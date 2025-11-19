import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.apnaaashiyanaa.app',
  appName: 'Apna Aashiyanaa',
  webDir: 'dist',
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com', 'phone'],
      // Using the correct NATIVE Android API Key and App ID from google-services.json
      projectId: "app-backend-69011",
      apiKey: "AIzaSyC2nWUA5x2PWz7M8zJsXq6KTZQJmmTHGWI", // Corrected API Key
      authDomain: "app-backend-69011.firebaseapp.com",
      storageBucket: "app-backend-69011.firebasestorage.app",
      messagingSenderId: "882368628360",
      appId: "1:882368628360:android:d51432d7a6ed557747013d", // Corrected App ID for Android
    },
  },
};

export default config;
