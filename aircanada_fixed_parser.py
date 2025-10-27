import undetected_chromedriver as uc
from flask import Flask, request, jsonify, render_template_string
import json
import time
import random
import logging
import os
import zipfile
import re
from bs4 import BeautifulSoup
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, WebDriverException

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Global scraper instance
scraper = None

def create_proxy_extension(proxy_host, proxy_port, proxy_user, proxy_pass, plugin_path="proxy_auth_plugin.zip"):
    """Create a Chrome extension to handle proxy authentication"""
    manifest_json = """
    {
        "version": "1.0.0",
        "manifest_version": 2,
        "name": "Chrome Proxy",
        "permissions": [
            "proxy",
            "tabs",
            "unlimitedStorage",
            "storage",
            "<all_urls>",
            "webRequest",
            "webRequestBlocking"
        ],
        "background": {
            "scripts": ["background.js"]
        },
        "minimum_chrome_version":"22.0.0"
    }
    """

    background_js = f"""
    var config = {{
            mode: "fixed_servers",
            rules: {{
              singleProxy: {{
                scheme: "http",
                host: "{proxy_host}",
                port: parseInt({proxy_port})
              }},
              bypassList: ["localhost"]
            }}
          }};
    chrome.proxy.settings.set({{value: config, scope: "regular"}}, function() {{}});
    function callbackFn(details) {{
        return {{
            authCredentials: {{
                username: "{proxy_user}",
                password: "{proxy_pass}"
            }}
        }};
    }}
    chrome.webRequest.onAuthRequired.addListener(
                callbackFn,
                {{urls: ["<all_urls>"]}},
                ['blocking']
    );
    """

    with zipfile.ZipFile(plugin_path, 'w') as zp:
        zp.writestr("manifest.json", manifest_json)
        zp.writestr("background.js", background_js)

    return plugin_path


