"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LogIn, Phone } from "lucide-react";
import { useAuth } from "../context/AuthContext";
// تم تعديل المسار هنا ليطابق مكان ملف الفايربيس في مجلد app
import { db } from "../firebase"; 
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || phone.length < 9) {
      alert("الرجاء إدخال رقم هاتف صحيح");
      return;
    }

    const fullName = phone === "0912345678" ? "محمد أحمد" : `مستخدم (${phone})`;

    try {
      // حفظ البيانات في مجموعة users داخل Firestore
      await setDoc(doc(db, "users", phone), {
        fullName: fullName,
        phone: phone,
        state: "السودان",
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      }, { merge: true });

      login({
        fullName: fullName,
        phone: phone,
        state: "السودان",
      });

      router.push("/");
    } catch (error) {
      console.error("خطأ أثناء حفظ البيانات في قاعدة البيانات:", error);
      alert("حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة لاحقاً.");
    }
  };

  return (
    <div className="min-h-screen bg-[#030914] text-white flex items-center justify-center p-4" dir="rtl">
      <div className="bg-[#081322] border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <LogIn className="text-[#0EA5A5] w-5 h-5" />
            تسجيل الدخول السريع
          </h1>
          <Link href="/" className="text-xs text-gray-400 hover:text-white flex items-center gap-1 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10 transition">
            <ArrowRight className="w-3.5 h-3.5" /> الرئيسية
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">رقم الهاتف</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <Phone className="w-4 h-4" />
              </span>
              <input 
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912345678"
                className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 outline-none focus:border-[#0EA5A5]"
              />
            </div>
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
            className="w-full bg-[#0EA5A5] hover:bg-[#0EA5A5]/90 text-white font-bold text-sm py-3 rounded-xl transition duration-200 mt-2 shadow-md cursor-pointer"
          >
            دخول فوري للمنصة
          </button>
        </form>

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