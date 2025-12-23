#!/usr/bin/env python3
"""
Removes expired API keys from rvr_trial.bin.
Called by CRM repo after it determines which keys have expired.
"""

import sys
from pathlib import Path


def remove_expired_keys(input_file: str, expired_keys_csv: str):
    """Remove specified keys from the file."""
    
    # Parse comma-separated keys
    keys_to_remove = set(key.strip() for key in expired_keys_csv.split(',') if key.strip())
    
    if not keys_to_remove:
        print("No keys to remove")
        return
    
    print(f"Keys to remove: {keys_to_remove}")
    
    # Read current keys
    with open(input_file, 'r') as f:
        lines = [line.strip() for line in f if line.strip()]
    
    # Filter out expired keys
    valid_keys = []
    removed_keys = []
    
    for line in lines:
        if line in keys_to_remove:
            removed_keys.append(line)
        else:
            valid_keys.append(line)
    
    # Write back valid keys
    with open(input_file, 'w') as f:
        for key in valid_keys:
            f.write(f"{key}\n")
    
    # Print summary
    print(f"Processed {len(lines)} keys")
    print(f"Removed: {len(removed_keys)}")
    print(f"Remaining: {len(valid_keys)}")
    
    if removed_keys:
        print("\nRemoved keys:")
        for key in removed_keys:
            print(f"  - {key}")


def main():
    if len(sys.argv) < 3:
        print("Usage: python expire_api_keys.py <input_file> <comma_separated_keys>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    expired_keys = sys.argv[2]
    
    if not Path(input_file).exists():
        print(f"Error: File {input_file} does not exist")
        sys.exit(1)
    
    remove_expired_keys(input_file, expired_keys)


if __name__ == "__main__":
    main()