def parse_html_to_tracking_data(html_content, awb_number):
    """Parse HTML content based on the actual Air Canada structure"""
    try:
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Initialize the tracking data structure
        tracking_data = {
            "refNum": awb_number.replace("014-", ""),
            "refType": "AWB",
            "origin": None,
            "destination": None,
            "additionalInfo": {
                "totalPieces": None,
                "pieces": None,
                "weight": None,
                "totalWeight": None,
                "specialHandling": None,
                "volume": None,
                "totalVolume": None,
                "products": None,
                "commodity": null,
                "offsetData": None,
                "currentStatus": None,
                "departureArrivalInfo": None
            },
            "shipments": [
                {
                    "events": [],
                    "routes": []
                }
            ],
            "logs": None
        }
        
        logger.info("Parsing Air Canada HTML with corrected selectors...")
        
        # Extract origin and destination from booking summary
        page_text = soup.get_text()
        
        # Look for "From X to Y" pattern in booking summary
        route_match = re.search(r'From\s+([A-Za-z\s]+)\s+to\s+([A-Za-z\s]+)', page_text)
        if route_match:
            origin_city = route_match.group(1).strip()
            destination_city = route_match.group(2).strip()
            logger.info(f"Found route: {origin_city} to {destination_city}")
        
        # Extract route segments from the actual HTML structure
        routes_found = []
        segment_items = soup.find_all('div', class_='segment-item')
        logger.info(f"Found {len(segment_items)} segment items")
        
        for i, segment in enumerate(segment_items):
            segment_text = segment.get_text(strip=True)
            logger.info(f"Segment {i}: {segment_text[:100]}...")
            
            # Extract route information from segment
            route_match = re.search(r'Route:\s*([A-Za-z\s]+)\s*\(([A-Z]{3})\)\s*to\s*([A-Za-z\s]+)\s*\(([A-Z]{3})\)', segment_text)
            flight_match = re.search(r'Flight:\s*([A-Z0-9]+)\s*-\s*(Confirmed|Unconfirmed)', segment_text)
            departure_match = re.search(r'Departure:\s*([^<]+)', segment_text)
            
            if route_match:
                origin_city = route_match.group(1).strip()
                origin_code = route_match.group(2)
                dest_city = route_match.group(3).strip()
                dest_code = route_match.group(4)
                
                # Set overall origin and destination from first and last segments
                if i == 0:
                    tracking_data["origin"] = origin_code
                if i == len(segment_items) - 1:
                    tracking_data["destination"] = dest_code
                
                route = {
                    "origin": origin_code,
                    "destination": dest_code,
                    "routeIndex": i,
                    "date": departure_match.group(1).strip() if departure_match else None,
                    "flightNum": flight_match.group(1) if flight_match else None,
                    "estimatedDepartureDate": None,
                    "estimatedArrivalDate": None,
                    "departureDate": None,
                    "departureDateExpected": None,
                    "arrivalDate": None,
                    "arrivalDateExpected": None,
                    "totalPieces": None,
                    "pieces": None,
                    "weight": None,
                    "totalWeight": None,
                    "volume": None,
                    "totalVolume": None,
                    "additionalInfo": {
                        "totalPieces": None,
                        "weight": None,
                        "totalWeight": None,
                        "specialHandling": None,
                        "origin": origin_city,
                        "destination": dest_city,
                        "description": flight_match.group(2) if flight_match else "Unknown",
                        "departureDate": departure_match.group(1).strip() if departure_match else None,
                        "arrivalDate": None,
                        "arrivalDateExpected": None,
                        "arrivalDateEstimated": None,
                        "departureDateExpected": None,
                        "departureDateEstimated": None,
                        "flightDate": None,
                        "facility": None,
                        "remarks": None,
                        "ulds": None,
                        "vehicleNumber": flight_match.group(1) if flight_match else None,
                        "volume": None,
                        "totalVolume": None
                    },
                    "transportMode": "AIR"
                }
                routes_found.append(route)
                logger.info(f"Added route: {origin_code} -> {dest_code}, Flight: {flight_match.group(1) if flight_match else 'N/A'}")
        
        # Look for tracking events in mat-expansion-panel elements
        events_found = []
        
        # Try different selectors for expansion panels
        panel_selectors = [
            'mat-expansion-panel',
            '.mat-expansion-panel',
            '[class*="expansion-panel"]'
        ]
        
        panels = []
        for selector in panel_selectors:
            found_panels = soup.select(selector)
            if found_panels:
                panels = found_panels
                logger.info(f"Found {len(panels)} panels with selector: {selector}")
                break
        
        for panel_idx, panel in enumerate(panels):
            logger.info(f"Processing panel {panel_idx}")
            
            # Extract date from panel header
            panel_header = panel.find('mat-expansion-panel-header')
            date_text = None
            
            if panel_header:
                # Look for date in panel title
                panel_title = panel_header.find('mat-panel-title')
                if panel_title:
                    title_text = panel_title.get_text(strip=True)
                    # Remove "View shipping status on" text
                    date_text = re.sub(r'View shipping status on\s*', '', title_text).strip()
                    logger.info(f"Panel {panel_idx} date: {date_text}")
            
            # Look for event items within the panel
            event_selectors = [
                '.m-expanded-panel',
                '[class*="expanded-panel"]',
                '.event-item',
                '[class*="event"]'
            ]
            
            event_items = []
            for selector in event_selectors:
                found_items = panel.select(selector)
                if found_items:
                    event_items = found_items
                    logger.info(f"Found {len(event_items)} event items with selector: {selector}")
                    break
            
            for event_idx, item in enumerate(event_items):
                logger.info(f"Processing event {event_idx} in panel {panel_idx}")
                
                # Extract status from left panel
                left_panel = item.find('div', class_='m-left-panel')
                status = left_panel.get_text(strip=True) if left_panel else None
                
                # Extract details from right panel
                right_panel = item.find('div', class_='m-right-panel-content')
                time_str = None
                location = None
                pieces = None
                weight = None
                
                if right_panel:
                    spans = right_panel.find_all('span')
                    if len(spans) >= 4:
                        time_str = spans[0].get_text(strip=True)
                        location = spans[1].get_text(strip=True)
                        pieces_text = spans[2].get_text(strip=True)
                        weight_text = spans[3].get_text(strip=True)
                        
                        # Extract pieces number
                        pieces_match = re.search(r'(\d+)\s*pc', pieces_text)
                        if pieces_match:
                            pieces = pieces_match.group(1)
                        
                        # Extract weight
                        weight_match = re.search(r'([\d.]+)kg', weight_text)
                        if weight_match:
                            weight = float(weight_match.group(1))
                        
                        logger.info(f"Event details: {time_str}, {location}, {pieces_text}, {weight_text}")
                
                # Extract description from package status
                description = None
                package_status = item.find('div', class_='m-package-status')
                if package_status:
                    description = package_status.get_text(strip=True)
                
                # Map status to event codes
                event_code_mapping = {
                    'delivered': 'DLV',
                    'ready for pickup': 'NFD',
                    'arrived': 'FAR',
                    'in transit': 'DEP',
                    'planned for flight': 'PRE',
                    'tracking has not started': 'FOH',
                    'dropped off': 'RCT'
                }
                
                event_code = None
                if status:
                    status_lower = status.lower()
                    for key, code in event_code_mapping.items():
                        if key in status_lower:
                            event_code = code
                            break
                
                # Extract flight number from description
                flight_number = None
                if description:
                    flight_match = re.search(r'Flight\s+([A-Z0-9]+)', description)
                    if flight_match:
                        flight_number = flight_match.group(1)
                
                # Construct full datetime
                event_time = None
                if date_text and time_str:
                    try:
                        # Convert "Aug 18, 2025" and "12:16" to proper datetime format
                        date_match = re.search(r'(\w+)\s+(\d+),\s+(\d+)', date_text)
                        if date_match:
                            month_name = date_match.group(1)
                            day = date_match.group(2).zfill(2)
                            year = date_match.group(3)
                            
                            # Convert month name to number
                            month_mapping = {
                                'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
                                'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
                                'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
                            }
                            month = month_mapping.get(month_name, '01')
                            
                            event_time = f"{year}-{month}-{day} {time_str}:00"
                    except Exception as e:
                        logger.debug(f"Date parsing error: {e}")
                        event_time = f"{date_text} {time_str}"
                
                # Create event object if we have meaningful data
                if status or description or location:
                    event = {
                        "mode": "AIR",
                        "status": None,
                        "eventCode": event_code,
                        "eventTime": event_time,
                        "eventQualifier": None,
                        "location": {
                            "name": location,
                            "city": None,
                            "state": None,
                            "country": None,
                            "latitude": None,
                            "longitude": None,
                            "unloCode": None,
                            "terminal": None
                        },
                        "additionalInfo": {
                            "totalPieces": pieces,
                            "weight": None,
                            "totalWeight": {
                                "value": weight,
                                "unit": "KG"
                            } if weight else None,
                            "specialHandling": None,
                            "origin": None,
                            "destination": None,
                            "description": description,
                            "departureDate": None,
                            "arrivalDate": None,
                            "arrivalDateExpected": None,
                            "arrivalDateEstimated": None,
                            "departureDateExpected": None,
                            "departureDateEstimated": None,
                            "flightDate": None,
                            "facility": None,
                            "remarks": None,
                            "ulds": None,
                            "vehicleNumber": flight_number,
                            "volume": None,
                            "totalVolume": None
                        }
                    }
                    
                    events_found.append(event)
                    logger.info(f"Added event: {status} at {location} on {event_time}")
        
        # If no events found, try alternative parsing approaches
        if not events_found:
            logger.info("No events found with standard selectors, trying alternative approaches...")
            
            # Look for any divs that might contain tracking information
            potential_event_divs = soup.find_all('div', string=re.compile(r'(Delivered|Arrived|In transit|Departed|Picked up)', re.IGNORECASE))
            logger.info(f"Found {len(potential_event_divs)} potential event divs")
            
            for div in potential_event_divs[:5]:  # Limit to first 5
                parent = div.parent
                if parent:
                    event_text = parent.get_text(strip=True)
                    logger.info(f"Potential event text: {event_text[:100]}...")
                    
                    # Try to extract basic event info
                    status = div.get_text(strip=True)
                    
                    event = {
                        "mode": "AIR",
                        "status": None,
                        "eventCode": "INFO",
                        "eventTime": None,
                        "eventQualifier": None,
                        "location": {
                            "name": None,
                            "city": None,
                            "state": None,
                            "country": None,
                            "latitude": None,
                            "longitude": None,
                            "unloCode": None,
                            "terminal": None
                        },
                        "additionalInfo": {
                            "totalPieces": None,
                            "weight": None,
                            "totalWeight": None,
                            "specialHandling": None,
                            "origin": None,
                            "destination": None,
                            "description": status,
                            "departureDate": None,
                            "arrivalDate": None,
                            "arrivalDateExpected": None,
                            "arrivalDateEstimated": None,
                            "departureDateExpected": None,
                            "departureDateEstimated": None,
                            "flightDate": None,
                            "facility": None,
                            "remarks": None,
                            "ulds": None,
                            "vehicleNumber": None,
                            "volume": None,
                            "totalVolume": None
                        }
                    }
                    events_found.append(event)
        
        # Extract total pieces and weight from first event if available
        if events_found:
            first_event = events_found[0]
            if first_event["additionalInfo"]["totalPieces"]:
                try:
                    tracking_data["additionalInfo"]["totalPieces"] = int(first_event["additionalInfo"]["totalPieces"])
                except:
                    pass
            if first_event["additionalInfo"]["totalWeight"]:
                tracking_data["additionalInfo"]["totalWeight"] = {
                    "value": first_event["additionalInfo"]["totalWeight"]["value"],
                    "unit": "Kg"
                }
        
        # Add events and routes to tracking data
        tracking_data["shipments"][0]["events"] = events_found
        tracking_data["shipments"][0]["routes"] = routes_found
        
        logger.info(f"Successfully parsed: {len(events_found)} events, {len(routes_found)} routes")
        logger.info(f"Origin: {tracking_data['origin']}, Destination: {tracking_data['destination']}")
        
        return tracking_data
        
    except Exception as e:
        logger.error(f"Error parsing HTML for AWB {awb_number}: {str(e)}")
        
        # Return basic structure even if parsing fails
        return {
            "refNum": awb_number.replace("014-", ""),
            "refType": "AWB",
            "origin": None,
            "destination": None,
            "additionalInfo": {
                "totalPieces": None,
                "pieces": None,
                "weight": None,
                "totalWeight": None,
                "specialHandling": None,
                "volume": None,
                "totalVolume": None,
                "products": None,
                "commodity": None,
                "offsetData": None,
                "currentStatus": None,
                "departureArrivalInfo": None
            },
            "shipments": [
                {
                    "events": [],
                    "routes": []
                }
            ],
            "logs": None
        }


