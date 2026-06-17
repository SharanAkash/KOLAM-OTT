# KOLAM App - Manual Connection Guide

## ✅ Current Status

- **APK**: ✅ Installed on emulator
- **Expo Server**: ✅ Running on http://192.168.1.10:8081
- **App**: ✅ Open and showing connection screen

---

## 📱 Connect to Development Server (Manual Steps)

### On Your Emulator Screen:

1. **Look at the emulator** - You should see a screen that says:
   ```
   KOLAM - Tamil Cinema
   Development Build
   ```

2. **You'll see** "DEVELOPMENT SERVERS" section with:
   ```
   KOLAM - Tamil Cinema
   http://192.168.1.10:8081
   ```
   (with a green dot and arrow)

3. **TAP on that entry** (tap anywhere on the "KOLAM - Tamil Cinema" row)

4. **The app will load** - You'll see:
   - Loading spinner
   - Then the KOLAM login screen appears!

---

## 🎯 Expected Result

After tapping, you should see the **Login Screen** with:
- KOLAM logo in gold
- "Dive Back In" title
- Email Address field
- Password field
- "Sign In" button (yellow/gold)
- Google and Apple login buttons

---

## 🧪 Testing Login

Once the login screen appears:

### Option 1: Quick Test (No Real Auth)
Just tap the **"Sign In"** button (even with empty fields) and you'll go to the Home screen.

### Option 2: Fill Fields
1. Tap **Email** field
2. Type: `test@kolam.com`
3. Tap **Password** field  
4. Type: `password123`
5. Tap **Sign In**

---

## 🏠 After Login

You'll see the **Home Screen** with:
- Hero banner showing "VEERAN" movie
- "Watch Now" and "More Info" buttons
- Scrollable movie carousels below
- Bottom navigation (Home, Search, Profile)

### Test Navigation:
- **Scroll** the movie carousels horizontally
- **Tap any movie** to see details
- **Use bottom tabs** to switch between sections
- **Tap Profile** to see user settings

---

## 🔧 If Connection Doesn't Work

### Option 1: Restart Everything
```bash
# Stop everything
pkill -f "expo start"
adb shell am force-stop com.kolam.ott

# Start fresh
cd /Users/sharan.j/kolam-ott/apps/mobile
npx expo start --android --clear

# Then open app on emulator again
```

### Option 2: Rebuild and Reconnect
```bash
# In the app on emulator, tap "Fetch development servers"
# This will scan for available servers
```

### Option 3: Check Logs
```bash
# View Expo server logs
tail -f /tmp/expo-server.log

# View app logs on emulator
adb logcat | grep -i "kolam\|expo\|react"
```

---

## 💡 Quick Tips

### Keyboard Shortcuts (on your computer while emulator is focused):
- **Ctrl + M** - Open developer menu in app
- **R** - Reload app  
- **D** - Open debugger

### Emulator Controls:
- **Scroll**: Click and drag on the screen
- **Tap**: Single click
- **Back**: Use back button (◁) at bottom left
- **Home**: Use home button (⊙) at bottom center

---

## 📸 What You Should See

**Connection Screen:**
```
┌─────────────────────────────────┐
│ KOLAM - Tamil Cinema            │
│ Development Build               │
│                                 │
│ DEVELOPMENT SERVERS             │
│                                 │
│ ● KOLAM - Tamil Cinema       ›  │ ← TAP HERE
│   http://192.168.1.10:8081     │
│                                 │
│ + New development server        │
└─────────────────────────────────┘
```

**Login Screen (after connection):**
```
┌─────────────────────────────────┐
│                                 │
│          KOLAM                  │
│      Dive Back In               │
│                                 │
│  ┌──────────────────────────┐  │
│  │ Email Address            │  │
│  │ name@example.com         │  │
│  └──────────────────────────┘  │
│                                 │
│  ┌──────────────────────────┐  │
│  │ Password     👁           │  │
│  │ ••••••••                 │  │
│  └──────────────────────────┘  │
│                                 │
│  ┌──────────────────────────┐  │
│  │      Sign In             │  │ ← TAP TO LOGIN
│  └──────────────────────────┘  │
│                                 │
│       Or continue with          │
│  ┌──────┐        ┌──────┐      │
│  │Google│        │Apple │      │
│  └──────┘        └──────┘      │
└─────────────────────────────────┘
```

---

## ✅ Success Indicators

You'll know it's working when you see:
1. ✅ Green dot next to server name
2. ✅ App loads with KOLAM branding
3. ✅ Login screen with gold accent colors
4. ✅ Smooth navigation and transitions

---

## 🎬 Ready to Test!

**Your KOLAM app is ready to use in the emulator!**

Just tap on the development server entry and start exploring the app. All features are functional:
- Login flow
- Home with movie carousels  
- Movie details
- Profile management
- Navigation

Have fun testing! 🚀
