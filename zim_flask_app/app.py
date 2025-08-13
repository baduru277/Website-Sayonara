from flask import Flask, Response
import json
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from dataclasses import dataclass, asdict, field
from datetime import datetime
from typing import List, Optional, Dict, Any


# ====== Helper - Formatting ======

def format_date(date_str: Optional[str]) -> Optional[str]:
    if not date_str:
        return None
    for fmt in ("%Y-%m-%dT%H:%M:%S.%f", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d"):
        try:
            return datetime.strptime(date_str, fmt).strftime("%d-%b-%Y")
        except ValueError:
            continue
    return None


def format_datetime(date_str: Optional[str]) -> Optional[str]:
    if not date_str:
        return None
    for fmt in ("%Y-%m-%dT%H:%M:%S.%f", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d"):
        try:
            return datetime.strptime(date_str, fmt).strftime("%d-%b-%Y %H:%M")
        except ValueError:
            continue
    return None


# ====== Shipping2-like Models ======

@dataclass
class Location:
    Name: Optional[str] = None
    Terminal: Optional[str] = None
    City: Optional[str] = None
    Country: Optional[str] = None


@dataclass
class Stop:
    StopType: Optional[str] = None
    Location: Location = field(default_factory=Location)
    ArrivalTime: Optional[str] = None
    DepartureTime: Optional[str] = None


@dataclass
class VesselInfo:
    Name: Optional[str] = None


@dataclass
class Event:
    Status: Optional[str] = None
    EventTime: Optional[str] = None
    Location: Location = field(default_factory=Location)
    StopIndex: Optional[str] = None
    VesselInfo: VesselInfo = field(default_factory=VesselInfo)
    VoyageReference: Optional[str] = None


@dataclass
class VesselMovement:
    VesselVoyage: Optional[str] = None
    PartnerVoyage: Optional[str] = None


@dataclass
class Container:
    ContainerType: Optional[str] = None
    ContainerNum: Optional[str] = None
    Stops: List[Stop] = field(default_factory=list)
    Events: List[Event] = field(default_factory=list)
    VesselMovements: List[VesselMovement] = field(default_factory=list)
    PodETA: Optional[str] = None


@dataclass
class Shipping2:
    RefNum: Optional[str] = None
    RefType: Optional[str] = None
    Origin: Optional[str] = None
    Destination: Optional[str] = None
    CurrentStatus: Optional[str] = None
    BookingNum: Optional[str] = None
    BolNum: Optional[str] = None
    Containers: List[Container] = field(default_factory=list)
    Logs: List[Dict[str, Any]] = field(default_factory=list)


# ====== Utils to safely read keys (handle camelCase/PascalCase) ======

def g(obj: Dict[str, Any], key: str) -> Any:
    if not isinstance(obj, dict):
        return None
    if key in obj:
        return obj.get(key)
    # try alternative case variants
    variants = {key, key.lower(), key.upper(), key[:1].lower() + key[1:], key[:1].upper() + key[1:]}
    for k in obj.keys():
        if k in variants:
            return obj.get(k)
    # final attempt: case-insensitive match
    lk = key.lower()
    for k in obj.keys():
        if k.lower() == lk:
            return obj.get(k)
    return None


# ====== Mapping Logic (mirror C# rules) ======

def map_zim_to_shipping2(raw: Dict[str, Any], code: str, code_type: str = "Container") -> Dict[str, Any]:
    data = g(raw, "data") or g(raw, "Data") or {}
    legs: List[Dict[str, Any]] = g(data, "blRouteLegs") or g(data, "BlRouteLegs") or []
    cons_details: Dict[str, Any] = g(data, "consignmentDetails") or g(data, "ConsignmentDetails") or {}
    cons_list: List[Dict[str, Any]] = g(cons_details, "consContainerList") or g(cons_details, "ConsContainerList") or []

    final_eta = g(data, "finalETA") or {}
    agreed_eta = g(data, "agreedETA") or {}
    pod_eta_raw = g(final_eta, "etaValueDate") or g(final_eta, "etaValue") or g(agreed_eta, "etaValueDate") or g(agreed_eta, "etaValue")
    pod_eta = format_date(pod_eta_raw)

    stops: List[Stop] = []
    vessel_movements: List[VesselMovement] = []
    origin: Optional[str] = None
    destination: Optional[str] = None

    def L(idx: int, key: str) -> Any:
        if idx < 0 or idx >= len(legs):
            return None
        return g(legs[idx], key)

    # Helper to build VesselMovement from a leg index
    def add_vessel_movement(idx: int):
        vessel_name = L(idx, "vesselName")
        voyage = L(idx, "voyage")
        leg_code = L(idx, "leg")
        partner_voyage = L(idx, "partnerVoyage")
        vv = f"{vessel_name}/{voyage}/{leg_code}" if vessel_name else None
        vessel_movements.append(VesselMovement(VesselVoyage=vv, PartnerVoyage=partner_voyage))

    # Pattern matching similar to C#
    n = len(legs)
    if n == 1 and (L(0, "portFromType") == "POL" and L(0, "portToType") == "POD"):
        origin = f"{L(0, 'portNameFrom')}, {L(0, 'countryNameFrom')}"
        destination = f"{L(0, 'portNameTo')}, {L(0, 'countryNameTo')}"
        stops.append(Stop(
            StopType="Port of Loading",
            Location=Location(Name=origin, Terminal=L(0, "depotNameFrom")),
            DepartureTime=format_date(L(0, "sailingDateTz"))
        ))
        stops.append(Stop(
            StopType="Port of Discharge",
            Location=Location(Name=destination, Terminal=L(0, "depotNameTo"))
        ))
        add_vessel_movement(0)

    elif n == 2 and (L(0, "portFromType") == "POL" and L(0, "portToType") == "Transshipment" and
                      L(1, "portFromType") == "Transshipment" and L(1, "portToType") == "POD"):
        origin = f"{L(0, 'portNameFrom')}, {L(0, 'countryNameFrom')}"
        destination = f"{L(1, 'portNameTo')}, {L(1, 'countryNameTo')}"
        POL = f"{L(0, 'portNameFrom')}, {L(0, 'countryNameFrom')}"
        TSP = f"{L(1, 'portNameFrom')}, {L(1, 'countryNameFrom')}"
        POD = f"{L(1, 'portNameTo')}, {L(1, 'countryNameTo')}"
        stops.append(Stop(
            StopType="Port of Loading",
            Location=Location(Name=POL, Terminal=L(0, "depotNameFrom")),
            DepartureTime=format_date(L(0, "sailingDateTz"))
        ))
        stops.append(Stop(
            StopType="Port of Discharge",
            Location=Location(Name=POD, Terminal=L(1, "depotNameTo"))
        ))
        stops.append(Stop(
            StopType="Transshipment",
            Location=Location(Name=TSP, Terminal=L(1, "depotNameFrom")),
            ArrivalTime=format_date(L(0, "arrivalDateTz")),
            DepartureTime=format_date(L(1, "sailingDateTz"))
        ))
        add_vessel_movement(0)
        add_vessel_movement(1)

    elif n == 2 and (L(0, "portFromType") == "POL" and L(0, "portToType") == "POD" and
                      L(1, "portFromType") == "POD" and L(1, "portToType") == "DEL"):
        origin = f"{L(0, 'portNameFrom')}, {L(0, 'countryNameFrom')}"
        destination = f"{L(1, 'portNameTo')}, {L(1, 'countryNameTo')}"
        POL = f"{L(0, 'portNameFrom')}, {L(0, 'countryNameFrom')}"
        POD = f"{L(0, 'portNameTo')}, {L(0, 'countryNameTo')}"
        DEL = f"{L(1, 'portNameTo')}, {L(1, 'countryNameTo')}"
        stops.append(Stop(
            StopType="Port of Loading",
            Location=Location(Name=POL, Terminal=L(0, "depotNameFrom")),
            DepartureTime=format_date(L(0, "sailingDateTz"))
        ))
        stops.append(Stop(
            StopType="Port of Discharge",
            Location=Location(Name=POD, Terminal=L(0, "depotNameTo")),
            ArrivalTime=format_date(L(0, "arrivalDateTz"))
        ))
        stops.append(Stop(
            StopType="Final Destination",
            Location=Location(Name=DEL, Terminal=L(1, "depotNameFrom"))
        ))
        add_vessel_movement(0)
        add_vessel_movement(1)

    elif n == 2 and (L(0, "portFromType") == "POR" and L(0, "portToType") == "POL" and
                      L(1, "portFromType") == "POL" and L(1, "portToType") == "POD"):
        origin = f"{L(0, 'portNameFrom')}, {L(0, 'countryNameFrom')}"
        destination = f"{L(1, 'portNameTo')}, {L(1, 'countryNameTo')}"
        POR = f"{L(0, 'portNameFrom')}, {L(0, 'countryNameFrom')}"
        POL = f"{L(0, 'portNameTo')}, {L(0, 'countryNameTo')}"
        POD = f"{L(1, 'portNameTo')}, {L(1, 'countryNameTo')}"
        stops.append(Stop(StopType="Place of Receipt", Location=Location(Name=POR)))
        stops.append(Stop(
            StopType="Port of Loading",
            Location=Location(Name=POL, Terminal=L(1, "depotNameFrom")),
            DepartureTime=format_date(L(1, "sailingDateTz"))
        ))
        stops.append(Stop(
            StopType="Port of Discharge",
            Location=Location(Name=POD, Terminal=L(1, "depotNameTo"))
        ))
        add_vessel_movement(0)
        add_vessel_movement(1)

    elif n == 3 and (L(0, "portFromType") == "POR" and L(0, "portToType") == "POL" and
                      L(2, "portFromType") == "POD" and L(2, "portToType") == "DEL"):
        origin = f"{L(0, 'portNameFrom')}, {L(0, 'countryNameFrom')}"
        destination = f"{L(2, 'portNameTo')}, {L(2, 'countryNameTo')}"
        POR = origin
        POL = f"{L(0, 'portNameTo')}, {L(0, 'countryNameTo')}"
        POD = f"{L(1, 'portNameTo')}, {L(1, 'countryNameTo')}"
        DEL = destination
        stops.append(Stop(StopType="Place of Receipt", Location=Location(Name=POR)))
        stops.append(Stop(
            StopType="Port of Loading",
            Location=Location(Name=POL, Terminal=L(1, "depotNameFrom")),
            DepartureTime=format_date(L(1, "sailingDateTz"))
        ))
        stops.append(Stop(
            StopType="Port of Discharge",
            Location=Location(Name=POD, Terminal=L(1, "depotNameTo")),
            ArrivalTime=format_date(L(1, "arrivalDateTz"))
        ))
        stops.append(Stop(StopType="Final Destination", Location=Location(Name=DEL)))
        add_vessel_movement(0)
        add_vessel_movement(1)
        add_vessel_movement(2)

    elif n == 3 and (L(0, "portFromType") == "POR" and L(0, "portToType") == "POL" and
                      L(2, "portFromType") == "Transshipment" and L(2, "portToType") == "POD"):
        origin = f"{L(0, 'portNameFrom')}, {L(0, 'countryNameFrom')}"
        destination = f"{L(2, 'portNameTo')}, {L(2, 'countryNameTo')}"
        POR = origin
        POL = f"{L(0, 'portNameTo')}, {L(0, 'countryNameTo')}"
        TSP = f"{L(2, 'portNameFrom')}, {L(2, 'countryNameFrom')}"
        POD = destination
        stops.append(Stop(StopType="Place of Receipt", Location=Location(Name=POR)))
        stops.append(Stop(
            StopType="Port of Loading",
            Location=Location(Name=POL, Terminal=L(1, "depotNameFrom")),
            DepartureTime=format_date(L(1, "sailingDateTz"))
        ))
        stops.append(Stop(
            StopType="Port of Discharge",
            Location=Location(Name=POD, Terminal=L(2, "depotNameTo"))
        ))
        stops.append(Stop(
            StopType="Transshipment",
            Location=Location(Name=TSP),
            ArrivalTime=format_date(L(1, "arrivalDateTz")),
            DepartureTime=format_date(L(2, "sailingDateTz"))
        ))
        add_vessel_movement(0)
        add_vessel_movement(1)
        add_vessel_movement(2)

    elif n == 3 and (L(0, "portFromType") == "POL" and L(0, "portToType") == "Transshipment" and
                      L(2, "portFromType") == "POD" and L(2, "portToType") == "DEL"):
        origin = f"{L(0, 'portNameFrom')}, {L(0, 'countryNameFrom')}"
        destination = f"{L(2, 'portNameTo')}, {L(2, 'countryNameTo')}"
        POL = origin
        TSP = f"{L(1, 'portNameFrom')}, {L(1, 'countryNameFrom')}"
        POD = f"{L(1, 'portNameTo')}, {L(1, 'countryNameTo')}"
        DEL = destination
        stops.append(Stop(
            StopType="Port of Loading",
            Location=Location(Name=POL, Terminal=L(0, "depotNameFrom")),
            DepartureTime=format_date(L(0, "sailingDateTz"))
        ))
        stops.append(Stop(
            StopType="Port of Discharge",
            Location=Location(Name=POD, Terminal=L(1, "depotNameTo")),
            ArrivalTime=format_date(L(1, "arrivalDateTz"))
        ))
        stops.append(Stop(
            StopType="Transshipment",
            Location=Location(Name=TSP, Terminal=L(1, "depotNameFrom")),
            ArrivalTime=format_date(L(0, "sailingDateTz")),
            DepartureTime=format_date(L(1, "sailingDateTz"))
        ))
        stops.append(Stop(StopType="Final Destination", Location=Location(Name=DEL)))
        add_vessel_movement(0)
        add_vessel_movement(1)
        add_vessel_movement(2)

    elif n == 3 and (L(0, "portFromType") == "POL" and L(0, "portToType") == "Transshipment" and
                      L(1, "portFromType") == "Transshipment" and L(1, "portToType") == "Transshipment" and
                      L(2, "portFromType") == "Transshipment" and L(2, "portToType") == "POD"):
        origin = f"{L(0, 'portNameFrom')}, {L(0, 'countryNameFrom')}"
        destination = f"{L(2, 'portNameTo')}, {L(2, 'countryNameTo')}"
        POL = origin
        TSP1 = f"{L(0, 'portNameTo')}, {L(0, 'countryNameTo')}"
        TSP2 = f"{L(1, 'portNameTo')}, {L(1, 'countryNameTo')}"
        POD = destination
        stops.append(Stop(
            StopType="Port of Loading",
            Location=Location(Name=POL, Terminal=L(0, "depotNameFrom")),
            DepartureTime=format_date(L(0, "sailingDateTz"))
        ))
        stops.append(Stop(
            StopType="Port of Discharge",
            Location=Location(Name=POD, Terminal=L(2, "depotNameTo"))
        ))
        stops.append(Stop(
            StopType="Transshipment",
            Location=Location(Name=TSP1, Terminal=L(0, "depotNameTo")),
            ArrivalTime=format_date(L(0, "arrivalDateTz")),
            DepartureTime=format_date(L(1, "sailingDateTz"))
        ))
        stops.append(Stop(
            StopType="Transshipment",
            Location=Location(Name=TSP2, Terminal=L(1, "depotNameTo")),
            ArrivalTime=format_date(L(1, "arrivalDateTz")),
            DepartureTime=format_date(L(2, "sailingDateTz"))
        ))
        add_vessel_movement(0)
        add_vessel_movement(1)
        add_vessel_movement(2)

    # Fallback simple mapping if no specific pattern matched
    if not stops and n >= 1:
        first = legs[0]
        last = legs[-1]
        origin = f"{g(first, 'portNameFrom')}, {g(first, 'countryNameFrom')}"
        destination = f"{g(last, 'portNameTo')}, {g(last, 'countryNameTo')}"
        stops.append(Stop(
            StopType="Port of Loading",
            Location=Location(Name=origin, Terminal=g(first, 'depotNameFrom')),
            DepartureTime=format_date(g(first, 'sailingDateTz'))
        ))
        stops.append(Stop(
            StopType="Port of Discharge",
            Location=Location(Name=destination, Terminal=g(last, 'depotNameTo')),
            ArrivalTime=format_date(g(last, 'arrivalDateTz'))
        ))
        # add vessel movement per leg
        for i in range(n):
            add_vessel_movement(i)

    # Build events and containers
    containers: List[Container] = []

    def build_events(item: Dict[str, Any]) -> List[Event]:
        activities: List[Dict[str, Any]] = g(item, 'unitActivityList') or g(item, 'UnitActivityList') or []
        evs: List[Event] = []
        i = 0
        for bit in reversed(activities):
            ev_time = format_datetime(g(bit, 'activityDateTz'))
            place = g(bit, 'placeFromDesc')
            country = g(bit, 'countryFromName')
            vessel_name = g(bit, 'vesselName')
            voyage = g(bit, 'voyage')
            leg_code = g(bit, 'leg')
            evs.append(Event(
                Status=g(bit, 'activityDesc'),
                EventTime=ev_time,
                Location=Location(Name=f"{place}, {country}" if place or country else None, City=place, Country=country),
                StopIndex=str(i),
                VesselInfo=VesselInfo(Name=vessel_name),
                VoyageReference=f"{voyage}/{leg_code}" if voyage and leg_code else "N/A"
            ))
            i += 1
        return evs

    if cons_list:
        for item in cons_list:
            ctype = g(item, 'cargoType')
            cnum = (g(item, 'unitPrefix') or '') + (str(g(item, 'unitNo')).strip() if g(item, 'unitNo') else '')
            events = build_events(item)
            containers.append(Container(
                ContainerType=ctype,
                ContainerNum=cnum if cnum else None,
                Stops=stops,
                Events=events,
                VesselMovements=vessel_movements,
                PodETA=pod_eta
            ))
    else:
        containers.append(Container(
            Stops=stops,
            VesselMovements=vessel_movements,
            PodETA=pod_eta
        ))

    # Current status (take latest entry from original list if available)
    current_status = None
    try:
        first_item = cons_list[0]
        first_activity = (g(first_item, 'unitActivityList') or g(first_item, 'UnitActivityList') or [])[0]
        current_status = g(first_activity, 'activityDesc')
    except Exception:
        current_status = None

    shipping2 = Shipping2(
        RefNum=code,
        RefType=code_type,
        Origin=origin,
        Destination=destination,
        CurrentStatus=current_status,
        BookingNum=code if code_type == "Booking" else None,
        BolNum=code if code_type in ("BillOfLanding", "BL", "Bol") else None,
        Containers=containers,
        Logs=[],
    )

    # Return as plain dict ready for JSON
    return asdict(shipping2)


# ====== Selenium Fetch ======

def wait_and_click(driver, by, selector, timeout=10):
    WebDriverWait(driver, timeout).until(
        EC.element_to_be_clickable((by, selector))
    ).click()


def fetch_zim_api_data(driver, cons_number: str) -> Dict[str, Any]:
    api_url = f"https://www.zim.com/api/v2/trackShipment/GetTracing?consnumber={cons_number}"
    driver.execute_script(f"window.open('{api_url}','_blank');")
    WebDriverWait(driver, 5).until(lambda d: len(d.window_handles) > 1)
    driver.switch_to.window(driver.window_handles[-1])

    pre = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "pre"))
    )
    data = json.loads(pre.text)

    driver.close()
    driver.switch_to.window(driver.window_handles[0])
    return data