class AirCanadaSeleniumScraper:
    def __init__(self, headless=True, proxy=None):
        self.driver = None
        self.headless = headless
        self.proxy = proxy
        self.setup_driver()

    def setup_driver(self):
        try:
            options = uc.ChromeOptions()

            if self.headless:
                options.add_argument('--headless=new')

            # Chrome stability options
            options.add_argument('--no-sandbox')
            options.add_argument('--disable-dev-shm-usage')
            options.add_argument('--disable-blink-features=AutomationControlled')
            options.add_argument('--disable-gpu')
            options.add_argument('--disable-software-rasterizer')
            options.add_argument('--disable-background-timer-throttling')
            options.add_argument('--disable-backgrounding-occluded-windows')
            options.add_argument('--disable-renderer-backgrounding')
            options.add_argument('--disable-features=TranslateUI')
            options.add_argument('--disable-ipc-flooding-protection')

            options.add_argument(
                "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            )

            if self.proxy:
                try:
                    parts = self.proxy.split(":")
                    proxy_host = parts[0]
                    proxy_port = parts[1]
                    proxy_user = parts[2]
                    proxy_pass = ":".join(parts[3:])
                    plugin_file = create_proxy_extension(proxy_host, proxy_port, proxy_user, proxy_pass)
                    options.add_extension(plugin_file)
                    logger.info("Proxy with authentication added successfully")
                except Exception as e:
                    logger.error(f"Invalid proxy format or error adding proxy: {str(e)}")

            window_sizes = [
                '--window-size=1920,1080',
                '--window-size=1366,768',
                '--window-size=1440,900',
                '--window-size=1536,864'
            ]
            options.add_argument(random.choice(window_sizes))

            # Try to create driver with better error handling
            try:
                self.driver = uc.Chrome(options=options, version_main=None)
                logger.info("Chrome driver initialized successfully")
            except Exception as e:
                logger.error(f"First attempt failed: {e}")
                # Retry without version_main
                self.driver = uc.Chrome(options=options)
                logger.info("Chrome driver initialized on retry")

            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        except Exception as e:
            logger.error(f"Error setting up Chrome driver: {str(e)}")
            raise

    def get_random_delay(self, min_delay=3, max_delay=8):
        return random.uniform(min_delay, max_delay)

    def visit_homepage_first(self):
        try:
            logger.info("Visiting homepage to establish session...")
            self.driver.get("https://www.aircanada.com/")
            time.sleep(random.uniform(2, 5))

            self.driver.execute_script("window.scrollTo(0, Math.floor(Math.random() * 500));")
            time.sleep(random.uniform(1, 3))

            logger.info("Successfully visited homepage")
            return True
        except Exception as e:
            logger.error(f"Error visiting homepage: {str(e)}")
            return False

    def fetch_tracking_data(self, awb_number, max_retries=3):
        """Fetch tracking data using Selenium"""
        tracking_url = f"https://www.aircanada.com/cargo/tracking?awbnb={awb_number}"

        for attempt in range(max_retries):
            try:
                logger.info(f"Attempt {attempt + 1} for AWB: {awb_number}")

                if attempt == 0:
                    self.visit_homepage_first()

                logger.info(f"Navigating to: {tracking_url}")
                self.driver.get(tracking_url)

                # Wait for page to load
                wait = WebDriverWait(self.driver, 20)
                
                # Wait for body to be present
                wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
                logger.info("Page body loaded")
                
                # Additional wait for content to load
                time.sleep(random.uniform(5, 8))
                
                # Try to wait for booking summary
                try:
                    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".booking-summary")))
                    logger.info("Booking summary found")
                except TimeoutException:
                    logger.warning("Booking summary not found, continuing anyway")
                
                # Additional wait for dynamic content
                time.sleep(3)

                page_source = self.driver.page_source
                logger.info(f"Page source length: {len(page_source)}")

                if any(indicator in page_source.lower() for indicator in [
                    'access denied', 'blocked', 'cloudflare', 'bot detected',
                    'security check', 'please wait', 'checking your browser'
                ]):
                    logger.warning(f"Possible bot detection for AWB: {awb_number}")
                    if attempt < max_retries - 1:
                        delay = self.get_random_delay(10, 20)
                        logger.info(f"Waiting {delay:.2f} seconds before retry...")
                        time.sleep(delay)
                        continue

                logger.info(f"Successfully fetched data for AWB: {awb_number}")
                return page_source

            except TimeoutException:
                logger.warning(f"Timeout for AWB: {awb_number}, attempt {attempt + 1}")
                if attempt < max_retries - 1:
                    delay = self.get_random_delay(8, 15)
                    time.sleep(delay)
                    continue

            except WebDriverException as e:
                logger.error(f"WebDriver exception for AWB {awb_number}: {str(e)}")
                if attempt < max_retries - 1:
                    delay = self.get_random_delay(5, 12)
                    time.sleep(delay)
                    continue

        return None

    def close(self):
        """Close the driver"""
        if self.driver:
            try:
                self.driver.quit()
            except:
                pass


