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


class AirCanadaAPIInterceptor:
    def __init__(self, headless=False):
        self.driver = None
        self.headless = headless
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
                            
                            logger.info(f"Found API response: {url}")
                            
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
                                            ('refNum' in api_data or 'shipments' in api_data or 'events' in api_data)):
                                            
                                            logger.info(f"SUCCESS: Extracted API data from {url}")
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
                    
                    # Give extra time for API calls
                    time.sleep(8)
                    
                    # Try to wait for specific content that indicates data loaded
                    possible_selectors = ["[data-testid]", ".loading", ".spinner", "[class*='track']"]
                    for selector in possible_selectors:
                        try:
                            WebDriverWait(self.driver, 3).until(
                                EC.presence_of_element_located((By.CSS_SELECTOR, selector))
                            )
                            break
                        except TimeoutException:
                            continue
                    
                except TimeoutException:
                    logger.warning("Timeout waiting for page elements, continuing anyway...")
                
                # Additional wait for any delayed API calls
                time.sleep(5)
                
                # Extract API data from network logs
                api_data = self.extract_api_data_from_logs(awb_number)
                
                if api_data:
                    logger.info(f"Successfully extracted API data for AWB: {awb_number}")
                    return api_data
                else:
                    logger.warning(f"No API data found in network logs for AWB: {awb_number}")
                
                # If no API data found, log some debug info
                current_url = self.driver.current_url
                page_title = self.driver.title
                logger.info(f"Current URL: {current_url}")
                logger.info(f"Page title: {page_title}")
                
                # Check if page shows any error messages
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
    output_file = "aircanada_api_data.json"
    
    # Use the AWB from your example
    test_awb = "014-32570694"
    
    try:
        # Try to load from Excel, but fallback to test AWB
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
        # Initialize scraper (non-headless for debugging)
        scraper = AirCanadaAPIInterceptor(headless=False)
        
        for i, awb in enumerate(awb_list[:3], 1):  # Test first 3 AWBs
            logger.info(f"Processing AWB {i}: {awb}")
            
            api_data = scraper.fetch_tracking_data(awb)
            
            if api_data:
                result = {
                    "awb": awb,
                    "data": api_data,
                    "status": "success",
                    "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
                }
                logger.info(f"✓ SUCCESS: Retrieved data for {awb}")
            else:
                result = {
                    "awb": awb,
                    "error": "Failed to retrieve API data",
                    "status": "failed",
                    "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
                }
                logger.error(f"✗ FAILED: No data for {awb}")
            
            all_results.append(result)
            
            # Save results after each AWB
            try:
                with open(output_file, "w", encoding="utf-8") as f:
                    json.dump(all_results, f, ensure_ascii=False, indent=2)
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
            # Keep browser open for inspection
            input("Press Enter to close browser...")
            scraper.close()

    # Summary
    successful_requests = sum(1 for r in all_results if r.get("status") == "success")
    logger.info(f"Scraping complete: {successful_requests}/{len(all_results)} successful")
    
    if successful_requests > 0:
        logger.info(f"✓ Data saved to {output_file}")
    else:
        logger.error("No successful requests. Check logs for debugging info.")


if __name__ == "__main__":
    main()