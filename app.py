from flask import Flask, Response
import json
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException, WebDriverException
from datetime import datetime
import copy
import time
import random
from functools import wraps

app = Flask(__name__)

RESPONSE_TEMPLATE = {
    "version": "1.00",
    "scrapingType": None,
    "refNum": None,
    "refType": None,
    "jtCarrierName": None,
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
            "additionalInfo": None
        }
    ],
    "logs": []
}

def retry_on_failure(max_retries=3, delay_range=(1, 3)):
    """Decorator to retry functions on failure"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_retries - 1:
                        raise e
                    delay = random.uniform(*delay_range)
                    time.sleep(delay)
            return None
        return wrapper
    return decorator

def parse_date(date_str: str):
    if not date_str:
        return None
    fmts = [
        "%d-%b-%Y %H:%M",
        "%d-%b-%Y",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%d %H:%M",
        "%m/%d/%Y %H:%M",
        "%m/%d/%Y",
    ]
    for fmt in fmts:
        try:
            dt = datetime.strptime(date_str.strip(), fmt)
            if any(ch in date_str for ch in ["T", ":", " "]):
                return dt.strftime("%d-%b-%Y %H:%M")
            return dt.strftime("%d-%b-%Y")
        except Exception:
            continue
    return date_str

def safe_get_text(el):
    try:
        return el.text.strip()
    except Exception:
        return ""

def wait_and_click(driver, by, selector, timeout=15):
    """Enhanced wait and click with multiple strategies"""
    try:
        # First try: Wait for element to be clickable
        element = WebDriverWait(driver, timeout).until(
            EC.element_to_be_clickable((by, selector))
        )
        # Scroll to element if needed
        driver.execute_script("arguments[0].scrollIntoView(true);", element)
        time.sleep(0.5)
        element.click()
        return True
    except Exception:
        try:
            # Second try: Use JavaScript click
            element = driver.find_element(by, selector)
            driver.execute_script("arguments[0].click();", element)
            return True
        except Exception:
            return False

def robust_find_element(driver, selectors_list, timeout=15):
    """Try multiple selectors until one works"""
    for by, selector in selectors_list:
        try:
            element = WebDriverWait(driver, timeout).until(
                EC.presence_of_element_located((by, selector))
            )
            return element
        except Exception:
            continue
    return None

def robust_find_elements(driver, selectors_list, timeout=10):
    """Try multiple selectors for finding multiple elements"""
    for by, selector in selectors_list:
        try:
            WebDriverWait(driver, timeout).until(
                EC.presence_of_element_located((by, selector))
            )
            elements = driver.find_elements(by, selector)
            if elements:
                return elements
        except Exception:
            continue
    return []

@retry_on_failure(max_retries=3)
def fetch_events_and_routes_via_api(driver, container_number: str):
    """Fetch events/routes using the same browser tab with retry logic"""
    api_url = f"https://www.zim.com/api/v2/trackShipment/GetTracing?consnumber={container_number}"
    original_url = driver.current_url
    
    try:
        driver.get(api_url)
        time.sleep(2)  # Allow page to load

        pre_selectors = [
            (By.TAG_NAME, "pre"),
            (By.CSS_SELECTOR, "pre"),
            (By.XPATH, "//pre"),
            (By.CSS_SELECTOR, "body")
        ]
        
        pre_element = robust_find_element(driver, pre_selectors, timeout=15)
        if not pre_element:
            raise Exception("Could not find API response element")
            
        response_text = pre_element.text
        if not response_text.strip():
            # Try to get page source if pre is empty
            response_text = driver.page_source
            
        data = json.loads(response_text)
    except Exception as e:
        driver.get(original_url)
        raise e

    events = []
    routes = []
    actual_container_number = container_number
    ref_type = None

    try:
        if "data" in data:
            consignment_details = data["data"].get("consignmentDetails", {})
            ref_type = consignment_details.get("type")
            containers_list = consignment_details.get("consContainerList", [])
            if containers_list:
                cont_info = containers_list[0]
                actual_container_number = (
                    (cont_info.get("unitPrefix") or "").strip() + (cont_info.get("unitNo") or "").strip()
                )
                for idx, cont in enumerate(containers_list):
                    for e in cont.get("unitActivityList", []):
                        events.append({
                            "mode": None,
                            "status": e.get("activityDesc"),
                            "eventCode": None,
                            "eventTime": parse_date(e.get("activityDateTz") or ""),
                            "eventQualifier": None,
                            "location": {
                                "name": f"{e.get('placeFromDesc', '')}, {e.get('countryFromName', '')}",
                                "city": e.get("placeFromDesc"),
                                "state": None,
                                "country": e.get("countryFromName"),
                                "latitude": None,
                                "longitude": None,
                                "unloCode": None,
                                "terminal": None
                            },
                            "stopIndex": str(idx),
                            "vesselInfo": {
                                "name": e.get("vesselName"),
                                "imo": None,
                                "mmsi": None,
                                "additionalInfo": None
                            },
                            "voyageReference": e.get("voyage"),
                            "additionalInfo": None
                        })
            for leg in data["data"].get("blRouteLegs", []):
                routes.append({
                    "place": None,
                    "date": None,
                    "berthing": None,
                    "vessel": leg.get("vesselName"),
                    "voyage": leg.get("voyage"),
                    "actualLoading": None,
                    "portOfLoading": f"{leg.get('placeFromDesc', '')}, {leg.get('countryNameFrom', '')}, {leg.get('depotNameFrom', '')}",
                    "departureDate": parse_date(leg.get("sailingDateTz")),
                    "departureDateExpected": None,
                    "portOfDischarging": f"{leg.get('portNameTo', '')}, {leg.get('depotNameTo', '')}",
                    "arrivalTime": parse_date(leg.get("arrivalDateTz")),
                    "arrivalTimeExpected": None
                })
    except Exception as e:
        print(f"Error parsing API response: {e}")

    driver.get(original_url)  # return back to the previous page
    time.sleep(2)  # Allow page to load
    return events, routes, actual_container_number, ref_type

@retry_on_failure(max_retries=3)
def scrape_container_data(container_number: str):
    options = uc.ChromeOptions()
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--disable-extensions")
    options.add_argument("--disable-plugins")
    options.add_argument("--disable-images")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)

    driver = None
    try:
        driver = uc.Chrome(options=options)
        driver.set_page_load_timeout(90)
        driver.implicitly_wait(10)
        
        # Add stealth measures
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        
        # Navigate to the tracking page with retries
        max_nav_attempts = 3
        for nav_attempt in range(max_nav_attempts):
            try:
                driver.get("https://www.zim.com/tools/track-a-shipment")
                time.sleep(3 + random.uniform(1, 3))  # Random delay
                break
            except Exception as e:
                if nav_attempt == max_nav_attempts - 1:
                    raise e
                time.sleep(5)
        
        # Handle cookie consent with multiple strategies
        cookie_selectors = [
            (By.ID, "onetrust-accept-btn-handler"),
            (By.CSS_SELECTOR, "#onetrust-accept-btn-handler"),
            (By.XPATH, "//button[contains(@id, 'onetrust-accept')]"),
            (By.XPATH, "//button[contains(text(), 'Accept')]"),
            (By.CSS_SELECTOR, "button[id*='accept']")
        ]
        
        for by, selector in cookie_selectors:
            try:
                if wait_and_click(driver, by, selector, timeout=8):
                    time.sleep(1)
                    break
            except Exception:
                continue

        # Find container input with multiple strategies
        input_selectors = [
            (By.ID, "shipment-main-search-2"),
            (By.ID, "shipment-main-search"),
            (By.CSS_SELECTOR, "input[id*='shipment-main-search']"),
            (By.CSS_SELECTOR, "input[placeholder*='container']"),
            (By.CSS_SELECTOR, "input[type='text'][id*='search']"),
            (By.XPATH, "//input[contains(@id, 'search')]")
        ]
        
        container_input = robust_find_element(driver, input_selectors, timeout=20)
        if not container_input:
            raise RuntimeError("Unable to locate container input box after trying all selectors.")

        # Clear and enter container number
        container_input.clear()
        time.sleep(0.5)
        container_input.send_keys(container_number)
        time.sleep(1)

        # Click search button with multiple strategies
        search_selectors = [
            (By.XPATH, "//input[@type='submit' and contains(@value,'Search')]"),
            (By.CSS_SELECTOR, "input[type='submit'][value*='Search']"),
            (By.XPATH, "//button[contains(.,'Search')]"),
            (By.CSS_SELECTOR, "button[type='submit']"),
            (By.XPATH, "//button[@type='submit']"),
            (By.CSS_SELECTOR, "input[value*='search']")
        ]
        
        search_clicked = False
        for by, sel in search_selectors:
            if wait_and_click(driver, by, sel, timeout=10):
                search_clicked = True
                break
        
        if not search_clicked:
            # Fallback: try pressing Enter
            container_input.send_keys("\n")
        
        time.sleep(3)

        # Wait for results with multiple possible selectors
        result_selectors = [
            (By.CSS_SELECTOR, "div.tracing-details-card.card"),
            (By.CSS_SELECTOR, "div.tracing-details-card"),
            (By.CSS_SELECTOR, ".tracing-details-card"),
            (By.CSS_SELECTOR, "div[class*='tracing-details']"),
            (By.CSS_SELECTOR, "div[class*='card']"),
            (By.XPATH, "//div[contains(@class, 'tracing-details')]")
        ]
        
        result_found = False
        for by, selector in result_selectors:
            try:
                WebDriverWait(driver, 25).until(
                    EC.visibility_of_element_located((by, selector))
                )
                result_found = True
                break
            except Exception:
                continue
        
        if not result_found:
            raise RuntimeError("Results page did not load properly")
            
        time.sleep(2)  # Allow all content to load

        # Extract summary data with robust selectors
        summary_data = {}
        label_selectors = [
            (By.CSS_SELECTOR, "div.card-content-text > div.label"),
            (By.CSS_SELECTOR, "div.label"),
            (By.CSS_SELECTOR, ".label"),
            (By.XPATH, "//div[contains(@class, 'label')]")
        ]
        
        value_selectors = [
            (By.CSS_SELECTOR, "div.card-content-text > div.label + div"),
            (By.CSS_SELECTOR, "div.label + div"),
            (By.XPATH, "//div[contains(@class, 'label')]/following-sibling::div[1]")
        ]
        
        labels = robust_find_elements(driver, label_selectors)
        values = robust_find_elements(driver, value_selectors)
        
        label_count = {}
        for label, value in zip(labels, values):
            key = safe_get_text(label)
            val = safe_get_text(value)
            if not key:
                continue
            if key in label_count:
                label_count[key] += 1
                key = f"{key}_{label_count[key]}"
            else:
                label_count[key] = 1
            summary_data[key] = val

        # Extract additional info with robust selectors
        additional_info = {}
        info_label_selectors = [
            (By.CSS_SELECTOR, "div.container-info-card .label"),
            (By.CSS_SELECTOR, ".container-info-card .label"),
            (By.XPATH, "//div[contains(@class, 'container-info-card')]//div[contains(@class, 'label')]")
        ]
        
        info_value_selectors = [
            (By.CSS_SELECTOR, "div.container-info-card .label + div"),
            (By.CSS_SELECTOR, ".container-info-card .label + div"),
            (By.XPATH, "//div[contains(@class, 'container-info-card')]//div[contains(@class, 'label')]/following-sibling::div[1]")
        ]
        
        info_labels = robust_find_elements(driver, info_label_selectors)
        info_values = robust_find_elements(driver, info_value_selectors)
        
        for label, value in zip(info_labels, info_values):
            k = safe_get_text(label)
            v = safe_get_text(value)
            if k:
                additional_info[k] = v

        # Fetch events and routes via API with retry
        events, routes, actual_container_number, ref_type = fetch_events_and_routes_via_api(driver, container_number)

        # Build final response
        final_output = copy.deepcopy(RESPONSE_TEMPLATE)
        final_output["refNum"] = container_number
        final_output["refType"] = ref_type
        final_output["bolNum"] = container_number
        final_output["origin"] = None
        final_output["destination"] = None
        final_output["currentStatus"] = events[0]["status"] if events else None

        cont = final_output["containers"][0]
        cont["containerType"] = summary_data.get("cargoType")
        cont["containerNum"] = actual_container_number
        cont["events"] = list(reversed(events[1:])) if events else []  # reversed events
        cont["routes"] = routes
        cont["podETA"] = routes[-1]["arrivalTime"] if routes else None  # arrivalDateDt
        cont["additionalInfo"] = additional_info if additional_info else None

        final_output["logs"].append({
            "ts": datetime.utcnow().isoformat() + "Z",
            "msg": f"Events fetched: {len(events) - 1 if events else 0}; Routes fetched: {len(routes)}"
        })

        return final_output

    except Exception as e:
        # Enhanced error logging
        error_msg = f"Scraping failed for {container_number}: {str(e)}"
        print(error_msg)
        
        # Return a partial response with error info
        error_output = copy.deepcopy(RESPONSE_TEMPLATE)
        error_output["refNum"] = container_number
        error_output["logs"].append({
            "ts": datetime.utcnow().isoformat() + "Z",
            "msg": error_msg
        })
        raise e

    finally:
        if driver:
            try:
                driver.quit()
            except Exception:
                pass

@app.route('/Zim4/v1/<ref_type>/<ref_number>', methods=['GET'])
def get_container_data(ref_type, ref_number):
    try:
        data = scrape_container_data(ref_number)
        data['refType'] = ref_type.upper()  # override refType from URL
        return Response(json.dumps(data, indent=4), mimetype='application/json')
    except Exception as e:
        err = {"error": str(e)}
        return Response(json.dumps(err, indent=4), mimetype='application/json'), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5100)