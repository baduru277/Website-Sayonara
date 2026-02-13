import undetected_chromedriver as uc
import pandas as pd
import json
import time
import random
import logging
import os
import zipfile
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, WebDriverException
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

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


class AirCanadaSeleniumScraper:
    def __init__(self, headless=True, proxy=None):
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

            self.driver = uc.Chrome(options=options, desired_capabilities=caps)

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
                                        
                                        # Validate that this looks like tracking data
                                        if (isinstance(api_data, dict) and 
                                            ('refNum' in api_data or 'shipments' in api_data or 'events' in str(api_data))):
                                            
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

    def fetch_tracking_data(self, awb_number, max_retries=3):
        """Fetch tracking data using Selenium - MODIFIED to capture API data"""
        tracking_url = f"https://www.aircanada.com/cargo/tracking?awbnb={awb_number}"

        for attempt in range(max_retries):
            try:
                logger.info(f"Attempt {attempt + 1} for AWB: {awb_number}")

                if attempt == 0:
                    self.visit_homepage_first()

                # Clear previous logs before making the request
                self.driver.get_log('performance')

                self.driver.get(tracking_url)

                wait = WebDriverWait(self.driver, 15)

                # Wait for page to load
                time.sleep(random.uniform(3, 6))

                # Additional wait for API calls to complete
                time.sleep(5)

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

                # NEW: Try to extract API data from network logs
                api_data = self.extract_api_data_from_logs(awb_number)
                
                if api_data:
                    logger.info(f"Successfully captured API data for AWB: {awb_number}")
                    # Return the API data instead of HTML
                    return api_data
                else:
                    logger.info(f"No API data found, returning HTML for AWB: {awb_number}")
                    # Fallback to returning HTML as before
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


def load_awb_numbers(excel_file):
    """Load and format AWB numbers from Excel file"""
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
    output_file = "aircanada_tracking_selenium.json"

    proxy = "brd.superproxy.io:22225:brd-customer-hl_82185c3d-zone-residential:u9vibpbq8sa1"

    try:
        awb_list = load_awb_numbers(excel_file)
        logger.info(f"Loaded {len(awb_list)} AWB numbers from {excel_file}")
    except Exception as e:
        logger.error(f"Failed to load AWB numbers: {str(e)}")
        return

    scraper = None
    all_results = []

    try:
        scraper = AirCanadaSeleniumScraper(headless=False, proxy=proxy)
        # Process each AWB
        for i, awb in enumerate(awb_list, 1):
            logger.info(f"Processing AWB {i}/{len(awb_list)}: {awb}")

            tracking_data = scraper.fetch_tracking_data(awb)

            if tracking_data:
                # Check if we got API data (dict) or HTML (string)
                if isinstance(tracking_data, dict):
                    # We got API data - this is the format you want!
                    result = {
                        "awb": awb, 
                        "data": tracking_data,  # This will be in the exact format you specified
                        "data_type": "api_json",
                        "status": "success"
                    }
                    logger.info(f"✓ SUCCESS: Got API data for {awb}")
                else:
                    # We got HTML - fallback
                    result = {
                        "awb": awb, 
                        "html": tracking_data, 
                        "data_type": "html",
                        "status": "success"
                    }
                    logger.info(f"⚠ Got HTML data for {awb} (API data not captured)")
            else:
                result = {"awb": awb, "error": "Failed to fetch data", "status": "failed"}
                logger.error(f"✗ FAILED: No data for {awb}")

            all_results.append(result)

            # Save results after each request
            try:
                with open(output_file, "w", encoding="utf-8") as f:
                    json.dump(all_results, f, ensure_ascii=False, indent=2)
                logger.info(f"Results saved to {output_file}")
            except Exception as e:
                logger.error(f"Error saving results: {str(e)}")

            if i < len(awb_list):
                delay = scraper.get_random_delay(8, 15)
                logger.info(f"Waiting {delay:.2f} seconds before next request...")
                time.sleep(delay)

    except Exception as e:
        logger.error(f"Error during scraping: {str(e)}")
    finally:
        if scraper:
            scraper.close()

    successful_requests = sum(1 for r in all_results if r.get("status") == "success")
    api_data_count = sum(1 for r in all_results if r.get("data_type") == "api_json")
    
    logger.info(f"Scraping complete. {successful_requests}/{len(awb_list)} requests successful.")
    logger.info(f"API data captured for {api_data_count} AWBs")
    logger.info(f"Results saved to {output_file}")


if __name__ == "__main__":
    main()