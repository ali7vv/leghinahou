import Link from "next/link"
import { CheckCircle2, ArrowRight, Heart, MapPin, Calendar } from "lucide-react"

export default function FoundCasesPage() {
  const foundCases = [
    {
      id: 1,
      name: "أحمد محمد عثمان",
      age: 24,
      location: "الخرطوم",
      foundDate: "أغسطس 2026",
      story: "الحمد لله تم العثور عليه بفضل جهود المتطوعين وتواصل أهله معه وهو الآن في أتم الصحة والعافية وسط أسرته.",
    },
    {
      id: 2,
      name: "فاطمة أحمد حسن",
      age: 30,
      location: "الجزيرة",
      foundDate: "يوليو 2026",
      story: "بفضل الله ثم بلاغ المنصة وتكاتف أهل الخير، تم التعرف عليها وإرجاعها لأبنائها سالمة.",
    },
  ]

  return (
    <main className="relative min-h-[90vh] bg-brand py-16 px-4 overflow-hidden" dir="rtl">
      
      {/* خلفية متدرجة فخمة تشبه الصفحة الرئيسية */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand via-brand/90 to-slate-900 opacity-95" />
      
      {/* دوائر مضيئة هادئة في الخلفية لإعطاء عمق وراحة بصرية */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#00B488]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        
        {/* رأس الصفحة */}
        <div className="bg-gradient-to-r from-[#00B488] to-emerald-700 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
          <div className="space-y-2 text-center md:text-right">
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>فرحة لم الشمل</span>
            </div>
            <h1 className="text-3xl font-black">الحالات التي تم العثور عليها الحمد لله</h1>
            <p className="text-white/90 text-sm max-w-lg">
              هنا تجد قصص النجاح لأشخاص تم إرجاعهم إلى أسرهم بسلام، لزرع الأمل في قلوب الجميع.
            </p>
          </div>
          <Link 
            href="/" 
            className="bg-white text-[#00B488] hover:bg-slate-100 px-6 py-3 rounded-2xl font-bold text-xs transition shadow-md flex items-center gap-2 shrink-0"
          >
            <ArrowRight className="w-4 h-4" />
            <span>الرجوع للرئيسية</span>
          </Link>
        </div>

        {/* قائمة الحالات بتصميم بطاقات شفافة أنيقة (Glassmorphism) */}
        <div className="grid gap-4">
          {foundCases.map((item) => (
            <div key={item.id} className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition hover:bg-white">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-emerald-50 text-[#00B488] rounded-xl">
                    <CheckCircle2 className="w-5 h-5" />
                  </span>
                  <h3 className="text-xl font-bold text-slate-800">{item.name}</h3>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-semibold">العمر: {item.age} سنة</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed pr-9">
                  {item.story}
                </p>
                <div className="flex items-center gap-4 pr-9 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#00B488]" />
                    {item.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#00B488]" />
                    {item.foundDate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}