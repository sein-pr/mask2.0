# 🐳 Docker Build & Test Commands

## 🔨 Build Your Docker Image

### Step 1: Open Terminal in Project Directory
```powershell
cd C:\Users\seinp\Documents\mask2.0
```

### Step 2: Build the Image
```powershell
docker build -t maskguard-app .
```

**What this does:**
- `-t maskguard-app` = Tags your image with name "maskguard-app"
- `.` = Builds from current directory (uses Dockerfile)

**Expected output:**
```
[+] Building 120.5s (12/12) FINISHED
 => [1/6] FROM docker.io/library/python:3.9-slim
 => [2/6] WORKDIR /app
 => [3/6] RUN apt-get update && apt-get install...
 => [4/6] COPY requirements.txt .
 => [5/6] RUN pip install --no-cache-dir -r requirements.txt
 => [6/6] COPY . .
 => exporting to image
Successfully tagged maskguard-app:latest
```

⏱️ **First build takes ~5-10 minutes** (downloads Python, installs packages)

---

## 🚀 Run Your Container

### Option 1: Run Normally (foreground)
```powershell
docker run -p 5000:5000 maskguard-app
```

### Option 2: Run in Background (detached)
```powershell
docker run -d -p 5000:5000 --name maskguard maskguard-app
```

**What this does:**
- `-p 5000:5000` = Maps container port 5000 to your PC port 5000
- `-d` = Runs in background (detached mode)
- `--name maskguard` = Names the container "maskguard"

---

## 🧪 Test Your App

1. **Open browser**: http://localhost:5000
2. **Allow camera** permissions
3. **Click anywhere** to enable audio
4. **Start detecting!** 🎭

---

## 📊 Monitor Your Container

### View Logs
```powershell
# If running in foreground: Logs show automatically

# If running in background:
docker logs maskguard

# Follow logs in real-time:
docker logs -f maskguard
```

### Check Container Status
```powershell
docker ps
```

**Expected output:**
```
CONTAINER ID   IMAGE           STATUS         PORTS                    NAMES
abc123def456   maskguard-app   Up 2 minutes   0.0.0.0:5000->5000/tcp   maskguard
```

### View Resource Usage
```powershell
docker stats maskguard
```

---

## 🛑 Stop Your Container

### Stop Container
```powershell
docker stop maskguard
```

### Stop and Remove Container
```powershell
docker stop maskguard
docker rm maskguard
```

### Stop Container Running in Foreground
```
Press Ctrl + C
```

---

## 🔄 Rebuild After Changes

### Quick rebuild:
```powershell
# Stop old container
docker stop maskguard
docker rm maskguard

# Rebuild image
docker build -t maskguard-app .

# Run new container
docker run -d -p 5000:5000 --name maskguard maskguard-app
```

### Force complete rebuild (no cache):
```powershell
docker build --no-cache -t maskguard-app .
```

---

## 🧹 Clean Up

### Remove Container
```powershell
docker rm maskguard
```

### Remove Image
```powershell
docker rmi maskguard-app
```

### Remove All Stopped Containers
```powershell
docker container prune
```

### Remove Unused Images
```powershell
docker image prune -a
```

---

## 🐛 Troubleshooting

### Build fails with "no space left on device"
```powershell
docker system prune -a
```

### Port already in use
```powershell
# Use different port (e.g., 8080)
docker run -p 8080:5000 maskguard-app

# Then visit: http://localhost:8080
```

### Check what's using port 5000
```powershell
netstat -ano | findstr :5000
```

### Access container shell (for debugging)
```powershell
docker exec -it maskguard /bin/bash
```

---

## ✅ Success Checklist

After running `docker run`, you should see:
```
============================================================
MaskGuard Detection System - Starting...
============================================================
Model loaded: models/best.onnx
Server running on: http://0.0.0.0:5000
Debug mode: OFF
Environment: production
============================================================
 * Serving Flask app 'app'
 * Debug mode: off
WARNING: This is a development server. Do not use it in a production deployment.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
```

✅ Visit http://localhost:5000 and test!

---

## 📦 Check Image Size

```powershell
docker images maskguard-app
```

**Expected size:** ~2-3 GB (includes Python, OpenCV, YOLO)

If too large for Back4App:
- Consider smaller YOLO model (yolov8n)
- Or use cloud storage for model file

---

## 🎯 Ready for Deployment?

Once tested locally, push to GitHub and deploy to Back4App!

See `QUICKSTART.md` for deployment steps.

---

**Good luck! 🚀**

