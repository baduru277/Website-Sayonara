import undetected_chromedriver as uc
import pandas as pd
import json
import time
import random
import logging
import zipfile
import requests
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException, WebDriverException

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


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


class AirCanadaAPIScraper:
    def __init__(self, headless=True, proxy=None):
        self.driver = None
        self.headless = headless
        self.proxy = proxy
        self.session = requests.Session()
        self.setup_driver()
        self.setup_session()

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

            self.driver = uc.Chrome(options=options)
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

            logger.info("Chrome driver initialized successfully")

        except Exception as e:
            logger.error(f"Error setting up Chrome driver: {str(e)}")
            raise

    def setup_session(self):
        """Setup requests session with proper headers"""
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
        })

        if self.proxy:
            proxy_parts = self.proxy.split(":")
            if len(proxy_parts) >= 4:
                proxy_host = proxy_parts[0]
                proxy_port = proxy_parts[1]
                proxy_user = proxy_parts[2]
                proxy_pass = ":".join(proxy_parts[3:])
                
                proxy_url = f"http://{proxy_user}:{proxy_pass}@{proxy_host}:{proxy_port}"
                self.session.proxies.update({
                    'http': proxy_url,
                    'https': proxy_url
                })

    def get_random_delay(self, min_delay=3, max_delay=8):
        return random.uniform(min_delay, max_delay)

    def visit_homepage_first(self):
        try:
            logger.info("Visiting homepage to establish session...")
            self.driver.get("https://www.aircanada.com/")
            time.sleep(random.uniform(2, 5))

            # Extract cookies from selenium and add to requests session
            selenium_cookies = self.driver.get_cookies()
            for cookie in selenium_cookies:
                self.session.cookies.set(cookie['name'], cookie['value'], domain=cookie.get('domain'))

            logger.info("Successfully visited homepage and extracted cookies")
            return True
        except Exception as e:
            logger.error(f"Error visiting homepage: {str(e)}")
            return False

    def discover_api_endpoint(self, awb_number):
        """Discover the API endpoint by monitoring network requests"""
        try:
            # Enable performance logging to capture network requests
            caps = self.driver.desired_capabilities
            caps['goog:loggingPrefs'] = {'performance': 'ALL'}
            
            tracking_url = f"https://www.aircanada.com/cargo/tracking?awbnb={awb_number}"
            logger.info(f"Visiting tracking page to discover API endpoint: {tracking_url}")
            
            self.driver.get(tracking_url)
            
            # Wait for page to load
            time.sleep(5)
            
            # Get performance logs to find API calls
            logs = self.driver.get_log('performance')
            api_endpoints = []
            
            for log in logs:
                message = json.loads(log['message'])
                if message['message']['method'] == 'Network.responseReceived':
                    url = message['message']['params']['response']['url']
                    if 'api' in url.lower() or 'tracking' in url.lower():
                        if awb_number in url or 'cargo' in url:
                            api_endpoints.append(url)
                            logger.info(f"Found potential API endpoint: {url}")
            
            return api_endpoints
            
        except Exception as e:
            logger.error(f"Error discovering API endpoint: {str(e)}")
            return []

    def try_api_endpoints(self, awb_number):
        """Try common API endpoint patterns"""
        potential_endpoints = [
            f"https://www.aircanada.com/api/cargo/tracking/{awb_number}",
            f"https://www.aircanada.com/api/cargo/shipment/{awb_number}",
            f"https://www.aircanada.com/cargo/api/tracking/{awb_number}",
            f"https://www.aircanada.com/cargo/api/shipment/{awb_number}",
            f"https://api.aircanada.com/cargo/tracking/{awb_number}",
            f"https://api.aircanada.com/cargo/shipment/{awb_number}",
        ]
        
        # Also try POST endpoints with AWB in body
        post_endpoints = [
            "https://www.aircanada.com/api/cargo/tracking",
            "https://www.aircanada.com/cargo/api/tracking",
            "https://api.aircanada.com/cargo/tracking",
        ]
        
        for endpoint in potential_endpoints:
            try:
                logger.info(f"Trying GET endpoint: {endpoint}")
                response = self.session.get(endpoint, timeout=10)
                
                if response.status_code == 200:
                    try:
                        data = response.json()
                        if isinstance(data, dict) and ('refNum' in data or 'shipments' in data or 'events' in data):
                            logger.info(f"SUCCESS: Found working API endpoint: {endpoint}")
                            return data
                    except json.JSONDecodeError:
                        pass
                        
                logger.info(f"GET {endpoint} returned status: {response.status_code}")
                
            except Exception as e:
                logger.debug(f"GET {endpoint} failed: {str(e)}")
        
        # Try POST endpoints
        for endpoint in post_endpoints:
            try:
                logger.info(f"Trying POST endpoint: {endpoint}")
                
                # Try different payload formats
                payloads = [
                    {"awb": awb_number},
                    {"awbnb": awb_number},
                    {"refNum": awb_number},
                    {"trackingNumber": awb_number},
                ]
                
                for payload in payloads:
                    response = self.session.post(endpoint, json=payload, timeout=10)
                    
                    if response.status_code == 200:
                        try:
                            data = response.json()
                            if isinstance(data, dict) and ('refNum' in data or 'shipments' in data or 'events' in data):
                                logger.info(f"SUCCESS: Found working POST API endpoint: {endpoint} with payload: {payload}")
                                return data
                        except json.JSONDecodeError:
                            pass
                            
                    logger.info(f"POST {endpoint} with {payload} returned status: {response.status_code}")
                    
            except Exception as e:
                logger.debug(f"POST {endpoint} failed: {str(e)}")
        
        return None

    def intercept_network_requests(self, awb_number):
        """Use Selenium to intercept network requests and find the API call"""
        try:
            from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
            
            # Enable logging
            caps = DesiredCapabilities.CHROME
            caps['goog:loggingPrefs'] = {'performance': 'ALL'}
            
            tracking_url = f"https://www.aircanada.com/cargo/tracking?awbnb={awb_number}"
            logger.info(f"Loading tracking page with network monitoring: {tracking_url}")
            
            self.driver.get(tracking_url)
            
            # Wait for page and API calls to complete
            time.sleep(8)
            
            # Get all network logs
            logs = self.driver.get_log('performance')
            
            for log in logs:
                try:
                    message = json.loads(log['message'])
                    
                    # Look for network responses
                    if message['message']['method'] == 'Network.responseReceived':
                        response_data = message['message']['params']['response']
                        url = response_data['url']
                        status = response_data['status']
                        
                        # Check if this looks like an API endpoint
                        if (status == 200 and 
                            ('api' in url.lower() or 'json' in response_data.get('mimeType', '').lower()) and
                            ('cargo' in url.lower() or 'tracking' in url.lower() or awb_number in url)):
                            
                            logger.info(f"Found potential API call: {url}")
                            
                            # Try to get the response body
                            try:
                                request_id = message['message']['params']['requestId']
                                response_body = self.driver.execute_cdp_cmd('Network.getResponseBody', {'requestId': request_id})
                                
                                if response_body and 'body' in response_body:
                                    try:
                                        api_data = json.loads(response_body['body'])
                                        if isinstance(api_data, dict) and ('refNum' in api_data or 'shipments' in api_data):
                                            logger.info(f"SUCCESS: Extracted API data from network logs")
                                            return api_data
                                    except json.JSONDecodeError:
                                        pass
                                        
                            except Exception as e:
                                logger.debug(f"Could not get response body for {url}: {str(e)}")
                
                except Exception as e:
                    logger.debug(f"Error processing log entry: {str(e)}")
            
            return None
            
        except Exception as e:
            logger.error(f"Error intercepting network requests: {str(e)}")
            return None

    def fetch_tracking_data(self, awb_number, max_retries=3):
        """Fetch tracking data using multiple approaches"""
        
        for attempt in range(max_retries):
            try:
                logger.info(f"Attempt {attempt + 1} for AWB: {awb_number}")

                if attempt == 0:
                    self.visit_homepage_first()

                # Approach 1: Try to intercept network requests
                logger.info("Approach 1: Intercepting network requests...")
                api_data = self.intercept_network_requests(awb_number)
                if api_data:
                    return api_data

                # Approach 2: Try common API endpoints
                logger.info("Approach 2: Trying common API endpoints...")
                api_data = self.try_api_endpoints(awb_number)
                if api_data:
                    return api_data

                # Approach 3: Discover API endpoints from network logs
                logger.info("Approach 3: Discovering API endpoints...")
                discovered_endpoints = self.discover_api_endpoint(awb_number)
                for endpoint in discovered_endpoints:
                    try:
                        response = self.session.get(endpoint, timeout=10)
                        if response.status_code == 200:
                            try:
                                data = response.json()
                                if isinstance(data, dict) and ('refNum' in data or 'shipments' in data):
                                    logger.info(f"SUCCESS: API data from discovered endpoint: {endpoint}")
                                    return data
                            except json.JSONDecodeError:
                                pass
                    except Exception as e:
                        logger.debug(f"Failed to fetch from discovered endpoint {endpoint}: {str(e)}")

                if attempt < max_retries - 1:
                    delay = self.get_random_delay(8, 15)
                    logger.info(f"All approaches failed, waiting {delay:.2f} seconds before retry...")
                    time.sleep(delay)

            except Exception as e:
                logger.error(f"Error in attempt {attempt + 1}: {str(e)}")
                if attempt < max_retries - 1:
                    time.sleep(self.get_random_delay(5, 10))

        logger.error(f"All attempts failed for AWB: {awb_number}")
        return None

    def close(self):
        if self.driver:
            self.driver.quit()


