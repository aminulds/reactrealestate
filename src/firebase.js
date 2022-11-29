import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQybmo7yZ5NiXxq175XK0guOglqMQVDAM",
  authDomain: "reactrealestate-dab3b.firebaseapp.com",
  projectId: "reactrealestate-dab3b",
  storageBucket: "reactrealestate-dab3b.appspot.com",
  messagingSenderId: "191381607855",
  appId: "1:191381607855:web:5c361e11f9930c26754b5a"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();