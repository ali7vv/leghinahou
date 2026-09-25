"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { db, auth } from "@/app/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  // تسجيل الدخول باستخدام Google
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userEmail = user.email || "";
      const userName = user.displayName || "مستخدم جديد";
      const photoURL = user.photoURL || "";

      // حفظ/تحديث بيانات المستخدم في Firestore
      if (userEmail) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            name: userName,
            email: userEmail,
            photoURL: photoURL,
            role: userEmail === "admin@laqaynaho.com" ? "admin" : "user",
            createdAt: new Date(),
          });
        }
      }

      login(userEmail, userName, "الخرطوم");

      if (userEmail === "admin@laqaynaho.com") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error("خطأ أثناء تسجيل الدخول بـ Google:", error);
      alert("حدث خطأ أثناء تسجيل الدخول بـ Google: " + (error?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" dir="rtl">
      <div className="max-w-md w-full bg-card border border-border p-8 rounded-3xl shadow-sm text-center">
        <h2 className="text-xl font-bold mb-2 text-foreground">تسجيل الدخول الآمن والمحمي</h2>
        
        {/* العبارة اللطيفة والقلب */}
        <p className="text-xs text-[#0EA5A5] font-medium mb-8 flex items-center justify-center gap-1.5 bg-[#0EA5A5]/10 py-2.5 px-4 rounded-2xl">
          <span>عشان نسهل عليكم التسجيل بضغطة زر واحدة.. اختر حسابك وادخل فوراً</span>
          <span className="text-red-500 text-sm">❤️</span>
        </p>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 py-3.5 rounded-2xl font-bold text-sm hover:bg-gray-50 transition shadow-sm disabled:opacity-50 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          {loading ? "جاري الدخول..." : "متابعة باستخدام Google"}
        </button>
      </div>
    </div>
  );
}