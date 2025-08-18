from __future__ import annotations

import json
from datetime import datetime
import re
from typing import Any, Dict, List, Optional, Tuple

from flask import Flask, Response, request

import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


app = Flask(__name__)


def wait_and_click(driver, by: By, selector: str, timeout: int = 10) -> None:
    WebDriverWait(driver, timeout).until(
        EC.element_to_be_clickable((by, selector))
    ).click()


def find_first_clickable(driver, candidates: List[Tuple[By, str]], timeout_each: int = 5):
    for by, selector in candidates:
        try:
            return WebDriverWait(driver, timeout_each).until(
                EC.element_to_be_clickable((by, selector))
            )
        except Exception:
            continue
    return None


def text_of(el) -> str:
    return el.text.strip() if el else ""


def split_city_country(name: str) -> Tuple[Optional[str], Optional[str]]:
    if not name:
        return None, None
    # Expect formats like "SHANGHAI (SH), CHINA. PEOPLE'S REPUBLIC"
    parts = [p.strip() for p in name.split(",")]
    if len(parts) >= 2:
        city = ", ".join(parts[:-1]).strip() or None
        country = parts[-1].strip() or None
        return city, country
    return name, None


def parse_vessel_and_voyage(text: str) -> Tuple[Optional[str], Optional[str]]:
    if not text:
        return None, None
    # Examples: "HE JIN/86/N" -> ("HE JIN", "86/N")
    #           "MSC SUAPE VII/36/E" -> ("MSC SUAPE VII", "36/E")
    parts = [p.strip() for p in text.split("/")]
    if len(parts) >= 3:
        vessel_name = "/".join(parts[:-2]).strip() or None
        voyage_ref = "/".join(parts[-2:]).strip() or None
        return vessel_name, voyage_ref
    if len(parts) == 2:
        return parts[0] or None, parts[1] or None
    return text.strip() or None, None


def combine_date_time(date_text: str, time_text: str) -> Optional[str]:
    date_text = (date_text or "").strip()
    time_text = (time_text or "").strip()
    if not date_text and not time_text:
        return None
    if date_text and time_text:
        # Always strip AM/PM suffixes (case-insensitive)
        normalized_time = re.sub(r"\s?(AM|PM)$", "", time_text, flags=re.IGNORECASE).strip()
        # Also remove any stray AM/PM anywhere in the time string
        normalized_time = re.sub(r"(AM|PM)", "", normalized_time, flags=re.IGNORECASE).strip()
        return f"{date_text} {normalized_time}".strip()
    return date_text or time_text


def build_event(
    status: Optional[str],
    date_text: Optional[str],
    time_text: Optional[str],
    location_name: Optional[str],
    vessel_voyage_text: Optional[str],
    stop_index: int,
) -> Dict[str, Any]:
    city, country = split_city_country(location_name or "")
    vessel_name, voyage_reference = parse_vessel_and_voyage(vessel_voyage_text or "")
    event_time = combine_date_time(date_text or "", time_text or "")

    return {
        "mode": None,
        "status": (status or None),
        "eventCode": None,
        "eventTime": event_time,
        "eventQualifier": None,
        "location": {
            "name": (location_name or None),
            "city": city,
            "state": None,
            "country": country,
            "latitude": None,
            "longitude": None,
            "unloCode": None,
            "terminal": None,
        },
        "stopIndex": str(stop_index),
        "vesselInfo": {
            "name": vessel_name,
            "imo": None,
            "mmsi": None,
            "additionalInfo": None,
        },
        "voyageReference": voyage_reference or (vessel_voyage_text or None),
        "additionalInfo": None,
    }


