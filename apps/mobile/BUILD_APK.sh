#!/bin/bash

# KOLAM Mobile App - APK Build Script
# This script builds the Android APK for the KOLAM OTT mobile app

echo "==================================="
echo "KOLAM Mobile App - APK Builder"
echo "==================================="
echo ""

# Check if we're in the right directory
if [ ! -f "app.json" ]; then
    echo "❌ Error: Please run this script from the mobile app directory"
    echo "   cd /Users/sharan.j/kolam-ott/apps/mobile"
    exit 1
fi

# Check Java version
echo "📋 Checking Java version..."
java -version 2>&1 | head -1

JAVA_VERSION=$(java -version 2>&1 | head -1 | cut -d'"' -f2 | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt "17" ]; then
    echo "⚠️  Warning: Java 17+ required. Current: Java $JAVA_VERSION"
    echo "   Install Java 17: brew install openjdk@17"
    echo "   Then set JAVA_HOME: export JAVA_HOME=\$(/usr/libexec/java_home -v 17)"
fi

echo ""
echo "🔨 Building Android APK..."
echo ""

cd android

# Build debug APK (unsigned, for testing)
echo "📦 Building debug APK..."
./gradlew assembleDebug

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📱 APK Location:"
    echo "   android/app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    echo "📲 To install on device:"
    echo "   adb install app/build/outputs/apk/debug/app-debug.apk"
    echo ""
else
    echo ""
    echo "❌ Build failed. Common issues:"
    echo "   1. Java 17+ not installed"
    echo "   2. Android SDK not configured"
    echo "   3. Missing dependencies"
    echo ""
    echo "💡 Try building with Expo EAS instead:"
    echo "   npm install -g eas-cli"
    echo "   eas login"
    echo "   eas build --platform android --profile preview"
    echo ""
fi
