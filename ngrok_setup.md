# 🚀 Quick Setup with Ngrok (2 Minutes!)

## Get your app online instantly for testing/demos

### Step 1: Install Ngrok

**Option A: Download**
- Go to https://ngrok.com/download
- Download for Windows
- Extract and place `ngrok.exe` in your project folder

**Option B: Using pip**
```bash
pip install pyngrok
```

### Step 2: Create Account (Free)
1. Go to https://dashboard.ngrok.com/signup
2. Sign up (free, no credit card)
3. Copy your authtoken from https://dashboard.ngrok.com/get-started/your-authtoken

### Step 3: Configure Ngrok
```bash
ngrok config add-authtoken YOUR_TOKEN_HERE
```

### Step 4: Run Your App
```bash
python app.py
```
Your app will start on `http://localhost:5000`

### Step 5: Create Public URL

**In a new terminal:**
```bash
ngrok http 5000
```

You'll see something like:
```
Forwarding   https://abcd-12-34-567-890.ngrok-free.app -> http://localhost:5000
```

### Step 6: Test on Your Phone!

1. Copy the `https://abcd-12-34-567-890.ngrok-free.app` URL
2. Open it on your phone's browser
3. Allow camera permissions
4. Start detecting! 🎉

---

## ⚡ Quick Command (All in One)

After setup, just run:
```bash
# Terminal 1
python app.py

# Terminal 2
ngrok http 5000
```

---

## 📱 Testing Tips

- **Share with friends**: Send them the ngrok URL
- **Test on multiple devices**: Works on any phone/tablet
- **Switch cameras**: Use the "Switch Camera" button on mobile
- **Demo to clients**: Professional HTTPS URL

---

## ⚠️ Important Notes

- URL changes each time you restart ngrok
- URL expires when you close ngrok/terminal
- Free tier has some limitations (fine for testing)
- Need to keep your computer running

---

## 🎯 Perfect For:

✅ Quick testing on mobile  
✅ Showing to friends/family  
✅ Client demos  
✅ Development testing  
✅ Before deploying to production  

---

**Happy Testing! 🚀**

