'use client';

import { initializeApp, getApps } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import type { Functions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';
import type { FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase is configured
export const isFirebaseConfigured = (): boolean => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  );
};

// Lazy initialization functions
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _functions: Functions | null = null;
let _storage: FirebaseStorage | null = null;

const getFirebaseApp = (): FirebaseApp | null => {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (_app) {
    return _app;
  }

  if (getApps().length === 0) {
    _app = initializeApp(firebaseConfig);
  } else {
    _app = getApps()[0];
  }

  return _app;
};

export const getFirebaseAuth = (): Auth | null => {
  if (_auth) return _auth;
  const app = getFirebaseApp();
  if (!app) return null;
  _auth = getAuth(app);
  return _auth;
};

export const getFirebaseDb = (): Firestore | null => {
  if (_db) return _db;
  const app = getFirebaseApp();
  if (!app) return null;
  _db = getFirestore(app);
  return _db;
};

export const getFirebaseFunctions = (): Functions | null => {
  if (_functions) return _functions;
  const app = getFirebaseApp();
  if (!app) return null;
  _functions = getFunctions(app);

  // Connect to emulators in development
  if (
    typeof window !== 'undefined' &&
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_USE_FUNCTIONS_EMULATOR === 'true'
  ) {
    connectFunctionsEmulator(_functions, 'localhost', 5001);
  }

  return _functions;
};

export const getFirebaseStorage = (): FirebaseStorage | null => {
  if (_storage) return _storage;
  const app = getFirebaseApp();
  if (!app) return null;
  _storage = getStorage(app);
  return _storage;
};

// Legacy exports for backwards compatibility (these will be null if Firebase is not configured)
export const app = null as unknown as FirebaseApp;
export const auth = null as unknown as Auth;
export const db = null as unknown as Firestore;
export const functions = null as unknown as Functions;
export const storage = null as unknown as FirebaseStorage;
