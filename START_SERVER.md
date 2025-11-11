# 🚀 Starting the MaskGuard Server

## Quick Start

### 1. Make sure you're in the project directory
```bash
cd path/to/maskguard
```

### 2. Start the server
```bash
python app.py
```

You should see:
```
============================================================
MaskGuard Detection System - Starting...
============================================================
Model loaded: models/best.onnx
Server running on: http://0.0.0.0:5000
Debug mode: ON
Environment: development
============================================================
```

### 3. Access the application

Open your browser and go to:
```
http://localhost:5000
```

## Available Pages

| URL | Page | Description |
|-----|------|-------------|
| http://localhost:5000 | Home | Landing page with features |
| http://localhost:5000/live | Live Detection | Real-time camera detection |
| http://localhost:5000/upload | Upload | Upload and analyze images |
| http://localhost:5000/how-it-works | How It Works | Information and FAQ |

## Troubleshooting

### "Not Found" Error

**Possible causes:**

1. **Server not running**
   - Make sure you ran `python app.py`
   - Check the terminal for error messages

2. **Wrong URL**
   - Use `http://localhost:5000` (not just `localhost:5000`)
   - Don't add extra slashes or paths

3. **Server needs restart**
   - Press `Ctrl+C` to stop the server
   - Run `python app.py` again

4. **Port already in use**
   - Another app might be using port 5000
   - Try: `python app.py` (it will show an error if port is busy)
   - Kill the other process or change the port

### Test if Server is Running

Run this command in another terminal:
```bash
python test_routes.py
```

This will test all routes and show which ones are working.

### Check Server Logs

Look at the terminal where you ran `python app.py`. You should see:
```
127.0.0.1 - - [DATE] "GET / HTTP/1.1" 200 -
```

If you see `404` instead of `200`, the route isn't found.

### Common Issues

**Issue: "ModuleNotFoundError"**
```bash
# Install missing packages
pip install -r requirements.txt
```

**Issue: "Model not found"**
```bash
# Make sure models/best.onnx exists
ls models/best.onnx
```

**Issue: "Port 5000 already in use"**
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux - Find and kill process
lsof -ti:5000 | xargs kill -9
```

**Issue: "Camera not working"**
- On localhost: Should work with HTTP
- On other devices: Need HTTPS (see CAMERA_FIX.md)

## Starting with HTTPS

For camera access from other devices:
```bash
python run_https.py
```

Then access from other devices:
```
https://YOUR_IP_ADDRESS:5000
```

## Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

## Checking if Everything Works

1. **Start the server:**
   ```bash
   python app.py
   ```

2. **Open browser:**
   ```
   http://localhost:5000
   ```

3. **You should see:**
   - Home page with hero section
   - Navigation menu at top
   - Feature cards
   - Footer at bottom

4. **Test navigation:**
   - Click "Live Detection" → Should show camera interface
   - Click "Upload Image" → Should show upload area
   - Click "How It Works" → Should show information

## Still Having Issues?

1. **Check Python version:**
   ```bash
   python --version
   ```
   Should be Python 3.7 or higher

2. **Reinstall dependencies:**
   ```bash
   pip install -r requirements.txt --force-reinstall
   ```

3. **Check file structure:**
   ```
   project/
   ├── app.py
   ├── templates/
   │   ├── base.html
   │   ├── home.html
   │   ├── live.html
   │   ├── upload.html
   │   └── how_it_works.html
   ├── static/
   │   ├── css/
   │   ├── js/
   │   └── sounds/
   └── models/
       └── best.onnx
   ```

4. **Check the terminal output:**
   - Look for error messages
   - Check if the model loaded successfully
   - Verify the port number

## Success Indicators

✓ Server starts without errors
✓ You see "Model loaded: models/best.onnx"
✓ Browser shows the home page
✓ Navigation works
✓ No 404 errors in browser console (F12)

## Need More Help?

- Check `CAMERA_FIX.md` for camera issues
- Check `HTTPS_SETUP.md` for HTTPS setup
- Check `UPDATES.md` for recent changes
