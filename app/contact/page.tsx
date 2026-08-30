import Link from "next/link"
import { Mail, MessageSquare } from "lucide-react"

export default function ContactPage() {
  return (
    <main className="min-h-[80vh] py-16 px-4" dir="rtl">
      <div className="max-w-3xl mx-auto space-y-6 text-slate-800 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h1 className="text-4xl font-black text-[#00B488]">اتصل بنا</h1>
        <p className="text-lg leading-relaxed text-slate-600">
          نحن في خدمة الأهل دائماً. لو عندك أي استفسار، بلاغ طارئ، أو واجهتك مشكلة في استخدام المنصة، يسعدنا تواصلك معنا عبر وسائل الاتصال أدناه:
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* صندوق البريد الإلكتروني */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="p-3 bg-[#00B488]/15 text-[#00B488] rounded-xl">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold">البريد الإلكتروني الرسمي</p>
              <a href="mailto:b3eed2009@gmail.com" className="text-sm font-bold text-slate-800 hover:text-[#00B488] transition">
                b3eed2009@gmail.com
              </a>
            </div>
          </div>

          {/* صندوق الواتساب */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="p-3 bg-green-500/15 text-green-600 rounded-xl">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold">تواصل عبر واتساب</p>
              <a 
                href="https://wa.me/249117550533" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-bold text-slate-800 hover:text-green-600 transition"
                dir="ltr"
              >
                +249 11 755 0533
              </a>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Link href="/" className="inline-block bg-[#00B488] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-[#009670] transition">
            الرجوع للرئيسية
          </Link>
        </div>
      </div>
    </main>
  )
}