def scrape_container_data(cons_number: str) -> Dict[str, Any]:
    options = uc.ChromeOptions()
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--headless=new")
    driver = uc.Chrome(options=options)

    try:
        driver.get("https://www.zim.com/tools/track-a-shipment")
        try:
            wait_and_click(driver, By.ID, "onetrust-accept-btn-handler", timeout=5)
        except Exception:
            pass

        container_input = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "shipment-main-search"))
        )
        container_input.clear()
        container_input.send_keys(cons_number)

        wait_and_click(driver, By.XPATH, "//button[contains(.,'Search')]", timeout=10)
        WebDriverWait(driver, 20).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "div.tracing-details-card.card"))
        )

        raw_api_data = fetch_zim_api_data(driver, cons_number)
        return raw_api_data

    finally:
        driver.quit()


# ====== Flask App ======
app = Flask(__name__)


@app.route('/Zim4/v1/bl/<container_number>', methods=['GET'])
def get_container(container_number):
    try:
        raw = scrape_container_data(container_number)
        mapped = map_zim_to_shipping2(raw, code=container_number, code_type="Container")
        return Response(json.dumps(mapped, indent=2), mimetype="application/json")
    except Exception as e:
        return Response(json.dumps({"error": str(e)}, indent=2), mimetype="application/json"), 500


# Extra endpoints to ease testing/mapping without Selenium
from flask import request


@app.route('/Zim4/v1/map', methods=['POST'])
def map_payload():
    try:
        payload = request.get_json(force=True, silent=False)
        # Accept either the whole raw or just the inner data structure
        if 'data' in payload or 'Data' in payload:
            raw = payload
        else:
            raw = {'data': payload}
        mapped = map_zim_to_shipping2(raw, code=payload.get('code') or 'N/A', code_type=payload.get('codeType') or 'Container')
        return Response(json.dumps(mapped, indent=2), mimetype="application/json")
    except Exception as e:
        return Response(json.dumps({"error": str(e)}, indent=2), mimetype="application/json"), 400


@app.route('/Zim4/v1/raw/<container_number>', methods=['GET'])
def get_raw(container_number):
    try:
        raw = scrape_container_data(container_number)
        return Response(json.dumps(raw, indent=2), mimetype="application/json")
    except Exception as e:
        return Response(json.dumps({"error": str(e)}, indent=2), mimetype="application/json"), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5100)