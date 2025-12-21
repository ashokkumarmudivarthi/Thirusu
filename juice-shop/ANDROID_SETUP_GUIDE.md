# 📱 Android App Setup Guide - ThiruSu Juice Shop

Complete guide to convert the React web app into a native Android application using Capacitor.

---

## 🎯 Overview

This guide covers the complete setup of Capacitor to convert your React + Vite web application into a native Android app that can be installed on Android devices and published to Google Play Store.

---

## ✅ Prerequisites

- ✅ Node.js 18+ installed
- ✅ Android Studio installed
- ✅ Java JDK 17+ installed
- ✅ React app built and working

---

## 📦 Installed Packages

```json
{
  "@capacitor/core": "latest",
  "@capacitor/cli": "latest",
  "@capacitor/android": "latest",
  "typescript": "latest" (dev dependency)
}
```

---

## 🛠️ Configuration Files

### 1. `capacitor.config.ts`
Located at: `E:\ThiruSu\juice-shop\capacitor.config.ts`

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.thirusu.juiceshop',
  appName: 'ThiruSu Juice Shop',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true, // Allows HTTP (for local backend development)
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FF6B35',
      showSpinner: true,
      spinnerColor: '#ffffff',
    },
  },
};
```

**Key Settings:**
- `appId`: Unique identifier for your app (com.thirusu.juiceshop)
- `appName`: Display name in Android
- `webDir`: Build output directory (dist)
- `cleartext: true`: Allows HTTP connections (needed for localhost backend during development)

---

### 2. `vite.config.js` Updates
Located at: `E:\ThiruSu\juice-shop\vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // ⚠️ CRITICAL for Capacitor
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
```

**Important:** `base: './'` is required for Capacitor to load assets correctly on mobile.

---

### 3. API URL Configuration
Located at: `E:\ThiruSu\juice-shop\src\services\api.js`

```javascript
const isMobile = () => {
  return window.Capacitor !== undefined;
};

const getApiBaseUrl = () => {
  if (isMobile()) {
    // For development: Use laptop's local IP
    return 'http://192.168.1.100:5000/api';
    // For production: Use deployed backend
    // return 'https://your-backend-domain.com/api';
  }
  return 'http://localhost:5000/api';
};
```

**Mobile Detection:** Automatically switches API URL when running on Android device.

---

## 🏗️ Project Structure After Setup

```
juice-shop/
├── android/              ← NEW: Android native project
│   ├── app/
│   ├── build.gradle
│   └── settings.gradle
├── dist/                 ← Built React app
├── src/                  ← React source code
├── capacitor.config.ts   ← NEW: Capacitor configuration
├── vite.config.js        ← UPDATED for mobile
└── package.json          ← UPDATED with Capacitor packages
```

---

## 📋 Build & Run Commands

### Development Workflow

```bash
# 1. Build React app
npm run build

# 2. Sync changes to Android
npx cap sync android

# 3. Open in Android Studio
npx cap open android
```

### Quick Sync Script
Add to `package.json`:

```json
"scripts": {
  "build": "vite build",
  "android": "npm run build && npx cap sync android",
  "android:open": "npx cap open android"
}
```

Then use:
```bash
npm run android        # Build and sync
npm run android:open   # Open Android Studio
```

---

## 🔧 Finding Your Local IP Address

For development, your Android device needs to access your laptop's backend.

### Windows:
```bash
ipconfig | findstr IPv4
```

Look for: `IPv4 Address. . . . . . . . . . . : 192.168.x.x`

### Update API Configuration:
Replace `192.168.1.100` in `src/services/api.js` with your actual IP:

```javascript
return 'http://YOUR_ACTUAL_IP:5000/api';
```

### Backend CORS Update:
Update `backend/server.js` to allow your mobile IP:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'capacitor://localhost',  // Capacitor iOS
    'http://localhost',       // Capacitor Android
  ],
  credentials: true
}));
```

---

## 📱 Building APK in Android Studio

### Step 1: Open Project
```bash
npx cap open android
```

Wait for Gradle sync to complete (first time takes 5-10 minutes).

### Step 2: Build Debug APK
1. **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Wait for build to complete
3. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 3: Install on Device

**Via USB:**
1. Enable Developer Options on Android phone
2. Enable USB Debugging
3. Connect phone via USB
4. Click **Run** ▶️ in Android Studio
5. Select your device

**Via APK File:**
1. Transfer `app-debug.apk` to phone
2. Install APK (allow unknown sources)
3. Open "ThiruSu Juice Shop" app

---

## 🚀 Production Release Build

### Generate Signed APK

