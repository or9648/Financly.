// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrF1hETwDbiLdz4Z2DqNtvtBy3mdBYedo",
  authDomain: "finance-tracker-4c643.firebaseapp.com",
  projectId: "finance-tracker-4c643",
  storageBucket: "finance-tracker-4c643.appspot.com",
  messagingSenderId: "673549464584",
  appId: "1:673549464584:web:6718f3a81e684cdf390dbd",
  measurementId: "G-10HVH24FCD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app); // Authentication service
const db = getFirestore(app); // Firestore database
const googleProvider = new GoogleAuthProvider(); // Google authentication provider

// Export services for use in other files
export { app, auth, db, googleProvider };
