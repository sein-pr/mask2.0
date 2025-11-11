# 🛡️ MaskGuard Detection System

AI-powered real-time face mask detection and compliance monitoring system.

![Python](https://img.shields.io/badge/Python-3.7+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)
![YOLO](https://img.shields.io/badge/YOLO-v8-red.svg)

## ✨ Features

- 🎥 **Real-time Detection** - Live camera feed with instant mask detection
- 📸 **Image Upload** - Analyze mask compliance in photos
- 📊 **Statistics Dashboard** - Track compliance metrics in real-time
- 🔔 **Smart Alerts** - Audio and visual warnings for violations
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Dark theme with faint blue accents

## 🚀 Quick Start

### Option 1: Using Startup Script (Easiest)

**Windows:**
```bash
start.bat
```

**Mac/Linux:**
```bash
chmod +x start.sh
./start.sh
```

### Option 2: Manual Start

```bash
# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```

### Access the Application

Open your browser and go to:
```
http://localhost:5000
```

## 📋 Requirements

- Python 3.7 or higher
- Webcam (for live detection)
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 📦 Installation

1. **Clone or download the project**

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Ensure model file exists:**
   ```
   models/best.onnx
   ```

4. **Run the application:**
   ```bash
   python app.py
   ```

## 🎯 Usage

### Home Page
- Overview of features
- Quick access to all functions
- Detection type information

### Live Detection
- Real-time camera monitoring
- Instant mask compliance detection
- Statistics dashboard
- Audio/visual alerts

### Upload Image
- Drag-and-drop interface
- Analyze photos for mask compliance
- Side-by-side comparison
- Detection summary

### How It Works
- Technology explanation
- Detection categories
- Usage instructions
- FAQ section

## 🔐 Camera Access from Other Devices

Camera requires HTTPS when accessing from other devices (not localhost).

### Quick HTTPS Setup:
```bash
python run_https.py
```

Then access from other devices:
```
https://YOUR_IP_ADDRESS:5000
```

See [CAMERA_FIX.md](CAMERA_FIX.md) for detailed instructions.

## 📱 Detection Categories

| Category | Color | Description |
|----------|-------|-------------|
| ✅ Mask OK | Green | Mask worn correctly |
| ⚠️ Incorrect Mask | Orange | Mask worn improperly |
| ❌ No Mask | Red | No mask detected |

## 🎨 Color Scheme

- **Background:** Dark blue-black gradient
- **Primary:** Bright blue (#3b82f6)
- **Surface:** Dark blue (#1a1f35)
- **Text:** Light colors for contrast
- **Accents:** Green (safe), Red (danger), Yellow (warning)

## 📁 Project Structure

```
maskguard/
├── app.py                      # Main Flask application
├── requirements.txt            # Python dependencies
├── start.bat / start.sh       # Startup scripts
├── run_https.py               # HTTPS server script
├── templates/                 # HTML templates
│   ├── base.html             # Base template
│   ├── home.html             # Home page
│   ├── live.html             # Live detection
│   ├── upload.html           # Image upload
│   └── how_it_works.html     # Information page
├── static/                    # Static files
│   ├── css/
│   │   └── style.css         # Styles
│   ├── js/
│   │   ├── app.js            # Live detection logic
│   │   ├── camera.js         # Camera handling
│   │   ├── navigation.js     # Navigation menu
│   │   └── upload.js         # Upload functionality
│   └── sounds/
│       └── beep-warning-6387.mp3  # Alert sound
└── models/
    └── best.onnx             # YOLO model
```

## 🔧 Troubleshooting

### "Not Found" Error
1. Make sure server is running (`python app.py`)
2. Use correct URL: `http://localhost:5000`
3. Restart the server (Ctrl+C, then `python app.py`)

### Camera Not Working
- **On localhost:** Should work with HTTP
- **On other devices:** Requires HTTPS (see CAMERA_FIX.md)

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for more help.

## 📚 Documentation

- [START_SERVER.md](START_SERVER.md) - Server startup guide
- [CAMERA_FIX.md](CAMERA_FIX.md) - Camera access solutions
- [HTTPS_SETUP.md](HTTPS_SETUP.md) - Detailed HTTPS setup
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues and fixes
- [UPDATES.md](UPDATES.md) - Recent changes

## 🛠️ Technology Stack

- **Backend:** Flask (Python)
- **AI Model:** YOLO v8 (Ultralytics)
- **Computer Vision:** OpenCV
- **Frontend:** HTML5, CSS3, JavaScript
- **Camera:** WebRTC (getUserMedia API)

## 🌐 Browser Support

| Browser | Version | Camera Support |
|---------|---------|----------------|
| Chrome | 53+ | ✅ Full |
| Firefox | 36+ | ✅ Full |
| Safari | 11+ | ✅ Full |
| Edge | 79+ | ✅ Full |

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Home page |
| `/live` | GET | Live detection page |
| `/upload` | GET | Upload page |
| `/how-it-works` | GET | Information page |
| `/process_frame` | POST | Process live camera frame |
| `/process_image` | POST | Process uploaded image |
| `/statistics` | GET | Get detection statistics |
| `/reset_statistics` | POST | Reset statistics |
| `/video_feed` | GET | Video stream endpoint |

## 🔒 Security Notes

- Camera access requires user permission
- All processing happens locally (no data sent to external servers)
- HTTPS recommended for production use
- Self-signed certificates safe for local development

## 🎓 How It Works

1. **Capture:** Camera feed or uploaded image
2. **Detect:** YOLO model identifies faces
3. **Classify:** Determines mask status (OK/Incorrect/None)
4. **Alert:** Visual and audio notifications for violations
5. **Track:** Statistics and compliance metrics

## 🤝 Contributing

Developed by **Aina**

## 📄 License

All Rights Reserved © 2025

## 🆘 Support

Having issues? Check these resources:

1. [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common problems
2. [START_SERVER.md](START_SERVER.md) - Startup help
3. [CAMERA_FIX.md](CAMERA_FIX.md) - Camera issues

## 🎉 Quick Test

```bash
# 1. Start server
python app.py

# 2. Open browser
http://localhost:5000

# 3. Test routes
python test_routes.py
```

## 📝 Notes

- Model file (`models/best.onnx`) required for detection
- Camera works on localhost without HTTPS
- Other devices require HTTPS for camera access
- Audio alerts require user interaction to enable

---

**Made with ❤️ using Flask and YOLO**