def load_awb_numbers(excel_file):
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
    excel_file = "awb_numbers.xlsx"
    output_file = "aircanada_tracking_api.json"
    proxy = "brd.superproxy.io:22225:brd-customer-hl_82185c3d-zone-residential:u9vibpbq8sa1"

    # Test with a real AWB number
    test_awb = "014-32570694"  # From your example
    
    try:
        # Try to load from Excel, but fallback to test AWB if file doesn't exist
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
    all_results = []

    try:
        # Run in non-headless mode for debugging
        scraper = AirCanadaAPIScraper(headless=False, proxy=proxy)
        
        # Process first AWB for testing
        awb = awb_list[0]
        logger.info(f"Processing AWB: {awb}")

        api_data = scraper.fetch_tracking_data(awb)

        if api_data:
            result = {"awb": awb, "data": api_data, "status": "success"}
            logger.info(f"SUCCESS: Retrieved API data for {awb}")
        else:
            result = {"awb": awb, "error": "Failed to fetch API data", "status": "failed"}
            logger.info("FAILED: No API data retrieved")

        all_results.append(result)

        # Save results
        try:
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(all_results, f, ensure_ascii=False, indent=2)
            logger.info(f"Results saved to {output_file}")
        except Exception as e:
            logger.error(f"Error saving results: {str(e)}")

    except Exception as e:
        logger.error(f"Error during scraping: {str(e)}")
    finally:
        if scraper:
            # Keep browser open for manual inspection
            input("Press Enter to close browser and exit...")
            scraper.close()

    successful_requests = sum(1 for r in all_results if r.get("status") == "success")
    logger.info(f"Scraping complete. {successful_requests}/{len(awb_list)} requests successful.")


if __name__ == "__main__":
    main()