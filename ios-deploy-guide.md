# Guide: Deploying Your Vue.js App to iOS with Capacitor

This guide provides step-by-step instructions to take your Vue.js web application and convert it into a native iOS application using Capacitor.

## Prerequisites

1.  **macOS Computer**: You can only build iOS apps on a Mac.
2.  **Xcode**: Install the latest version of Xcode from the Mac App Store.
3.  **Command Line Tools**: Open Terminal and run `xcode-select --install`.
4.  **Homebrew**: If not installed, run: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`.
5.  **CocoaPods**: This is an iOS dependency manager. Install it by running: `sudo gem install cocoapods`.

---

## Step 1: Install Capacitor CLI

First, install the Capacitor command-line interface and core packages into your project as development dependencies.

```bash
npm install @capacitor/cli @capacitor/core --save-dev
```

---

## Step 2: Initialize Capacitor

Next, initialize Capacitor in your project. This will create the `capacitor.config.ts` file, which is the main configuration file for Capacitor.

```bash
npx cap init
```

The CLI will prompt you for a few details:
*   **App Name**: Enter the name of your app (e.g., `Real Estate App`).
*   **App ID**: This is a unique identifier for your app, typically in reverse domain name notation (e.g., `com.company.appname`). **This is very important for iOS.**

---

## Step 3: Configure `capacitor.config.ts`

Open the newly created `capacitor.config.ts` file. For a Vite project, you must set the `webDir` property to `"dist"`. This tells Capacitor where your built web assets are located.

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.realestate', // Make sure this is correct
  appName: 'Real Estate App',
  webDir: 'dist', // Important for Vite builds
  server: {
    androidScheme: 'https'
  }
};

export default config;
```

---

## Step 4: Add the iOS Platform

Now, you can add the native iOS platform to your project.

```bash
npm install @capacitor/ios
npx cap add ios
```

This command will create an `ios` directory in your project's root. This directory contains a native Xcode project.

---

## Step 5: Build Your Vue App

Before you can run the app on iOS, you need to create a production build of your Vue application.

```bash
npm run build
```

---

## Step 6: Sync Your Project

The `sync` command is your most-used command. It updates your native iOS project with your web code and any new Capacitor plugins you've installed.

Run this command **every time you make changes to your web code**.

```bash
npx cap sync
```

---

## Step 7: Configure Firebase for iOS

Since your project uses Firebase, you need to configure it for the iOS app.

1.  **Create a Firebase Project**: If you haven't already, go to the [Firebase Console](https://console.firebase.google.com/) and create a new project or use your existing one.

2.  **Add an iOS App**:
    *   In your Firebase project dashboard, click the iOS+ icon to "Add app".
    *   **Apple bundle ID**: Enter the same App ID you used in `capacitor.config.ts` (e.g., `com.yourcompany.realestate`).
    *   **App nickname (optional)**: An internal-facing name for your app.
    *   Click **Register app**.

3.  **Download Config File**:
    *   Click **Download GoogleService-Info.plist** to get your Firebase configuration file.

4.  **Add Config File to Xcode**:
    *   Open your native iOS project in Xcode:
        ```bash
        npx cap open ios
        ```
    *   In Xcode, right-click the `App` folder (the one inside the top-level `App` project folder) and select **Add Files to "App"**.
    *   Select the `GoogleService-Info.plist` file you just downloaded.
    *   When the options dialog appears, make sure that **Copy items if needed** is checked and that your app's target is selected in the **Add to targets** box.

---

## Step 8: Configure Authentication Plugin for iOS

Your Android configuration shows you are using `capacitor-firebase-authentication`. To make it work on iOS, you need to add a custom URL scheme. This allows the app to handle the redirect back from the Firebase authentication page.

1.  **Find the REVERSED_CLIENT_ID**:
    *   Open the `GoogleService-Info.plist` file you added to Xcode.
    *   Find the key `REVERSED_CLIENT_ID` and copy its string value. It will look something like `com.googleusercontent.apps.xxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx`.

2.  **Add URL Scheme in Xcode**:
    *   In Xcode, select your project in the left-hand navigator.
    *   Select the **App** target from the central column.
    *   Go to the **Info** tab.
    *   Expand the **URL Types** section at the bottom. If it doesn't exist, right-click anywhere and choose "Add Row", then type "URL Types".
    *   Click the **+** button to add a new URL type.
    *   In the **URL Schemes** input box, paste the `REVERSED_CLIENT_ID` value you copied.

---

## Step 9: Run Your App in Xcode

1.  **Select a Target**: In the top bar of Xcode, select your app and choose an iOS Simulator (e.g., "iPhone 15 Pro") or a physically connected iPhone.
2.  **Run the App**: Click the "Run" button (the play icon) or press `Cmd+R`.

Xcode will build and run your application on the selected simulator or device.

---

## Step 10: Automating Builds with GitHub Actions (CI/CD)

Setting up a Continuous Integration and Continuous Deployment (CI/CD) pipeline automates the process of building and testing your application. This ensures that every change you push to your GitHub repository is automatically built, saving you manual effort and time.

### 1. Create the Workflow Directory

First, create the necessary directory structure in your project's root. GitHub Actions workflows are defined in `.yml` files inside the `.github/workflows` directory.

```bash
mkdir -p .github/workflows
```

### 2. Create the Workflow File

Create a new file named `build-ios.yml` inside the `.github/workflows` directory.

