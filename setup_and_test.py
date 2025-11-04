#!/usr/bin/env python3
"""
Setup and test script for Air Canada scraper
"""
import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    print("Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✓ Requirements installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Failed to install requirements: {e}")
        return False

def create_sample_data():
    """Create sample Excel file"""
    print("Creating sample Excel file...")
    try:
        subprocess.check_call([sys.executable, "create_sample_excel.py"])
        print("✓ Sample Excel file created")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Failed to create sample Excel: {e}")
        return False

def run_test():
    """Run the test script"""
    print("Running test script...")
    try:
        subprocess.check_call([sys.executable, "aircanada_scraper_test.py"])
        print("✓ Test completed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Test failed: {e}")
        return False

def main():
    print("=== Air Canada Scraper Setup ===\n")
    
    # Check if we're in the right directory
    required_files = ["requirements.txt", "aircanada_scraper_fixed.py", "aircanada_scraper_test.py"]
    missing_files = [f for f in required_files if not os.path.exists(f)]
    
    if missing_files:
        print(f"✗ Missing files: {missing_files}")
        print("Please make sure you're in the correct directory")
        return
    
    # Step 1: Install requirements
    if not install_requirements():
        return
    
    print()
    
    # Step 2: Create sample data
    if not create_sample_data():
        return
    
    print()
    
    # Step 3: Run test
    run_test()
    
    print("\n=== Setup Complete ===")
    print("Files created:")
    print("- aircanada_scraper_fixed.py (main script)")
    print("- aircanada_scraper_test.py (test script)")
    print("- awb_numbers.xlsx (sample data)")
    print("- requirements.txt (dependencies)")
    
    print("\nNext steps:")
    print("1. Run the test script first: python aircanada_scraper_test.py")
    print("2. If test passes, run the main script: python aircanada_scraper_fixed.py")
    print("3. Check the generated HTML files for debugging if needed")

if __name__ == "__main__":
    main()