# KOLAM Mobile App - Build Instructions

## Overview
React Native mobile application for KOLAM OTT Platform built with Expo.

## Features Implemented
- ✅ Login Screen with social authentication
- ✅ Home Screen with hero section and movie carousels
- ✅ Movie Details Screen with full information
- ✅ Profile Screen with user info and settings
- ✅ Bottom tab navigation
- ✅ Material Design 3 color system
- ✅ Custom typography (Montserrat + Inter)

## Building the APK

### Method 1: Using EAS Build (Cloud Build - Recommended)

1. **Install EAS CLI**
```bash
npm install -g eas-cli
```

2. **Login to Expo**
```bash
eas login
```

3. **Configure Build**
```bash
eas build:configure
```

4. **Build APK**
```bash
eas build --platform android --profile preview
```

The APK will be built in the cloud and you'll get a download link.

### Method 2: Local Build (Requires Android Studio)

1. **Install Android Studio**
   - Download from https://developer.android.com/studio
   - Install Android SDK and NDK

2. **Generate Native Android Project**
```bash
npx expo prebuild --platform android
```

3. **Build APK**
```bash
cd android
./gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

### Method 3: Development Build (For Testing)

1. **Start Expo Dev Server**
```bash
npx expo start
```

2. **Scan QR Code**
   - Install Expo Go app on your Android device
   - Scan the QR code to run the app

## Environment Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Android Studio (for local builds)
- Expo account (for EAS builds)

### Install Dependencies
```bash
npm install
```

## Running the App

### Start Development Server
```bash
npm start
```

### Run on Android Emulator
```bash
npm run android
```

### Run on iOS Simulator (Mac only)
```bash
npm run ios
```

## Project Structure

```
src/
├── screens/
│   ├── HomeScreen.tsx          # Main home with carousels
│   ├── LoginScreen.tsx         # Authentication
│   ├── MovieDetailScreen.tsx   # Movie information
│   ├── ProfileScreen.tsx       # User profile
│   └── SearchScreen.tsx        # Search (placeholder)
└── theme/
    ├── colors.ts               # Material Design 3 colors
    └── typography.ts           # Font styles
```

## Design System

### Colors
- Primary: #FFD700 (Gold)
- Surface: #131313 (Dark)
- On Surface: #E5E2E1 (Light text)

### Typography
- Display: Montserrat 700, 32-48px
- Headline: Montserrat 600, 24px
- Body: Inter 400, 16-18px
- Label: Inter 600, 12px

## Configuration

### App Configuration (app.json)
- App Name: KOLAM - Tamil Cinema
- Bundle ID: com.kolam.ott
- Version: 1.0.0
- Permissions: INTERNET

### Build Configuration (eas.json)
- Preview builds: APK format
- Production builds: APK/AAB format

## Troubleshooting

### Build Fails
- Make sure Android SDK is installed
- Check Java version (JDK 17 required)
- Run `npx expo doctor` to check setup

### Dependencies Issues
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

### Font Loading Issues
- Fonts are loaded via @expo-google-fonts
- Wait for fonts to load before rendering

## Next Steps

1. **Backend Integration**
   - Connect to API endpoints
   - Implement real authentication
   - Fetch movie data from database

2. **Video Playback**
   - Add expo-av or react-native-video
   - Implement video player controls
   - Add subtitle support

3. **Offline Mode**
   - Download movies for offline viewing
   - Cache movie data
   - Sync watchlist

4. **Push Notifications**
   - New content alerts
   - Subscription reminders
   - Personalized recommendations

5. **Analytics**
   - Track user behavior
   - Monitor playback quality
   - Measure engagement

## Distribution

### Internal Testing
- Build APK with `eas build --profile preview`
- Share download link with testers

### Google Play Store
1. Build AAB with `eas build --profile production`
2. Create Google Play Console account
3. Upload AAB and complete store listing
4. Submit for review

## Support

For build issues:
- Check Expo documentation: https://docs.expo.dev
- Android Studio guide: https://developer.android.com

## License
Proprietary - All rights reserved
