"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, User, Phone, MapPin, LogOut, ShieldCheck, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // لو الزول ما مسجل دخول وضغط الرابط، نرجعو لصفحة الدخول
  if (!user) {
    return (
      <div className="min-h-screen bg-[#030914] text-white flex flex-col items-center justify-center p-4 text-center" dir="rtl">
        <div className="bg-[#081322] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-xl space-y-4">
          <h2 className="text-xl font-bold">عذراً، يجب تسجيل الدخول أولاً</h2>
          <p className="text-xs text-gray-400">الرجاء تسجيل الدخول لمشاهدة الملف الشخصي وإدارة بلاغاتك.</p>
          <Link 
            href="/login" 
            className="block w-full bg-[#0EA5A5] hover:bg-[#0EA5A5]/90 text-white font-bold text-sm py-3 rounded-xl transition shadow-md"
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#030914] text-white p-4 sm:p-8" dir="rtl">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* زر العودة للرئيسية */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-wide">
            الملف الشخصي<span className="text-[#0EA5A5]">.</span>
          </h1>
          <Link href="/" className="text-xs text-gray-400 hover:text-white flex items-center gap-1 bg-white/5 px-3 py-2 rounded-xl border border-white/10 transition">
            <ArrowRight className="w-4 h-4" /> الرئيسية
          </Link>
        </div>

        {/* كرت معلومات المستخدم الأساسية */}
        <div className="bg-[#081322] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center gap-6">
          {/* الصورة الشخصية أو الحرف الأول */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0EA5A5] to-blue-600 flex items-center justify-center text-white font-black text-3xl shadow-lg border-2 border-white/20">
            {user.fullName ? user.fullName.charAt(0) : <User className="w-8 h-8" />}
          </div>

          <div className="flex-1 text-center sm:text-right space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold">{user.fullName || "مستخدم المنصة"}</h2>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> حساب موثق
              </span>
            </div>
            
            <div className="text-xs text-gray-400 flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#0EA5A5]" /> {user.phone || "غير مسجل"}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#0EA5A5]" /> {user.state || "السودان"}
              </span>
            </div>
          </div>

          {/* زر تسجيل الخروج */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-4 py-2.5 rounded-xl transition text-xs font-bold"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>

        {/* قسم البلاغات أو النشاطات الخاصة بالمستخدم */}
        <div className="bg-[#081322] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <h3 className="text-base font-bold flex items-center gap-2 border-b border-white/10 pb-3">
            <FileText className="w-5 h-5 text-[#0EA5A5]" />
            بلاغاتي والنشاطات
          </h3>
          <div className="text-center py-8 text-gray-400 text-xs space-y-2">
            <p>ليس لديك أي بلاغات مضافة حتى الآن.</p>
            <Link href="/report" className="text-[#0EA5A5] font-semibold hover:underline block">
              أضف بلاغاً عن مفقود الآن
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}