import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.apnaaashiyanaa.app',
  appName: 'Apna Aashiyanaa',
  webDir: 'dist',
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ["google.com"],
    },
    CapacitorFirebaseAuth: {
      providers: ["google.com"],
      languageCode: "en",
      nativeAuth: false,
      properties: {
        projectId: "app-backend-69011",
        apiKey: "AIzaSyCSW-vvYqBZr3gu1oHLPRvKfMKAcQKCctA",
        authDomain: "app-backend-69011.firebaseapp.com",
        storageBucket: "app-backend-69011.firebasestorage.app",
        messagingSenderId: "882368628360",
        appId: "1:882368628360:web:64f3a5d52b7c7aef47013d",
        measurementId: "G-VMVGJXS119"
      }
    }
  },
};

export default config;
