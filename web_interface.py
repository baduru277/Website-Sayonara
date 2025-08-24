#!/usr/bin/env python3
"""
Web interface for the AI Datamyne Scraper using Flask
"""

from flask import Flask, render_template, request, jsonify, session
import os
import json
from datetime import datetime
from ai_scraper_tool import DatamyneAIScraper

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Change this in production

# Global scraper instance (in production, use proper session management)
scrapers = {}

def get_scraper(session_id):
    """Get or create scraper for session."""
    if session_id not in scrapers:
        scrapers[session_id] = DatamyneAIScraper()
    return scrapers[session_id]

@app.route('/')
def index():
    """Main page."""
    return render_template('index.html')

@app.route('/api/execute', methods=['POST'])
def execute_command():
    """Execute a natural language command."""
    try:
        data = request.get_json()
        command = data.get('command', '').strip()
        
        if not command:
            return jsonify({
                'success': False,
                'message': 'Please provide a command'
            })
        
        # Get session ID
        session_id = session.get('session_id', 'default')
        scraper = get_scraper(session_id)
        
        # Execute command
        success = scraper.execute_command(command)
        
        return jsonify({
            'success': success,
            'message': 'Command executed successfully' if success else 'Command failed',
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        })

@app.route('/api/status')
def get_status():
    """Get current scraper status."""
    try:
        session_id = session.get('session_id', 'default')
        scraper = get_scraper(session_id)
        
        status = scraper.get_status()
        return jsonify({
            'success': True,
            'status': status
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        })

@app.route('/api/login', methods=['POST'])
def login():
    """Login to Datamyne."""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        session_id = session.get('session_id', 'default')
        scraper = get_scraper(session_id)
        
        success = scraper.login(username, password)
        
        return jsonify({
            'success': success,
            'message': 'Login successful' if success else 'Login failed'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        })

@app.route('/api/download', methods=['POST'])
def download_records():
    """Download records."""
    try:
        data = request.get_json()
        start_range = data.get('start_range')
        end_range = data.get('end_range')
        
        if not start_range or not end_range:
            return jsonify({
                'success': False,
                'message': 'Please provide both start and end range'
            })
        
        session_id = session.get('session_id', 'default')
        scraper = get_scraper(session_id)
        
        success = scraper.download_records(str(start_range), str(end_range))
        
        return jsonify({
            'success': success,
            'message': f'Download {"completed" if success else "failed"}'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        })

@app.route('/api/cleanup', methods=['POST'])
def cleanup():
    """Cleanup scraper resources."""
    try:
        session_id = session.get('session_id', 'default')
        if session_id in scrapers:
            scrapers[session_id].cleanup()
            del scrapers[session_id]
        
        return jsonify({
            'success': True,
            'message': 'Cleanup completed'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        })

