import undetected_chromedriver as uc
import pandas as pd
import json
import time
import random
import logging
import zipfile
from bs4 import BeautifulSoup
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

    def save_debug_html(self, html_content, awb_number):
        """Save HTML content for debugging purposes"""
        try:
            debug_file = f"debug_html_{awb_number.replace('-', '_')}.html"
            with open(debug_file, 'w', encoding='utf-8') as f:
                f.write(html_content)
            logger.info(f"Debug HTML saved to {debug_file}")
        except Exception as e:
            logger.error(f"Error saving debug HTML: {str(e)}")

    def parse_tracking_html(self, html_content, awb_number=None):
        """Parse Air Canada Cargo tracking HTML into structured JSON with enhanced debugging"""
        soup = BeautifulSoup(html_content, "html.parser")
        events = []
        
        logger.info("=== HTML PARSING DEBUG ===")
        logger.info(f"HTML content length: {len(html_content)}")
        
        # Save HTML for debugging
        if awb_number:
            self.save_debug_html(html_content, awb_number)
        
        # Check for common error indicators
        error_indicators = [
            'access denied', 'blocked', 'cloudflare', 'bot detected',
            'security check', 'please wait', 'checking your browser',
            'not found', 'invalid', 'error'
        ]
        
        html_lower = html_content.lower()
        for indicator in error_indicators:
            if indicator in html_lower:
                logger.warning(f"Found error indicator: {indicator}")
        
        # Look for various possible selectors
        selectors_to_try = [
            "mat-expansion-panel",
            ".mat-expansion-panel",
            "[class*='expansion']",
            "[class*='panel']",
            ".tracking-event",
            ".shipment-event",
            ".status-item",
            "[class*='status']",
            "[class*='tracking']",
            "table tr",
            ".timeline-item",
            "[class*='timeline']"
        ]
        
        found_elements = {}
        for selector in selectors_to_try:
            elements = soup.select(selector)
            if elements:
                found_elements[selector] = len(elements)
                logger.info(f"Found {len(elements)} elements with selector: {selector}")
        
        if not found_elements:
            logger.warning("No tracking elements found with any selector")
            # Log some of the page structure
            logger.info("Page title: " + (soup.title.string if soup.title else "No title"))
            
            # Look for any divs or sections that might contain tracking data
            divs = soup.find_all('div', class_=True)
            logger.info(f"Found {len(divs)} divs with classes")
            
            # Log first few div classes to understand structure
            for i, div in enumerate(divs[:10]):
                classes = ' '.join(div.get('class', []))
                text_preview = div.get_text(strip=True)[:100] if div.get_text(strip=True) else "No text"
                logger.info(f"Div {i}: classes='{classes}', text='{text_preview}'")
        
        # Try original parsing logic
        for panel in soup.select("mat-expansion-panel"):
            logger.info("Processing mat-expansion-panel")
            header = panel.select_one("mat-panel-title")
            date = header.get_text(strip=True).replace("View shipping status on", "").strip() if header else None
            logger.info(f"Found date: {date}")

            for item in panel.select(".m-expanded-panel"):
                logger.info("Processing m-expanded-panel item")
                left = item.select_one(".m-left-panel")
                status = left.get_text(strip=True) if left else None

                right_content = item.select_one(".m-right-panel-content")
                spans = [s.get_text(strip=True) for s in right_content.select("span")] if right_content else []

                # Example order: time, location, pieces, weight
                time_str, location, pieces, weight = (spans + [None, None, None, None])[:4]

                details = item.select_one(".m-package-status")
                details_text = details.get_text(strip=True) if details else None

                event = {
                    "date": date,
                    "time": time_str,
                    "location": location,
                    "pieces": pieces,
                    "weight": weight,
                    "status": status,
                    "details": details_text
                }
                events.append(event)
                logger.info(f"Added event: {event}")
        
        # Try alternative parsing approaches if original didn't work
        if not events:
            logger.info("Original parsing failed, trying alternative approaches...")
            
            # Look for any table-based tracking data
            tables = soup.find_all('table')
            for table in tables:
                rows = table.find_all('tr')
                if len(rows) > 1:  # Has header and data
                    logger.info(f"Found table with {len(rows)} rows")
                    for i, row in enumerate(rows[1:]):  # Skip header
                        cells = row.find_all(['td', 'th'])
                        if cells:
                            cell_texts = [cell.get_text(strip=True) for cell in cells]
                            logger.info(f"Row {i}: {cell_texts}")
                            
                            # Try to extract meaningful data
                            if len(cell_texts) >= 2:
                                events.append({
                                    "raw_data": cell_texts,
                                    "status": cell_texts[0] if cell_texts else None,
                                    "details": " | ".join(cell_texts[1:]) if len(cell_texts) > 1 else None
                                })
            
            # Look for any list-based tracking data
            lists = soup.find_all(['ul', 'ol'])
            for list_elem in lists:
                items = list_elem.find_all('li')
                if items:
                    logger.info(f"Found list with {len(items)} items")
                    for i, item in enumerate(items):
                        text = item.get_text(strip=True)
                        if text and len(text) > 10:  # Ignore very short items
                            logger.info(f"List item {i}: {text[:100]}")
                            events.append({
                                "raw_text": text,
                                "status": "list_item"
                            })
        
        logger.info(f"Total events extracted: {len(events)}")
        logger.info("=== END HTML PARSING DEBUG ===")
        
        return events

    def wait_for_content_load(self, timeout=15):
        """Wait for page content to load completely"""
        try:
            # Wait for body to be present
            WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            # Additional wait for dynamic content
            time.sleep(3)
            
            # Try to wait for specific tracking content
            possible_selectors = [
                "mat-expansion-panel",
                "[class*='tracking']",
                "[class*='status']",
                "table",
                "[class*='shipment']"
            ]
            
            for selector in possible_selectors:
                try:
                    WebDriverWait(self.driver, 5).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, selector))
                    )
                    logger.info(f"Found content with selector: {selector}")
                    break
                except TimeoutException:
                    continue
            
            return True
        except TimeoutException:
            logger.warning("Timeout waiting for content to load")
            return False

    def fetch_tracking_data(self, awb_number, max_retries=3):
        """Fetch tracking data using Selenium and parse it"""
        tracking_url = f"https://www.aircanada.com/cargo/tracking?awbnb={awb_number}"

        for attempt in range(max_retries):
            try:
                logger.info(f"Attempt {attempt + 1} for AWB: {awb_number}")
                logger.info(f"URL: {tracking_url}")

                if attempt == 0:
                    self.visit_homepage_first()

                self.driver.get(tracking_url)
                
                # Wait for content to load
                self.wait_for_content_load()
                
                # Additional random delay
                time.sleep(random.uniform(3, 6))

                # Get current URL to check for redirects
                current_url = self.driver.current_url
                logger.info(f"Current URL: {current_url}")
                
                page_source = self.driver.page_source
                logger.info(f"Page source length: {len(page_source)}")

                # Check for bot detection or errors
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

                # Parse the HTML
                events = self.parse_tracking_html(page_source, awb_number)
                
                if events:
                    logger.info(f"Successfully extracted {len(events)} events for AWB: {awb_number}")
                else:
                    logger.warning(f"No events extracted for AWB: {awb_number}")
                
                return events

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
    output_file = "aircanada_tracking_selenium_debug.json"
    proxy = "brd.superproxy.io:22225:brd-customer-hl_82185c3d-zone-residential:u9vibpbq8sa1"

    # Test with a single AWB first
    test_awb = "014-12345678"  # Replace with a real AWB number for testing
    
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
        scraper = AirCanadaSeleniumScraper(headless=False, proxy=proxy)
        
        # Process only first AWB for debugging
        awb = awb_list[0]
        logger.info(f"Processing AWB for debugging: {awb}")

        events = scraper.fetch_tracking_data(awb)

        if events:
            result = {"awb": awb, "events": events, "status": "success"}
            logger.info(f"SUCCESS: Found {len(events)} events")
        else:
            result = {"awb": awb, "error": "Failed to fetch data", "status": "failed"}
            logger.info("FAILED: No events found")

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
            # Keep browser open for manual inspection in debug mode
            input("Press Enter to close browser and exit...")
            scraper.close()

    successful_requests = sum(1 for r in all_results if r.get("status") == "success")
    logger.info(f"Scraping complete. {successful_requests}/{len(awb_list)} requests successful.")


if __name__ == "__main__":
    main()