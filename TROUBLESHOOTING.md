# Air Canada Scraper Troubleshooting Guide

## Common Issues and Solutions

### 1. Error 502 Bad Gateway

**Cause**: Server-side error or rate limiting from Air Canada's servers.

**Solutions**:
- Try running without proxy first (use test script)
- Increase delays between requests
- Use different user agents
- Try during off-peak hours

### 2. Proxy Issues

**Cause**: Incorrect proxy format or authentication issues.

**Solutions**:
- Verify proxy format: `host:port:username:password`
- Test proxy connection separately
- Try without proxy first to isolate the issue

### 3. Chrome Driver Issues

**Cause**: Version mismatch or missing Chrome browser.

**Solutions**:
```bash
# Update Chrome
sudo apt update && sudo apt install google-chrome-stable

# Clear Chrome cache
rm -rf ~/.cache/google-chrome/

# Install specific undetected-chromedriver version
pip install undetected-chromedriver==3.5.0
```

### 4. Bot Detection

**Cause**: Website detecting automated behavior.

**Solutions**:
- Increase random delays
- Visit homepage first
- Use different user agents
- Run in non-headless mode for testing

### 5. Excel File Issues

**Cause**: Missing or incorrectly formatted Excel file.

**Solutions**:
- Ensure `awb_numbers.xlsx` exists
- Column must be named `awb`
- AWB numbers should be strings

## Testing Steps

1. **Run the setup script**:
   ```bash
   python setup_and_test.py
   ```

2. **Test without proxy**:
   ```bash
   python aircanada_scraper_test.py
   ```

3. **Check generated HTML files**:
   - `tracking_page.html` - Normal response
   - `error_page.html` - Error response

4. **Run main script**:
   ```bash
   python aircanada_scraper_fixed.py
   ```

## Debugging Tips

- Check the log output for detailed error messages
- Examine the saved HTML files to see what the website returns
- Try running in non-headless mode to see what's happening
- Test with a single AWB number first

## Environment Requirements

- Python 3.8+
- Google Chrome browser installed
- Stable internet connection
- Valid proxy (if using)

## File Structure
```
workspace/
├── aircanada_scraper_fixed.py    # Main script
├── aircanada_scraper_test.py     # Test script
├── setup_and_test.py            # Setup automation
├── create_sample_excel.py       # Excel creator
├── requirements.txt             # Dependencies
├── awb_numbers.xlsx            # Input data
└── TROUBLESHOOTING.md          # This file
```