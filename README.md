# COVID-19 Mask Detection System

A modern, real-time face mask detection web application powered by YOLOv11 and Flask.

## Features

- **Live Detection**: Real-time mask detection from webcam feed
- **Pause/Resume**: Control detection with easy pause and resume functionality
- **Statistics Dashboard**: Track mask compliance with detailed statistics
- **Environment Safety Status**: Real-time safety assessment of the environment
- **Alarm System**: Audio alerts when mask violations are detected
- **Modern UI**: Clean, responsive design with light theme

## Prerequisites

- Python 3.8 or higher
- Webcam
- Trained YOLOv11 model (ONNX format) located at `mask2/best.onnx`

## Installation

1. Clone or navigate to the project directory:
```bash
cd mask2.0
```

2. Install required dependencies:
```bash
pip install -r requirements.txt
```

## Usage

1. Make sure your trained model is located at `mask2/best.onnx`

2. Run the Flask application:
```bash
python app.py
```

3. Open your web browser and navigate to:
```
http://localhost:5000
```

4. Allow camera permissions when prompted by your browser

## Features Guide

### Live Detection
- The main video feed shows real-time detection with bounding boxes
- Different classes are detected: with mask, without mask, incorrect mask

### Controls
- **Pause/Resume Button**: Pause detection to freeze the analysis
- **Reset Statistics Button**: Clear all statistics and start fresh

### Statistics Panel
- **With Mask**: Count of people wearing masks correctly
- **Without Mask**: Count of people not wearing masks
- **Incorrect Mask**: Count of people wearing masks incorrectly
- **Total Detections**: Overall detection count

### Safety Status
- Shows overall environment safety status
- Displays compliance percentage
- Updates in real-time based on detections

### Alarm System
- Automatically triggers when mask violations are detected
- Plays audio alerts at regular intervals during violations
- Stops when environment becomes safe again

## Model Classes

Your YOLOv11 model should be trained to detect the following classes:
- With Mask / Mask
- Without Mask / No Mask
- Incorrect Mask / Improper Mask

## Technologies Used

- **Backend**: Flask, Ultralytics YOLOv11
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Computer Vision**: OpenCV
- **AI/ML**: YOLOv11 (ONNX)

## Browser Compatibility

- Chrome/Edge (Recommended)
- Firefox
- Safari
- Opera

## Notes

- The application uses your default webcam (device index 0)
- Detection confidence threshold is set to 0.4 (40%)
- Statistics update every second
- Video stream runs at optimal resolution for performance

## Troubleshooting

**Camera not working:**
- Ensure no other application is using the camera
- Check browser permissions
- Try refreshing the page

**Model not loading:**
- Verify the model path: `mask2/best.onnx`
- Ensure the model is in ONNX format
- Check that the model was exported correctly from Ultralytics

**Performance issues:**
- Close other resource-intensive applications
- Reduce browser zoom level
- Ensure good lighting for better detection

## License

This project is for educational and safety purposes.

## Credits

- Powered by Ultralytics YOLOv11
- Built with Flask framework
- Modern UI design with clean aesthetics