def derive_routes(events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not events:
        return []

    pol_event = None
    pod_event = None
    for ev in events:
        status_text = (ev.get("status") or "").lower()
        if pol_event is None and "port of loading" in status_text:
            pol_event = ev
        # Prefer explicit POD; fall back to destination
        if pod_event is None and (
            "port of discharge" in status_text or "port of destination" in status_text
        ):
            pod_event = ev

    if not pol_event and not pod_event:
        return []

    def event_date_only(ev: Dict[str, Any]) -> Optional[str]:
        dt = ev.get("eventTime") or ""
        return dt.split(" ")[0] if dt else None

    vessel_name = None
    voyage_ref = None
    port_of_loading_name = None
    port_of_discharging_name = None
    departure_date = None
    arrival_date = None

    if pol_event:
        vessel_name = pol_event.get("vesselInfo", {}).get("name") or vessel_name
        voyage_ref = pol_event.get("voyageReference") or voyage_ref
        loc = pol_event.get("location") or {}
        port_of_loading_name = loc.get("name")
        departure_date = event_date_only(pol_event)

    if pod_event:
        vessel_name = pod_event.get("vesselInfo", {}).get("name") or vessel_name
        voyage_ref = pod_event.get("voyageReference") or voyage_ref
        loc = pod_event.get("location") or {}
        port_of_discharging_name = loc.get("name")
        arrival_date = event_date_only(pod_event)

    return [
        {
            "place": None,
            "date": None,
            "berthing": None,
            "vessel": vessel_name,
            "voyage": voyage_ref,
            "actualLoading": None,
            "portOfLoading": (
                f"{port_of_loading_name} ~~ POL" if port_of_loading_name else None
            ),
            "departureDate": departure_date,
            "departureDateExpected": None,
            "portOfDischarging": (
                f"{port_of_discharging_name} ~~ POD" if port_of_discharging_name else None
            ),
            "arrivalTime": arrival_date,
            "arrivalTimeExpected": None,
        }
    ]


def derive_pod_eta(events: List[Dict[str, Any]]) -> Optional[str]:
    for ev in events:
        status_text = (ev.get("status") or "").lower()
        if "vessel arrival to port of discharge" in status_text:
            dt = ev.get("eventTime") or ""
            return dt.split(" ")[0] if dt else None
    return None


def derive_routes_from_events(events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not events:
        return []
    # Ensure chronological order by stopIndex if available
    def parse_index(ev: Dict[str, Any]) -> int:
        try:
            return int(str(ev.get("stopIndex", 0)))
        except Exception:
            return 0

    ordered = sorted(events, key=parse_index)

    legs: List[Dict[str, Any]] = []
    current_vessel: Optional[str] = None
    current_voyage: Optional[str] = None
    start_loc: Optional[str] = None
    start_date: Optional[str] = None

    for ev in ordered:
        vessel_name = (ev.get("vesselInfo") or {}).get("name")
        voyage_ref = ev.get("voyageReference")

        # Skip legs with missing or "N/A" vessel info
        if vessel_name:
            vessel_name = vessel_name.strip() or None
        if voyage_ref:
            voyage_ref = voyage_ref.strip() or None
        if voyage_ref and voyage_ref.upper() == "N/A":
            voyage_ref = None

        location_name = ((ev.get("location") or {}).get("name") or None)
        event_time = ev.get("eventTime") or None
        date_only = event_time.split(" ")[0] if event_time else None

        if vessel_name and voyage_ref:
            # New leg if vessel/voyage changed
            if current_vessel != vessel_name or current_voyage != voyage_ref:
                # flush previous leg if any
                if current_vessel and current_voyage and start_loc and start_date:
                    # Determine last known location/date from the previous event in ordered list
                    # We'll set it when closing based on last stored end fields on previous iteration
                    pass
                # Start a new leg
                current_vessel = vessel_name
                current_voyage = voyage_ref
                start_loc = location_name
                start_date = date_only
                # Set a placeholder leg and update end info as we go
                legs.append({
                    "vessel": current_vessel,
                    "voyage": current_voyage,
                    "start_loc": start_loc,
                    "start_date": start_date,
                    "end_loc": location_name,
                    "end_date": date_only,
                })
            else:
                # Update end info of current leg
                if legs:
                    legs[-1]["end_loc"] = location_name or legs[-1].get("end_loc")
                    legs[-1]["end_date"] = date_only or legs[-1].get("end_date")
        else:
            # No vessel info; still update end_loc/date for current leg if exists
            if legs:
                legs[-1]["end_loc"] = location_name or legs[-1].get("end_loc")
                legs[-1]["end_date"] = date_only or legs[-1].get("end_date")

    # Transform legs into route dicts, de-duplicated and with POL/POD composition
    seen = set()
    routes: List[Dict[str, Any]] = []
    for leg in legs:
        vessel = leg.get("vessel")
        voyage = leg.get("voyage")
        pol = leg.get("start_loc")
        pod = leg.get("end_loc")
        dep = leg.get("start_date")
        arr = leg.get("end_date")
        if not (vessel and voyage and pol and pod):
            continue
        key = (vessel, voyage, pol, pod, dep, arr)
        if key in seen:
            continue
        seen.add(key)
        routes.append({
            "place": None,
            "date": None,
            "berthing": None,
            "vessel": vessel,
            "voyage": voyage,
            "actualLoading": None,
            "portOfLoading": f"{pol} ~~ POL",
            "departureDate": dep,
            "departureDateExpected": None,
            "portOfDischarging": f"{pod} ~~ POD",
            "arrivalTime": arr,
            "arrivalTimeExpected": None,
        })
    return routes


def parse_details_card(driver) -> Dict[str, Optional[str]]:
    details: Dict[str, Optional[str]] = {
        "pol": None,
        "pol_terminal": None,
        "sailing": None,
        "pod": None,
        "pod_terminal": None,
        "ata": None,
        "eta": None,
        "route_vessel": None,
        "route_voyage": None,
    }

    # Top ETA block
    try:
        details["eta"] = text_of(driver.find_element(By.CSS_SELECTOR, "#etaDate")) or None
    except Exception:
        pass

    # Tracing details card with POL/POD/terminals/dates
    try:
        card = driver.find_element(By.CSS_SELECTOR, ".tracing-details-card .card-body")
        blocks = card.find_elements(By.CSS_SELECTOR, ".block-new")
        for block in blocks:
            # Look at first label in block to determine POL vs POD
            label_els = block.find_elements(By.CSS_SELECTOR, ".card-content-text .label")
            if not label_els:
                continue
            first_label = text_of(label_els[0]).lower()
            content_items = block.find_elements(By.CSS_SELECTOR, ".card-content-text")
            if "port of loading" in first_label:
                for ci in content_items:
                    lbl = text_of(ci.find_element(By.CSS_SELECTOR, ".label")).lower()
                    # Value is the last div inside the card-content-text
                    all_divs = ci.find_elements(By.CSS_SELECTOR, "div")
                    value = text_of(all_divs[-1]) if all_divs else ""
                    if "port of loading" in lbl:
                        details["pol"] = value or None
                    elif "terminal name" in lbl:
                        details["pol_terminal"] = value or None
                    elif "sailing" in lbl:
                        details["sailing"] = value or None
            elif "port of discharge" in first_label:
                for ci in content_items:
                    lbl = text_of(ci.find_element(By.CSS_SELECTOR, ".label")).lower()
                    all_divs = ci.find_elements(By.CSS_SELECTOR, "div")
                    value = text_of(all_divs[-1]) if all_divs else ""
                    if "port of discharge" in lbl:
                        details["pod"] = value or None
                    elif "terminal name" in lbl:
                        details["pod_terminal"] = value or None
                    elif "actual time of arrival" in lbl:
                        details["ata"] = value or None
    except Exception:
        pass

    # Try to get vessel/voyage from progress bar
    try:
        vessel_blocks = driver.find_elements(By.CSS_SELECTOR, ".progress-bar-v2 .vessel")
        for vb in vessel_blocks:
            text = vb.text.replace("Vessel / Voyage", "").strip()
            if not text:
                continue
            vessel_name, voyage = parse_vessel_and_voyage(text)
            details["route_vessel"] = vessel_name
            details["route_voyage"] = voyage
            break
    except Exception:
        pass

    return details


def build_routes_from_details(details: Dict[str, Optional[str]]) -> List[Dict[str, Any]]:
    if not any([details.get("pol"), details.get("pod")]):
        return []
    pol_composed = None
    pod_composed = None
    if details.get("pol") and details.get("pol_terminal"):
        pol_composed = f"{details['pol']} / {details['pol_terminal']} ~~ POL"
    elif details.get("pol"):
        pol_composed = f"{details['pol']} ~~ POL"
    if details.get("pod") and details.get("pod_terminal"):
        pod_composed = f"{details['pod']} / {details['pod_terminal']} ~~ POD"
    elif details.get("pod"):
        pod_composed = f"{details['pod']} ~~ POD"

    return [
        {
            "place": None,
            "date": None,
            "berthing": None,
            "vessel": details.get("route_vessel"),
            "voyage": details.get("route_voyage"),
            "actualLoading": None,
            "portOfLoading": pol_composed,
            "departureDate": details.get("sailing"),
            "departureDateExpected": None,
            "portOfDischarging": pod_composed,
            "arrivalTime": details.get("ata") or details.get("eta"),
            "arrivalTimeExpected": None,
        }
    ]


def parse_reference_variant(results, driver) -> Tuple[List[Dict[str, Any]], Optional[str], List[Dict[str, Any]], Optional[str]]:
    # Returns (containers, current_status, routes, pod_eta)
    containers: List[Dict[str, Any]] = []
    current_status: Optional[str] = None

    # Parse routing details containers and activity timeline
    try:
        container_cards = results.find_elements(By.CSS_SELECTOR, ".routing-details-v2 li.card-container-v2")
    except Exception:
        container_cards = []

    for card in container_cards:
        # Top-level info within card header
        try:
            container_num = text_of(card.find_element(By.CSS_SELECTOR, ".unit-number"))
        except Exception:
            container_num = None
        try:
            container_type = text_of(card.find_element(By.CSS_SELECTOR, "div[id$='_cargoType']"))
        except Exception:
            container_type = None
        try:
            last_activity = text_of(card.find_element(By.CSS_SELECTOR, "div[id$='_activityDesc']"))
        except Exception:
            last_activity = None
        if last_activity and not current_status:
            current_status = last_activity

        # Activities within the expanded timeline
        events: List[Dict[str, Any]] = []
        activity_items = []
        try:
            activity_items = card.find_elements(By.CSS_SELECTOR, ".card-desktop-inner li.card-container-activity")
        except Exception:
            activity_items = []

        for idx, item in enumerate(activity_items):
            try:
                date_text = text_of(item.find_element(By.CSS_SELECTOR, "div[id$='_activityDateTz'] .date"))
            except Exception:
                date_text = ""
            try:
                time_text = text_of(item.find_element(By.CSS_SELECTOR, "div[id$='_activityDateTz'] .time"))
            except Exception:
                time_text = ""
            try:
                activity_text = text_of(item.find_element(By.CSS_SELECTOR, "div[id$='_activityDesc']"))
            except Exception:
                activity_text = ""
            try:
                location_text = text_of(item.find_element(By.CSS_SELECTOR, "div[id$='_placeFromDesc']"))
            except Exception:
                location_text = ""
            vessel_text = ""
            try:
                vessel_block = item.find_element(By.CSS_SELECTOR, "div[id$='_vessel']")
                try:
                    vessel_text = text_of(vessel_block.find_element(By.CSS_SELECTOR, "a"))
                except Exception:
                    vessel_text = text_of(vessel_block)
            except Exception:
                vessel_text = ""

            events.append(
                build_event(
                    status=activity_text,
                    date_text=date_text,
                    time_text=time_text,
                    location_name=location_text,
                    vessel_voyage_text=vessel_text,
                    stop_index=idx,
                )
            )

        # Build routes from events for this container
        event_routes = derive_routes_from_events(events)

        containers.append(
            {
                "containerType": container_type,
                "containerNum": (container_num or "").strip() or None,
                "stops": [],
                "events": events,
                "routes": event_routes,  # may be merged with details routes below
                "vesselMovements": [],
                "cargoDeliveryInformationUsImportOnly": None,
                "podETA": None,  # Filled later from details card
                "additionalInfo": None,
            }
        )

    details = parse_details_card(driver)
    routes = build_routes_from_details(details)
    pod_eta = details.get("eta") or details.get("ata")

    # Attach routes and podETA to each container
    for c in containers:
        # Merge routes uniquely
        combined = []
        seen_keys = set()
        for r in (c.get("routes") or []) + (routes or []):
            key = (r.get("vessel"), r.get("voyage"), r.get("portOfLoading"), r.get("portOfDischarging"), r.get("departureDate"), r.get("arrivalTime"))
            if key in seen_keys:
                continue
            seen_keys.add(key)
            combined.append(r)
        c["routes"] = combined
        c["podETA"] = pod_eta

    return containers, current_status, routes, pod_eta


def scrape_container_or_bol(identifier: str) -> Dict[str, Any]:
    options = uc.ChromeOptions()
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--headless=new")

    driver = uc.Chrome(options=options)
    driver.set_page_load_timeout(60)

    try:
        url = "https://www.zim.com/tools/track-a-shipment"
        driver.get(url)

        try:
            wait_and_click(driver, By.ID, "onetrust-accept-btn-handler", timeout=5)
        except Exception:
            pass

        # Locate the input (site has changed ids historically)
        container_input = None
        for input_id in ["shipment-main-search-2", "shipment-main-search"]:
            try:
                container_input = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.ID, input_id))
                )
                break
            except Exception:
                continue
        if not container_input:
            raise RuntimeError("Unable to locate container/BOL input box.")

        container_input.clear()
        container_input.send_keys(identifier)

        # Try ENTER and also fallback to clicking any visible search button
        container_input.send_keys(Keys.ENTER)
        search_button = find_first_clickable(
            driver,
            [
                (By.CSS_SELECTOR, "input[type='submit'][value*='Search']"),
                (By.XPATH, "//input[@type='submit' and contains(@value,'Search')]"),
                (By.XPATH, "//button[contains(.,'Search')]")
            ],
            timeout_each=3,
        )
        if search_button:
            try:
                search_button.click()
            except Exception:
                pass

        # Wait for results
        results = WebDriverWait(driver, 45).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "div.tracing-result-wrapper"))
        )

        # Decide variant: container-number vs B/L reference
        is_reference_variant = False
        try:
            results.find_element(By.CSS_SELECTOR, ".routing-details-v2")
            is_reference_variant = True
        except Exception:
            is_reference_variant = False

        if is_reference_variant:
            # Parse B/L layout
            containers, current_status, routes, pod_eta = parse_reference_variant(results, driver)

            # Compose payload using parsed details
            payload: Dict[str, Any] = {
                "version": "1.00",
                "scrapingType": None,
                "refNum": identifier,
                "refType": "BillOfLanding",
                "jtCarrierName": None,
                "origin": None,
                "destination": None,
                "currentStatus": current_status,
                "bookingNum": None,
                "bolNum": identifier,
                "bl_Issue_Date": None,
                "booking_Date": None,
                "trackingnNo": None,
                "additionalInfo": None,
                "containers": containers,
                "logs": [],
            }
            return payload
        else:
            # Container-number layout parsing (existing path)
            # Header fields
            try:
                header_container_num = text_of(results.find_element(By.CSS_SELECTOR, ".cons-number")).lstrip("\u00a0").strip()
            except Exception:
                header_container_num = None

            try:
                type_and_size = text_of(driver.find_element(By.CSS_SELECTOR, "#typeAndSize"))
            except Exception:
                type_and_size = None

            last_activity_text = None
            try:
                last_activity_els = driver.find_elements(By.CSS_SELECTOR, ".last-activity-value")
                for el in last_activity_els:
                    txt = text_of(el)
                    if txt:
                        last_activity_text = txt
                        break
            except Exception:
                last_activity_text = None

            # Activities table
            activities_container = results.find_element(By.CSS_SELECTOR, ".one-container-activities")
            row_els = activities_container.find_elements(By.CSS_SELECTOR, ".activity-row")

            # Build events from rows. Reverse to oldest->newest for stable indexing like sample
            events: List[Dict[str, Any]] = []
            for row_index, row in enumerate(reversed(row_els)):
                items = row.find_elements(By.CSS_SELECTOR, ".activity-item")
                date_text = ""
                time_text = ""
                activity_text = ""
                location_text = ""
                vessel_text = ""

                if len(items) >= 1:
                    date_block = items[0]
                    try:
                        date_text = text_of(date_block.find_element(By.CSS_SELECTOR, ".date"))
                    except Exception:
                        date_text = ""
                    try:
                        time_text = text_of(date_block.find_element(By.CSS_SELECTOR, ".time"))
                    except Exception:
                        time_text = ""

                if len(items) >= 2:
                    try:
                        activity_text = text_of(items[1].find_element(By.CSS_SELECTOR, ".text-style"))
                    except Exception:
                        activity_text = ""

                if len(items) >= 3:
                    try:
                        location_text = text_of(items[2].find_element(By.CSS_SELECTOR, ".text-style"))
                    except Exception:
                        location_text = ""

                if len(items) >= 4:
                    try:
                        vessel_container = items[3].find_element(By.CSS_SELECTOR, ".text-style")
                        try:
                            vessel_text = text_of(vessel_container.find_element(By.CSS_SELECTOR, "a"))
                        except Exception:
                            vessel_text = text_of(vessel_container)
                    except Exception:
                        vessel_text = ""

                events.append(
                    build_event(
                        status=activity_text,
                        date_text=date_text,
                        time_text=time_text,
                        location_name=location_text,
                        vessel_voyage_text=vessel_text,
                        stop_index=row_index,
                    )
                )

            routes = derive_routes_from_events(events)
            pod_eta = derive_pod_eta(events)

            # Compose final payload matching the provided schema
            payload: Dict[str, Any] = {
                "version": "1.00",
                "scrapingType": None,
                "refNum": identifier,
                "refType": "Container",  # Can be overridden via query param if provided
                "jtCarrierName": None,
                "origin": None,
                "destination": None,
                "currentStatus": last_activity_text,
                "bookingNum": None,
                "bolNum": None,
                "bl_Issue_Date": None,
                "booking_Date": None,
                "trackingnNo": None,
                "additionalInfo": None,
                "containers": [
                    {
                        "containerType": type_and_size,
                        "containerNum": header_container_num or identifier,
                        "stops": [],
                        "events": events,
                        "routes": routes,
                        "vesselMovements": [],
                        "cargoDeliveryInformationUsImportOnly": None,
                        "podETA": pod_eta,
                        "additionalInfo": None,
                    }
                ],
                "logs": [],
            }

            return payload

    finally:
        try:
            driver.quit()
        except Exception:
            pass


