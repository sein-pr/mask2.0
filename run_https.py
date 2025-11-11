#!/usr/bin/env python3
"""
Run MaskGuard with HTTPS support for camera access from other devices.
This script automatically generates a self-signed certificate if needed.
"""

import os
import sys
from pathlib import Path

def generate_certificate():
    """Generate self-signed certificate if it doesn't exist"""
    cert_file = Path('cert.pem')
    key_file = Path('key.pem')
    
    if cert_file.exists() and key_file.exists():
        print("✓ SSL certificates found")
        return True
    
    print("Generating self-signed SSL certificate...")
    print("(You can press Enter for all prompts)")
    
    try:
        import subprocess
        result = subprocess.run([
            'openssl', 'req', '-x509', '-newkey', 'rsa:4096', 
            '-nodes', '-out', 'cert.pem', '-keyout', 'key.pem', 
            '-days', '365', '-subj', '/CN=localhost'
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✓ SSL certificates generated successfully")
            return True
        else:
            print("✗ Failed to generate certificates")
            print(result.stderr)
            return False
    except FileNotFoundError:
        print("✗ OpenSSL not found. Please install OpenSSL:")
        print("  - Windows: Download from https://slproweb.com/products/Win32OpenSSL.html")
        print("  - Mac: brew install openssl")
        print("  - Linux: sudo apt-get install openssl")
        return False
    except Exception as e:
        print(f"✗ Error generating certificates: {e}")
        return False

def get_local_ip():
    """Get local IP address"""
    import socket
    try:
        # Create a socket to get the local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except:
        return "Unable to determine"

def main():
    print("="*70)
    print("MaskGuard Detection System - HTTPS Mode")
    print("="*70)
    
    # Check if certificates exist or generate them
    if not generate_certificate():
        print("\nFalling back to HTTP mode...")
        print("Camera will only work on localhost (127.0.0.1)")
        print("\nStarting server...")
        os.system('python app.py')
        return
    
    # Get local IP
    local_ip = get_local_ip()
    
    print("\n" + "="*70)
    print("Server Information:")
    print("="*70)
    print(f"Local access:    https://localhost:5000")
    print(f"                 https://127.0.0.1:5000")
    print(f"Network access:  https://{local_ip}:5000")
    print("="*70)
    print("\n⚠️  IMPORTANT: When accessing from other devices:")
    print("   1. Your browser will show a security warning")
    print("   2. Click 'Advanced' and 'Proceed' (it's safe - it's your own certificate)")
    print("   3. Allow camera permissions when prompted")
    print("="*70)
    print("\nStarting HTTPS server...\n")
    
    # Modify app.py to use SSL
    try:
        # Import and run the app with SSL
        import app as flask_app
        
        port = int(os.environ.get('PORT', 5000))
        debug = os.environ.get('FLASK_ENV', 'development') != 'production'
        
        flask_app.app.run(
            debug=debug,
            host='0.0.0.0',
            port=port,
            threaded=True,
            use_reloader=False,
            ssl_context=('cert.pem', 'key.pem')
        )
    except KeyboardInterrupt:
        print("\n\nShutting down gracefully...")
    except Exception as e:
        print(f"\n✗ Error starting server: {e}")
        print("\nTry running: python app.py")
        sys.exit(1)

if __name__ == '__main__':
    main()
