// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_PORTFOLIO,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN_PORTFOLIO,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID_PORTFOLIO,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET_PORTFOLIO,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_USER_ID_PORTFOLIO,
  appId: process.env.NEXT_PUBLIC_APP_ID_PORTFOLIO,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID_PORTFOLIO,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
