"use client"

import Link from "next/link"
import { Heart, Phone, Info, LogIn, User, LogOut } from "lucide-react"
import { useAuth } from "@/app/context/AuthContext" // تأكد من مسار الـ context

export function SiteHeader() {
  const { user, logout } = useAuth() // جلب بيانات المستخدم ووظيفة الخروج

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-900/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" dir="rtl">
        
        {/* اللوجو */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black text-white tracking-wide">
            لقيناهو<span className="text-[#00B488]">.</span>
          </span>
        </Link>

        {/* الروابط العلوية */}
        <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-bold text-slate-200">
          <Link href="/about" className="flex items-center gap-1.5 hover:text-[#00B488] transition">
            <Info className="w-4 h-4 text-[#00B488]" />
            <span>عن لقيناهو</span>
          </Link>

          <Link href="/contact" className="flex items-center gap-1.5 hover:text-[#00B488] transition">
            <Phone className="w-4 h-4 text-[#00B488]" />
            <span>اتصل بنا</span>
          </Link>

          {/* زر لقيت زول؟ */}
          <Link 
            href="/found-cases" 
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-1.5 rounded-full transition shadow-sm backdrop-blur-md"
          >
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
            <span>لقيت زول؟</span>
          </Link>

          {/* التحقق من حالة تسجيل الدخول */}
          {user ? (
            // لو المستخدم مسجل دخول، بنعرض اسمه وملفه الشخصي ونخفي زر تسجيل الدخول
            <div className="flex items-center gap-3">
              <Link 
                href="/profile" 
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-3.5 py-2 rounded-xl transition border border-white/10"
              >
                <div className="w-7 h-7 rounded-full bg-[#00B488] flex items-center justify-center text-white font-bold text-xs">
                  {user.fullName ? user.fullName.charAt(0) : <User className="w-4 h-4" />}
                </div>
                <span className="text-xs font-semibold max-w-[100px] truncate">{user.fullName || "حسابي"}</span>
              </Link>
              
              <button 
                onClick={logout}
                title="تسجيل الخروج"
                className="p-2 text-slate-400 hover:text-rose-400 bg-white/5 hover:bg-white/10 rounded-xl transition border border-white/10"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            // لو ما مسجل دخول، بنعرض زر تسجيل الدخول العادي
            <Link 
              href="/login" 
              className="flex items-center gap-1.5 bg-[#00B488] hover:bg-[#009670] text-white px-4 py-2 rounded-xl transition shadow-md font-bold text-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول</span>
            </Link>
          )}
        </nav>

      </div>
    </header>
  )
}