# 📷 Camera Access Fix - HTTPS Required

## The Problem

When accessing the MaskGuard app from other devices (phones, tablets, other computers), the camera doesn't work because:

**Modern browsers require HTTPS for camera access on non-localhost connections.**

## ✅ Quick Solutions

### Option 1: Use HTTPS Script (Easiest)

Run the app with automatic HTTPS setup:

```bash
python run_https.py
```

This will:
1. Auto-generate SSL certificates (if needed)
2. Start the server with HTTPS
3. Show you the URLs to access from other devices

**Then access from other devices:**
```
https://YOUR_IP_ADDRESS:5000
```

⚠️ **You'll see a security warning** - Click "Advanced" → "Proceed" (it's safe, it's your own certificate)

### Option 2: Use ngrok (No Certificate Needed)

1. **Download ngrok:** https://ngrok.com/download

2. **Run your app normally:**
   ```bash
   python app.py
   ```

3. **In another terminal, run:**
   ```bash
   ngrok http 5000
   ```

4. **Use the HTTPS URL provided by ngrok:**
   ```
   https://abc123.ngrok.io
   ```

This URL works on ANY device with camera support!

### Option 3: Access on Same Device (No HTTPS Needed)

If testing on the same computer:
```
http://localhost:5000/live
```

Camera works without HTTPS on localhost!

## 🔧 Manual HTTPS Setup

If you want to set it up manually:

### 1. Generate Certificate

```bash
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365
```

Press Enter for all prompts (or fill them in).

### 2. Update app.py

Find the `app.run()` line at the bottom and change it to:

```python
app.run(
    debug=debug,
    host='0.0.0.0',
    port=port,
    threaded=True,
    use_reloader=False,
    ssl_context=('cert.pem', 'key.pem')  # Add this line
)
```

### 3. Run the app

```bash
python app.py
```

### 4. Access from other devices

```
https://YOUR_IP_ADDRESS:5000
```

## 📱 Finding Your IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address"

**Mac/Linux:**
```bash
ifconfig
```
or
```bash
ip addr
```

Look for your local network IP (usually starts with 192.168.x.x or 10.x.x.x)

## 🔍 Troubleshooting

### Camera still not working?

1. **Check browser permissions:**
   - Allow camera access when prompted
   - Check browser settings → Privacy → Camera

2. **Try a different browser:**
   - Chrome usually has the best WebRTC support

3. **Make sure camera isn't in use:**
   - Close Zoom, Skype, Teams, etc.

4. **Check the browser console:**
   - Press F12 → Console tab
   - Look for error messages

### Security Warning Won't Go Away?

This is normal for self-signed certificates. You need to:
1. Click "Advanced" or "Show Details"
2. Click "Proceed to [IP] (unsafe)" or "Accept Risk"
3. This is safe - it's your own certificate

### ngrok Session Expired?

Free ngrok URLs expire after 2 hours. Just restart ngrok to get a new URL.

## 🎯 Recommended Approach

**For Quick Testing:**
→ Use **ngrok** (easiest, no setup)

**For Local Network:**
→ Use **run_https.py** script (one command)

**For Production:**
→ Use proper SSL certificate with domain name

## 📚 More Information

See `HTTPS_SETUP.md` for detailed setup instructions and production deployment options.

## ✨ Summary

| Access Method | HTTPS Required? | Camera Works? |
|--------------|----------------|---------------|
| localhost (same device) | ❌ No | ✅ Yes |
| Other devices (HTTP) | ❌ No | ❌ No |
| Other devices (HTTPS) | ✅ Yes | ✅ Yes |
| ngrok tunnel | ✅ Yes (automatic) | ✅ Yes |

**Bottom line:** Use HTTPS for camera access from other devices!
