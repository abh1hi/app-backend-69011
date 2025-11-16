import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSW-vvYqBZr3gu1oHLPRvKfMKAcQKCctA",
  authDomain: "app-backend-69011.firebaseapp.com",
  projectId: "app-backend-69011",
  storageBucket: "app-backend-69011.firebasestorage.app",
  messagingSenderId: "882368628360",
  appId: "1:882368628360:web:64f3a5d52b7c7aef47013d",
  measurementId: "G-VMVGJXS119"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { auth, db, storage, analytics };
