import undetected_chromedriver as uc
from flask import Flask, request, jsonify, render_template_string
import json
import time
import random
import logging
import os
import zipfile
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
    """Parse HTML content and map it to the required JSON structure"""
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
        
        # Try to extract data from various possible HTML structures
        logger.info("Parsing HTML content for tracking data...")
        
        # Look for shipment summary information
        summary_selectors = [
            '.shipment-summary',
            '.tracking-summary', 
            '.cargo-summary',
            '[class*="summary"]',
            '[class*="shipment"]'
        ]
        
        for selector in summary_selectors:
            summary_elements = soup.select(selector)
            if summary_elements:
                logger.info(f"Found summary elements with selector: {selector}")
                for element in summary_elements:
                    text = element.get_text(strip=True)
                    
                    # Extract pieces information
                    if 'piece' in text.lower() or 'pcs' in text.lower():
                        import re
                        pieces_match = re.search(r'(\d+)\s*(?:piece|pcs)', text, re.IGNORECASE)
                        if pieces_match:
                            tracking_data["additionalInfo"]["totalPieces"] = int(pieces_match.group(1))
                    
                    # Extract weight information
                    if 'kg' in text.lower() or 'weight' in text.lower():
                        import re
                        weight_match = re.search(r'(\d+(?:\.\d+)?)\s*kg', text, re.IGNORECASE)
                        if weight_match:
                            tracking_data["additionalInfo"]["totalWeight"] = {
                                "value": float(weight_match.group(1)),
                                "unit": "Kg"
                            }
        
        # Look for tracking events
        event_selectors = [
            '.tracking-event',
            '.shipment-event',
            '.timeline-item',
            '[class*="event"]',
            '[class*="timeline"]',
            '[class*="status"]',
            'mat-expansion-panel',
            '.expansion-panel'
        ]
        
        events_found = []
        
        for selector in event_selectors:
            elements = soup.select(selector)
            if elements:
                logger.info(f"Found {len(elements)} potential event elements with selector: {selector}")
                
                for element in elements:
                    event_text = element.get_text(strip=True)
                    
                    if len(event_text) > 10:  # Skip very short elements
                        # Try to extract structured event data
                        event = {
                            "mode": "AIR",
                            "status": None,
                            "eventCode": None,
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
                                "description": None,
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
                        
                        # Extract date/time information
                        import re
                        date_patterns = [
                            r'(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})',
                            r'(\d{2}/\d{2}/\d{4}\s+\d{2}:\d{2})',
                            r'(\d{2}-\d{2}-\d{4}\s+\d{2}:\d{2})'
                        ]
                        
                        for pattern in date_patterns:
                            date_match = re.search(pattern, event_text)
                            if date_match:
                                event["eventTime"] = date_match.group(1)
                                break
                        
                        # Extract location codes (3-letter airport codes)
                        location_match = re.search(r'\b([A-Z]{3})\b', event_text)
                        if location_match:
                            event["location"]["name"] = location_match.group(1)
                        
                        # Extract event codes
                        event_codes = ['FOH', 'RCT', 'PRE', 'MAN', 'DEP', 'FAR', 'ULB', 'AWA', 'NFD', 'DLV']
                        for code in event_codes:
                            if code in event_text.upper():
                                event["eventCode"] = code
                                break
                        
                        # Extract flight numbers
                        flight_match = re.search(r'\b(AC\d+|[A-Z]{2}\d+)\b', event_text)
                        if flight_match:
                            event["additionalInfo"]["vehicleNumber"] = flight_match.group(1)
                        
                        # Extract pieces and weight from event
                        pieces_match = re.search(r'(\d+)\s*(?:piece|pcs)', event_text, re.IGNORECASE)
                        if pieces_match:
                            event["additionalInfo"]["totalPieces"] = pieces_match.group(1)
                        
                        weight_match = re.search(r'(\d+(?:\.\d+)?)\s*kg', event_text, re.IGNORECASE)
                        if weight_match:
                            event["additionalInfo"]["totalWeight"] = {
                                "value": float(weight_match.group(1)),
                                "unit": "KG"
                            }
                        
                        events_found.append(event)
        
        # Look for route information
        route_selectors = [
            '.route-info',
            '.flight-info',
            '[class*="route"]',
            '[class*="flight"]',
            'table tr',
            '.itinerary'
        ]
        
        routes_found = []
        
        for selector in route_selectors:
            elements = soup.select(selector)
            if elements:
                logger.info(f"Found {len(elements)} potential route elements with selector: {selector}")
                
                for element in elements:
                    route_text = element.get_text(strip=True)
                    
                    if len(route_text) > 10:
                        # Try to extract route information
                        route = {
                            "origin": None,
                            "destination": None,
                            "routeIndex": 0,
                            "date": None,
                            "flightNum": None,
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
                                "origin": None,
                                "destination": None,
                                "description": None,
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
                            },
                            "transportMode": "AIR"
                        }
                        
                        # Extract flight numbers
                        import re
                        flight_match = re.search(r'\b(AC\d+|[A-Z]{2}\d+)\b', route_text)
                        if flight_match:
                            route["flightNum"] = flight_match.group(1)
                        
                        # Extract airport codes for origin/destination
                        airport_codes = re.findall(r'\b([A-Z]{3})\b', route_text)
                        if len(airport_codes) >= 2:
                            route["origin"] = airport_codes[0]
                            route["destination"] = airport_codes[1]
                        
                        # Extract dates
                        date_match = re.search(r'(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})', route_text)
                        if date_match:
                            route["departureDate"] = date_match.group(1)
                        
                        routes_found.append(route)
        
        # Look for origin/destination in main content
        main_content = soup.get_text()
        airport_codes = []
        import re
        airport_matches = re.findall(r'\b([A-Z]{3})\b', main_content)
        if airport_matches:
            airport_codes = list(set(airport_matches))  # Remove duplicates
            if len(airport_codes) >= 2:
                tracking_data["origin"] = airport_codes[0]
                tracking_data["destination"] = airport_codes[1]
        
        # Add extracted events and routes to the tracking data
        if events_found:
            tracking_data["shipments"][0]["events"] = events_found
            logger.info(f"Extracted {len(events_found)} events")
        
        if routes_found:
            tracking_data["shipments"][0]["routes"] = routes_found
            logger.info(f"Extracted {len(routes_found)} routes")
        
        # If no structured data found, create a basic event from the page content
        if not events_found and not routes_found:
            logger.warning("No structured tracking data found, creating basic event")
            
            # Create a basic event with available information
            basic_event = {
                "mode": "AIR",
                "status": None,
                "eventCode": "INFO",
                "eventTime": time.strftime("%Y-%m-%d %H:%M:%S"),
                "eventQualifier": None,
                "location": {
                    "name": airport_codes[0] if airport_codes else None,
                    "city": None,
                    "state": None,
                    "country": None,
                    "latitude": None,
                    "longitude": None,
                    "unloCode": None,
                    "terminal": None
                },
                "additionalInfo": {
                    "totalPieces": tracking_data["additionalInfo"]["totalPieces"],
                    "weight": None,
                    "totalWeight": tracking_data["additionalInfo"]["totalWeight"],
                    "specialHandling": None,
                    "origin": None,
                    "destination": None,
                    "description": "Tracking information available",
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
            
            tracking_data["shipments"][0]["events"] = [basic_event]
        
        logger.info(f"Successfully parsed tracking data for AWB: {awb_number}")
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

            options.add_argument('--no-sandbox')
            options.add_argument('--disable-dev-shm-usage')
            options.add_argument('--disable-blink-features=AutomationControlled')

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
                    proxy_pass = ":".join(parts[3:])  # ✅ Fix: handles colons in password
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

            self.driver = uc.Chrome(options=options)

            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

            logger.info("Chrome driver initialized successfully")

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

                self.driver.get(tracking_url)

                wait = WebDriverWait(self.driver, 15)

                time.sleep(random.uniform(3, 6))

                page_source = self.driver.page_source

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
            self.driver.quit()


# HTML template for the web interface
HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>Air Canada Cargo Tracking API</title>
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
        pre { background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto; white-space: pre-wrap; }
        .api-info { background: #e7f3ff; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
        .endpoint { font-family: monospace; background: #f1f1f1; padding: 5px; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🛩️ Air Canada Cargo Tracking API</h1>
        
        <div class="api-info">
            <h3>API Endpoints:</h3>
            <p><strong>POST</strong> <span class="endpoint">/track</span> - Track single AWB</p>
            <p><strong>GET</strong> <span class="endpoint">/</span> - This web interface</p>
            <p><strong>Example:</strong> curl -X POST -H "Content-Type: application/json" -d '{"awb":"32570694"}' http://localhost:5000/track</p>
        </div>
        
        <form id="trackingForm">
            <div class="form-group">
                <label for="awb">AWB Number:</label>
                <input type="text" id="awb" name="awb" placeholder="Enter AWB number (e.g., 32570694)" required>
                <small>Note: 014- prefix will be added automatically</small>
            </div>
            <button type="submit">Track Shipment</button>
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
            
            resultDiv.innerHTML = '<div class="result loading">🔄 Tracking shipment... This may take 30-60 seconds...</div>';
            
            try {
                const response = await fetch('/track', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ awb: awb })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    resultDiv.innerHTML = `
                        <div class="result success">
                            <h3>✅ Tracking Data Retrieved</h3>
                            <p><strong>AWB:</strong> ${data.awb}</p>
                            <p><strong>Status:</strong> ${data.status}</p>
                            <h4>Tracking Data:</h4>
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


@app.route('/track', methods=['POST'])
def track_awb():
    """API endpoint to track a single AWB"""
    try:
        data = request.get_json()
        
        if not data or 'awb' not in data:
            return jsonify({
                'success': False,
                'error': 'AWB number is required',
                'awb': None
            }), 400
        
        awb_number = str(data['awb']).strip()
        
        # Add 014- prefix if not present
        if not awb_number.startswith("014-"):
            awb_number = "014-" + awb_number
        
        logger.info(f"API request received for AWB: {awb_number}")
        
        # Initialize scraper if not already done
        global scraper
        if scraper is None:
            proxy = "brd.superproxy.io:22225:brd-customer-hl_82185c3d-zone-residential:u9vibpbq8sa1"
            scraper = AirCanadaSeleniumScraper(headless=True, proxy=proxy)
            logger.info("Scraper initialized")
        
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
            'awb': data.get('awb') if 'data' in locals() else None,
            'timestamp': time.strftime("%Y-%m-%d %H:%M:%S")
        }), 500


@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': time.strftime("%Y-%m-%d %H:%M:%S"),
        'scraper_initialized': scraper is not None
    })


if __name__ == "__main__":
    try:
        logger.info("🚀 Starting Air Canada Cargo Tracking API...")
        logger.info("📍 Web interface: http://localhost:5000")
        logger.info("📍 API endpoint: POST http://localhost:5000/track")
        logger.info("📍 Health check: GET http://localhost:5000/health")
        
        app.run(host='0.0.0.0', port=5000, debug=False)
        
    except KeyboardInterrupt:
        logger.info("Shutting down...")
    finally:
        if scraper:
            scraper.close()
            logger.info("Scraper closed")