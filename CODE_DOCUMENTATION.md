# 📚 MaskGuard Detection System - Complete Code Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Dependencies (requirements.txt)](#dependencies)
3. [Backend (app.py)](#backend)
4. [Frontend Templates](#frontend-templates)
5. [JavaScript Modules](#javascript-modules)
6. [CSS Styling](#css-styling)
7. [Utility Scripts](#utility-scripts)
8. [Data Flow](#data-flow)
9. [API Endpoints](#api-endpoints)

---

## Project Overview

**MaskGuard** is an AI-powered real-time face mask detection system built with Flask and YOLO v8. It provides:
- Real-time camera detection
- Image upload analysis
- Statistics tracking
- PDF report generation
- Responsive web interface

### Technology Stack
- **Backend:** Python 3.7+, Flask
- **AI Model:** YOLO v8 (Ultralytics)
- **Computer Vision:** OpenCV
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Camera Access:** WebRTC (getUserMedia API)

---

## Dependencies (requirements.txt)

```txt
Flask
ultralytics
opencv-python-headless
numpy
Pillow
lap
onnxruntime
```

### Detailed Dependency Breakdown

#### 1. **Flask**
- **Purpose:** Web framework for Python
- **Usage:** 
  - Handles HTTP requests/responses
  - Renders HTML templates
  - Manages routes and endpoints
  - Serves static files
- **Version:** 2.0+
- **Key Features Used:**
  - `render_template()` - Template rendering
  - `jsonify()` - JSON responses
  - `request` - Handle incoming data
  - `Response` - Stream video data

#### 2. **ultralytics**
- **Purpose:** YOLO (You Only Look Once) implementation
- **Usage:**
  - Load YOLO model (`YOLO()`)
  - Run object detection
  - Track objects across frames
- **Key Features:**
  - Real-time object detection
  - Object tracking with IDs
  - Confidence scoring
  - Bounding box coordinates

#### 3. **opencv-python-headless**
- **Purpose:** Computer vision library (without GUI)
- **Usage:**
  - Image processing
  - Video frame manipulation
  - Drawing bounding boxes
  - Image encoding/decoding
- **Why Headless:** Server deployment doesn't need GUI
- **Key Functions Used:**
  - `cv2.VideoCapture()` - Camera access
  - `cv2.rectangle()` - Draw boxes
  - `cv2.putText()` - Add labels
  - `cv2.imencode()` - Encode images
  - `cv2.cvtColor()` - Color conversion

#### 4. **numpy**
- **Purpose:** Numerical computing library
- **Usage:**
  - Array operations
  - Image data manipulation
  - Mathematical operations
- **Key Features:**
  - Multi-dimensional arrays
  - Fast array operations
  - Image to array conversion

#### 5. **Pillow (PIL)**
- **Purpose:** Python Imaging Library
- **Usage:**
  - Image file handling
  - Format conversion
  - Image opening/saving
- **Key Functions:**
  - `Image.open()` - Open images
  - `Image.fromarray()` - Array to image
  - Format conversions

#### 6. **lap**
- **Purpose:** Linear Assignment Problem solver
- **Usage:**
  - Object tracking optimization
  - Required by YOLO tracking
- **Technical:** Hungarian algorithm implementation

#### 7. **onnxruntime**
- **Purpose:** ONNX model inference engine
- **Usage:**
  - Run ONNX format models
  - Optimized inference
- **Why:** YOLO model is in ONNX format (.onnx)

---

## Backend (app.py)

### File Structure Overview
```python
# Imports
# Global Variables
# Helper Functions
# Route Handlers
# Main Execution
```

### Detailed Code Breakdown

#### 1. Imports Section
```python
from flask import Flask, render_template, Response, jsonify, request
from ultralytics import YOLO
import cv2
import threading
import time
from collections import deque
from datetime import datetime
import numpy as np
import base64
import io
from PIL import Image
import os
```

**Purpose of Each Import:**
- `Flask` - Main web framework
- `render_template` - Render HTML templates
- `Response` - Create HTTP responses (for video streaming)
- `jsonify` - Convert Python dicts to JSON
- `request` - Access incoming request data
- `YOLO` - Load and run YOLO model
- `cv2` - OpenCV for image processing
- `threading` - Handle concurrent operations
- `time` - Time delays and measurements
- `deque` - Efficient queue for detection history
- `datetime` - Timestamp generation
- `numpy` - Array operations
- `base64` - Encode/decode images for web transfer
- `io` - In-memory file operations
- `Image` - PIL image handling
- `os` - Operating system operations

#### 2. Flask App Initialization
```python
app = Flask(__name__)
```
- Creates Flask application instance
- `__name__` tells Flask where to find resources

#### 3. Model Loading
```python
model = YOLO("models/best.onnx", task='detect')
```
- Loads YOLO model from ONNX file
- `task='detect'` - Specifies detection (not segmentation/classification)
- Model trained to detect: with_mask, without_mask, incorrect_mask

#### 4. Global Variables

##### Camera Variables
```python
camera = None
detection_active = True
detection_paused = False
```
- `camera` - OpenCV VideoCapture object
- `detection_active` - Controls main detection loop
- `detection_paused` - Pause/resume detection

##### Statistics Dictionary
```python
statistics = {
    'total_detections': 0,
    'with_mask': 0,
    'without_mask': 0,
    'incorrect_mask': 0,
    'current_status': 'safe',
    'last_violation': None,
    'detection_history': deque(maxlen=100)
}
```
- Tracks all detection metrics
- `deque(maxlen=100)` - Keeps last 100 detection records
- Auto-removes old entries when full

##### Tracking Variables
```python
tracked_objects = {}
counted_ids = set()
lock = threading.Lock()
```
- `tracked_objects` - Maps track_id to object info
- `counted_ids` - Prevents duplicate counting
- `lock` - Thread-safe access to shared data

#### 5. Helper Functions

##### get_camera()
```python
def get_camera():
    """Initialize camera if not already done"""
    global camera
    try:
        if camera is None or not camera.isOpened():
            camera = cv2.VideoCapture(0)
            if not camera.isOpened():
                print("Error: Could not open camera")
                return None
            camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        return camera
    except Exception as e:
        print(f"Error initializing camera: {e}")
        return None
```

**Purpose:** Initialize and configure camera
**Parameters:** None
**Returns:** Camera object or None
**Key Operations:**
1. Check if camera already initialized
2. Open camera (index 0 = default camera)
3. Set resolution to 640x480
4. Return camera object

##### analyze_detection()
```python
def analyze_detection(results):
    """Analyze detection results and update statistics"""
    # Complex logic for tracking and counting
```

**Purpose:** Process YOLO detection results
**Parameters:** 
- `results` - YOLO detection output
**Returns:** Alert data dictionary
**Key Operations:**
1. Extract detection information
2. Classify mask status
3. Track unique objects
4. Update statistics
5. Generate alerts

**Detection Classification Logic:**
```python
if 'no_mask' in class_name or 'without_mask' in class_name:
    status = "No Mask"
    category = 'without_mask'
elif 'incorrect' in class_name or 'improper' in class_name:
    status = "Incorrect Mask"
    category = 'incorrect_mask'
elif 'mask' in class_name or 'with_mask' in class_name:
    status = "Mask OK"
    category = 'with_mask'
```

**Unique Counting System:**
- Uses `counted_ids` set to track which IDs have been counted
- Only increments statistics when new unique ID detected
- Prevents duplicate counting when same person appears in multiple frames

##### generate_frames()
```python
def generate_frames():
    """Generate video frames with detection"""
    # Video streaming generator
```

**Purpose:** Stream video frames with detections
**Returns:** Generator yielding JPEG frames
**Key Operations:**
1. Read frame from camera
2. Run YOLO tracking
3. Analyze detections
4. Draw bounding boxes
5. Encode as JPEG
6. Yield frame bytes

**Frame Format:**
```python
yield (b'--frame\r\n'
       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
```
- Multipart HTTP response format
- Each frame is a separate JPEG image

#### 6. Route Handlers

##### Home Routes
```python
@app.route('/')
def index():
    return render_template('home.html')

@app.route('/live')
def live():
    return render_template('live.html')

@app.route('/upload')
def upload():
    return render_template('upload.html')

@app.route('/how-it-works')
def how_it_works():
    return render_template('how_it_works.html')
```

**Purpose:** Render HTML pages
**Method:** GET
**Returns:** Rendered HTML template

##### API Routes

###### /process_frame (POST)
```python
@app.route('/process_frame', methods=['POST'])
def process_frame():
    # Process live camera frame
```

**Purpose:** Process frames from client-side camera
**Method:** POST
**Input:** JSON with base64 encoded image
**Output:** JSON with processed image and alert data
**Use Case:** Live detection page

**Request Format:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

**Response Format:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQ...",
  "alert_data": {
    "new_alerts": [1, 2],
    "unsafe_count": 2,
    "environment_unsafe": false
  }
}
```

###### /process_image (POST)
```python
@app.route('/process_image', methods=['POST'])
def process_image():
    # Process uploaded image
```

**Purpose:** Process single uploaded image
**Method:** POST
**Input:** JSON with base64 encoded image
**Output:** JSON with processed image and detection counts
**Use Case:** Upload page

**Key Difference from process_frame:**
- Uses `model()` instead of `model.track()`
- No tracking IDs
- Immediate classification
- Returns detection counts

**Response Format:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQ...",
  "detections": {
    "with_mask": 2,
    "without_mask": 1,
    "incorrect_mask": 0,
    "total": 3
  }
}
```

###### /video_feed (GET)
```python
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')
```

**Purpose:** Stream video feed
**Method:** GET
**Returns:** Multipart HTTP response with JPEG frames
**MIME Type:** `multipart/x-mixed-replace`
**Use Case:** Server-side camera streaming (if needed)

###### /statistics (GET)
```python
@app.route('/statistics')
def get_statistics():
    # Return current statistics
```

**Purpose:** Get current detection statistics
**Method:** GET
**Returns:** JSON with statistics
**Update Frequency:** Called every 1 second by frontend

**Response Format:**
```json
{
  "total_detections": 10,
  "with_mask": 7,
  "without_mask": 2,
  "incorrect_mask": 1,
  "current_status": "safe",
  "safety_percentage": 70.0,
  "unsafe_count": 0,
  "environment_unsafe": false,
  "tracked_count": 3,
  "detection_history": [...]
}
```

###### /reset_statistics (POST)
```python
@app.route('/reset_statistics', methods=['POST'])
def reset_statistics():
    # Reset all statistics
```

**Purpose:** Reset statistics to zero
**Method:** POST
**Returns:** Success confirmation
**Clears:**
- All counters
- Counted IDs
- Tracked objects
- Detection history

###### /toggle_detection (POST)
```python
@app.route('/toggle_detection', methods=['POST'])
def toggle_detection():
    # Pause/resume detection
```

**Purpose:** Toggle detection pause state
**Method:** POST
**Returns:** Current pause state

#### 7. Main Execution Block
```python
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV', 'development') != 'production'
    
    print("="*60)
    print("MaskGuard Detection System - Starting...")
    print("="*60)
    
    try:
        app.run(debug=debug, host='0.0.0.0', port=port, 
                threaded=True, use_reloader=False)
    except KeyboardInterrupt:
        print("\nShutting down gracefully...")
    finally:
        detection_active = False
        if camera is not None:
            camera.release()
            cv2.destroyAllWindows()
```

**Configuration:**
- `host='0.0.0.0'` - Listen on all network interfaces
- `port=5000` - Default port (configurable via environment)
- `threaded=True` - Handle multiple requests concurrently
- `use_reloader=False` - Disable auto-reload (prevents model reload)

**Cleanup:**
- Release camera resources
- Close OpenCV windows
- Set detection_active to False

---

