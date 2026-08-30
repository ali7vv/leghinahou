"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login({
      fullName: phone === "0912345678" ? "محمد أحمد" : `مستخدم (${phone})`,
      phone: phone,
      state: "السودان",
    });

    router.push("/");
  };

  // تسجيل الدخول الحقيقي عبر قوقل مع نافذة المنبثقة (Popup)
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // تمرير البيانات الحقيقية الجات من إيميل قوقل
      login({
        fullName: user.displayName || "مستخدم قوقل",
        phone: user.phoneNumber || user.email || "عبر قوقل",
        state: "السودان",
      });

      router.push("/");
    } catch (error) {
      console.error("خطأ في تسجيل الدخول بقوقل:", error);
      alert("حدث خطأ أثناء تسجيل الدخول بقوقل، تأكد من تفعيل الميزة في فايربيس.");
    }
  };

  return (
    <div className="min-h-screen bg-[#030914] text-white flex items-center justify-center p-4" dir="rtl">
      <div className="bg-[#081322] border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <LogIn className="text-[#0EA5A5] w-5 h-5" />
            تسجيل الدخول
          </h1>
          <Link href="/" className="text-xs text-gray-400 hover:text-white flex items-center gap-1 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10 transition">
            <ArrowRight className="w-3.5 h-3.5" /> الرئيسية
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">رقم الهاتف</label>
            <input 
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0912345678"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 outline-none focus:border-[#0EA5A5]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">كلمة السر</label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 outline-none focus:border-[#0EA5A5]"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#0EA5A5] hover:bg-[#0EA5A5]/90 text-white font-bold text-sm py-3 rounded-xl transition duration-200 mt-2 shadow-md"
          >
            دخول للمنصة
          </button>
        </form>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="px-3 text-xs text-gray-400">أو</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        {/* زر تسجيل الدخول عبر جوجل الحقيقي */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm py-3 rounded-xl transition duration-200 shadow-md cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.14C3.15 21.32 7.23 24 12 24z"/>
            <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.62H1.18C.43 8.13 0 9.83 0 12s.43 3.87 1.18 5.38l4.09-3.14z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.15 2.68 1.18 6.62l4.09 3.14c.95-2.85 3.6-4.96 6.73-4.96z"/>
          </svg>
          <span>المتابعة باستخدام جوجل</span>
        </button>

        <p className="text-xs text-center text-gray-400 mt-6 pt-4 border-t border-white/5">
          ما عندك حساب؟{" "}
          <Link href="/register" className="text-[#0EA5A5] font-semibold hover:underline">
            إنشاء حساب جديد
          </Link>
        </p>
      </div>
    </div>
  );
}