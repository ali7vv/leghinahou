"use client"

import Link from "next/link"
import { Search, UserPlus, CheckCircle2, ClipboardList } from "lucide-react"

export function ActionCards() {
  return (
    <section className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Card 1: البحث عن شخص */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl flex flex-col justify-between transition-transform hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00B488]/15 text-[#00B488] flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white mb-1">البحث عن شخص</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              ابحث بالاسم أو باستخدام صورة أو معلومات أخرى
            </p>
          </div>
          <Link 
            href="/search"
            className="w-full bg-[#00B488] hover:bg-[#009670] text-white py-2.5 rounded-xl text-xs font-bold text-center transition-colors block shadow-md"
          >
            ابدأ البحث
          </Link>
        </div>

        {/* Card 2: أبلغ عن شخص مفقود */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl flex flex-col justify-between transition-transform hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center">
                <UserPlus className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white mb-1">أبلغ عن شخص مفقود</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              أضف بلاغاً عن شخص مفقود وساعد في العثور عليه
            </p>
          </div>
          <Link 
            href="/report"
            className="w-full bg-[#E53E3E] hover:bg-[#C53030] text-white py-2.5 rounded-xl text-xs font-bold text-center transition-colors block shadow-md"
          >
            إضافة بلاغ
          </Link>
        </div>

        {/* Card 3: شخص تم العثور عليه */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl flex flex-col justify-between transition-transform hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white mb-1">شخص تم العثور عليه</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              أبلغ عن شخص تم العثور عليه لربطه بأهله
            </p>
          </div>
          <Link 
            href="/found"
            className="w-full bg-[#3182CE] hover:bg-[#2B6CB0] text-white py-2.5 rounded-xl text-xs font-bold text-center transition-colors block shadow-md"
          >
            إضافة بلاغ
          </Link>
        </div>

        {/* Card 4: أحدث البلاغات */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl flex flex-col justify-between transition-transform hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <ClipboardList className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white mb-1">أحدث البلاغات</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              اطلع على آخر البلاغات المضافة في المنصة
            </p>
          </div>
          <Link 
            href="/search"
            className="w-full bg-[#DD6B20] hover:bg-[#C05621] text-white py-2.5 rounded-xl text-xs font-bold text-center transition-colors block shadow-md"
          >
            عرض البلاغات
          </Link>
        </div>

      </div>
    </section>
  )
}