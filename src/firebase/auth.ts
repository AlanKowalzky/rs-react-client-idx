import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, PhoneAuthProvider, signInWithPhoneNumber, RecaptchaVerifier, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

// Sprawdzenie czy kod jest wykonywany w przeglądarce
const isBrowser = typeof window !== 'undefined';

// Initialize Firebase tylko po stronie klienta
let app;
let auth: Auth;
let googleProvider: GoogleAuthProvider;
let phoneProvider;

if (isBrowser) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  phoneProvider = new PhoneAuthProvider(auth);
}

// Authentication functions
export const signUp = async (email: string, password: string) => {
  if (!isBrowser) {
    throw new Error('Auth operations are only supported in browser environment');
  }
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = async (email: string, password: string) => {
  if (!isBrowser) {
    throw new Error('Auth operations are only supported in browser environment');
  }
  return signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async () => {
  if (!isBrowser) {
    throw new Error('Auth operations are only supported in browser environment');
  }
  return signInWithPopup(auth, googleProvider);
};

// Phone authentication requires a two-step process
export const setupRecaptcha = (containerOrId: string | HTMLElement) => {
  if (!isBrowser) {
    throw new Error('Auth operations are only supported in browser environment');
  }
  return new RecaptchaVerifier(auth, containerOrId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
    }
  });
};

export const sendPhoneVerification = async (phoneNumber: string, appVerifier: RecaptchaVerifier) => {
  if (!isBrowser) {
    throw new Error('Auth operations are only supported in browser environment');
  }
  return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

export const logOut = async () => {
  if (!isBrowser) {
    throw new Error('Auth operations are only supported in browser environment');
  }
  // Remove auth-token cookie when logging out
  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
  return signOut(auth);
};

export const getCurrentUser = () => {
  if (!isBrowser) {
    return null;
  }
  return auth.currentUser;
};

export { auth, onAuthStateChanged };