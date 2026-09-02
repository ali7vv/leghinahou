import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCJi_9xu3fINuRdcCbNbk7Ib4zVvvmWQmE",
  authDomain: "eghinahou.firebaseapp.com",
  projectId: "eghinahou",
  storageBucket: "eghinahou.firebasestorage.app",
  messagingSenderId: "371767889005",
  appId: "1:371767889005:web:80144fb6ef7bca12ad0364",
  measurementId: "G-5C6H3MBDR6"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export { app };