def generate_api_key():
    """Generate a random alphanumeric API key (e.g., 32 characters)."""
    import secrets
    return secrets.token_hex(16)  # 32-character key

def save_api_key_to_bin(file_path, api_key):
    """Append API key as plain text in a .bin file."""
    with open(file_path, "ab") as f:  # Append in binary mode
        f.write((api_key + "\n").encode("utf-8"))  # Store as UTF-8 text

# File path
file_path = "api_keys.bin"

# Generate a new API key
new_key = generate_api_key()

# Save it to the .bin file
save_api_key_to_bin(file_path, new_key)

print(f"API key saved: {new_key}")
