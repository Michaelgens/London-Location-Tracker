import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace these with your Firebase config values
const firebaseConfig = {
    apiKey: "AIzaSyAyx9AvQ30dENvYM1pJ1ZqTivtsSR1ukEQ",
    authDomain: "london-congestion-checker.firebaseapp.com",
    projectId: "london-congestion-checker",
    storageBucket: "london-congestion-checker.firebasestorage.app",
    messagingSenderId: "703249187051",
    appId: "1:703249187051:web:14d92dc04ee59688f9beae",
    measurementId: "G-3WSMRN8KP1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google Auth Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
}); 