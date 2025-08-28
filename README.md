# 🤖 AI Datamyne Scraper

An intelligent web scraper for Datamyne with Natural Language Processing capabilities. This tool allows you to control web scraping operations using natural language commands.

## ✨ Features

- **Natural Language Processing**: Control the scraper using plain English commands
- **AI-Powered Intent Recognition**: Understands various ways to express the same command
- **Multiple Interfaces**: Command line, interactive mode, and web interface
- **Configurable**: Easily customize settings through JSON configuration
- **Error Handling**: Robust error handling and recovery mechanisms
- **Session Management**: Maintains login sessions and state

## 🚀 Quick Start

### 1. Setup

```bash
# Run the setup script
python setup.py
```

This will:
- Install all required Python packages
- Download NLP models
- Create configuration files
- Check for Chrome driver

### 2. Configuration

Update `config.json` with your credentials:

```json
{
    "username": "your_username",
    "password": "your_password",
    "chromedriver_path": "/usr/bin/chromedriver"
}
```

### 3. Run the Scraper

**Interactive Mode (Recommended):**
```bash
python ai_scraper_tool.py
```

**Command Line Interface:**
```bash
python cli_interface.py --interactive
python cli_interface.py --command "login and download records from 1 to 100"
```

**Web Interface:**
```bash
python web_interface.py
# Open http://localhost:5000 in your browser
```

## 💬 Natural Language Commands

The AI scraper understands various natural language commands:

### Login Commands
- `"login"` or `"sign in"`
- `"please login to the system"`
- `"authenticate with my credentials"`

### Download Commands
- `"download records from 1 to 100"`
- `"export data from 50 to 200"`
- `"get records between 1 and 50"`
- `"fetch data range 100 to 500"`

### Utility Commands
- `"refresh"` or `"reload page"`
- `"what's the current status?"`
- `"check system status"`
- `"logout"` or `"sign out"`

### Combined Commands
- `"login and download records from 1 to 1000"`
- `"please login then export data from 500 to 1000"`

## 🛠️ Installation

### Prerequisites

- Python 3.8+
- Chrome browser
- Chrome driver (automatically detected or manually configured)

### Manual Installation

1. **Clone or download the project files**

2. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

3. **Download NLP models:**
```bash
python -m spacy download en_core_web_sm
```

4. **Install Chrome driver:**

**Ubuntu/Debian:**
```bash
sudo apt install chromium-chromedriver
```

**macOS:**
```bash
brew install chromedriver
```

**Manual download:**
- Download from [ChromeDriver](https://chromedriver.chromium.org/)
- Extract and place in your PATH or update `config.json`

## 📁 Project Structure

```
ai-datamyne-scraper/
├── ai_scraper_tool.py      # Main AI scraper class
├── cli_interface.py        # Command line interface
├── web_interface.py        # Web interface (Flask)
├── setup.py               # Setup and installation script
├── config.json            # Configuration file
├── requirements.txt       # Python dependencies
├── README.md             # This file
└── templates/
    └── index.html        # Web interface template
```

## ⚙️ Configuration Options

The `config.json` file contains various configurable options:

```json
{
    "chromedriver_path": "/usr/bin/chromedriver",
    "url": "https://threezero.datamyne.com/system/jsp/login.jsp",
    "username": "your_username",
    "password": "your_password",
    "download_wait_time": 80,
    "refresh_wait_time": 50,
    "implicit_wait": 5,
    "explicit_wait": 10,
    "nlp_settings": {
        "confidence_threshold": 0.3,
        "enable_sentiment_analysis": true,
        "enable_intent_classification": true
    }
}
```

## 🎯 Usage Examples

### Interactive Mode
```bash
$ python ai_scraper_tool.py

🤖 AI Datamyne Scraper - Interactive Mode
Type 'help' for commands, 'quit' to exit
--------------------------------------------------

🤖 What would you like to do? login please
🎯 Processing: 'login please'
💭 Understood intent: login (confidence: 1.00)
🔐 Logging into Datamyne...
✅ Successfully logged in!

🤖 What would you like to do? download records from 1 to 500
🎯 Processing: 'download records from 1 to 500'
💭 Understood intent: download (confidence: 0.67)
📥 Downloading records 1 to 500...
✅ Download completed!
```

### CLI Mode
```bash
# Single command execution
python cli_interface.py --command "login and download records 1 to 100"

# Manual login and download
python cli_interface.py --login --download-range 1 100

# Check status
python cli_interface.py --status
```

### Web Interface
1. Start the web server: `python web_interface.py`
2. Open http://localhost:5000
3. Use the web interface to:
   - Enter natural language commands
   - Login with credentials
   - Download specific ranges
   - Monitor status

## 🔧 Troubleshooting

### Common Issues

**Chrome driver not found:**
- Install Chrome driver using your package manager
- Or download manually and update `chromedriver_path` in config.json

**Login fails:**
- Check your credentials in config.json
- Verify the website URL is correct
- Check internet connection

**Downloads don't work:**
- Ensure you're logged in first
- Check if the record range is valid
- Verify download directory permissions

**NLP not working:**
- Install required packages: `pip install spacy transformers`
- Download language model: `python -m spacy download en_core_web_sm`

### Debug Mode

Enable debug logging by updating config.json:
```json
{
    "logging": {
        "level": "DEBUG",
        "file": "scraper.log"
    }
}
```

## 📝 API Reference

### DatamyneAIScraper Class

**Main Methods:**
- `login(username, password)` - Login to Datamyne
- `download_records(start, end)` - Download records in range
- `execute_command(text)` - Execute natural language command
- `get_status()` - Get current status
- `cleanup()` - Clean up resources

**NLP Methods:**
- `process_natural_language(text)` - Process NL input
- `classify_intent(text)` - Classify user intent
- `calculate_confidence(text, intent)` - Calculate confidence score

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Disclaimer

This tool is for educational and legitimate business purposes only. Always respect website terms of service and rate limiting. Use responsibly and ensure you have permission to scrape the target website.

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review the configuration file
3. Check the log files
4. Create an issue with detailed information

---

**Happy Scraping! 🤖✨**