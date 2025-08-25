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

    try:
        with zipfile.ZipFile(plugin_path, 'w') as zp:
            zp.writestr("manifest.json", manifest_json)
            zp.writestr("background.js", background_js)
        logger.info(f"Proxy extension created: {plugin_path}")
        return plugin_path
    except Exception as e:
        logger.error(f"Error creating proxy extension: {str(e)}")
        raise


class AirCanadaSeleniumScraper:
    def __init__(self, headless=True, proxy=None):
        self.driver = None
        self.headless = headless
        self.proxy = proxy
        self.setup_driver()

    def setup_driver(self):
        """Setup undetected Chrome driver"""
        try:
            options = uc.ChromeOptions()

            if self.headless:
                options.add_argument('--headless=new')

            # Add stealth options
            options.add_argument('--no-sandbox')
            options.add_argument('--disable-dev-shm-usage')
            options.add_argument('--disable-blink-features=AutomationControlled')
            options.add_argument('--disable-web-security')
            options.add_argument('--disable-features=VizDisplayCompositor')
            options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

            # Proxy setup with authentication
            if self.proxy:
                try:
                    proxy_parts = self.proxy.split(":")
                    if len(proxy_parts) == 4:
                        proxy_host, proxy_port, proxy_user, proxy_pass = proxy_parts
                        plugin_file = create_proxy_extension(proxy_host, proxy_port, proxy_user, proxy_pass)
                        options.add_extension(plugin_file)
                        logger.info("Proxy with authentication added successfully")
                    else:
                        logger.error("Invalid proxy format. Expected format: host:port:username:password")
                except Exception as e:
                    logger.error(f"Invalid proxy format or error adding proxy: {str(e)}")

            # Random window size
            window_sizes = [
                '--window-size=1920,1080',
                '--window-size=1366,768',
                '--window-size=1440,900',
                '--window-size=1536,864'
            ]
            options.add_argument(random.choice(window_sizes))

            # Initialize driver with version_main parameter to avoid compatibility issues
            self.driver = uc.Chrome(options=options, version_main=None)

            # Remove webdriver flag
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

            logger.info("Chrome driver initialized successfully")

        except Exception as e:
            logger.error(f"Error setting up Chrome driver: {str(e)}")
            raise

    def get_random_delay(self, min_delay=3, max_delay=8):
        """Generate random delay to mimic human behavior"""
        return random.uniform(min_delay, max_delay)

    def visit_homepage_first(self):
        """Visit homepage first to establish session like a real user"""
        try:
            logger.info("Visiting homepage to establish session...")
            self.driver.get("https://www.aircanada.com/")
            time.sleep(random.uniform(2, 5))

            # Scroll randomly to mimic user behavior
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

                # Visit homepage first on first attempt
                if attempt == 0:
                    self.visit_homepage_first()

                # Navigate to tracking page
                logger.info(f"Navigating to: {tracking_url}")
                self.driver.get(tracking_url)

                # Wait for page to load
                wait = WebDriverWait(self.driver, 15)

                # Simulate human wait
                time.sleep(random.uniform(3, 6))

                # Get page source
                page_source = self.driver.page_source

                # Check for bot detection
                if any(indicator in page_source.lower() for indicator in [
                    'access denied', 'blocked', 'cloudflare', 'bot detected',
                    'security check', 'please wait', 'checking your browser',
                    '502 bad gateway', 'error 502'
                ]):
                    logger.warning(f"Possible bot detection or server error for AWB: {awb_number}")
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

            except Exception as e:
                logger.error(f"Unexpected error for AWB {awb_number}: {str(e)}")
                if attempt < max_retries - 1:
                    delay = self.get_random_delay(5, 12)
                    time.sleep(delay)
                    continue

        logger.error(f"Failed to fetch data for AWB: {awb_number} after {max_retries} attempts")
        return None

    def close(self):
        """Close the driver"""
        if self.driver:
            try:
                self.driver.quit()
                logger.info("Driver closed successfully")
            except Exception as e:
                logger.error(f"Error closing driver: {str(e)}")


def load_awb_numbers(excel_file):
    """Load and format AWB numbers from Excel file"""
    try:
        if not os.path.exists(excel_file):
            logger.error(f"Excel file not found: {excel_file}")
            raise FileNotFoundError(f"Excel file not found: {excel_file}")
            
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
    output_file = "aircanada_tracking_selenium.json"

    # Bright Data Residential Proxy (username:password inside)
    proxy = "brd.superproxy.io:22225:brd-customer-hl_82185c3d-zone-residential:u9vibpbq8sa1"

    # Load AWB numbers
    try:
        awb_list = load_awb_numbers(excel_file)
        logger.info(f"Loaded {len(awb_list)} AWB numbers from {excel_file}")
    except Exception as e:
        logger.error(f"Failed to load AWB numbers: {str(e)}")
        return

    # Initialize scraper
    scraper = None
    all_results = []

    try:
        scraper = AirCanadaSeleniumScraper(headless=False, proxy=proxy)  
        
        # Process each AWB
        for i, awb in enumerate(awb_list, 1):
            logger.info(f"Processing AWB {i}/{len(awb_list)}: {awb}")

            html_content = scraper.fetch_tracking_data(awb)

            if html_content:
                result = {"awb": awb, "html": html_content, "status": "success"}
            else:
                result = {"awb": awb, "error": "Failed to fetch data", "status": "failed"}

            all_results.append(result)

            # Save results after each request
            try:
                with open(output_file, "w", encoding="utf-8") as f:
                    json.dump(all_results, f, ensure_ascii=False, indent=2)
                logger.info(f"Results saved to {output_file}")
            except Exception as e:
                logger.error(f"Error saving results: {str(e)}")

            # Random delay between requests
            if i < len(awb_list):  # Don't wait after the last request
                delay = scraper.get_random_delay(8, 15)
                logger.info(f"Waiting {delay:.2f} seconds before next request...")
                time.sleep(delay)

    except Exception as e:
        logger.error(f"Error during scraping: {str(e)}")
    finally:
        if scraper:
            scraper.close()

    # Final summary
    successful_requests = sum(1 for r in all_results if r.get("status") == "success")
    logger.info(f"Scraping complete. {successful_requests}/{len(awb_list)} requests successful.")
    logger.info(f"Results saved to {output_file}")


if __name__ == "__main__":
    main()