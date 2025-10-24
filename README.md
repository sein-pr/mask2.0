# 🎭 MaskGuard - Real-Time Mask Detection System

<div align="center">

A modern, AI-powered face mask detection web application with mobile support. Works on **phones, tablets, and desktops**!

**Developed by Aina** 🚀

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0+-green.svg)](https://flask.palletsprojects.com/)
[![YOLO](https://img.shields.io/badge/YOLO-v11-red.svg)](https://docs.ultralytics.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[About](#-about) • [Features](#-features) • [Showcase](#-system-showcase) • [Quick Start](#-quick-start-local) • [Deployment](#-deploy-online) • [How It Works](#-how-it-works) • [Dataset](#-dataset) • [Acknowledgments](#-acknowledgments)

</div>

---

## 📖 About

MaskGuard is an intelligent real-time face mask detection system built with Flask, YOLO11, and modern web technologies. The system uses advanced object detection and tracking to monitor mask compliance in real-time, making it perfect for offices, schools, retail stores, healthcare facilities, and public spaces.

**Key Highlights:**
- 🤖 Powered by **Ultralytics YOLO11** pretrained models
- 📊 Trained on a custom, high-quality dataset from **Kaggle**
- ☁️ Deployable on **Back4App** with automatic HTTPS
- 🎯 Three-class detection: With Mask, Without Mask, Incorrect Mask
- 🔄 Smart tracking with unique IDs (no duplicate counting)

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

## 📸 System Showcase

<div align="center">

### ✅ Mask Worn Correctly
![Mask Worn](md%20imgs/System%20snap(Mask%20Worn).png)

### ❌ Mask Not Worn
![Mask Not Worn](md%20imgs/System%20snap(Mask%20No%20Worn).png)

### ⚠️ Mask Worn Incorrectly
![Mask Worn Incorrectly](md%20imgs/System%20snap(Mask%20Worn%20Incorectly).png)

</div>

---

## 🚀 Quick Start (Local)

### Option 1: Python (Recommended for Development)

**1. Install Dependencies**
```bash
pip install -r requirements.txt
```

**2. Run the App**
```bash
python app.py
```

**3. Open Browser**
```
http://localhost:5000
```

**4. Allow Camera Permissions**
Click "Allow" when browser asks for camera access

### Option 2: Docker (Recommended for Deployment)

**1. Build the Docker Image**
```bash
docker build -t maskguard .
```

**2. Run the Container**
```bash
docker run -p 5000:5000 maskguard
```

**3. Access the App**
```
http://localhost:5000
```

See [`docker-commands.md`](docker-commands.md) for more Docker commands and options.

---

## 🌐 Deploy Online

### ⭐ Recommended: Back4App (Free Tier Available!)

**Professional cloud deployment with zero configuration**

[Back4App](https://www.back4app.com/) is our recommended deployment platform for MaskGuard. It offers:

- ✅ **Free Tier** - Get started at no cost
- ✅ **Automatic HTTPS** - Secure camera access built-in
- ✅ **Easy Deploy** - Connect your GitHub repo and deploy
- ✅ **Scalable** - Handles traffic spikes effortlessly
- ✅ **Global CDN** - Fast performance worldwide

**Quick Deploy Steps:**
1. Sign up for a free [Back4App](https://www.back4app.com/) account
2. Create a new app and connect your GitHub repository
3. Back4App automatically detects Flask and deploys
4. Your app is live with HTTPS! 🚀

For detailed step-by-step instructions, see [`BACK4APP_DEPLOYMENT.md`](BACK4APP_DEPLOYMENT.md)

### Alternative Platforms

The app is also compatible with other Flask hosting platforms like Heroku, Railway, Render, or any cloud platform that supports Python/Flask applications.

---

## 📱 How It Works

### Client-Side Camera (JavaScript + WebRTC)
1. Browser requests camera access via WebRTC API
2. JavaScript captures video frames at 10 FPS
3. Frames are encoded to base64 and sent to server via POST request
4. Annotated frames returned and displayed in real-time

### Server-Side Processing (Flask + YOLO)
1. Flask receives base64-encoded frames at `/process_frame` endpoint
2. YOLO model performs object detection and tracking with unique IDs
3. Each person is assigned a persistent track ID
4. Custom bounding boxes drawn with color-coding:
   - **Green** = Wearing mask correctly
   - **Red** = No mask or incorrect mask (triggers alert)
5. Statistics updated (each person counted only once)
6. Annotated frame returned to client

### Detection Classes
- ✅ **With Mask** - Wearing correctly (Green box, no alert)
- ❌ **Without Mask** - Not wearing (Red box + Alert sound)
- ⚠️ **Incorrect Mask** - Wearing improperly (Red box + Alert sound)

### Smart Tracking
- Each person gets a **unique track ID** that persists across frames
- People are counted only **once** when first detected
- If someone puts on a mask, their status updates without duplicate counting
- Environment alert triggered when >2 people are non-compliant

---

## 🔌 API Endpoints

The Flask backend provides several API endpoints:

### `GET /`
Main page - serves the web interface

### `POST /process_frame`
Process a single frame from client camera
- **Input**: JSON with base64-encoded image
- **Output**: Annotated image and alert data

### `GET /video_feed`
Server-side camera stream (for local deployment with webcam)
- **Output**: MJPEG stream with real-time detection

### `GET /statistics`
Get current detection statistics
- **Output**: JSON with counts, percentages, and history

### `POST /reset_statistics`
Reset all statistics and tracking data
- **Output**: Success confirmation

### `POST /toggle_detection`
Pause/resume detection
- **Output**: Current pause state

### `GET /health`
Health check endpoint
- **Output**: Server status and model load status

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
├── app.py                  # Main Flask application
├── models/
│   ├── best.onnx          # YOLO model (ONNX format)
│   ├── best.pt            # YOLO model (PyTorch format)
│   └── last.pt            # Last checkpoint
├── train/                  # Training results
│   ├── weights/           # Model weights
│   │   ├── best.pt
│   │   ├── best.onnx
│   │   └── last.pt
│   ├── confusion_matrix.png
│   ├── confusion_matrix_normalized.png
│   ├── results.png        # Training metrics graphs
│   ├── results.csv        # Training metrics data
│   ├── BoxP_curve.png     # Precision curve
│   ├── BoxR_curve.png     # Recall curve
│   ├── BoxPR_curve.png    # Precision-Recall curve
│   ├── BoxF1_curve.png    # F1-Score curve
│   ├── train_batch*.jpg   # Training batch samples
│   ├── val_batch*.jpg     # Validation batch predictions/labels
│   ├── labels.jpg         # Label distribution
│   └── args.yaml          # Training arguments
├── val/                    # Validation results
│   ├── confusion_matrix.png
│   ├── confusion_matrix_normalized.png
│   ├── BoxP_curve.png     # Precision curve
│   ├── BoxR_curve.png     # Recall curve
│   ├── BoxPR_curve.png    # Precision-Recall curve
│   ├── BoxF1_curve.png    # F1-Score curve
│   └── val_batch*.jpg     # Validation predictions/labels
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
├── requirements.txt        # Python dependencies
├── Dockerfile              # Docker configuration
├── BACK4APP_DEPLOYMENT.md  # Back4App deployment guide
├── QUICKSTART.md           # Quick start guide
├── docker-commands.md      # Docker commands reference
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

This project includes training and validation results in the `train/` and `val/` folders.

### Training Results (`train/`)
The `train/` folder contains comprehensive training outputs:
- **Confusion Matrices** - Both raw and normalized versions showing classification performance
- **Performance Curves** - Precision, Recall, PR, and F1-Score curves
- **Training Metrics** - `results.png` visualizes training progress, `results.csv` contains raw data
- **Sample Batches** - Training and validation batch images with predictions
- **Model Weights** - Best and last checkpoints in both PyTorch (.pt) and ONNX formats
- **Configuration** - `args.yaml` contains all training hyperparameters

### Validation Results (`val/`)
The `val/` folder contains validation-specific outputs:
- **Confusion Matrices** - Performance on validation set
- **Performance Curves** - Validation metrics curves
- **Validation Batches** - Predictions vs ground truth comparisons

### Train Your Own Model
Want to train a custom model? Use:
- Ultralytics YOLOv8 or YOLOv11
- Dataset with three classes: `with_mask`, `without_mask`, `incorrect_mask`
- Export to ONNX format for deployment
- Replace `models/best.onnx` with your trained model

Example training command:
```python
from ultralytics import YOLO

# Train the model
model = YOLO('yolov8n.pt')  # or yolov11n.pt
results = model.train(
    data='your_dataset.yaml',
    epochs=100,
    imgsz=640,
    batch=16,
    name='mask_detection'
)

# Export to ONNX
model.export(format='onnx')
```

---

## 📊 Dataset

This project uses a custom mask detection dataset prepared and cleaned by **Sein Muwana**.

### Dataset Information
- **Name**: Best Mask Detection Dataset
- **Classes**: 3 (with_mask, without_mask, incorrect_mask)
- **Platform**: Kaggle
- **Link**: [Download Dataset on Kaggle](https://www.kaggle.com/datasets/muwanasein/bestset)

The dataset has been carefully curated and annotated to ensure high-quality training data for mask detection models. It includes diverse scenarios with various lighting conditions, angles, and mask types.

### Dataset Statistics
- **Training Images**: Comprehensive collection covering all three classes
- **Validation Images**: Balanced validation set for model evaluation
- **Annotations**: High-quality bounding box annotations
- **Format**: YOLO format (ready to use)

---

## 🎨 Customization

### Change Detection Confidence
In `app.py`, modify the confidence threshold (default is 0.5):
```python
results = model.track(frame, conf=0.5, iou=0.7, persist=True, verbose=False)
# Change conf=0.5 to your desired value (higher = stricter, lower = more detections)
```

### Change FPS
In `static/js/camera.js`, adjust frame processing rate:
```javascript
this.fps = 10;  // Frames per second (default: 10)
```

### Change Alert Threshold
In `app.py`, modify the environment unsafe threshold (default is >2 people):
```python
'environment_unsafe': unsafe_count > 2  # Change 2 to your threshold
```

### Change IOU Threshold
In `app.py`, adjust tracking sensitivity:
```python
results = model.track(frame, conf=0.5, iou=0.7, persist=True, verbose=False)
# Change iou=0.7 to control object tracking overlap threshold
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

## 🙏 Acknowledgments

This project wouldn't be possible without the contributions and support from amazing teams and individuals:

<div align="center">

### 🤖 AI & Model

<table>
<tr>
<td align="center" width="50%">
<img src="md%20imgs/thanks%20ultralytics.svg" width="120" style="border-radius: 50%;" alt="Ultralytics"/><br />
<b><a href="https://docs.ultralytics.com/">Ultralytics Team</a></b><br/>
<sub>For their outstanding YOLO models and the Ultralytics framework that powers our detection system. Their pretrained models and comprehensive documentation made this project possible.</sub>
</td>
<td align="center" width="50%">
<img src="md%20imgs/thanks%20sein-pr.png" width="120" style="border-radius: 50%;" alt="Sein Muwana"/><br />
<b><a href="https://github.com/sein-pr">Sein Muwana</a></b><br/>
<sub>For meticulously preparing, cleaning, and annotating the mask detection dataset available on <a href="https://www.kaggle.com/datasets/muwanasein/bestset">Kaggle</a>. The quality of this dataset was crucial for model training.</sub>
</td>
</tr>
</table>

### ☁️ Infrastructure & Resources

- **[Back4App](https://www.back4app.com/)** - For providing an excellent cloud deployment platform with seamless Flask integration and automatic HTTPS support, making the app accessible worldwide.

- **[Kaggle](https://www.kaggle.com/)** - For providing free GPU resources through Kaggle Notebooks and KaggleHub, enabling us to train our model efficiently without expensive hardware. Their platform democratizes AI development.

### 🛠️ Technologies

- **[Flask](https://flask.palletsprojects.com/)** - Web framework powering the backend
- **[OpenCV](https://opencv.org/)** - Computer vision library for image processing
- **[WebRTC](https://webrtc.org/)** - Browser camera API for real-time video capture

</div>

---

## ⭐ Show Your Support

If you find this project useful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 🔗 Sharing with others

---

**Stay Safe! Wear Your Mask! 😷**

