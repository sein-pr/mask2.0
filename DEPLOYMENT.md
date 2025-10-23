# MaskGuard - Deployment Guide

## 🚀 Deploying to Render

### Prerequisites
- A [Render](https://render.com) account (free tier available)
- Git repository with your code
- Your YOLO model file (`models/best.onnx`)

### Step-by-Step Deployment

#### 1. Prepare Your Repository

Make sure your repository includes:
- ✅ `app.py` - Flask application
- ✅ `requirements.txt` - Python dependencies
- ✅ `Procfile` - Tells Render how to run your app
- ✅ `models/best.onnx` - Your YOLO model
- ✅ `static/` and `templates/` folders

#### 2. Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit for Render deployment"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/maskguard.git

# Push to GitHub
git push -u origin main
```

**Note:** Your `models/best.onnx` file might be too large for GitHub (>100MB). If so:
- Use Git LFS: `git lfs track "*.onnx"`
- Or upload the model separately to Render

#### 3. Deploy on Render

1. **Go to [Render Dashboard](https://dashboard.render.com)**

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository**

4. **Configure the service:**
   - **Name:** `maskguard` (or your preferred name)
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Instance Type:** Free (or paid for better performance)

5. **Add Environment Variables** (if needed):
   - Click "Advanced"
   - Add any custom environment variables

6. **Click "Create Web Service"**

7. **Wait for deployment** (5-10 minutes)

#### 4. Upload Your Model (if > 100MB)

If your model is too large for Git:

1. After deployment, go to your service
2. Click "Shell" tab
3. Upload model using Render's file upload or:
   ```bash
   # Download from a URL
   wget YOUR_MODEL_URL -O models/best.onnx
   ```

### 📱 Mobile Access

Once deployed, your app will be accessible at:
```
https://your-service-name.onrender.com
```

**Features:**
- ✅ Works on **mobile phones** (iOS/Android)
- ✅ Accesses **phone camera** through browser
- ✅ **Front and back camera** switching
- ✅ Real-time mask detection
- ✅ Audio alerts
- ✅ Speech warnings

### 🎥 How It Works

1. **Browser** requests camera access
2. **Client-side JavaScript** captures video frames
3. Frames sent to **Render server**
4. **YOLO model** processes frames
5. **Annotated frames** returned to browser
6. Results displayed in real-time

### 🔧 Troubleshooting

#### Camera Permission Denied
- Users must **allow camera access** in browser
- On mobile, use **HTTPS** (Render provides this automatically)

#### Slow Performance
- Free tier may be slow
- Upgrade to paid instance for better performance
- Reduce FPS in `static/js/camera.js` (line 9: `this.fps = 10;`)

#### Model Not Found Error
- Ensure `models/best.onnx` is uploaded
- Check file path is correct: `models/best.onnx`

#### Out of Memory
- Large model + multiple requests = memory issues
- Upgrade to larger instance
- Or reduce model size

### 💡 Tips

- **Free Tier:** Spins down after inactivity (30 seconds to wake up)
- **Performance:** Consider paid tier for production use
- **Security:** Add authentication if needed
- **Monitoring:** Check Render logs for errors

### 🌐 Custom Domain

To use your own domain:
1. Go to service settings
2. Click "Custom Domains"
3. Add your domain
4. Update DNS records as instructed

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

## 🎨 Features

- ✅ Real-time mask detection
- ✅ Object tracking with unique IDs
- ✅ Audio & speech alerts
- ✅ Mobile-friendly interface
- ✅ Front/back camera switching
- ✅ Statistics tracking
- ✅ Beautiful modern UI

---

**Developed by Aina** 🚀

