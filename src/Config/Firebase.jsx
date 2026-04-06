// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBdJRw4exNc7Vuy1dv8QbUklco7pI2Mo4g",
  authDomain: "kenyskitchen-b6e31.firebaseapp.com",
  projectId: "kenyskitchen-b6e31",
  storageBucket: "kenyskitchen-b6e31.firebasestorage.app",
  messagingSenderId: "339860998871",
  appId: "1:339860998871:web:f1e6a77ef6665bfaaa7e92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app)   
export const storage = getStorage(app)                