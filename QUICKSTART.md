# 🚀 Back4App Quick Deployment

## ⚡ 3-Step Deployment

### 1️⃣ Push to GitHub
```bash
git init
git add .
git commit -m "Ready for Back4App deployment"

# Create repo at: https://github.com/new
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/maskguard.git
git branch -M main
git push -u origin main
```

### 2️⃣ Deploy on Back4App
1. Go to [Back4App Dashboard](https://www.back4app.com/)
2. Click **"Build new app"** → **"Launch using Containers"**
3. Connect GitHub → Select your repo → Select `main` branch
4. **Port**: `5000` (auto-detected from Dockerfile)
5. Click **"Create App"**

### 3️⃣ Done! 🎉
- Wait ~5-10 minutes for build
- Your app will be live at: `https://YOUR_APP_NAME.back4app.io`
- Test on mobile & desktop!

---

## 📱 Testing Your Live App

1. Visit your Back4App URL
2. **Allow camera permissions**
3. **Click anywhere** on the page (to enable audio)
4. Start detecting masks! 🎭

---

## ⚠️ Important Checks

**Before deploying, verify:**

✅ **Model size**: Check `models/best.onnx` is < 500MB
```bash
ls -lh models/best.onnx
```

✅ **Required files**:
- ✅ `Dockerfile`
- ✅ `requirements.txt`
- ✅ `app.py`
- ✅ `models/best.onnx`
- ✅ `static/` folder
- ✅ `templates/` folder

---

## 🔄 Updating Your App

```bash
# Make changes to your code
git add .
git commit -m "Update description"
git push origin main
```

Back4App **auto-deploys** on push! 🚀

---

## 🆘 Troubleshooting

**Build fails?**
- Check [Back4App logs](https://dashboard.back4app.com/)
- Verify all files are pushed to GitHub
- Check `Dockerfile` syntax

**App crashes?**
- Model might be too large (>500MB)
- Check memory usage (free tier = 512MB RAM)

**Camera not working?**
- Back4App provides HTTPS automatically ✅
- User must allow camera permissions
- Click page to enable audio

---

## 📖 Full Guide

See `BACK4APP_DEPLOYMENT.md` for detailed instructions and troubleshooting.

---

**Good luck! 🎉**

