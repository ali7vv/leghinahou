import Link from "next/link"
import { HeartHandshake, ShieldCheck, Users, ArrowRight, MessageCircle, Lock } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="relative min-h-[90vh] flex items-center justify-center py-16 px-4 overflow-hidden bg-brand" dir="rtl">
      
      {/* خلفية جمالية متدرجة مع تأثيرات بصرية */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand via-brand/90 to-slate-900 opacity-95" />
      
      {/* دوائر مضيئة هادئة في الخلفية لإعطاء عمق وراحة بصرية */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#00B488]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* البطاقة الرئيسية في المنتصف بتصميم فخم ومريح */}
      <div className="relative z-10 max-w-2xl w-full bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 text-slate-800">
        
        {/* أيقونة ترحيبية في الأعلى */}
        <div className="w-14 h-14 bg-[#00B488]/10 text-[#00B488] rounded-2xl flex items-center justify-center mb-6 shadow-inner">
          <HeartHandshake className="w-7 h-7" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">
          عن منصة <span className="text-[#00B488]">لقيناهو</span>
        </h1>

        <p className="text-base sm:text-lg leading-relaxed text-slate-600 mb-6">
          منصة سودانية مجتمعية تطوعية، أُنشئت بهدف تسهيل البحث عن الأشخاص المفقودين في ظل الظروف الصعبة، ومساعدة الأسر في لم شملهم بكل أمان وسرعة وبدون أي مقابل، لنكون حلقة وصل بين أهل الخير وكل محتاج. 🤍
        </p>

        {/* مميزات سريعة تحت النبذة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <ShieldCheck className="w-5 h-5 text-[#00B488]" />
            <span className="text-xs sm:text-sm font-bold text-slate-700">سرية وأمان تام للبيانات</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <Users className="w-5 h-5 text-[#00B488]" />
            <span className="text-xs sm:text-sm font-bold text-slate-700">جهود مجتمعية خالصة</span>
          </div>
        </div>

        {/* قسم التواصل وحماية التشفير والحقوق */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-8 space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-500 font-medium">تواصل مباشر (واتساب):</span>
            <a 
              href="https://wa.me/249117550533" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#00B488] font-bold hover:underline"
              dir="ltr"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              +249 11 755 0533
            </a>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-slate-200/60">
            <span className="text-slate-500 font-medium">حماية المنصة:</span>
            <span className="inline-flex items-center gap-1 text-slate-700 font-semibold">
              <Lock className="w-3.5 h-3.5 text-[#00B488]" />
              مشفر بالكامل وآمن
            </span>
          </div>
        </div>

        {/* زر الرجوع مع حقوق النشر */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <Link 
            href="/" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00B488] hover:bg-[#009670] text-white px-7 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg shadow-[#00B488]/20 group"
          >
            <ArrowRight className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>الرجوع للرئيسية</span>
          </Link>

          <span className="text-xs text-slate-400 font-medium text-center">
            جميع الحقوق محفوظة © 2026
          </span>
        </div>

      </div>
    </main>
  )
}