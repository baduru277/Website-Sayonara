import csv
import time
import json
import re
import os
from typing import Dict, List, Optional, Tuple
from datetime import datetime

import undetected_chromedriver as uc
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver import ActionChains, Keys
from selenium.common.exceptions import TimeoutException, WebDriverException

import spacy
import openai
from transformers import pipeline
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords


class DatamyneAIScraper:
    """
    AI-powered web scraper for Datamyne with Natural Language Processing capabilities.
    """
    
    def __init__(self, config_file: str = "config.json"):
        """Initialize the AI scraper with configuration."""
        self.config = self.load_config(config_file)
        self.driver = None
        self.is_logged_in = False
        
        # Initialize NLP components
        self.setup_nlp()
        
        # Command patterns for NLP understanding
        self.command_patterns = {
            'download': ['download', 'export', 'get', 'fetch', 'extract'],
            'login': ['login', 'sign in', 'authenticate', 'connect'],
            'logout': ['logout', 'sign out', 'disconnect', 'exit'],
            'range': ['range', 'records', 'from', 'to', 'between'],
            'refresh': ['refresh', 'reload', 'restart'],
            'status': ['status', 'check', 'info', 'information']
        }
        
        print("🤖 AI Datamyne Scraper initialized successfully!")
    
    def load_config(self, config_file: str) -> Dict:
        """Load configuration from JSON file."""
        default_config = {
            "chromedriver_path": "/usr/bin/chromedriver",  # Linux path
            "url": "https://threezero.datamyne.com/system/jsp/login.jsp",
            "username": "",
            "password": "",
            "download_wait_time": 80,
            "refresh_wait_time": 50,
            "implicit_wait": 5,
            "explicit_wait": 10
        }
        
        if os.path.exists(config_file):
            with open(config_file, 'r') as f:
                user_config = json.load(f)
                default_config.update(user_config)
        
        return default_config
    
    def setup_nlp(self):
        """Initialize NLP components."""
        try:
            # Download required NLTK data
            nltk.download('punkt', quiet=True)
            nltk.download('stopwords', quiet=True)
            
            # Initialize sentiment analyzer
            self.sentiment_analyzer = pipeline("sentiment-analysis")
            
            # Initialize intent classifier
            self.intent_classifier = pipeline("zero-shot-classification")
            
            print("✅ NLP components initialized successfully")
            
        except Exception as e:
            print(f"⚠️ Warning: Could not initialize all NLP components: {e}")
            self.sentiment_analyzer = None
            self.intent_classifier = None
    
    def process_natural_language(self, user_input: str) -> Dict:
        """
        Process natural language input to understand user intent and extract parameters.
        """
        user_input = user_input.lower().strip()
        
        # Extract numbers (potential record ranges)
        numbers = re.findall(r'\d+', user_input)
        
        # Determine intent using keyword matching
        intent = self.classify_intent(user_input)
        
        # Extract parameters based on intent
        parameters = {}
        
        if intent == 'download' and len(numbers) >= 2:
            parameters['start_range'] = numbers[0]
            parameters['end_range'] = numbers[1]
        elif intent == 'download' and len(numbers) == 1:
            parameters['single_record'] = numbers[0]
        
        # Extract credentials if mentioned
        if 'username' in user_input or 'user' in user_input:
            username_match = re.search(r'username[:\s]+(\w+)', user_input)
            if username_match:
                parameters['username'] = username_match.group(1)
        
        if 'password' in user_input or 'pass' in user_input:
            password_match = re.search(r'password[:\s]+(\w+)', user_input)
            if password_match:
                parameters['password'] = password_match.group(1)
        
        return {
            'intent': intent,
            'parameters': parameters,
            'confidence': self.calculate_confidence(user_input, intent),
            'original_text': user_input
        }
    
    def classify_intent(self, text: str) -> str:
        """Classify user intent from text."""
        for intent, keywords in self.command_patterns.items():
            if any(keyword in text for keyword in keywords):
                return intent
        
        # Use ML-based classification if available
        if self.intent_classifier:
            try:
                candidate_labels = list(self.command_patterns.keys())
                result = self.intent_classifier(text, candidate_labels)
                return result['labels'][0]
            except Exception:
                pass
        
        return 'unknown'
    
    def calculate_confidence(self, text: str, intent: str) -> float:
        """Calculate confidence score for intent classification."""
        if intent == 'unknown':
            return 0.0
        
        keywords = self.command_patterns.get(intent, [])
        matches = sum(1 for keyword in keywords if keyword in text)
        return min(matches / len(keywords), 1.0)
    
    def setup_driver(self):
        """Initialize the Chrome driver."""
        try:
            service = Service(self.config['chromedriver_path'])
            self.driver = uc.Chrome(service=service)
            self.driver.maximize_window()
            self.driver.implicitly_wait(self.config['implicit_wait'])
            print("✅ Chrome driver initialized successfully")
            return True
        except Exception as e:
            print(f"❌ Failed to initialize Chrome driver: {e}")
            return False
    
    def login(self, username: str = None, password: str = None):
        """Login to the Datamyne system."""
        if not self.driver:
            if not self.setup_driver():
                return False
        
        try:
            username = username or self.config.get('username')
            password = password or self.config.get('password')
            
            if not username or not password:
                print("❌ Username and password are required for login")
                return False
            
            print("🔐 Logging into Datamyne...")
            self.driver.get(self.config['url'])
            
            # Enter username
            username_field = self.driver.find_element(By.XPATH, '//*[@id="UserName"]')
            username_field.send_keys(username)
            
            # Click next
            next_btn = WebDriverWait(self.driver, self.config['explicit_wait']).until(
                EC.element_to_be_clickable((By.XPATH, '//*[@id="UsernameNext"]'))
            )
            next_btn.click()
            
            # Enter password
            password_field = self.driver.find_element(By.XPATH, '//*[@id="Password"]')
            password_field.send_keys(password)
            
            # Click login
            WebDriverWait(self.driver, self.config['explicit_wait']).until(
                EC.element_to_be_clickable((By.XPATH, '//*[@id="Login"]'))
            ).click()
            
            # Skip any prompts
            try:
                WebDriverWait(self.driver, self.config['explicit_wait']).until(
                    EC.element_to_be_clickable((By.XPATH, '//*[@id="skipNow"]'))
                ).click()
            except TimeoutException:
                pass  # Skip button might not appear
            
            self.is_logged_in = True
            print("✅ Successfully logged in!")
            return True
            
        except Exception as e:
            print(f"❌ Login failed: {e}")
            return False
    
    def download_records(self, start_range: str, end_range: str):
        """Download records within the specified range."""
        if not self.is_logged_in:
            print("❌ Please login first")
            return False
        
        try:
            print(f"📥 Downloading records {start_range} to {end_range}...")
            
            # Wait for page elements
            WebDriverWait(self.driver, self.config['explicit_wait']).until(
                EC.element_to_be_clickable((By.ID, "containerResult"))
            )
            
            # Click Excel export button
            WebDriverWait(self.driver, self.config['explicit_wait']).until(
                EC.element_to_be_clickable((By.XPATH, '//*[@id="btnExcel"]/button[1]'))
            ).click()
            
            # Wait for modal
            WebDriverWait(self.driver, self.config['explicit_wait']).until(
                EC.element_to_be_clickable((By.XPATH, '//*[@id="htmlPageBody"]/div[8]'))
            )
            
            # Enter start range
            start_field = WebDriverWait(self.driver, self.config['explicit_wait']).until(
                EC.element_to_be_clickable((By.XPATH, '//*[@id="dd_startRangeE"]'))
            )
            start_field.clear()
            start_field.send_keys(start_range)
            
            # Enter end range
            end_field = WebDriverWait(self.driver, self.config['explicit_wait']).until(
                EC.element_to_be_clickable((By.XPATH, '//*[@id="dd_endRangeE"]'))
            )
            end_field.clear()
            end_field.send_keys(end_range)
            
            # Select range option
            WebDriverWait(self.driver, self.config['explicit_wait']).until(
                EC.element_to_be_clickable((By.XPATH, '//*[@id="radioToExportRange"]'))
            ).click()
            
            # Click download
            WebDriverWait(self.driver, self.config['explicit_wait']).until(
                EC.element_to_be_clickable((By.XPATH, '//*[@id="htmlPageBody"]/div[7]/div[3]/div/button[2]'))
            ).click()
            
            print(f"⏳ Waiting {self.config['download_wait_time']} seconds for download...")
            time.sleep(self.config['download_wait_time'])
            
            print("✅ Download completed!")
            return True
            
        except Exception as e:
            print(f"❌ Download failed: {e}")
            return False
    
    def refresh_page(self):
        """Refresh the current page."""
        if self.driver:
            print("🔄 Refreshing page...")
            self.driver.refresh()
            time.sleep(self.config['refresh_wait_time'])
            print("✅ Page refreshed!")
    
    def get_status(self):
        """Get current status of the scraper."""
        status = {
            'driver_active': self.driver is not None,
            'logged_in': self.is_logged_in,
            'current_url': self.driver.current_url if self.driver else None,
            'timestamp': datetime.now().isoformat()
        }
        return status
    
    def execute_command(self, user_input: str):
        """Execute a command based on natural language input."""
        print(f"🎯 Processing: '{user_input}'")
        
        # Process natural language
        nlp_result = self.process_natural_language(user_input)
        intent = nlp_result['intent']
        parameters = nlp_result['parameters']
        confidence = nlp_result['confidence']
        
        print(f"💭 Understood intent: {intent} (confidence: {confidence:.2f})")
        
        if confidence < 0.3:
            print("❓ I'm not sure what you want to do. Please be more specific.")
            return False
        
        # Execute based on intent
        if intent == 'login':
            username = parameters.get('username')
            password = parameters.get('password')
            return self.login(username, password)
        
        elif intent == 'download':
            if 'start_range' in parameters and 'end_range' in parameters:
                return self.download_records(parameters['start_range'], parameters['end_range'])
            else:
                print("❓ Please specify the record range (e.g., 'download records from 1 to 100')")
                return False
        
        elif intent == 'refresh':
            self.refresh_page()
            return True
        
        elif intent == 'status':
            status = self.get_status()
            print("📊 Current Status:")
            for key, value in status.items():
                print(f"   {key}: {value}")
            return True
        
        elif intent == 'logout':
            self.cleanup()
            return True
        
        else:
            print(f"❓ I don't know how to handle '{intent}' commands yet.")
            return False
    
    def interactive_mode(self):
        """Run the scraper in interactive mode."""
        print("\n🚀 AI Datamyne Scraper - Interactive Mode")
        print("Type 'help' for commands, 'quit' to exit")
        print("-" * 50)
        
        while True:
            try:
                user_input = input("\n🤖 What would you like to do? ").strip()
                
                if user_input.lower() in ['quit', 'exit', 'bye']:
                    print("👋 Goodbye!")
                    break
                
                elif user_input.lower() == 'help':
                    self.show_help()
                    continue
                
                elif not user_input:
                    continue
                
                # Execute the command
                self.execute_command(user_input)
                
            except KeyboardInterrupt:
                print("\n👋 Goodbye!")
                break
            except Exception as e:
                print(f"❌ Error: {e}")
    
    def show_help(self):
        """Show help information."""
        help_text = """
🤖 AI Datamyne Scraper Commands:

Login Commands:
  - "login" or "sign in"
  - "login with username [user] password [pass]"

Download Commands:
  - "download records from 1 to 100"
  - "export data from 50 to 200"
  - "get records between 1 and 50"

Utility Commands:
  - "refresh" or "reload page"
  - "status" or "check status"
  - "logout" or "sign out"

Examples:
  🔹 "Please login to the system"
  🔹 "Download records from 1 to 500"
  🔹 "Export data between 100 and 200"
  🔹 "What's the current status?"
  🔹 "Refresh the page please"
        """
        print(help_text)
    
    def cleanup(self):
        """Clean up resources."""
        if self.driver:
            print("🧹 Cleaning up...")
            self.driver.quit()
            self.driver = None
            self.is_logged_in = False
            print("✅ Cleanup completed!")


def main():
    """Main function to run the AI scraper."""
    scraper = DatamyneAIScraper()
    
    # Check if config file exists, create if not
    if not os.path.exists("config.json"):
        print("📝 Creating configuration file...")
        config = {
            "chromedriver_path": "/usr/bin/chromedriver",
            "url": "https://threezero.datamyne.com/system/jsp/login.jsp",
            "username": "",
            "password": "",
            "download_wait_time": 80,
            "refresh_wait_time": 50,
            "implicit_wait": 5,
            "explicit_wait": 10
        }
        
        with open("config.json", 'w') as f:
            json.dump(config, f, indent=4)
        
        print("⚠️ Please update config.json with your credentials and Chrome driver path")
    
    try:
        scraper.interactive_mode()
    finally:
        scraper.cleanup()


if __name__ == "__main__":
    main()