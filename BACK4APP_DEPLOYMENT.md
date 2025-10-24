# 🚀 Back4App Deployment Guide

Deploy your MaskGuard Detection System to Back4App with Docker.

---

## 📋 Prerequisites

1. **Back4App Account** - [Sign up free](https://www.back4app.com/)
2. **GitHub Account** - For code repository
3. **Dockerfile** - ✅ Already created!

---

## 🎯 Deployment Steps

### Step 1: Push Your Code to GitHub

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit for Back4App deployment"
```

2. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Name: `maskguard-detection`
   - Visibility: Private (recommended for your app)
   - Don't initialize with README (you already have one)

3. **Push your code**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/maskguard-detection.git
git branch -M main
git push -u origin main
```

---

### Step 2: Deploy on Back4App

1. **Login to Back4App**:
   - Go to [Back4App Dashboard](https://www.back4app.com/)
   - Click "Build new app"

2. **Connect GitHub**:
   - Select "Launch using Containers"
   - Connect your GitHub account
   - Select your `maskguard-detection` repository
   - Select `main` branch

3. **Configure Container**:
   - **Dockerfile**: Automatically detected ✅
   - **Port**: `5000` (default)
   - **Region**: Choose closest to you
   - **Plan**: Free tier (1 container, 512MB RAM)

4. **Environment Variables** (if needed):
   - No special env vars needed for basic setup
   - Back4App will automatically set `PORT` if needed

5. **Deploy**:
   - Click "Create App"
   - Wait for build (~5-10 minutes)
   - Your app will be live at: `https://YOUR_APP_NAME.back4app.io`

---

## 🎯 Important Notes

### ⚠️ Model Size Warning

Your YOLO model (`models/best.onnx`) must be **< 500MB** for smooth deployment.

**Check your model size**:
```bash
ls -lh models/best.onnx
```

If it's too large:
- Consider using a smaller YOLO model (yolov8n instead of yolov8l)
- Or store the model in cloud storage (S3, Google Cloud) and download on startup

---

### 📱 Camera Access

Your app uses **client-side camera**, so:
- ✅ Works on mobile devices
- ✅ Works on desktops
- ✅ HTTPS provided by Back4App (required for camera)

Users just need to **allow camera permissions** in their browser.

---

### 🔧 Troubleshooting

**Build fails?**
1. Check Dockerfile syntax
2. Verify `requirements.txt` has all dependencies
3. Check Back4App logs for specific errors

**App crashes?**
1. Check memory usage (free tier = 512MB)
2. YOLO model might be too large
3. View logs in Back4App dashboard

**Camera not working?**
1. Ensure HTTPS is enabled (Back4App does this automatically)
2. User must grant camera permissions
3. Click anywhere on page to enable audio (browser requirement)

---

## 🎉 After Deployment

1. **Test your app**:
   - Visit: `https://YOUR_APP_NAME.back4app.io`
   - Allow camera permissions
   - Click anywhere to enable audio
   - Start detecting! 🎭

2. **Share your app**:
   - Share the URL with anyone
   - Works on any device with a camera
   - No installation needed!

---

## 💰 Pricing

**Free Tier Includes**:
- 1 container
- 512MB RAM
- Shared CPU
- 1GB bandwidth/month
- Perfect for testing & personal projects!

**If you need more**:
- Upgrade to paid plans for more resources
- Or consider alternatives like Railway, Render

---

## 🔄 Updates

To update your deployed app:

```bash
git add .
git commit -m "Update description"
git push origin main
```

Back4App will **automatically rebuild** and redeploy! 🎉

---

## 🆘 Need Help?

- [Back4App Documentation](https://www.back4app.com/docs)
- [Back4App Community](https://community.back4app.com/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Good luck with your deployment! 🚀**

