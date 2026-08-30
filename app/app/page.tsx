"use client";

import Link from "next/link";
import { 
  Search, UserPlus, FileText, CheckCircle2, ShieldCheck, Heart, Share2, ArrowRight, Globe, User, LogOut 
} from "lucide-react";
import { useAuth } from "./context/AuthContext";

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#1F2937] selection:bg-[#0EA5A5] selection:text-white font-sans overflow-x-hidden" dir="rtl">
      
      {/* 1. الهيدر العلوي */}
      <header className="bg-white border-b border-gray-100 px-6 lg:px-12 py-4 flex items-center justify-between max-w-7xl mx-auto sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition">
            <Globe className="w-3.5 h-3.5" /> EN
          </button>

          {/* التحقق من حالة تسجيل الدخول لعرض الملف الشخصي أو زر الدخول */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/profile" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-xl transition text-xs font-bold text-gray-800">
                <div className="w-6 h-6 rounded-lg bg-[#0EA5A5] text-white flex items-center justify-center font-bold text-xs">
                  {user.fullName ? user.fullName.charAt(0) : <User className="w-3.5 h-3.5" />}
                </div>
                <span>{user.fullName || "حسابي"}</span>
              </Link>
              <button 
                onClick={logout}
                title="تسجيل الخروج"
                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="px-5 py-2 bg-[#0B192C] hover:bg-[#0B192C]/90 text-white rounded-xl text-xs font-bold transition shadow-sm">
              تسجيل الدخول
            </Link>
          )}
        </div>

        {/* القائمة الرئيسية والشعار */}
        <div className="flex items-center gap-10">
          <nav className="hidden lg:flex items-center gap-6 text-sm text-gray-600 font-semibold">
            <Link href="/" className="text-[#0EA5A5] font-bold">الرئيسية</Link>
            <Link href="/about" className="hover:text-[#0EA5A5] transition">عن لقيناهم</Link>
            <Link href="/how-it-works" className="hover:text-[#0EA5A5] transition">كيف نعمل</Link>
            <Link href="/faq" className="hover:text-[#0EA5A5] transition">أسئلة شائعة</Link>
            <Link href="/contact" className="hover:text-[#0EA5A5] transition">تواصل معنا</Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="flex flex-col text-left lg:text-right">
              <span className="font-black text-xl tracking-tight text-[#0B192C]">لقيناهم</span>
              <span className="text-[10px] text-gray-400 font-medium">نبحت معاً.. لننجدهم</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#0B192C] flex items-center justify-center text-[#0EA5A5] shadow-md">
              <span className="font-bold text-lg">🔍</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. قسم الهيرو (Hero Section) */}
      <section className="relative overflow-hidden bg-[#0B192C] text-white py-20 px-6 text-center max-w-7xl mx-auto rounded-b-[48px] shadow-2xl">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/70 via-[#0B192C] to-[#0B192C] pointer-events-none"></div>
        <div className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url('/hero.png')` }}></div>
        
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-[#0EA5A5] font-medium backdrop-blur-md">
            <ShieldCheck className="w-4 h-4" /> منصة موثوقة للبحث عن المفقودين
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mt-2 text-white">
            لقيناهم
          </h1>
          
          <div className="flex items-center gap-2 text-xl md:text-2xl font-bold text-[#0EA5A5]">
            <Heart className="w-5 h-5 fill-current text-[#0EA5A5]" />
            <span>نبحت معاً.. لننجدهم</span>
          </div>

          <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl mt-1">
            منصة سودانية تساعد في البحث عن الأشخاص المفقودين والعثور عليهم، لنساهم جميعاً في عودتهم إلى ديارهم.
          </p>

          {/* أزرار الهيرو */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md mt-6">
            <Link href="/report" className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/15 font-bold py-3.5 px-8 rounded-2xl text-sm transition backdrop-blur-md">
              <UserPlus className="w-4 h-4" /> أبلغ عن مفقود
            </Link>
            <Link href="/search" className="flex items-center justify-center gap-2 bg-[#0EA5A5] hover:bg-[#0EA5A5]/90 text-white font-bold py-3.5 px-8 rounded-2xl text-sm transition shadow-lg shadow-[#0EA5A5]/30">
              <Search className="w-4 h-4" /> ابحث عن مفقود
            </Link>
          </div>
        </div>
      </section>

      {/* 3. الكروت الأربعة الرئيسية البارزة */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-20 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* كارت 1: ابدأ البحث */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col items-center text-center shadow-xl hover:shadow-2xl transition group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">ابدأ البحث</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">ابحث بالاسم أو باستخدام صورة أو معلومات أخرى</p>
            <Link href="/search" className="w-full mt-auto bg-[#0EA5A5] hover:bg-[#0EA5A5]/90 text-white font-bold text-xs py-3 rounded-xl transition shadow-md shadow-[#0EA5A5]/20">
              ابدأ البحث
            </Link>
          </div>

          {/* كارت 2: إضافة بلاغ */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col items-center text-center shadow-xl hover:shadow-2xl transition group">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <UserPlus className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">إضافة بلاغ</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">أضف بلاغاً عن شخص مفقود وساعد في العثور عليه</p>
            <Link href="/report" className="w-full mt-auto bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs py-3 rounded-xl transition shadow-md shadow-rose-500/20">
              إضافة بلاغ
            </Link>
          </div>

          {/* كارت 3: إضافة معثور عليه */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col items-center text-center shadow-xl hover:shadow-2xl transition group">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">إضافة معثور عليه</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">أبلغ عن شخص تم العثور عليه ليتعرف عليه أهله</p>
            <Link href="/found" className="w-full mt-auto bg-[#0284C7] hover:bg-[#0284C7]/90 text-white font-bold text-xs py-3 rounded-xl transition shadow-md shadow-[#0284C7]/20">
              إضافة بلاغ
            </Link>
          </div>

          {/* كارت 4: عرض البلاغات */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col items-center text-center shadow-xl hover:shadow-2xl transition group">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">عرض البلاغات</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">اطلع على أحدث البلاغات المضافة في المنصة</p>
            <Link href="/reports" className="w-full mt-auto bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-3 rounded-xl transition shadow-md shadow-amber-500/20">
              عرض البلاغات
            </Link>
          </div>

        </div>
      </section>

      {/* 4. قسم أحدث البلاغات */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex items-center justify-between mb-6">
          <Link href="/reports" className="text-xs text-[#0EA5A5] hover:underline font-bold flex items-center gap-1">
            عرض الكل <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <h2 className="text-xl font-black text-gray-900">أحدث البلاغات</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          
          {/* كارت 1 */}
          <div className="bg-white border border-gray-100 rounded-3xl p-4 flex flex-col gap-3 relative shadow-md hover:shadow-xl transition">
            <span className="absolute top-6 right-6 bg-red-50 text-red-500 border border-red-100 text-[11px] font-bold px-2.5 py-0.5 rounded-full">مفقود</span>
            <div className="w-full h-48 rounded-2xl bg-gray-100 overflow-hidden border border-gray-100">
              <img src="/placeholder-user.jpg" alt="مفقود" className="w-full h-full object-cover" />
            </div>
            <div className="text-right">
              <h3 className="font-bold text-base text-gray-900">أحمد محمد علي</h3>
              <p className="text-xs text-gray-500 mt-1">العمر: 12 سنة</p>
              <p className="text-xs text-gray-500">آخر مكان: أم درمان</p>
              <p className="text-[11px] text-gray-400 mt-2">تاريخ الاختفاء: 2024-05-20</p>
            </div>
            <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 transition">
                <Share2 className="w-3.5 h-3.5 text-gray-500" /> مشاركة
              </button>
              <span className="text-[11px] text-gray-400 font-medium">2024-05-21</span>
            </div>
          </div>

          {/* كارت 2 */}
          <div className="bg-white border border-gray-100 rounded-3xl p-4 flex flex-col gap-3 relative shadow-md hover:shadow-xl transition">
            <span className="absolute top-6 right-6 bg-red-50 text-red-500 border border-red-100 text-[11px] font-bold px-2.5 py-0.5 rounded-full">مفقود</span>
            <div className="w-full h-48 rounded-2xl bg-gray-100 overflow-hidden border border-gray-100">
              <img src="/placeholder-user.jpg" alt="مفقود" className="w-full h-full object-cover" />
            </div>
            <div className="text-right">
              <h3 className="font-bold text-base text-gray-900">محمد أحمد</h3>
              <p className="text-xs text-gray-500 mt-1">العمر: 20 سنة</p>
              <p className="text-xs text-gray-500">آخر مكان: أم درمان</p>
              <p className="text-[11px] text-gray-400 mt-2">تاريخ الاختفاء: 2024-05-18</p>
            </div>
            <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 transition">
                <Share2 className="w-3.5 h-3.5 text-gray-500" /> مشاركة
              </button>
              <span className="text-[11px] text-gray-400 font-medium">2024-05-20</span>
            </div>
          </div>

          {/* كارت 3 */}
          <div className="bg-white border border-gray-100 rounded-3xl p-4 flex flex-col gap-3 relative shadow-md hover:shadow-xl transition">
            <span className="absolute top-6 right-6 bg-red-50 text-red-500 border border-red-100 text-[11px] font-bold px-2.5 py-0.5 rounded-full">مفقود</span>
            <div className="w-full h-48 rounded-2xl bg-gray-100 overflow-hidden border border-gray-100">
              <img src="/placeholder-user.jpg" alt="مفقود" className="w-full h-full object-cover" />
            </div>
            <div className="text-right">
              <h3 className="font-bold text-base text-gray-900">الطيب حسين</h3>
              <p className="text-xs text-gray-500 mt-1">العمر: 45 سنة</p>
              <p className="text-xs text-gray-500">آخر مكان: بحري</p>
              <p className="text-[11px] text-gray-400 mt-2">تاريخ الاختفاء: 2024-05-15</p>
            </div>
            <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 transition">
                <Share2 className="w-3.5 h-3.5 text-gray-500" /> مشاركة
              </button>
              <span className="text-[11px] text-gray-400 font-medium">2024-05-19</span>
            </div>
          </div>

          {/* كارت 4 */}
          <div className="bg-white border border-gray-100 rounded-3xl p-4 flex flex-col gap-3 relative shadow-md hover:shadow-xl transition">
            <span className="absolute top-6 right-6 bg-red-50 text-red-500 border border-red-100 text-[11px] font-bold px-2.5 py-0.5 rounded-full">مفقود</span>
            <div className="w-full h-48 rounded-2xl bg-gray-100 overflow-hidden border border-gray-100">
              <img src="/placeholder-user.jpg" alt="مفقودة" className="w-full h-full object-cover" />
            </div>
            <div className="text-right">
              <h3 className="font-bold text-base text-gray-900">فاطمة عثمان</h3>
              <p className="text-xs text-gray-500 mt-1">العمر: 17 سنة</p>
              <p className="text-xs text-gray-500">آخر مكان: الخرطوم</p>
              <p className="text-[11px] text-gray-400 mt-2">تاريخ الاختفاء: 2024-05-15</p>
            </div>
            <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 transition">
                <Share2 className="w-3.5 h-3.5 text-gray-500" /> مشاركة
              </button>
              <span className="text-[11px] text-gray-400 font-medium">2024-05-18</span>
            </div>
          </div>

        </div>
      </section>

      {/* 5. تذييل خصوصيتك مهمة */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-xs text-gray-500 mt-12 shadow-inner">
        <div className="max-w-7xl mx-auto px-6">
          <h4 className="font-bold text-gray-800 mb-1">خصوصيتك مهمة</h4>
          <p>نحن نحافظ على خصوصية بياناتك ولا نشاركها مع أي جهة بدون إذنك</p>
        </div>
      </footer>

    </div>
  );
}