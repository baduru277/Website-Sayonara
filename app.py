from flask import Flask, Response
import json
import copy
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

import requests

app = Flask(__name__)

RESPONSE_TEMPLATE: Dict[str, Any] = {
    "version": "1.00",
    "scrapingType": "zim.container.tracking",
    "refNum": None,
    "refType": "Container",
    "jtCarrierName": "ZIM",
    "origin": None,
    "destination": None,
    "currentStatus": None,
    "bookingNum": None,
    "bolNum": None,
    "bl_Issue_Date": None,
    "booking_Date": None,
    "trackingnNo": None,
    "additionalInfo": None,
    "containers": [
        {
            "containerType": None,
            "containerNum": None,
            "stops": [],
            "events": [],
            "routes": [],
            "vesselMovements": [],
            "cargoDeliveryInformationUsImportOnly": None,
            "podETA": None,
            "additionalInfo": None,
        }
    ],
    "logs": [],
}


# ---------- Utilities ----------

def parse_date(date_str: Optional[str]) -> Optional[str]:
    if not date_str:
        return None
    fmts = [
        "%d-%b-%Y %H:%M",
        "%d-%b-%Y",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%d %H:%M",
        "%Y-%m-%d",
        "%m/%d/%Y %H:%M",
        "%m/%d/%Y",
    ]
    s = date_str.strip()
    if s.endswith("Z"):
        s = s[:-1]
    for fmt in fmts:
        try:
            dt = datetime.strptime(s, fmt)
            if any(ch in s for ch in ["T", ":", " "]):
                return dt.strftime("%d-%b-%Y %H:%M")
            return dt.strftime("%d-%b-%Y")
        except Exception:
            continue
    return date_str


def try_parse_datetime(date_str: Optional[str]) -> Optional[datetime]:
    if not date_str:
        return None
    s = date_str.strip()
    if s.endswith("Z"):
        s = s[:-1]
    fmts = [
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%d %H:%M",
        "%Y-%m-%d",
        "%d-%b-%Y %H:%M",
        "%d-%b-%Y",
        "%m/%d/%Y %H:%M",
        "%m/%d/%Y",
    ]
    for fmt in fmts:
        try:
            return datetime.strptime(s, fmt)
        except Exception:
            continue
    return None


def _first_non_empty(d: Dict[str, Any], keys: List[str]) -> Optional[Any]:
    for k in keys:
        v = d.get(k)
        if v not in (None, "", [], {}):
            return v
    return None


def _extract_routes_from_legs(legs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    routes: List[Dict[str, Any]] = []
    for leg in legs:
        from_port = _first_non_empty(
            leg,
            ["PortNameFrom", "PortFromName", "PortFrom", "FromPortName", "FromPort"],
        )
        to_port = _first_non_empty(
            leg,
            ["PortNameTo", "PortToName", "PortTo", "ToPortName", "ToPort"],
        )
        route_item = {
            "from": from_port,
            "to": to_port,
            "terminalFrom": _first_non_empty(leg, ["TerminalFrom", "FromTerminal"]),
            "terminalTo": _first_non_empty(leg, ["TerminalTo", "ToTerminal"]),
            "departure": parse_date(_first_non_empty(leg, ["DepartureDate", "ETD", "Departure"])),
            "arrival": parse_date(_first_non_empty(leg, ["ArrivalDate", "ETA", "Arrival"])),
            "vesselName": _first_non_empty(leg, ["VesselName", "Vessel"]),
            "voyageNumber": _first_non_empty(leg, ["VoyageNumber", "Voyage"]),
        }
        routes.append(route_item)
    return routes


def _stops_and_vessels_from_routes(routes: List[Dict[str, Any]]):
    stops: List[Dict[str, Optional[str]]] = []
    vessel_movements: List[Dict[str, Optional[str]]] = []

    for r in routes:
        vessel_movements.append(
            {
                "vesselName": r.get("vesselName"),
                "voyageNumber": r.get("voyageNumber"),
                "departure": r.get("departure"),
                "arrival": r.get("arrival"),
            }
        )

    if not routes:
        return stops, vessel_movements

    # Origin
    first_leg = routes[0]
    stops.append(
        {
            "stopType": "Origin",
            "Location": first_leg.get("from"),
            "Terminal": first_leg.get("terminalFrom"),
            "Arrival": None,
            "Departure": first_leg.get("departure"),
        }
    )

    # Transshipments
    for i in range(len(routes) - 1):
        leg = routes[i]
        next_leg = routes[i + 1]
        stops.append(
            {
                "stopType": "Transshipment",
                "Location": leg.get("to"),
                "Terminal": leg.get("terminalTo"),
                "Arrival": leg.get("arrival"),
                "Departure": next_leg.get("departure"),
            }
        )

    # Destination
    last_leg = routes[-1]
    stops.append(
        {
            "stopType": "Destination",
            "Location": last_leg.get("to"),
            "Terminal": last_leg.get("terminalTo"),
            "Arrival": last_leg.get("arrival"),
            "Departure": None,
        }
    )

    return stops, vessel_movements


# ---------- API Fetch ----------

def fetch_zim_api(container_number: str) -> Tuple[Dict[str, Any], List[str]]:
    url = f"https://www.zim.com/api/v2/trackShipment/GetTracing?consnumber={container_number}"
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
        ),
        "Accept": "application/json, text/plain, */*",
        "Referer": "https://www.zim.com/tools/track-a-shipment",
        "Origin": "https://www.zim.com",
        "Connection": "keep-alive",
    }
    logs: List[str] = []

    try:
        resp = requests.get(url, headers=headers, timeout=25)
        if resp.status_code != 200:
            logs.append(f"API HTTP {resp.status_code}")
            return {}, logs
        try:
            data = resp.json()
        except Exception:
            logs.append("API returned non-JSON body")
            return {}, logs
        return data, logs
    except requests.RequestException as exc:
        logs.append(f"API request error: {exc}")
        return {}, logs