@app.get("/api/zim/track")
def api_track() -> Response:
    # Accept either ?container=... or ?refNum=... with optional &refType=BillOfLanding|Container
    identifier = (request.args.get("container") or request.args.get("refNum") or "").strip()
    if not identifier:
        return Response(
            json.dumps({"error": "missing 'container' or 'refNum' query param"}),
            status=400,
            mimetype="application/json",
        )

    ref_type = (request.args.get("refType") or "Container").strip() or "Container"
    result = scrape_container_or_bol(identifier)
    # Override refType if the caller provided one (e.g., BillOfLanding)
    result["refType"] = ref_type
    if ref_type.lower().startswith("bill"):
        result["bolNum"] = identifier

    return Response(json.dumps(result, ensure_ascii=False), mimetype="application/json")


@app.get("/Zim4/cn/<string:container_num>")
def api_track_container_path(container_num: str) -> Response:
    identifier = (container_num or "").strip()
    if not identifier:
        return Response(
            json.dumps({"error": "missing container number in path"}),
            status=400,
            mimetype="application/json",
        )
    result = scrape_container_or_bol(identifier)
    result["refNum"] = identifier
    result["refType"] = "Container"
    result["bolNum"] = None
    return Response(json.dumps(result, ensure_ascii=False), mimetype="application/json")


@app.get("/Zim4/bl/<string:bol_num>")
def api_track_bol_path(bol_num: str) -> Response:
    identifier = (bol_num or "").strip()
    if not identifier:
        return Response(
            json.dumps({"error": "missing B/L number in path"}),
            status=400,
            mimetype="application/json",
        )
    result = scrape_container_or_bol(identifier)
    result["refNum"] = identifier
    result["refType"] = "BillOfLanding"
    result["bolNum"] = identifier
    return Response(json.dumps(result, ensure_ascii=False), mimetype="application/json")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)

