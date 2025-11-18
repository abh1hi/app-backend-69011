import { initializeApp } from "firebase/app";

const firebaseConfig: {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
} = {
  apiKey: "AIzaSyCSW-vvYqBZr3gu1oHLPRvKfMKAcQKCctA",
  authDomain: "app-backend-69011.firebaseapp.com",
  projectId: "app-backend-69011",
  storageBucket: "app-backend-69011.firebasestorage.app",
  messagingSenderId: "882368628360",
  appId: "1:882368628360:web:64f3a5d52b7c7aef47013d",
  measurementId: "G-VMVGJXS119"
};

if (window.location.hostname === "localhost") {
  firebaseConfig.authDomain = "localhost";
}

export const firebaseApp = initializeApp(firebaseConfig);
