import undetected_chromedriver as uc
import pandas as pd
import json
import time
import random
import logging
import os
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, WebDriverException

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class AirCanadaSeleniumScraper:
    def __init__(self, headless=True):
        self.driver = None
        self.headless = headless
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

            # Random window size
            window_sizes = [
                '--window-size=1920,1080',
                '--window-size=1366,768',
                '--window-size=1440,900',
                '--window-size=1536,864'
            ]
            options.add_argument(random.choice(window_sizes))

            # Initialize driver
            self.driver = uc.Chrome(options=options, version_main=None)

            # Remove webdriver flag
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

            logger.info("Chrome driver initialized successfully")

        except Exception as e:
            logger.error(f"Error setting up Chrome driver: {str(e)}")
            raise

    def test_connection(self):
        """Test basic connection to Air Canada website"""
        try:
            logger.info("Testing connection to Air Canada website...")
            self.driver.get("https://www.aircanada.com/")
            time.sleep(3)
            
            page_title = self.driver.title
            logger.info(f"Page title: {page_title}")
            
            # Check if page loaded successfully
            if "air canada" in page_title.lower():
                logger.info("✓ Successfully connected to Air Canada website")
                return True
            else:
                logger.warning("⚠ Unexpected page title")
                return False
                
        except Exception as e:
            logger.error(f"✗ Failed to connect: {str(e)}")
            return False

    def test_tracking_page(self, awb_number="014-1234567890"):
        """Test access to tracking page"""
        try:
            tracking_url = f"https://www.aircanada.com/cargo/tracking?awbnb={awb_number}"
            logger.info(f"Testing tracking page: {tracking_url}")
            
            self.driver.get(tracking_url)
            time.sleep(5)
            
            page_source = self.driver.page_source
            
            # Check for common error indicators
            error_indicators = [
                '502 bad gateway', 'error 502', 'service unavailable',
                'access denied', 'blocked', 'cloudflare', 'bot detected',
                'security check', 'please wait', 'checking your browser'
            ]
            
            found_errors = [indicator for indicator in error_indicators if indicator in page_source.lower()]
            
            if found_errors:
                logger.error(f"✗ Found error indicators: {found_errors}")
                # Save page source for debugging
                with open('error_page.html', 'w', encoding='utf-8') as f:
                    f.write(page_source)
                logger.info("Error page saved as 'error_page.html'")
                return False
            else:
                logger.info("✓ Tracking page loaded without obvious errors")
                # Save page source for inspection
                with open('tracking_page.html', 'w', encoding='utf-8') as f:
                    f.write(page_source)
                logger.info("Tracking page saved as 'tracking_page.html'")
                return True
                
        except Exception as e:
            logger.error(f"✗ Error testing tracking page: {str(e)}")
            return False

    def close(self):
        """Close the driver"""
        if self.driver:
            try:
                self.driver.quit()
                logger.info("Driver closed successfully")
            except Exception as e:
                logger.error(f"Error closing driver: {str(e)}")


def main():
    """Test the scraper functionality"""
    logger.info("Starting Air Canada scraper test...")
    
    scraper = None
    try:
        # Test without headless mode first
        scraper = AirCanadaSeleniumScraper(headless=False)
        
        # Test basic connection
        if scraper.test_connection():
            # Test tracking page
            scraper.test_tracking_page()
        
    except Exception as e:
        logger.error(f"Test failed: {str(e)}")
    finally:
        if scraper:
            scraper.close()


if __name__ == "__main__":
    main()