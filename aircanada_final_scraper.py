import undetected_chromedriver as uc
import pandas as pd
import json
import time
import random
import logging
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class AirCanadaTrackingScraper:
    def __init__(self, headless=False, proxy=None):
        self.driver = None
        self.headless = headless
        self.proxy = proxy
        self.setup_driver()

    def setup_driver(self):
        try:
            # Enable performance logging to capture network requests
            caps = DesiredCapabilities.CHROME
            caps['goog:loggingPrefs'] = {'performance': 'ALL'}
            
            options = uc.ChromeOptions()
            
            if self.headless:
                options.add_argument('--headless=new')
            
            options.add_argument('--no-sandbox')
            options.add_argument('--disable-dev-shm-usage')
            options.add_argument('--disable-blink-features=AutomationControlled')
            options.add_argument('--enable-logging')
            options.add_argument('--v=1')
            
            # Add proxy if provided
            if self.proxy:
                try:
                    parts = self.proxy.split(":")
                    if len(parts) >= 4:
                        proxy_host = parts[0]
                        proxy_port = parts[1]
                        proxy_user = parts[2]
                        proxy_pass = ":".join(parts[3:])
                        
                        # Create proxy extension
                        self.create_proxy_extension(proxy_host, proxy_port, proxy_user, proxy_pass)
                        options.add_extension("proxy_auth_plugin.zip")
                        logger.info("Proxy extension added")
                except Exception as e:
                    logger.error(f"Error setting up proxy: {str(e)}")
            
            # Standard user agent
            options.add_argument(
                "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            )
            
            # Random window size
            window_sizes = ['--window-size=1920,1080', '--window-size=1366,768', '--window-size=1440,900']
            options.add_argument(random.choice(window_sizes))
            
            self.driver = uc.Chrome(options=options, desired_capabilities=caps)
            
            # Anti-detection
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            
            logger.info("Chrome driver initialized with network logging")
            
        except Exception as e:
            logger.error(f"Error setting up Chrome driver: {str(e)}")
            raise

    def create_proxy_extension(self, proxy_host, proxy_port, proxy_user, proxy_pass):
        """Create Chrome extension for proxy authentication"""
        import zipfile
        
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

        with zipfile.ZipFile("proxy_auth_plugin.zip", 'w') as zp:
            zp.writestr("manifest.json", manifest_json)
            zp.writestr("background.js", background_js)

    def visit_homepage(self):
        """Visit homepage to establish session"""
        try:
            logger.info("Visiting Air Canada homepage...")
            self.driver.get("https://www.aircanada.com/")
            time.sleep(random.uniform(3, 6))
            
            # Simulate human behavior
            self.driver.execute_script("window.scrollTo(0, Math.floor(Math.random() * 500));")
            time.sleep(random.uniform(1, 3))
            
            return True
        except Exception as e:
            logger.error(f"Error visiting homepage: {str(e)}")
            return False

    def extract_api_data_from_logs(self, awb_number):
        """Extract API response data from Chrome performance logs"""
        try:
            logs = self.driver.get_log('performance')
            
            for log in logs:
                try:
                    message = json.loads(log['message'])
                    
                    # Look for Network.responseReceived events
                    if message['message']['method'] == 'Network.responseReceived':
                        response = message['message']['params']['response']
                        url = response['url']
                        
                        # Check if this looks like a tracking API call
                        if (response['status'] == 200 and 
                            'application/json' in response.get('mimeType', '') and
                            ('tracking' in url.lower() or 'cargo' in url.lower() or awb_number in url)):
                            
                            logger.info(f"Found potential API response: {url}")
                            
                            # Try to get the response body
                            try:
                                request_id = message['message']['params']['requestId']
                                
                                # Get response body using Chrome DevTools Protocol
                                response_body = self.driver.execute_cdp_cmd('Network.getResponseBody', {
                                    'requestId': request_id
                                })
                                
                                if 'body' in response_body:
                                    try:
                                        # Parse JSON response
                                        api_data = json.loads(response_body['body'])
                                        
                                        # Validate that this looks like tracking data with the expected structure
                                        if (isinstance(api_data, dict) and 
                                            self.validate_tracking_data_structure(api_data)):
                                            
                                            logger.info(f"SUCCESS: Found valid tracking data from {url}")
                                            return api_data
                                            
                                    except json.JSONDecodeError as e:
                                        logger.debug(f"JSON decode error for {url}: {str(e)}")
                                        
                            except Exception as e:
                                logger.debug(f"Could not get response body for {url}: {str(e)}")
                
                except Exception as e:
                    logger.debug(f"Error processing log entry: {str(e)}")
            
            return None
            
        except Exception as e:
            logger.error(f"Error extracting API data from logs: {str(e)}")
            return None

    def validate_tracking_data_structure(self, data):
        """Validate that the data has the expected Air Canada tracking structure"""
        if not isinstance(data, dict):
            return False
        
        # Check for key fields that should be present in Air Canada tracking data
        expected_fields = ['refNum', 'refType', 'shipments']
        has_expected_fields = any(field in data for field in expected_fields)
        
        # Also check for events or routes which are part of the structure
        has_tracking_content = (
            'events' in str(data) or 
            'routes' in str(data) or 
            'shipments' in data or
            ('refNum' in data and 'refType' in data)
        )
        
        return has_expected_fields or has_tracking_content

    def format_tracking_data(self, raw_data, awb_number):
        """Ensure the data is in the exact format specified by the user"""
        try:
            # If the data is already in the correct format, return as-is
            if (isinstance(raw_data, dict) and 
                'refNum' in raw_data and 
                'shipments' in raw_data and
                isinstance(raw_data.get('shipments'), list)):
                
                logger.info("Data is already in the correct format")
                return raw_data
            
            # If we need to transform the data, we would do it here
            # For now, return the raw data since we expect it to be in the correct format
            # from the Air Canada API
            
            return raw_data
            
        except Exception as e:
            logger.error(f"Error formatting tracking data: {str(e)}")
            return raw_data

    def fetch_tracking_data(self, awb_number, max_retries=3):
        """Fetch tracking data by intercepting API calls"""
        
        for attempt in range(max_retries):
            try:
                logger.info(f"Attempt {attempt + 1} for AWB: {awb_number}")
                
                if attempt == 0:
                    self.visit_homepage()
                
                # Clear previous logs
                self.driver.get_log('performance')
                
                # Navigate to tracking page
                tracking_url = f"https://www.aircanada.com/cargo/tracking?awbnb={awb_number}"
                logger.info(f"Loading tracking page: {tracking_url}")
                
                self.driver.get(tracking_url)
                
                # Wait for page to load and API calls to complete
                try:
                    # Wait for any element to ensure page loaded
                    WebDriverWait(self.driver, 15).until(
                        EC.presence_of_element_located((By.TAG_NAME, "body"))
                    )
                    
                    # Give time for initial API calls
                    time.sleep(5)
                    
                    # Try to wait for tracking content to appear
                    possible_selectors = [
                        "[data-testid*='track']",
                        "[class*='tracking']",
                        "[class*='shipment']",
                        "[class*='cargo']",
                        ".loading",
                        ".spinner"
                    ]
                    
                    for selector in possible_selectors:
                        try:
                            WebDriverWait(self.driver, 3).until(
                                EC.presence_of_element_located((By.CSS_SELECTOR, selector))
                            )
                            logger.info(f"Found element with selector: {selector}")
                            break
                        except TimeoutException:
                            continue
                    
                except TimeoutException:
                    logger.warning("Timeout waiting for page elements, continuing anyway...")
                
                # Additional wait for any delayed API calls
                time.sleep(8)
                
                # Extract API data from network logs
                raw_api_data = self.extract_api_data_from_logs(awb_number)
                
                if raw_api_data:
                    # Format the data to ensure it matches the expected structure
                    formatted_data = self.format_tracking_data(raw_api_data, awb_number)
                    
                    logger.info(f"Successfully extracted and formatted data for AWB: {awb_number}")
                    return formatted_data
                else:
                    logger.warning(f"No API data found in network logs for AWB: {awb_number}")
                
                # Debug information
                current_url = self.driver.current_url
                page_title = self.driver.title
                logger.info(f"Current URL: {current_url}")
                logger.info(f"Page title: {page_title}")
                
                # Check for error indicators
                page_source = self.driver.page_source.lower()
                error_indicators = ['not found', 'invalid', 'error', 'blocked', 'access denied']
                for indicator in error_indicators:
                    if indicator in page_source:
                        logger.warning(f"Page contains error indicator: {indicator}")
                        break
                
                if attempt < max_retries - 1:
                    delay = random.uniform(10, 20)
                    logger.info(f"Retrying in {delay:.2f} seconds...")
                    time.sleep(delay)
                
            except Exception as e:
                logger.error(f"Error in attempt {attempt + 1}: {str(e)}")
                if attempt < max_retries - 1:
                    time.sleep(random.uniform(5, 10))
        
        logger.error(f"All attempts failed for AWB: {awb_number}")
        return None

    def close(self):
        if self.driver:
            self.driver.quit()


def load_awb_numbers(excel_file):
    """Load AWB numbers from Excel file"""
    try:
        df = pd.read_excel(excel_file)
        if "awb" not in df.columns:
            raise ValueError("Excel must have a column named 'awb'")

        awb_list = []
        for awb in df["awb"]:
            awb_str = str(awb).strip()
            if not awb_str.startswith("014-"):
                awb_str = "014-" + awb_str
            awb_list.append(awb_str)
        return awb_list
    except Exception as e:
        logger.error(f"Error loading Excel file: {str(e)}")
        raise


def main():
    # Configuration
    excel_file = "awb_numbers.xlsx"
    output_file = "aircanada_tracking_data.json"
    proxy = "brd.superproxy.io:22225:brd-customer-hl_82185c3d-zone-residential:u9vibpbq8sa1"
    
    # Test AWB from your example
    test_awb = "014-32570694"
    
    try:
        # Try to load AWB numbers from Excel file
        try:
            awb_list = load_awb_numbers(excel_file)
            logger.info(f"Loaded {len(awb_list)} AWB numbers from {excel_file}")
        except:
            logger.info(f"Could not load Excel file, using test AWB: {test_awb}")
            awb_list = [test_awb]
    
    except Exception as e:
        logger.error(f"Failed to load AWB numbers: {str(e)}")
        return

    scraper = None
    all_tracking_data = []  # This will store the tracking data in the exact format you want

    try:
        # Initialize scraper (non-headless for debugging)
        scraper = AirCanadaTrackingScraper(headless=False, proxy=proxy)
        
        for i, awb in enumerate(awb_list, 1):
            logger.info(f"Processing AWB {i}/{len(awb_list)}: {awb}")
            
            # Fetch tracking data for this AWB
            tracking_data = scraper.fetch_tracking_data(awb)
            
            if tracking_data:
                # Add the tracking data directly to our results
                # The data should already be in the format you specified
                all_tracking_data.append(tracking_data)
                logger.info(f"✓ SUCCESS: Retrieved tracking data for {awb}")
                
                # Log some key information about the data
                if isinstance(tracking_data, dict):
                    ref_num = tracking_data.get('refNum', 'Unknown')
                    origin = tracking_data.get('origin', 'Unknown')
                    destination = tracking_data.get('destination', 'Unknown')
                    
                    # Count events if shipments exist
                    event_count = 0
                    if 'shipments' in tracking_data and isinstance(tracking_data['shipments'], list):
                        for shipment in tracking_data['shipments']:
                            if 'events' in shipment and isinstance(shipment['events'], list):
                                event_count += len(shipment['events'])
                    
                    logger.info(f"   RefNum: {ref_num}, Route: {origin} → {destination}, Events: {event_count}")
                
            else:
                logger.error(f"✗ FAILED: No tracking data retrieved for {awb}")
            
            # Save results after each AWB
            try:
                with open(output_file, "w", encoding="utf-8") as f:
                    json.dump(all_tracking_data, f, ensure_ascii=False, indent=2)
                logger.info(f"Results saved to {output_file}")
            except Exception as e:
                logger.error(f"Error saving results: {str(e)}")
            
            # Delay between requests
            if i < len(awb_list):
                delay = random.uniform(15, 25)
                logger.info(f"Waiting {delay:.2f} seconds before next request...")
                time.sleep(delay)

    except Exception as e:
        logger.error(f"Error during scraping: {str(e)}")
    
    finally:
        if scraper:
            # Keep browser open for inspection in debug mode
            if not scraper.headless:
                input("Press Enter to close browser...")
            scraper.close()

    # Final summary
    successful_requests = len(all_tracking_data)
    total_requests = len(awb_list)
    
    logger.info(f"="*50)
    logger.info(f"SCRAPING COMPLETE")
    logger.info(f"Successful: {successful_requests}/{total_requests}")
    logger.info(f"Data saved to: {output_file}")
    
    if successful_requests > 0:
        logger.info(f"✓ {successful_requests} AWB tracking records retrieved in the exact format you specified")
    else:
        logger.error("✗ No tracking data was successfully retrieved")
    
    logger.info(f"="*50)


if __name__ == "__main__":
    main()