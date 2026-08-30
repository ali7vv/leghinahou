import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJi_9xu3fINuRdcCbNbk7Ib4zVvvmWQmE",
  authDomain: "eghinahou.firebaseapp.com",
  projectId: "eghinahou",
  storageBucket: "eghinahou.firebasestorage.app",
  messagingSenderId: "371767889005",
  appId: "1:371767889005:web:80144fb6ef7bca12ad0364",
  measurementId: "G-5C6H3MBDR6"
};

// تهيئة فايربيس (مع التأكد من عدم تكرار التهيئة)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);