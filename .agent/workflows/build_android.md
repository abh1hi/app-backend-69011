---
description: Build the Android APK (Debug)
---

This workflow builds the web assets, syncs them to the Android project, and compiles the debug APK.

1. Build the web application
// turbo
npm run build

2. Sync web assets to Capacitor Android project
// turbo
npx cap sync android

3. Build the native Android APK using Gradle
// turbo
cd android && ./gradlew assembleDebug

4. Verify the APK was created
// turbo
dir android\app\build\outputs\apk\debug\app-debug.apk
