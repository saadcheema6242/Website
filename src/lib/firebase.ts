import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDM93jSbyt_oa8g3XM78zfGI6mdQeMxU-U",
    authDomain: "luxurycruisetour.firebaseapp.com",
    projectId: "luxurycruisetour",
    storageBucket: "luxurycruisetour.firebasestorage.app",
    messagingSenderId: "561301602587",
    appId: "1:561301602587:web:8f3b4b9bb8077bcb3e53be",
    measurementId: "G-R8RN4H3Y4B"
};

// Initialize Firebase only if no apps exist
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };

