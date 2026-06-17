# KOLAM App - Emulator Quick Guide

## ✅ App Successfully Installed!

Your KOLAM app is now installed and running on the Android emulator!

---

## 📱 How to Access the App

### Open the App:
1. **Look at your emulator screen** - the app should be launching
2. **Or tap the KOLAM icon** in the app drawer
3. **Or run this command:**
   ```bash
   adb shell am start -n com.kolam.ott/.MainActivity
   ```

### App Package Details:
- **Package Name:** com.kolam.ott
- **Activity:** MainActivity
- **Device:** emulator-5554

---

## 🎮 Emulator Controls

### Useful ADB Commands:

**Launch the app:**
```bash
adb shell am start -n com.kolam.ott/.MainActivity
```

**View app logs (for debugging):**
```bash
adb logcat | grep -i kolam
```

**Uninstall app:**
```bash
adb uninstall com.kolam.ott
```

**Reinstall app:**
```bash
adb install -r /Users/sharan.j/kolam-ott/apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

**Take screenshot:**
```bash
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png
```

**Record video:**
```bash
adb shell screenrecord /sdcard/demo.mp4
# Press Ctrl+C to stop, then:
adb pull /sdcard/demo.mp4
```

---

## 🔧 Troubleshooting

### If app doesn't appear:
```bash
# Check if installed
adb shell pm list packages | grep kolam

# Force stop and restart
adb shell am force-stop com.kolam.ott
adb shell am start -n com.kolam.ott/.MainActivity
```

### If emulator is not detected:
```bash
# List all devices
adb devices

# If no devices, restart adb
adb kill-server
adb start-server
adb devices
```

### If app crashes:
```bash
# View crash logs
adb logcat *:E

# Or filter for your app
adb logcat | grep "com.kolam.ott"
```

### To clear app data:
```bash
adb shell pm clear com.kolam.ott
```

---

## 📸 Emulator Navigation

**In the emulator:**
- **Back button** - Bottom left (◁)
- **Home button** - Bottom center (⊙)
- **Recent apps** - Bottom right (▢)
- **App drawer** - Swipe up from bottom
- **Power menu** - Right side panel

**Keyboard shortcuts:**
- `Ctrl + M` - Menu
- `Ctrl + F11` - Rotate left
- `Ctrl + F12` - Rotate right
- `Ctrl + H` - Home button
- `Ctrl + K` - Power button

---

## 🎯 Testing the App

### Test Flow:
1. **Login Screen** appears first
   - Test email/password fields
   - Check Google/Apple buttons (UI only)
   
2. **Tap "Sign In"** to access main app
   
3. **Home Screen** with:
   - Hero banner movie
   - Scrollable movie carousels
   - Bottom navigation tabs
   
4. **Tap any movie** to see details
   
5. **Bottom tabs:**
   - Home - Main screen
   - Search - Coming soon
   - Profile - User settings

---

## 🚀 Quick Commands Cheat Sheet

```bash
# Install APK
adb install app-debug.apk

# Launch app
adb shell am start -n com.kolam.ott/.MainActivity

# View logs
adb logcat | grep kolam

# Uninstall
adb uninstall com.kolam.ott

# Screenshot
adb shell screencap -p /sdcard/screen.png && adb pull /sdcard/screen.png

# Check app info
adb shell dumpsys package com.kolam.ott
```

---

## 📱 App Features to Test

✅ **Login Screen:**
- Email/password inputs
- Show/hide password toggle
- Forgot password link
- Social login buttons

✅ **Home Screen:**
- Hero banner with movie
- Watch Now / More Info buttons
- Horizontal scrolling carousels
- Movie thumbnails with ratings

✅ **Movie Details:**
- Movie backdrop image
- Rating and metadata
- Genre tags
- Cast information
- Action buttons

✅ **Profile Screen:**
- User avatar
- Gold Member badge
- Menu options
- Sign out button

✅ **Navigation:**
- Bottom tabs work
- Back button navigation
- Screen transitions

---

## 💡 Tips

1. **First launch may be slow** - React Native needs to bundle JavaScript
2. **Internet required** - Images load from URLs
3. **Backend not connected** - Using mock data currently
4. **Debug mode** - Shake device for developer menu (Ctrl+M on emulator)

---

## 🎬 Ready to Test!

Your KOLAM app is now running in the emulator. Explore all the features and test the UI!

**Current Status:** ✅ Installed and Running
**Emulator:** emulator-5554
**Package:** com.kolam.ott

Enjoy testing your app! 🚀
