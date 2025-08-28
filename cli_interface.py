#!/usr/bin/env python3
"""
Simple CLI interface for the AI Datamyne Scraper
"""

import sys
import argparse
from ai_scraper_tool import DatamyneAIScraper


def main():
    parser = argparse.ArgumentParser(
        description="AI-powered Datamyne Scraper with Natural Language Processing",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python cli_interface.py --interactive
  python cli_interface.py --command "login and download records from 1 to 100"
  python cli_interface.py --login --download-range 1 100
  python cli_interface.py --status
        """
    )
    
    parser.add_argument(
        '--interactive', '-i',
        action='store_true',
        help='Run in interactive mode'
    )
    
    parser.add_argument(
        '--command', '-c',
        type=str,
        help='Execute a natural language command'
    )
    
    parser.add_argument(
        '--login', '-l',
        action='store_true',
        help='Login to Datamyne'
    )
    
    parser.add_argument(
        '--download-range', '-d',
        nargs=2,
        metavar=('START', 'END'),
        help='Download records in range (requires login)'
    )
    
    parser.add_argument(
        '--status', '-s',
        action='store_true',
        help='Show current status'
    )
    
    parser.add_argument(
        '--config',
        default='config.json',
        help='Configuration file path (default: config.json)'
    )
    
    args = parser.parse_args()
    
    # Initialize scraper
    try:
        scraper = DatamyneAIScraper(args.config)
    except Exception as e:
        print(f"❌ Failed to initialize scraper: {e}")
        return 1
    
    try:
        if args.interactive:
            # Run interactive mode
            scraper.interactive_mode()
        
        elif args.command:
            # Execute natural language command
            success = scraper.execute_command(args.command)
            return 0 if success else 1
        
        elif args.login:
            # Login
            success = scraper.login()
            if success and args.download_range:
                # Download if range specified
                start, end = args.download_range
                success = scraper.download_records(start, end)
            return 0 if success else 1
        
        elif args.download_range:
            # Download (requires login)
            start, end = args.download_range
            if not scraper.is_logged_in:
                print("⚠️ Attempting to login first...")
                if not scraper.login():
                    print("❌ Login failed. Cannot download.")
                    return 1
            
            success = scraper.download_records(start, end)
            return 0 if success else 1
        
        elif args.status:
            # Show status
            status = scraper.get_status()
            print("📊 Scraper Status:")
            for key, value in status.items():
                print(f"   {key}: {value}")
            return 0
        
        else:
            # No arguments provided, show help
            parser.print_help()
            return 0
    
    except KeyboardInterrupt:
        print("\n👋 Interrupted by user")
        return 0
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1
    finally:
        scraper.cleanup()


if __name__ == "__main__":
    sys.exit(main())