```yaml
name: Build iOS App

on:
  push:
    branches: [ "main" ] # Triggers the workflow on pushes to the main branch
  pull_request:
    branches: [ "main" ] # Also triggers on pull requests to main

jobs:
  build-ios:
    runs-on: macos-latest # iOS builds must run on a macOS runner

    steps:
    - name: Checkout Repository
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20' # Match your project's Node.js version
        cache: 'npm'

    - name: Install npm Dependencies
      run: npm install

    - name: Build Vue.js Web App
      run: npm run build

    - name: Install Capacitor Dependencies and Sync
      run: |
        npm install @capacitor/cli @capacitor/core @capacitor/ios
        npx cap sync

    - name: Set up Xcode
      uses: maxim-lobanov/setup-xcode@v1
      with:
        xcode-version: '15.0' # Specify a version of Xcode

    - name: Install CocoaPods Dependencies
      run: pod install
      working-directory: ./ios/App

    - name: Build Xcode Project
      run: |
        xcodebuild -workspace ./ios/App/App.xcworkspace \
                   -scheme App \
                   -destination 'generic/platform=iOS' \
                   -archivePath $PWD/build/App.xcarchive \
                   archive
      working-directory: ./ios

    - name: Upload Build Artifact
      uses: actions/upload-artifact@v3
      with:
        name: ios-app
        path: ./ios/build/App.xcarchive
```

### 3. Handling Code Signing for iOS

To build and archive a native iOS app, the runner needs access to your Apple Developer signing certificate and provisioning profile.

1.  **Export Your Signing Certificate**:
    *   On your Mac, open the **Keychain Access** app.
    *   Find your developer certificate (e.g., "Apple Distribution: Your Name (XXXXXXXXXX)").
    *   Right-click and choose **Export**. Save it as a `.p12` file. **You must set a password.**

2.  **Get Your Provisioning Profile**:
    *   Go to the [Apple Developer Portal](https://developer.apple.com/account/resources/profiles/list).
    *   Download the provisioning profile for your app. It will have a `.mobileprovision` extension.

3.  **Create Base64 Encoded Versions**:
    *   You need to convert these files into Base64 strings to store them as GitHub Secrets.
    *   **For the certificate (`.p12`):**
        ```bash
        base64 -i your_certificate.p12 | pbcopy
        ```
    *   **For the provisioning profile (`.mobileprovision`):**
        ```bash
        base64 -i your_profile.mobileprovision | pbcopy
        ```

4.  **Add to GitHub Secrets**:
    *   In your GitHub repository, go to **Settings > Secrets and variables > Actions**.
    *   Click **New repository secret** and add the following:
        *   `IOS_SIGNING_KEY`: Paste the Base64 content of your `.p12` certificate.
        *   `IOS_SIGNING_KEY_PASSWORD`: The password you set for the `.p12` file.
        *   `IOS_PROVISIONING_PROFILE`: Paste the Base64 content of your `.mobileprovision` file.
        *   `IOS_TEAM_ID`: Your Apple Developer Team ID.

### 4. Update the Workflow for Code Signing

Add a step to your `build-ios.yml` file to import the certificate and provisioning profile before the build step.

```yaml
    # ... previous steps

    - name: Install CocoaPods Dependencies
      run: pod install
      working-directory: ./ios/App

    - name: Install Apple Certificate and Provisioning Profile
      env:
        IOS_SIGNING_KEY: ${{ secrets.IOS_SIGNING_KEY }}
        IOS_SIGNING_KEY_PASSWORD: ${{ secrets.IOS_SIGNING_KEY_PASSWORD }}
        IOS_PROVISIONING_PROFILE: ${{ secrets.IOS_PROVISIONING_PROFILE }}
        IOS_TEAM_ID: ${{ secrets.IOS_TEAM_ID }}
      run: |
        # Create a temporary keychain
        security create-keychain -p "" build.keychain
        security default-keychain -s build.keychain
        security unlock-keychain -p "" build.keychain
        
        # Import the certificate
        echo $IOS_SIGNING_KEY | base64 --decode > certificate.p12
        security import certificate.p12 -k build.keychain -P $IOS_SIGNING_KEY_PASSWORD -T /usr/bin/codesign
        
        # Install the provisioning profile
        mkdir -p ~/Library/MobileDevice/Provisioning\\ Profiles
        echo $IOS_PROVISIONING_PROFILE | base64 --decode > ~/Library/MobileDevice/Provisioning\\ Profiles/app.mobileprovision
        
    - name: Build Xcode Project
      run: |
        xcodebuild -workspace ./ios/App/App.xcworkspace \
                   -scheme App \
                   -destination 'generic/platform=iOS' \
                   -archivePath $PWD/build/App.xcarchive \
                   "CODE_SIGN_IDENTITY=Apple Distribution" \
                   "PROVISIONING_PROFILE_SPECIFIER=app.mobileprovision" \
                   "DEVELOPMENT_TEAM=${{ secrets.IOS_TEAM_ID }}" \
                   archive
      working-directory: ./ios
      
    # ... upload artifact step
```

### 5. Push and Run

Commit and push the `.github/workflows/build-ios.yml` file to your repository. This will trigger the workflow, and you can monitor its progress in the "Actions" tab of your GitHub repository.

If successful, the built `.xcarchive` file will be available as a downloadable artifact in the workflow summary. You can use this archive to upload to the App Store Connect.

---

## Development Workflow

Remember this cycle for future development:

1.  Make changes in your Vue.js code (`src` directory).
2.  Build the web app: `npm run build`.
3.  Sync with Capacitor: `npx cap sync`.
4.  Run from Xcode to see the changes on your device/simulator.

Congratulations! You now have a native iOS version of your application.
