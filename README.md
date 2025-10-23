# 🎭 MaskGuard - Real-Time Mask Detection System

A modern, AI-powered face mask detection web application with mobile support. Works on **phones, tablets, and desktops**!

**Developed by Aina** 🚀

---

## ✨ Features

- 🎥 **Real-time Detection** - Instant mask compliance monitoring
- 📱 **Mobile & Desktop** - Works on any device with a camera
- 🔄 **Object Tracking** - Unique IDs for each person (no duplicate counting!)
- 🔊 **Audio Alerts** - Sound + speech warnings for violations
- 📊 **Live Statistics** - Track compliance in real-time
- 🎨 **Beautiful UI** - Modern, responsive design
- 🔴 **Visual Alerts** - Color-coded bounding boxes (Green = safe, Red = alert)
- ⚠️ **Environment Warning** - Special alert when >2 people are non-compliant
- 📷 **Camera Switching** - Front/back camera on mobile devices

---

## 🚀 Quick Start (Local)

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the App
```bash
python app.py
```

### 3. Open Browser
```
http://localhost:5000
```

### 4. Allow Camera Permissions
Click "Allow" when browser asks for camera access

---

## 🌐 Deploy Online (FREE!)

### ⭐ Recommended: Hugging Face Spaces

**Best for AI/ML apps - Completely FREE forever!**

See detailed instructions in [`DEPLOYMENT.md`](DEPLOYMENT.md)

Quick overview:
1. Create account at [huggingface.co](https://huggingface.co/join)
2. Create a Space with Gradio SDK
3. Upload `app_gradio.py`, `models/best.onnx`, `requirements_gradio.txt`
4. Done! Your app is live 🎉

### 🎯 Quick Testing: Ngrok

**Get a public URL in 2 minutes!**

```bash
# Terminal 1
python app.py

# Terminal 2
ngrok http 5000
```

See [`ngrok_setup.md`](ngrok_setup.md) for detailed instructions

---

## 📱 How It Works

### Client-Side Camera
- Browser requests camera access
- JavaScript captures video frames
- Frames sent to server for processing
- Results displayed in real-time

### Server-Side Processing
- YOLO model analyzes frames
- Tracks objects with unique IDs
- Draws bounding boxes
- Returns annotated frames

### Detection Classes
- ✅ **With Mask** - Wearing correctly (Green box)
- ❌ **Without Mask** - Not wearing (Red box + Alert)
- ⚠️ **Incorrect Mask** - Wearing improperly (Red box + Alert)

---

## 🎮 Usage Guide

### Desktop
1. Visit the app URL
2. Allow camera access
3. See real-time detection!

### Mobile
1. Visit the app URL on your phone
2. Allow camera access
3. Use "Switch Camera" button to toggle front/back
4. Works just like desktop!

### Controls
- **Pause/Resume** - Stop/start detection
- **Switch Camera** - Toggle between cameras (mobile)
- **Reset Statistics** - Clear all counts

---

## 📊 Statistics

### What's Tracked:
- **Total Detections** - Unique people detected
- **With Mask** - People wearing masks correctly
- **Without Mask** - People not wearing masks
- **Incorrect Mask** - People wearing masks improperly
- **Safety Percentage** - Overall compliance rate

### Unique Counting:
Each person gets a **unique ID** and is counted only **once**. If they leave and return, they won't be counted again!

---

## 🔊 Alert System

### Individual Alerts
- Sound plays **once** when someone without proper mask is detected
- Red bounding box with "ALERT" label
- Continues until they put mask on correctly

### Environment Unsafe (>2 people)
- Continuous beeping sound
- Voice alert: "Environment not safe"
- Large warning banner on screen
- Repeats until situation improves

---

## 🛠️ Tech Stack

- **Backend**: Flask
- **AI Model**: Ultralytics YOLO (ONNX format)
- **Computer Vision**: OpenCV
- **Frontend**: HTML5, CSS3, JavaScript
- **Camera**: Browser WebRTC API
- **Audio**: Web Audio API + Speech Synthesis API

---

## 📂 Project Structure

```
mask2.0/
├── app.py                  # Main Flask app (original)
├── app_gradio.py          # Gradio version for Hugging Face
├── models/
│   └── best.onnx          # YOLO model
├── static/
│   ├── css/
│   │   └── style.css      # Styling
│   ├── js/
│   │   ├── app.js         # Main JavaScript
│   │   └── camera.js      # Camera handler
│   └── sounds/
│       └── beep-warning-6387.mp3
├── templates/
│   └── index.html         # Main page
├── requirements.txt        # Dependencies (Flask version)
├── requirements_gradio.txt # Dependencies (Gradio version)
├── DEPLOYMENT.md          # Deployment guide
└── README.md              # This file
```

---

## 🎯 Use Cases

- 🏢 **Office Buildings** - Monitor mask compliance
- 🏫 **Schools** - Ensure student safety
- 🏪 **Retail Stores** - Track customer compliance
- 🏥 **Healthcare** - Patient and visitor monitoring
- 🎭 **Events** - Large gathering safety
- 📚 **Research** - COVID-19 compliance studies

---

## 🔧 Troubleshooting

### Camera Not Working
- **Browser**: Check camera permissions in browser settings
- **Multiple Apps**: Close other apps using camera
- **HTTPS**: Camera requires HTTPS (works automatically when deployed)

### Slow Performance
- **Connection**: Check internet speed
- **Device**: Try on a more powerful device
- **Browser**: Use Chrome/Edge for best performance

### No Detections
- **Lighting**: Ensure good lighting
- **Distance**: Face should be visible and clear
- **Model**: Verify model file exists at `models/best.onnx`

---

## 📦 Requirements

- Python 3.8+
- Webcam/Camera
- Modern browser (Chrome, Firefox, Safari, Edge)
- YOLO model trained on mask detection

---

## 🌍 Browser Compatibility

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome  | ✅ | ✅ |
| Safari  | ✅ | ✅ |
| Firefox | ✅ | ✅ |
| Edge    | ✅ | ✅ |

---

## 📝 Model Training

Need to train your own model? Use:
- Ultralytics YOLOv8 or YOLOv11
- Dataset with mask/no-mask/incorrect-mask labels
- Export to ONNX format
- Place at `models/best.onnx`

---

## 🎨 Customization

### Change Detection Confidence
In `app.py` or `app_gradio.py`:
```python
results = model.track(frame, conf=0.5, ...)  # Change 0.5 to your value
```

### Change FPS
In `static/js/camera.js`:
```javascript
this.fps = 10;  // Frames per second
```

### Change Alert Threshold
In `app.py`:
```python
'environment_unsafe': unsafe_count > 2  # Change 2 to your threshold
```

---

## 🤝 Contributing

Feel free to fork and improve! Some ideas:
- [ ] Add database for statistics
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Export statistics to CSV
- [ ] Email alerts
- [ ] Integration with access control systems

---

## 📄 License

This project is for educational and safety purposes.

---

## 👨‍💻 Developer

**Developed by Aina**

- AI-powered mask detection
- Real-time object tracking
- Mobile-first design
- Production-ready code

---

## 🙏 Credits

- **Ultralytics YOLO** - Object detection framework
- **Flask** - Web framework
- **OpenCV** - Computer vision
- **Gradio** - ML app framework

---

## ⭐ Show Your Support

If you find this project useful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 🔗 Sharing with others

---

**Stay Safe! Wear Your Mask! 😷**

