"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, UserPlus, Phone, Lock, User, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    state: "الخرطوم",
    password: "",
  });
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // حفظ البيانات الحقيقية التي كتبها المستخدم
    login({
      fullName: formData.fullName,
      phone: formData.phone,
      state: formData.state,
    });

    // العودة للرئيسية
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#030914] text-white flex items-center justify-center p-4" dir="rtl">
      <div className="bg-[#081322] border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <UserPlus className="text-[#0EA5A5] w-5 h-5" />
            إنشاء حساب جديد
          </h1>
          <Link href="/" className="text-xs text-gray-400 hover:text-white flex items-center gap-1 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10 transition">
            <ArrowRight className="w-3.5 h-3.5" /> الرئيسية
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">الاسم بالكامل</label>
            <div className="relative">
              <User className="w-4 h-4 absolute right-3 top-3.5 text-gray-400" />
              <input 
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="أحمد محمد عثمان"
                className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 outline-none focus:border-[#0EA5A5]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">رقم الهاتف للتواصل</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute right-3 top-3.5 text-gray-400" />
              <input 
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0912345678"
                className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 outline-none focus:border-[#0EA5A5]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">الولاية المقيم بها</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute right-3 top-3.5 text-gray-400" />
              <select 
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-[#081322] border border-white/10 text-sm text-white outline-none focus:border-[#0EA5A5]"
              >
                <option value="الخرطوم">الخرطوم</option>
                <option value="الجزيرة">الجزيرة</option>
                <option value="نهر النيل">نهر النيل</option>
                <option value="الشمالية">الشمالية</option>
                <option value="البحر الأحمر">البحر الأحمر</option>
                <option value="ولاية أخرى">ولاية أخرى</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">كلمة السر</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute right-3 top-3.5 text-gray-400" />
              <input 
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 outline-none focus:border-[#0EA5A5]"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#0EA5A5] hover:bg-[#0EA5A5]/90 text-white font-bold text-sm py-3 rounded-xl transition duration-200 mt-2"
          >
            تسجيل الحساب
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 mt-6 pt-4 border-t border-white/5">
          عندك حساب بالفعل؟{" "}
          <Link href="/login" className="text-[#0EA5A5] font-semibold hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}