# Create templates directory and HTML template
def create_template():
    """Create HTML template if it doesn't exist."""
    templates_dir = 'templates'
    if not os.path.exists(templates_dir):
        os.makedirs(templates_dir)
    
    template_path = os.path.join(templates_dir, 'index.html')
    if not os.path.exists(template_path):
        html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Datamyne Scraper</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; text-align: center; }
        .card { background: white; border-radius: 10px; padding: 25px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .input-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 5px; font-weight: 600; color: #333; }
        input, textarea, button { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px; }
        button { background: #667eea; color: white; border: none; cursor: pointer; font-weight: 600; transition: background 0.3s; }
        button:hover { background: #5a67d8; }
        button:disabled { background: #ccc; cursor: not-allowed; }
        .btn-secondary { background: #718096; }
        .btn-secondary:hover { background: #4a5568; }
        .status { padding: 15px; border-radius: 5px; margin: 10px 0; }
        .status.success { background: #c6f6d5; color: #22543d; border: 1px solid #9ae6b4; }
        .status.error { background: #fed7d7; color: #742a2a; border: 1px solid #fc8181; }
        .status.info { background: #bee3f8; color: #2a4365; border: 1px solid #90cdf4; }
        .flex { display: flex; gap: 10px; }
        .flex > * { flex: 1; }
        #output { max-height: 300px; overflow-y: auto; background: #1a202c; color: #e2e8f0; padding: 15px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 14px; white-space: pre-wrap; }
        .loading { display: none; text-align: center; padding: 20px; }
        .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #667eea; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 AI Datamyne Scraper</h1>
            <p>Natural Language Processing for Web Scraping</p>
        </div>

        <div class="card">
            <h3>Natural Language Commands</h3>
            <div class="input-group">
                <label for="nlCommand">Tell me what you want to do:</label>
                <textarea id="nlCommand" placeholder="e.g., 'Login and download records from 1 to 100'" rows="3"></textarea>
            </div>
            <button onclick="executeNLCommand()" id="nlBtn">Execute Command</button>
        </div>

        <div class="card">
            <h3>Manual Controls</h3>
            <div class="flex">
                <div>
                    <label for="username">Username:</label>
                    <input type="text" id="username" placeholder="Enter username">
                </div>
                <div>
                    <label for="password">Password:</label>
                    <input type="password" id="password" placeholder="Enter password">
                </div>
            </div>
            <button onclick="login()" id="loginBtn" style="margin: 10px 0;">Login</button>
            
            <div class="flex">
                <div>
                    <label for="startRange">Start Range:</label>
                    <input type="number" id="startRange" placeholder="1">
                </div>
                <div>
                    <label for="endRange">End Range:</label>
                    <input type="number" id="endRange" placeholder="100">
                </div>
            </div>
            <button onclick="downloadRecords()" id="downloadBtn">Download Records</button>
        </div>

        <div class="card">
            <h3>Status & Controls</h3>
            <div class="flex">
                <button onclick="getStatus()" class="btn-secondary">Check Status</button>
                <button onclick="cleanup()" class="btn-secondary">Cleanup</button>
            </div>
        </div>

        <div class="loading" id="loading">
            <div class="spinner"></div>
            <p>Processing...</p>
        </div>

        <div id="status"></div>

        <div class="card">
            <h3>Output Log</h3>
            <div id="output">Welcome to AI Datamyne Scraper! 🤖
Ready to process your commands...</div>
        </div>
    </div>

    <script>
        function showLoading(show) {
            document.getElementById('loading').style.display = show ? 'block' : 'none';
        }

        function showStatus(message, type = 'info') {
            const statusDiv = document.getElementById('status');
            statusDiv.innerHTML = `<div class="status ${type}">${message}</div>`;
        }

        function addToOutput(message) {
            const output = document.getElementById('output');
            const timestamp = new Date().toLocaleTimeString();
            output.textContent += `\\n[${timestamp}] ${message}`;
            output.scrollTop = output.scrollHeight;
        }

        async function executeNLCommand() {
            const command = document.getElementById('nlCommand').value.trim();
            if (!command) {
                showStatus('Please enter a command', 'error');
                return;
            }

            showLoading(true);
            addToOutput(`Executing: ${command}`);

            try {
                const response = await fetch('/api/execute', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ command })
                });

                const result = await response.json();
                if (result.success) {
                    showStatus(result.message, 'success');
                    addToOutput(`✅ ${result.message}`);
                } else {
                    showStatus(result.message, 'error');
                    addToOutput(`❌ ${result.message}`);
                }
            } catch (error) {
                showStatus(`Error: ${error.message}`, 'error');
                addToOutput(`❌ Error: ${error.message}`);
            }

            showLoading(false);
        }

        async function login() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (!username || !password) {
                showStatus('Please enter both username and password', 'error');
                return;
            }

            showLoading(true);
            addToOutput('Attempting login...');

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const result = await response.json();
                if (result.success) {
                    showStatus('Login successful!', 'success');
                    addToOutput('✅ Login successful');
                } else {
                    showStatus('Login failed', 'error');
                    addToOutput('❌ Login failed');
                }
            } catch (error) {
                showStatus(`Error: ${error.message}`, 'error');
                addToOutput(`❌ Login error: ${error.message}`);
            }

            showLoading(false);
        }

        async function downloadRecords() {
            const startRange = document.getElementById('startRange').value;
            const endRange = document.getElementById('endRange').value;

            if (!startRange || !endRange) {
                showStatus('Please enter both start and end range', 'error');
                return;
            }

            showLoading(true);
            addToOutput(`Starting download: ${startRange} to ${endRange}`);

            try {
                const response = await fetch('/api/download', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ start_range: startRange, end_range: endRange })
                });

                const result = await response.json();
                if (result.success) {
                    showStatus('Download completed!', 'success');
                    addToOutput('✅ Download completed');
                } else {
                    showStatus('Download failed', 'error');
                    addToOutput('❌ Download failed');
                }
            } catch (error) {
                showStatus(`Error: ${error.message}`, 'error');
                addToOutput(`❌ Download error: ${error.message}`);
            }

            showLoading(false);
        }

        async function getStatus() {
            showLoading(true);

            try {
                const response = await fetch('/api/status');
                const result = await response.json();

                if (result.success) {
                    const status = result.status;
                    let statusText = 'Current Status:\\n';
                    for (const [key, value] of Object.entries(status)) {
                        statusText += `${key}: ${value}\\n`;
                    }
                    showStatus('Status retrieved', 'info');
                    addToOutput(statusText);
                } else {
                    showStatus('Failed to get status', 'error');
                    addToOutput('❌ Failed to get status');
                }
            } catch (error) {
                showStatus(`Error: ${error.message}`, 'error');
                addToOutput(`❌ Status error: ${error.message}`);
            }

            showLoading(false);
        }

        async function cleanup() {
            showLoading(true);
            addToOutput('Cleaning up...');

            try {
                const response = await fetch('/api/cleanup', {
                    method: 'POST'
                });

                const result = await response.json();
                if (result.success) {
                    showStatus('Cleanup completed', 'success');
                    addToOutput('✅ Cleanup completed');
                } else {
                    showStatus('Cleanup failed', 'error');
                    addToOutput('❌ Cleanup failed');
                }
            } catch (error) {
                showStatus(`Error: ${error.message}`, 'error');
                addToOutput(`❌ Cleanup error: ${error.message}`);
            }

            showLoading(false);
        }

        // Handle Enter key in natural language input
        document.getElementById('nlCommand').addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                executeNLCommand();
            }
        });
    </script>
</body>
</html>'''
        
        with open(template_path, 'w') as f:
            f.write(html_content)

if __name__ == '__main__':
    create_template()
    print("🚀 Starting AI Datamyne Scraper Web Interface...")
    print("📱 Open http://localhost:5000 in your browser")
    app.run(debug=True, host='0.0.0.0', port=5000)