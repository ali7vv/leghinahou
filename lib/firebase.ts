import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCkvUc9bv_gd9kiOt1LaPTJd8vu6KqauCM",
  authDomain: "leghinahou.firebaseapp.com",
  projectId: "leghinahou",
  storageBucket: "leghinahou.firebasestorage.app",
  messagingSenderId: "787569303248",
  appId: "1:787569303248:web:86a5cc90ec6d7d868788d5"
};

// تهيئة فايربيس (تجنب إعادة التهيئة لو تم استدعاؤها مسبقاً)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();