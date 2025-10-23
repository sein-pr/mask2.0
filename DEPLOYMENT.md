# MaskGuard - Free Hosting Options

## 🚀 Best Free Hosting Platforms

### ⭐ Option 1: Hugging Face Spaces (RECOMMENDED)

**Perfect for AI/ML apps like yours!**

#### Why Hugging Face Spaces?
- ✅ **Designed for ML apps** - Perfect for YOLO models
- ✅ **Completely FREE** forever
- ✅ **No credit card required**
- ✅ **Public URL** instantly
- ✅ **Works on mobile & desktop**
- ✅ **GPU support available** (even on free tier sometimes)
- ✅ **Great for portfolio** - showcases your AI project

#### Steps to Deploy:

1. **Create Account**
   - Go to [huggingface.co](https://huggingface.co/join)
   - Sign up (free, no credit card needed)

2. **Create a Space**
   - Click "Create new" → "Space"
   - Name: `maskguard-detection`
   - License: Choose any (MIT recommended)
   - SDK: Select **"Gradio"** (we'll convert your app)

3. **Prepare Your Files**

Create `app_gradio.py`:
```python
import gradio as gr
import cv2
import numpy as np
from ultralytics import YOLO
from PIL import Image

# Load model
model = YOLO("models/best.onnx", task='detect')

# Track objects
tracked_objects = {}
counted_ids = set()

def process_image(image):
    """Process image from webcam"""
    # Convert PIL to OpenCV format
    frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    
    # Run YOLO tracking
    results = model.track(frame, conf=0.5, iou=0.7, persist=True)
    
    # Draw results
    annotated_frame = results[0].plot()
    
    # Convert back to PIL
    return Image.fromarray(cv2.cvtColor(annotated_frame, cv2.COLOR_BGR2RGB))

# Create Gradio interface
demo = gr.Interface(
    fn=process_image,
    inputs=gr.Image(source="webcam", streaming=True),
    outputs="image",
    title="🎭 MaskGuard - Real-Time Mask Detection",
    description="AI-powered face mask compliance monitoring. Works on mobile & desktop!",
    live=True,
    allow_flagging="never"
)

if __name__ == "__main__":
    demo.launch()
```

4. **Upload Files**
   - Upload: `app_gradio.py`, `models/best.onnx`, `requirements.txt`
   - Space will auto-build and deploy!

5. **Access Your App**
   - URL: `https://huggingface.co/spaces/YOUR_USERNAME/maskguard-detection`
   - Share with anyone!

---

### Option 2: PythonAnywhere

**Simple Python hosting**

#### Pros:
- ✅ Free tier available
- ✅ Easy to set up
- ✅ Web console access
- ✅ Good for Flask apps

#### Cons:
- ❌ Limited to 512MB RAM (might struggle with YOLO)
- ❌ Requires account verification

#### Steps:
1. Sign up at [pythonanywhere.com](https://www.pythonanywhere.com)
2. Upload your files via web interface
3. Set up Flask app in "Web" tab
4. Install requirements: `pip install -r requirements.txt`
5. Configure WSGI file
6. Your app: `http://YOUR_USERNAME.pythonanywhere.com`

**Note:** Free tier might be slow for YOLO models.

---

### Option 3: Ngrok (Quick Testing/Sharing)

**For temporary demos and testing**

#### Perfect for:
- ✅ Quick sharing during development
- ✅ Testing on mobile devices
- ✅ Client demos
- ✅ Free temporary URLs

#### Steps:

1. **Install Ngrok**
   ```bash
   # Download from https://ngrok.com/download
   # Or install via:
   pip install pyngrok
   ```

2. **Sign up for free account**
   - Go to [ngrok.com/signup](https://ngrok.com/signup)
   - Get your authtoken

3. **Run Your App Locally**
   ```bash
   python app.py
   # App running on http://localhost:5000
   ```

4. **Create Public URL**
   ```bash
   ngrok http 5000
   ```

5. **Share the URL**
   - Ngrok gives you: `https://xxxx-xx-xx-xxx-xxx.ngrok-free.app`
   - Share this URL - works on any device!
   - URL changes each time you restart ngrok

**Limitations:**
- ❌ URL expires when you close ngrok
- ❌ Need to keep your computer running
- ✅ BUT: Great for quick testing and demos!

---

### Option 4: Railway

**Modern hosting platform**

#### Pros:
- ✅ $5 free credit/month
- ✅ Easy deployment
- ✅ Better performance than others
- ✅ Simple GitHub integration

#### Cons:
- ❌ Requires credit card (even for free tier)
- ❌ Costs after free credit runs out

#### Steps:
1. Sign up at [railway.app](https://railway.app)
2. Connect GitHub repository
3. Railway auto-detects Python app
4. Add environment variable: `PORT=5000`
5. Deploy!

---

## 📊 Comparison

| Platform | Best For | Setup Time | Performance | Mobile Support |
|----------|----------|------------|-------------|----------------|
| **Hugging Face Spaces** | AI/ML apps | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ Excellent |
| **PythonAnywhere** | Simple Flask | ⭐⭐⭐ | ⭐⭐ | ✅ Good |
| **Ngrok** | Quick demos | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Excellent |
| **Railway** | Production | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Excellent |

---

## 🎯 My Recommendation

### For Your Mask Detection App:

**Best Choice: Hugging Face Spaces** 🏆

Why?
1. **Made for AI apps** like yours
2. **Completely free** forever
3. **Great performance** for YOLO models
4. **Perfect for portfolio** - show it off!
5. **Mobile & desktop** work perfectly
6. **No credit card** needed
7. **Public URL** instantly

### Quick Win: Ngrok (for testing)

While setting up HF Spaces:
1. Run `ngrok http 5000`
2. Share URL with friends/clients
3. Test on your phone immediately!

---

## 🚀 Quick Start: Ngrok

**Get your app online in 2 minutes:**

```bash
# 1. Run your app
python app.py

# 2. In another terminal, run:
ngrok http 5000

# 3. Copy the https URL and test on your phone!
```

---

## 📱 Mobile Access

All these platforms provide **HTTPS** automatically, which means:
- ✅ Camera access works on mobile
- ✅ No security warnings
- ✅ Professional look

Just visit the URL on your phone and allow camera permissions!

---

## 🎨 Your App Features

- ✅ Real-time mask detection
- ✅ Object tracking with unique IDs
- ✅ Audio & speech alerts
- ✅ Mobile front/back camera switching
- ✅ Statistics tracking
- ✅ Beautiful modern UI
- ✅ Works on any device

---

## 📦 Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run locally
python app.py

# Access at
http://localhost:5000
```

---

**Developed by Aina** 🚀
