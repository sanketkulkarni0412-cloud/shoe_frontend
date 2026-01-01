import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Validate that all variables are present
const missingKeys = Object.entries(firebaseConfig)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

if (missingKeys.length > 0) {
    throw new Error(
        `Firebase initialization failed because the following environment variables are missing: ${missingKeys.join(
            ", "
        )}. Please check your .env.local file.`
    );
}

// Validate that variables are not placeholders
const invalidKeys = Object.entries(firebaseConfig)
    .filter(([_, value]) => value && value.startsWith('replace_with_your_'))
    .map(([key]) => key);

if (invalidKeys.length > 0) {
    throw new Error(
        `Firebase initialization failed because the following environment variables have placeholder values: ${invalidKeys.join(
            ", "
        )}. Please update your .env.local file with real Firebase keys.`
    );
}

// Singleton pattern for Next.js (avoids multiple instance errors during HMR)
let app: FirebaseApp;

if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log('[Firebase] Initialized new app instance');
} else {
    app = getApp();
    console.log('[Firebase] Reused existing app instance');
}

import { getStorage, FirebaseStorage } from "firebase/storage";

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, storage, googleProvider };
