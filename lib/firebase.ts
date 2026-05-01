import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Only validate and initialize on the client side or when env vars are present.
// This prevents build-time crashes during server-side static page generation.
const isMissingConfig = Object.values(firebaseConfig).some((v) => !v);

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let googleProvider: GoogleAuthProvider;

if (!isMissingConfig) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig as Record<string, string>);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    googleProvider = new GoogleAuthProvider();
} else if (typeof window !== "undefined") {
    // Only throw on the client side — server build gets a graceful skip
    throw new Error(
        `Firebase: missing env vars. Please set all NEXT_PUBLIC_FIREBASE_* variables in your Vercel project settings.`
    );
}

export { auth, db, storage, googleProvider };