1. **Build → Generate Signed Bundle / APK**
2. Select **APK**
3. Create new keystore:
   - Key store path: `juice-shop-release.jks`
   - Password: [Create strong password]
   - Alias: `thirusu-key`
   - Validity: 25 years
   - Organization: ThiruSu
4. Select **release** build variant
5. Check **V1 and V2 signatures**
6. Build

**Output:** `android/app/release/app-release.apk`

### ⚠️ IMPORTANT: Save Keystore
- Store `juice-shop-release.jks` safely
- Save password securely
- You MUST use same keystore for ALL future updates
- Losing keystore = can't update app on Play Store

---

## 🎨 App Icon & Splash Screen

### App Icon
1. Create icon: 1024x1024 PNG
2. Use Android Asset Studio: https://romannurik.github.io/AndroidAssetStudio/
3. Replace icons in: `android/app/src/main/res/`
   - `mipmap-hdpi/`
   - `mipmap-mdpi/`
   - `mipmap-xhdpi/`
   - `mipmap-xxhdpi/`
   - `mipmap-xxxhdpi/`

### Splash Screen
1. Create splash: 2732x2732 PNG
2. Place in: `android/app/src/main/res/drawable/splash.png`
3. Background color set in `capacitor.config.ts`: `#FF6B35`

---

## 🐛 Common Issues & Solutions

### Issue 1: "cleartext traffic not permitted"
**Solution:** Ensure `cleartext: true` in `capacitor.config.ts`

### Issue 2: API calls fail on mobile
**Solutions:**
1. Check local IP address is correct
2. Ensure backend is running
3. Ensure phone and laptop on same WiFi
4. Check backend CORS allows mobile origin

### Issue 3: White screen on app open
**Solutions:**
1. Check `base: './'` in `vite.config.js`
2. Run `npm run build` before `npx cap sync`
3. Check browser console in Android Studio for errors

### Issue 4: Assets not loading
**Solution:** Run `npx cap sync android` after every build

---

## 📊 Performance Optimization

### Code Splitting
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
        }
      }
    }
  }
})
```

### Lazy Loading Routes
```javascript
const Checkout = lazy(() => import('./pages/Checkout'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
```

---

## 🔌 Useful Capacitor Plugins

```bash
# Push Notifications
npm install @capacitor/push-notifications

# Camera
npm install @capacitor/camera

# Geolocation
npm install @capacitor/geolocation

# Share
npm install @capacitor/share

# Storage
npm install @capacitor/preferences
```

After installing plugins, run: `npx cap sync android`

---

## 🌐 Backend Deployment Options

For production, deploy backend to:

1. **Railway.app** (Free tier)
2. **Render.com** (Free tier)
3. **Heroku** (Paid)
4. **AWS EC2** (Paid)
5. **DigitalOcean** (Paid)

Then update API URL in `src/services/api.js`:
```javascript
return 'https://your-backend.railway.app/api';
```

---

## 📝 Testing Checklist

Before releasing:

- [ ] Test on multiple Android devices (different screen sizes)
- [ ] Test on Android versions 8.0, 10, 12, 13
- [ ] Test all features (login, cart, checkout, orders)
- [ ] Test offline behavior
- [ ] Test app permissions
- [ ] Test deep linking (if implemented)
- [ ] Verify app icon and splash screen
- [ ] Check app performance (load time, responsiveness)
- [ ] Test payment gateway on mobile
- [ ] Verify email functionality works on mobile

---

## 🎯 Next Steps

1. ✅ **Test on Emulator**
   ```bash
   npx cap open android
   # Click Run ▶️ in Android Studio
   ```

2. ✅ **Test on Real Device**
   - Enable USB debugging
   - Connect device
   - Run from Android Studio

3. ✅ **Deploy Backend** (for production)
   - Choose hosting provider
   - Update API URLs
   - Update CORS settings

4. ✅ **Generate Release APK**
   - Create keystore
   - Build signed APK
   - Test release build

5. ✅ **Publish to Play Store**
   - Create developer account ($25 one-time)
   - Prepare store listing
   - Upload APK/AAB
   - Submit for review

---

## 📞 Support & Resources

- **Capacitor Docs**: https://capacitorjs.com/docs
- **Android Studio Guide**: https://developer.android.com/studio
- **Capacitor Forum**: https://forum.ionicframework.com/

---

## 🔄 Regular Update Workflow

```bash
# 1. Make changes to React app
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Test in Android Studio
npx cap open android
# Click Run ▶️

# 4. If everything works, build release APK
# Build → Generate Signed Bundle/APK
```

---

**Setup Completed:** December 21, 2025  
**App ID:** com.thirusu.juiceshop  
**App Name:** ThiruSu Juice Shop

**Ready to build your Android app!** 🚀📱