# HTML template for the web interface
HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>Air Canada Cargo Tracking API - Fixed Parser</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background-color: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #c8102e; text-align: center; margin-bottom: 30px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input[type="text"] { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; }
        button { background-color: #c8102e; color: white; padding: 12px 30px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
        button:hover { background-color: #a00d24; }
        .result { margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6; }
        .loading { text-align: center; padding: 20px; color: #666; }
        .error { color: #dc3545; background-color: #f8d7da; border-color: #f5c6cb; }
        .success { color: #155724; background-color: #d4edda; border-color: #c3e6cb; }
        pre { background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto; white-space: pre-wrap; max-height: 500px; }
        .api-info { background: #e7f3ff; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
        .endpoint { font-family: monospace; background: #f1f1f1; padding: 5px; border-radius: 3px; }
        .success-info { background: #d1ecf1; padding: 15px; border-radius: 4px; margin-bottom: 20px; border: 1px solid #b8daff; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🛩️ Air Canada Cargo Tracking API - Fixed Parser</h1>
        
        <div class="success-info">
            <h3>✅ Parser Updated:</h3>
            <p>• Fixed to handle actual Air Canada HTML structure</p>
            <p>• Improved route extraction from segment items</p>
            <p>• Better event parsing with fallback methods</p>
        </div>
        
        <div class="api-info">
            <h3>API Endpoints (GET Method):</h3>
            <p><strong>GET</strong> <span class="endpoint">/track/&lt;awb&gt;</span> - Track AWB by URL path</p>
            <p><strong>GET</strong> <span class="endpoint">/track?awb=&lt;number&gt;</span> - Track AWB by query parameter</p>
            <p><strong>Examples:</strong></p>
            <ul>
                <li>http://localhost:5000/track/37120904</li>
                <li>http://localhost:5000/track?awb=37120904</li>
            </ul>
        </div>
        
        <form id="trackingForm">
            <div class="form-group">
                <label for="awb">AWB Number:</label>
                <input type="text" id="awb" name="awb" placeholder="Enter AWB number (e.g., 37120904)" required>
                <small>Note: 014- prefix will be added automatically</small>
            </div>
            <button type="submit">Track Shipment (Fixed Parser)</button>
        </form>
        
        <div id="result"></div>
    </div>

    <script>
        document.getElementById('trackingForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const awb = document.getElementById('awb').value;
            const resultDiv = document.getElementById('result');
            
            if (!awb) {
                resultDiv.innerHTML = '<div class="result error">Please enter an AWB number</div>';
                return;
            }
            
            resultDiv.innerHTML = '<div class="result loading">🔄 Tracking shipment with fixed parser...</div>';
            
            try {
                const response = await fetch(`/track/${awb}`);
                const data = await response.json();
                
                if (data.success) {
                    resultDiv.innerHTML = `
                        <div class="result success">
                            <h3>✅ Tracking Data Retrieved</h3>
                            <p><strong>AWB:</strong> ${data.awb}</p>
                            <p><strong>Origin:</strong> ${data.data.origin || 'Not found'}</p>
                            <p><strong>Destination:</strong> ${data.data.destination || 'Not found'}</p>
                            <p><strong>Events:</strong> ${data.data.shipments[0].events.length}</p>
                            <p><strong>Routes:</strong> ${data.data.shipments[0].routes.length}</p>
                            <h4>Full Tracking Data:</h4>
                            <pre>${JSON.stringify(data.data, null, 2)}</pre>
                        </div>
                    `;
                } else {
                    resultDiv.innerHTML = `
                        <div class="result error">
                            <h3>❌ Tracking Failed</h3>
                            <p><strong>Error:</strong> ${data.error}</p>
                            <p><strong>AWB:</strong> ${data.awb}</p>
                        </div>
                    `;
                }
            } catch (error) {
                resultDiv.innerHTML = `
                    <div class="result error">
                        <h3>❌ Request Failed</h3>
                        <p>Error: ${error.message}</p>
                    </div>
                `;
            }
        });
    </script>
</body>
</html>
"""


@app.route('/')
def home():
    """Web interface for tracking"""
    return render_template_string(HTML_TEMPLATE)


@app.route('/track/<awb_number>')
def track_awb_path(awb_number):
    """API endpoint to track AWB via URL path - GET method"""
    return track_awb_common(awb_number)


@app.route('/track')
def track_awb_query():
    """API endpoint to track AWB via query parameter - GET method"""
    awb_number = request.args.get('awb')
    if not awb_number:
        return jsonify({
            'success': False,
            'error': 'AWB number is required as query parameter (?awb=number)',
            'awb': None
        }), 400
    
    return track_awb_common(awb_number)


def track_awb_common(awb_number):
    """Common function to handle AWB tracking"""
    try:
        awb_number = str(awb_number).strip()
        
        # Add 014- prefix if not present
        if not awb_number.startswith("014-"):
            awb_number = "014-" + awb_number
        
        logger.info(f"Fixed parser API request for AWB: {awb_number}")
        
        # Initialize scraper if not already done
        global scraper
        if scraper is None:
            try:
                proxy = "brd.superproxy.io:22225:brd-customer-hl_82185c3d-zone-residential:u9vibpbq8sa1"
                scraper = AirCanadaSeleniumScraper(headless=False, proxy=proxy)
                logger.info("Scraper initialized")
            except Exception as e:
                logger.error(f"Failed to initialize scraper: {e}")
                return jsonify({
                    'success': False,
                    'error': f'Failed to initialize scraper: {str(e)}',
                    'awb': awb_number,
                    'timestamp': time.strftime("%Y-%m-%d %H:%M:%S")
                }), 500
        
        # Fetch HTML content
        html_content = scraper.fetch_tracking_data(awb_number)
        
        if html_content:
            # Parse HTML and map to required JSON structure
            tracking_data = parse_html_to_tracking_data(html_content, awb_number)
            
            logger.info(f"✅ SUCCESS: Tracking data retrieved for {awb_number}")
            
            return jsonify({
                'success': True,
                'awb': awb_number,
                'status': 'success',
                'data': tracking_data,
                'parser_version': 'fixed',
                'timestamp': time.strftime("%Y-%m-%d %H:%M:%S")
            })
        else:
            logger.error(f"❌ FAILED: No data retrieved for {awb_number}")
            
            return jsonify({
                'success': False,
                'awb': awb_number,
                'status': 'failed',
                'error': 'Failed to fetch tracking data from Air Canada',
                'timestamp': time.strftime("%Y-%m-%d %H:%M:%S")
            }), 500
    
    except Exception as e:
        logger.error(f"API error: {str(e)}")
        
        return jsonify({
            'success': False,
            'error': str(e),
            'awb': awb_number if 'awb_number' in locals() else None,
            'timestamp': time.strftime("%Y-%m-%d %H:%M:%S")
        }), 500


@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'parser_version': 'fixed',
        'timestamp': time.strftime("%Y-%m-%d %H:%M:%S"),
        'scraper_initialized': scraper is not None
    })


if __name__ == "__main__":
    try:
        logger.info("🚀 Starting Air Canada Cargo Tracking API - FIXED PARSER...")
        logger.info("📍 Web interface: http://localhost:5000")
        logger.info("📍 API endpoints:")
        logger.info("   GET http://localhost:5000/track/37120904")
        logger.info("   GET http://localhost:5000/track?awb=37120904")
        logger.info("📍 Health check: GET http://localhost:5000/health")
        
        app.run(host='0.0.0.0', port=5000, debug=False)
        
    except KeyboardInterrupt:
        logger.info("Shutting down...")
    finally:
        if scraper:
            scraper.close()
            logger.info("Scraper closed")