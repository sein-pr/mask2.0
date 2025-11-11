# HTTPS Setup Guide for Camera Access

## Why HTTPS is Required

Modern browsers require HTTPS for camera access when accessing from:
- Other devices on the network (e.g., phone accessing computer's IP)
- Remote connections
- Any non-localhost connection

**Exception:** Camera works on `localhost` or `127.0.0.1` without HTTPS

## Solution 1: Self-Signed Certificate (Quick & Easy)

### Step 1: Generate Certificate
```bash
# Install pyOpenSSL if not already installed
pip install pyopenssl

# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365
```

When prompted, you can press Enter for all fields or fill them in.

### Step 2: Update app.py

Add at the end of `app.py`, replace the `app.run()` line:

```python
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV', 'development') != 'production'
    
    print("="*60)
    print("MaskGuard Detection System - Starting...")
    print("="*60)
    print(f"Model loaded: models/best.onnx")
    print(f"Server running on: https://0.0.0.0:{port}")
    print(f"Debug mode: {'ON' if debug else 'OFF'}")
    print("="*60)
    
    try:
        # Run with SSL certificate
        app.run(
            debug=debug, 
            host='0.0.0.0', 
            port=port, 
            threaded=True, 
            use_reloader=False,
            ssl_context=('cert.pem', 'key.pem')  # Add this line
        )
    except KeyboardInterrupt:
        print("\nShutting down gracefully...")
    except Exception as e:
        print(f"Server error: {e}")
    finally:
        detection_active = False
        if camera is not None:
            camera.release()
            cv2.destroyAllWindows()
```

### Step 3: Access the Application

1. Find your computer's IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr`

2. Access from other device:
   ```
   https://YOUR_IP_ADDRESS:5000
   ```
   Example: `https://192.168.1.100:5000`

3. **Accept the security warning** (because it's self-signed):
   - Chrome: Click "Advanced" → "Proceed to [IP] (unsafe)"
   - Firefox: Click "Advanced" → "Accept the Risk and Continue"
   - Safari: Click "Show Details" → "visit this website"

## Solution 2: ngrok (Easiest for Testing)

### Step 1: Install ngrok
Download from: https://ngrok.com/download

### Step 2: Run Your Flask App (HTTP is fine)
```bash
python app.py
```

### Step 3: Create HTTPS Tunnel
```bash
ngrok http 5000
```

### Step 4: Use the HTTPS URL
ngrok will provide an HTTPS URL like:
```
https://abc123.ngrok.io
```

Share this URL to access from any device with camera support!

## Solution 3: Production Setup (Recommended for Deployment)

### Using Let's Encrypt (Free SSL Certificate)

1. **Get a domain name** (required for Let's Encrypt)

2. **Install Certbot:**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install certbot python3-certbot-nginx
   
   # Mac
   brew install certbot
   ```

3. **Get SSL Certificate:**
   ```bash
   sudo certbot certonly --standalone -d yourdomain.com
   ```

4. **Update app.py to use certificates:**
   ```python
   ssl_context=(
       '/etc/letsencrypt/live/yourdomain.com/fullchain.pem',
       '/etc/letsencrypt/live/yourdomain.com/privkey.pem'
   )
   ```

## Solution 4: Reverse Proxy with Nginx

1. **Install Nginx**
2. **Configure SSL in Nginx**
3. **Proxy to Flask app**

This is the most robust solution for production.

## Quick Test on Same Device

If you just want to test locally:
```
http://localhost:5000
```
or
```
http://127.0.0.1:5000
```

Camera will work without HTTPS on localhost!

## Troubleshooting

### Camera still not working?

1. **Check browser permissions:**
   - Chrome: Settings → Privacy and security → Site Settings → Camera
   - Firefox: Preferences → Privacy & Security → Permissions → Camera
   - Safari: Preferences → Websites → Camera

2. **Check if camera is in use:**
   - Close other apps using the camera (Zoom, Skype, etc.)

3. **Try different browser:**
   - Chrome usually has best WebRTC support

4. **Check console for errors:**
   - Press F12 → Console tab

### Certificate Warnings

Self-signed certificates will show security warnings. This is normal and safe for local development. Click "Advanced" and proceed.

## Recommended Approach

**For Development/Testing:**
- Use **ngrok** (easiest, no certificate needed)
- Or use **self-signed certificate** (one-time setup)

**For Production:**
- Use **Let's Encrypt** with proper domain
- Or use **reverse proxy** (Nginx/Apache) with SSL

## Need Help?

- ngrok documentation: https://ngrok.com/docs
- Let's Encrypt: https://letsencrypt.org/getting-started/
- Flask SSL: https://flask.palletsprojects.com/en/2.3.x/deploying/
