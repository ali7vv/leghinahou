import Link from "next/link"
import { Heart, CheckCircle2, ShieldCheck, Users } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand py-12 md:py-20">
      <img
        src="/images/hero.png"
        alt="شخص يمشي في طريق بحثاً عن أهله"
        className="absolute inset-0 size-full object-cover object-center opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-brand via-brand/85 to-brand/40" />

      {/* تم جعل كل المحتوى في المنتصف (items-center و text-center) */}
      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 text-center">
        
        {/* عبارة الأمل في المنتصف */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 backdrop-blur-md border border-white/10 text-white/90 text-xs md:text-sm font-semibold shadow-sm">
          <Heart className="w-4 h-4 text-[#00B488]" />
          <span>راجعين بإذن الله.. لكل مفقود يرجع لأهله وتتسهل الأمور ولم شمل الأسرة 🤍</span>
        </div>

        <h1 className="text-5xl font-extrabold text-brand-foreground text-balance md:text-6xl drop-shadow-sm">
          لقيناهو
        </h1>
        <p className="mt-2 text-2xl font-bold text-[color:var(--search)] md:text-3xl">
          نبحث معاً.. لنجدهم
        </p>
        <p className="mt-3 max-w-md text-base leading-relaxed text-brand-foreground/85 text-pretty md:text-lg">
          منصة سودانية تساعد في البحث عن الأشخاص المفقودين والعثور عليهم وتيسير لم شمل الأسرة بكل أمان وموثوقية
        </p>

        {/* الأزرار في المنتصف ومرفوعة لفوق بمسافة مناسبة */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center items-center">
          <Link
            href="/search"
            className="bg-[#00B488] hover:bg-[#009670] text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg flex items-center gap-2"
          >
            <span>ابحث عن مفقود</span>
          </Link>
          
          <Link
            href="/report"
            className="bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-600 px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
          >
            <span>الإبلاغ عن مفقود</span>
          </Link>

          <Link
            href="/found-cases"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/15 px-5 py-3 rounded-xl font-bold text-xs transition-colors backdrop-blur-sm flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-[#00B488]" />
            <span>تم العثور عليهم الحمد لله</span>
          </Link>
        </div>

        {/* شريط الثقة في المنتصف وقريب من الأزرار */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-6 justify-center text-xs text-brand-foreground/75">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#00B488]" />
            <span>بيانات محمية وآمنة</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#00B488]" />
            <span>مجتمع تضامني واسع</span>
          </div>
        </div>

      </div>
    </section>
  )
}