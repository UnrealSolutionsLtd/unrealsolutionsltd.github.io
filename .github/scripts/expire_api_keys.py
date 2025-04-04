#!/usr/bin/env python3

import re
from datetime import datetime
import sys
from pathlib import Path

def parse_date(date_str):
    try:
        return datetime.strptime(date_str, '%d-%m-%Y')
    except ValueError:
        return None

def process_api_keys(input_file):
    current_date = datetime.now()
    valid_keys = []
    expired_keys = []
    
    with open(input_file, 'r') as f:
        for line in f:
            line = line.strip()
            if not line:  # Skip empty lines
                continue
                
            # Look for date pattern at the end of the line
            date_match = re.search(r'(\d{2}-\d{2}-\d{4})$', line)
            
            if date_match:
                key_date = parse_date(date_match.group(1))
                if key_date and key_date >= current_date:
                    valid_keys.append(line)
                else:
                    expired_keys.append(line)
            else:
                # Keep lines without dates (legacy format)
                valid_keys.append(line)
    
    return valid_keys, expired_keys

def main():
    if len(sys.argv) != 2:
        print("Usage: python expire_api_keys.py <input_file>")
        sys.exit(1)
        
    input_file = sys.argv[1]
    if not Path(input_file).exists():
        print(f"Error: File {input_file} does not exist")
        sys.exit(1)
        
    valid_keys, expired_keys = process_api_keys(input_file)
    
    # Write valid keys back to the file
    with open(input_file, 'w') as f:
        for key in valid_keys:
            f.write(f"{key}\n")
    
    # Print summary
    print(f"Processed {len(valid_keys) + len(expired_keys)} keys")
    print(f"Valid keys: {len(valid_keys)}")
    print(f"Expired keys: {len(expired_keys)}")
    
    if expired_keys:
        print("\nExpired keys:")
        for key in expired_keys:
            print(f"- {key}")

if __name__ == "__main__":
    main() 