# ---------- Main scrape/shape ----------

def scrape_container_data(container_number: str) -> Dict[str, Any]:
    api_data, api_logs = fetch_zim_api(container_number)

    final_output = copy.deepcopy(RESPONSE_TEMPLATE)
    final_output["refNum"] = container_number

    if not api_data:
        final_output["logs"].extend({"ts": datetime.utcnow().isoformat() + "Z", "msg": m} for m in api_logs)
        return final_output

    root = api_data.get("Data") or api_data.get("data") or api_data

    # Routes
    legs = (
        root.get("BlRouteLegs")
        or root.get("blRouteLegs")
        or root.get("RouteLegs")
        or []
    )
    if not isinstance(legs, list):
        legs = []
    routes = _extract_routes_from_legs(legs)
    stops, vessel_movements = _stops_and_vessels_from_routes(routes)

    # Consignment/containers and events
    cons_list = (
        (root.get("ConsignmentDetails") or {}).get("ConsContainerList")
        or (root.get("consignmentDetails") or {}).get("consContainerList")
        or []
    )

    chosen_cons: Optional[Dict[str, Any]] = None
    for cons in cons_list:
        if cons.get("ContainerNumber") == container_number:
            chosen_cons = cons
            break
    if not chosen_cons and cons_list:
        chosen_cons = cons_list[0]

    activity_list: List[Dict[str, Any]] = []
    if chosen_cons:
        activity_list = (
            chosen_cons.get("UnitActivityList")
            or chosen_cons.get("unitActivityList")
            or []
        )

    # Events sorted by newest first
    events: List[Dict[str, Any]] = []
    activity_list_sorted = sorted(
        activity_list,
        key=lambda ev: try_parse_datetime(ev.get("ActivityTime") or "") or datetime.min,
        reverse=True,
    )
    for ev in activity_list_sorted:
        events.append(
            {
                "status": ev.get("ActivityName") or ev.get("ActivityCode"),
                "eventCode": ev.get("ActivityCode"),
                "eventName": ev.get("ActivityName"),
                "eventTime": parse_date(ev.get("ActivityTime")),
                "eventPort": _first_non_empty(ev, ["ActivityPort", "ActivityLocation", "Location"]),
            }
        )

    # Fill summary fields
    origin = None
    destination = None
    if routes:
        origin = routes[0].get("from")
        destination = routes[-1].get("to")

    final_output["origin"] = origin
    final_output["destination"] = destination
    final_output["currentStatus"] = (events[0]["status"] if events else None)

    cont = final_output["containers"][0]
    cont["containerType"] = chosen_cons.get("Type") if chosen_cons else None
    cont["containerNum"] = chosen_cons.get("ContainerNumber") if chosen_cons else container_number
    cont["events"] = events
    cont["routes"] = routes
    cont["stops"] = stops
    cont["vesselMovements"] = vessel_movements

    # Try to obtain ETA from the last leg arrival if available
    cont["podETA"] = routes[-1].get("arrival") if routes else None

    # Additional info assembled from chosen cons if present
    additional_info: Dict[str, Any] = {}
    if chosen_cons:
        for k in [
            "ISOCode",
            "Size",
            "Type",
            "Status",
            "CurrentLocation",
            "SealNumber",
            "GrossWeight",
            "Vgm",
        ]:
            if chosen_cons.get(k) not in (None, ""):
                additional_info[k] = chosen_cons.get(k)
    cont["additionalInfo"] = additional_info if additional_info else None

    # Logs
    final_output["logs"].extend({"ts": datetime.utcnow().isoformat() + "Z", "msg": m} for m in api_logs)
    final_output["logs"].append(
        {
            "ts": datetime.utcnow().isoformat() + "Z",
            "msg": f"Events fetched: {len(events)}; Routes fetched: {len(routes)}",
        }
    )

    return final_output


@app.route('/Zim4/v1/bl/<container_number>', methods=['GET'])
def get_container_data(container_number):
    try:
        data = scrape_container_data(container_number)
        return Response(json.dumps(data, indent=4), mimetype='application/json')
    except Exception as e:
        err = {"error": str(e)}
        return Response(json.dumps(err, indent=4), mimetype='application/json'), 500


if __name__ == '__main__':
    import os
    port = int(os.getenv("PORT", "5100"))
    app.run(host="0.0.0.0", port=port)