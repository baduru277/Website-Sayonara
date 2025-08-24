#!/usr/bin/env python3
"""
Setup script for AI Datamyne Scraper
"""

import os
import sys
import subprocess
import json


def install_requirements():
    """Install Python requirements."""
    print("📦 Installing Python requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install requirements: {e}")
        return False


def download_spacy_model():
    """Download spaCy language model."""
    print("🧠 Downloading spaCy language model...")
    try:
        subprocess.check_call([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
        print("✅ spaCy model downloaded successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"⚠️ Warning: Could not download spaCy model: {e}")
        return False


def setup_config():
    """Setup configuration file."""
    config_file = "config.json"
    
    if os.path.exists(config_file):
        print(f"⚠️ {config_file} already exists. Skipping configuration setup.")
        return True
    
    print("⚙️ Setting up configuration...")
    
    # Get user input for configuration
    username = input("Enter your Datamyne username (or press Enter to skip): ").strip()
    password = input("Enter your Datamyne password (or press Enter to skip): ").strip()
    
    # Detect Chrome driver path
    chrome_paths = [
        "/usr/bin/chromedriver",
        "/usr/local/bin/chromedriver", 
        "/opt/homebrew/bin/chromedriver",
        "C:\\chromedriver.exe",
        "C:\\Program Files\\chromedriver.exe"
    ]
    
    chromedriver_path = None
    for path in chrome_paths:
        if os.path.exists(path):
            chromedriver_path = path
            break
    
    if not chromedriver_path:
        chromedriver_path = input("Enter Chrome driver path (or press Enter for default): ").strip()
        if not chromedriver_path:
            chromedriver_path = "/usr/bin/chromedriver"
    
    config = {
        "chromedriver_path": chromedriver_path,
        "url": "https://threezero.datamyne.com/system/jsp/login.jsp",
        "username": username,
        "password": password,
        "download_wait_time": 80,
        "refresh_wait_time": 50,
        "implicit_wait": 5,
        "explicit_wait": 10,
        "nlp_settings": {
            "confidence_threshold": 0.3,
            "enable_sentiment_analysis": True,
            "enable_intent_classification": True
        },
        "logging": {
            "level": "INFO",
            "file": "scraper.log"
        }
    }
    
    try:
        with open(config_file, 'w') as f:
            json.dump(config, f, indent=4)
        print(f"✅ Configuration saved to {config_file}")
        return True
    except Exception as e:
        print(f"❌ Failed to save configuration: {e}")
        return False


def check_chrome_driver():
    """Check if Chrome driver is available."""
    print("🔍 Checking Chrome driver...")
    
    # Try to find chromedriver
    chrome_paths = [
        "/usr/bin/chromedriver",
        "/usr/local/bin/chromedriver",
        "/opt/homebrew/bin/chromedriver"
    ]
    
    for path in chrome_paths:
        if os.path.exists(path):
            print(f"✅ Found Chrome driver at: {path}")
            return True
    
    print("⚠️ Chrome driver not found. Please install it:")
    print("   Ubuntu/Debian: sudo apt install chromium-chromedriver")
    print("   macOS: brew install chromedriver")
    print("   Or download from: https://chromedriver.chromium.org/")
    return False


def create_directories():
    """Create necessary directories."""
    directories = ["logs", "downloads", "templates"]
    
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"📁 Created directory: {directory}")


def main():
    """Main setup function."""
    print("🚀 AI Datamyne Scraper Setup")
    print("=" * 40)
    
    # Create directories
    create_directories()
    
    # Install requirements
    if not install_requirements():
        print("❌ Setup failed due to requirements installation error")
        return False
    
    # Download spaCy model (optional)
    download_spacy_model()
    
    # Setup configuration
    if not setup_config():
        print("❌ Setup failed due to configuration error")
        return False
    
    # Check Chrome driver
    check_chrome_driver()
    
    print("\n🎉 Setup completed successfully!")
    print("\nNext steps:")
    print("1. Update config.json with your credentials if not done already")
    print("2. Make sure Chrome driver is installed and accessible")
    print("3. Run the scraper:")
    print("   - Interactive mode: python ai_scraper_tool.py")
    print("   - CLI mode: python cli_interface.py --help")
    print("   - Web interface: python web_interface.py")
    
    return True


if __name__ == "__main__":
    main()