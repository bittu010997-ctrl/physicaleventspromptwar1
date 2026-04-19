import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD_XnQMi55Hjk796da8lkcvyzInMjTakl8",
  authDomain: "physicaleventpromptwar1.firebaseapp.com",
  projectId: "physicaleventpromptwar1",
  storageBucket: "physicaleventpromptwar1.firebasestorage.app",
  messagingSenderId: "935582442080",
  appId: "1:935582442080:web:ab66662db73b29d8289905",
  measurementId: "G-B6PHYW7G21"
};

let app: any, db: any, auth: any;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  if (typeof window !== "undefined") {
    getAnalytics(app);
  }
} catch (error) {
  console.warn("Firebase initialization failed. Using mock DB.", error);
}

// Service to manage chat history
export const chatService = {
  async loadHistory(uid: string) {
    if (!db) return getMockHistory(uid);
    try {
      const docRef = doc(db, 'users', uid, 'chat', 'history');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data().messages || [];
      }
      return [];
    } catch (e) {
      console.warn("Error loading history from Firebase:", e);
      return getMockHistory(uid);
    }
  },

  async appendMessage(uid: string, message: any) {
    if (!db) {
      saveMockHistory(uid, message);
      return;
    }
    try {
      const docRef = doc(db, 'users', uid, 'chat', 'history');
      await setDoc(docRef, {
        messages: arrayUnion(message)
      }, { merge: true });
    } catch (e) {
      console.warn("Error saving history to Firebase:", e);
      saveMockHistory(uid, message);
    }
  }
};

// Fallback logic for local testing without Firebase API Key
const getMockHistory = (uid: string) => {
  const data = localStorage.getItem(`chat_history_${uid}`);
  return data ? JSON.parse(data) : [{ role: 'ai', text: 'Hi! I am your StadiumIQ assistant. Need help finding your seat, the nearest restroom, or food?' }];
};

const saveMockHistory = (uid: string, message: any) => {
  const current = getMockHistory(uid);
  localStorage.setItem(`chat_history_${uid}`, JSON.stringify([...current, message]));
};

export { app, db, auth };
