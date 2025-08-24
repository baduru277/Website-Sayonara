# 🚀 Quick Start Guide - AI Datamyne Scraper

## ⚡ Fastest Way to Run

### Option 1: Simple Python Script (Recommended)

1. **Install only essential packages:**
```bash
# Create virtual environment
python3 -m venv ai_scraper_env
source ai_scraper_env/bin/activate

# Install minimal dependencies
pip install selenium undetected-chromedriver flask nltk
```

2. **Update your config.json with credentials:**
```bash
nano config.json
```
Add your username and password:
```json
{
    "username": "your_username_here",
    "password": "your_password_here"
}
```

3. **Run the AI scraper:**
```bash
# Interactive mode (chat with AI)
python3 ai_scraper_tool.py

# OR Web interface
python3 web_interface.py
# Then open http://localhost:5000
```

### Option 2: Direct Usage (No Virtual Environment)

If you have permission issues, install directly:

```bash
# Install system-wide (use with caution)
sudo pip3 install selenium undetected-chromedriver flask nltk

# Run directly
python3 ai_scraper_tool.py
```

## 🎯 How to Use

### Interactive Mode Commands:
```
🤖 What would you like to do? login please
🤖 What would you like to do? download records from 1 to 100
🤖 What would you like to do? refresh page
🤖 What would you like to do? check status
```

### Web Interface:
1. Go to http://localhost:5000
2. Type natural language commands like:
   - "Login and download records from 1 to 500"
   - "Please login to the system"
   - "Download data from 100 to 200"

## 🔧 Configuration

Edit `config.json`:
```json
{
    "chromedriver_path": "/usr/bin/chromedriver",
    "url": "https://threezero.datamyne.com/system/jsp/login.jsp",
    "username": "YOUR_USERNAME",
    "password": "YOUR_PASSWORD",
    "download_wait_time": 80,
    "refresh_wait_time": 50
}
```

## 🚨 Troubleshooting

**Chrome driver not found:**
```bash
# Ubuntu/Debian
sudo apt install chromium-chromedriver

# Or download manually from https://chromedriver.chromium.org/
```

**Permission errors:**
```bash
# Use virtual environment
python3 -m venv ai_env
source ai_env/bin/activate
pip install selenium undetected-chromedriver
```

**Python version issues:**
- Use Python 3.8-3.11 for best compatibility
- Python 3.13 has some package compatibility issues

## 🎉 That's It!

Your AI scraper is ready to use. It understands natural language and can:
- ✅ Login automatically
- ✅ Download specific record ranges
- ✅ Handle errors and retries
- ✅ Provide status updates
- ✅ Work via web interface or command line

**Example Session:**
```
$ python3 ai_scraper_tool.py

🤖 AI Datamyne Scraper - Interactive Mode
🤖 What would you like to do? login and download records 1 to 1000

🎯 Processing: 'login and download records 1 to 1000'
💭 Understood intent: login (confidence: 0.85)
🔐 Logging into Datamyne...
✅ Successfully logged in!
📥 Downloading records 1 to 1000...
⏳ Waiting 80 seconds for download...
✅ Download completed!
```