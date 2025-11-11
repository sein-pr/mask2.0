# 🔧 Troubleshooting Guide

## "Not Found" Error (404)

### Quick Fix Checklist

1. **Is the server running?**
   ```bash
   # You should see this in terminal:
   # Server running on: http://0.0.0.0:5000
   ```

2. **Did you restart the server after making changes?**
   ```bash
   # Stop server: Ctrl+C
   # Start again: python app.py
   ```

3. **Are you using the correct URL?**
   ```
   ✓ http://localhost:5000
   ✓ http://127.0.0.1:5000
   ✗ localhost:5000 (missing http://)
   ✗ http://localhost:5000/index (wrong path)
   ```

4. **Check the terminal for errors**
   - Look for Python errors
   - Check if model loaded successfully

### Step-by-Step Fix

#### Step 1: Stop Everything
```bash
# Press Ctrl+C in the terminal running the server
```

#### Step 2: Verify Files Exist
```bash
# Check if templates exist
dir templates
# Should show: base.html, home.html, live.html, upload.html, how_it_works.html

# Check if app.py exists
dir app.py
```

#### Step 3: Install Dependencies
```bash
pip install flask ultralytics opencv-python-headless numpy pillow lap onnxruntime
```

#### Step 4: Start Fresh
```bash
python app.py
```

#### Step 5: Test in Browser
```
http://localhost:5000
```

## Common Errors and Solutions

### Error: "ModuleNotFoundError: No module named 'flask'"

**Solution:**
```bash
pip install flask
# Or install all dependencies:
pip install -r requirements.txt
```

### Error: "ModuleNotFoundError: No module named 'ultralytics'"

**Solution:**
```bash
pip install ultralytics
```

### Error: "Model not found: models/best.onnx"

**Solution:**
```bash
# Make sure the model file exists
# Check if models folder exists:
dir models

# If missing, you need to add your YOLO model file
# Place it at: models/best.onnx
```

### Error: "Address already in use" or "Port 5000 is already in use"

**Solution:**

**Windows:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9
```

**Or use a different port:**
```bash
# Set PORT environment variable
set PORT=8000  # Windows
export PORT=8000  # Mac/Linux

python app.py
# Now access at: http://localhost:8000
```

### Error: 404 on specific pages

**Check these:**

1. **Template files exist:**
   ```
   templates/home.html
   templates/live.html
   templates/upload.html
   templates/how_it_works.html
   templates/base.html
   ```

2. **No typos in URLs:**
   ```
   ✓ /live
   ✓ /upload
   ✓ /how-it-works
   ✗ /live-detection
   ✗ /how_it_works
   ```

3. **Server restarted after changes**

### Error: "Template not found"

**Solution:**
```bash
# Make sure templates folder exists and has files
dir templates

# If missing, you need to create the templates
# Check if you're in the right directory:
dir
# Should show: app.py, templates/, static/, models/
```

### Error: Camera not working

**On localhost:**
- Should work with HTTP
- Check browser permissions
- Make sure camera isn't in use by another app

**On other devices:**
- Requires HTTPS
- See CAMERA_FIX.md for solutions

### Error: "Internal Server Error" (500)

**Check terminal for Python errors:**
```bash
# Look for traceback in terminal
# Common causes:
# - Missing model file
# - Syntax error in code
# - Missing dependencies
```

## Verification Steps

### 1. Check Python Version
```bash
python --version
# Should be 3.7 or higher
```

### 2. Check Dependencies
```bash
pip list | findstr flask
pip list | findstr ultralytics
pip list | findstr opencv
```

### 3. Check File Structure
```
Your project should look like:
project/
├── app.py                 ← Main application
├── requirements.txt       ← Dependencies
├── templates/            ← HTML templates
│   ├── base.html
│   ├── home.html
│   ├── live.html
│   ├── upload.html
│   └── how_it_works.html
├── static/               ← Static files
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── app.js
│   │   ├── camera.js
│   │   ├── navigation.js
│   │   └── upload.js
│   └── sounds/
└── models/               ← AI model
    └── best.onnx
```

### 4. Test Routes
```bash
# Install requests if needed
pip install requests

# Run test script
python test_routes.py
```

### 5. Check Browser Console
```
1. Open browser (Chrome/Firefox)
2. Press F12
3. Go to Console tab
4. Look for errors (red text)
5. Check Network tab for failed requests
```

## Still Not Working?

### Complete Reset

1. **Stop the server** (Ctrl+C)

2. **Reinstall dependencies:**
   ```bash
   pip uninstall flask ultralytics opencv-python-headless -y
   pip install -r requirements.txt
   ```

3. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Or use Incognito/Private mode

4. **Start fresh:**
   ```bash
   python app.py
   ```

5. **Test with curl:**
   ```bash
   curl http://localhost:5000
   # Should return HTML
   ```

### Check Server Logs

When you access a page, you should see in terminal:
```
127.0.0.1 - - [08/Nov/2025 15:56:49] "GET / HTTP/1.1" 200 -
```

- `200` = Success ✓
- `404` = Not Found ✗
- `500` = Server Error ✗

### Debug Mode

Add this to see more details:
```python
# In app.py, change:
app.run(debug=True, ...)
```

This will show detailed error pages in the browser.

## Getting Help

When asking for help, provide:

1. **Error message** (exact text)
2. **Terminal output** (what you see when running python app.py)
3. **Browser console errors** (F12 → Console)
4. **URL you're trying to access**
5. **Python version** (`python --version`)
6. **Operating system** (Windows/Mac/Linux)

## Quick Diagnostic

Run this in terminal:
```bash
# Check if server is running
curl http://localhost:5000

# Check if templates exist
dir templates

# Check if app.py exists
dir app.py

# Check Python version
python --version

# Check Flask is installed
python -c "import flask; print(flask.__version__)"
```

If all these work, the server should run fine!
