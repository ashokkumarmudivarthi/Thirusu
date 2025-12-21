# 📱 Quick Start - Android App

## ⚡ Fast Track Commands

### Open Android Studio
```bash
npx cap open android
```

### Build & Sync After Changes
```bash
npm run build
npx cap sync android
```

### Your Local IP
**192.168.1.6** - Already configured in code

---

## 🎯 First Time Setup (Already Done ✅)

- ✅ Capacitor installed
- ✅ Android platform added
- ✅ Configuration files created
- ✅ API URLs configured
- ✅ CORS updated for mobile

---

## 📋 What to Do Next

### 1. Open Android Studio
```bash
cd E:\ThiruSu\juice-shop
npx cap open android
```

### 2. Wait for Gradle Sync
- First time takes 5-10 minutes
- Android Studio will download dependencies

### 3. Run on Emulator
1. Click **Device Manager** (phone icon)
2. Create new device (Pixel 6)
3. Click **Run** ▶️ button
4. Select emulator
5. App will launch!

### 4. Run on Real Device
1. Enable Developer Options on phone
2. Enable USB Debugging
3. Connect via USB
4. Click **Run** ▶️
5. Select your device
6. App will install and launch!

---

## 🔧 Important URLs

**Web App:** http://localhost:5173
**Backend:** http://localhost:5000
**Mobile API:** http://192.168.1.6:5000 (uses your local IP)

---

## 📝 Before Testing on Mobile

### Start Backend Server
```bash
cd E:\ThiruSu\juice-shop\backend
npm run dev
```

**Important:** Backend must be running for mobile app to work!

---

## 🐛 Quick Fixes

### App shows white screen?
```bash
npm run build
npx cap sync android
```

### API not working on mobile?
1. Check backend is running
2. Phone and laptop on same WiFi
3. Verify IP: `ipconfig | findstr IPv4`
4. Update IP in `src/services/api.js` if changed

---

## 📂 Project Structure

```
juice-shop/
├── android/              ← Android native project (NEW)
├── dist/                 ← Built React app
├── src/                  ← React source code
├── capacitor.config.ts   ← Capacitor config (NEW)
└── ANDROID_SETUP_GUIDE.md ← Full documentation
```

---

## 🚀 Full Documentation

See **ANDROID_SETUP_GUIDE.md** for:
- Complete setup details
- Building release APK
- Publishing to Play Store
- Troubleshooting
- Performance optimization

---

**Ready to build!** Open Android Studio and click Run ▶️
