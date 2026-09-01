import Link from "next/link";
import { ShieldCheck, Heart, Search, FileText, HelpCircle, PhoneCall, Info } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#030914] text-white border-t border-white/10 mt-12" dir="rtl">
      {sectionPrivacy()}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* القسم الأول: التعريف بالمنصة */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#0EA5A5]">لقيناهو</span>
            <span className="text-xs text-gray-400">نبحث معاً.. لننجدهم</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            منصة مجتمعية سودانية تساعد في البحث عن الأشخاص المفقودين والعثور عليهم وإعادتهم إلى ذويهم.
          </p>
        </div>

        {/* القسم الثاني: روابط سريعة */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white border-r-2 border-[#0EA5A5] pr-2">روابط سريعة</h3>
          <ul className="grid grid-cols-2 gap-2 text-xs text-gray-400">
            <li>
              <Link href="/search" className="hover:text-white transition flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#0EA5A5]" /> البحث عن شخص
              </Link>
            </li>
            <li>
              <Link href="/report" className="hover:text-white transition flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0EA5A5]" /> أبلغ عن مفقود
              </Link>
            </li>
            <li>
              <Link href="/search" className="hover:text-white transition flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#0EA5A5]" /> أحدث البلاغات
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-[#0EA5A5]" /> تواصل معنا
              </Link>
            </li>
          </ul>
        </div>

        {/* القسم الثالث: المنصة */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white border-r-2 border-[#0EA5A5] pr-2">المنصة</h3>
          <ul className="grid grid-cols-2 gap-2 text-xs text-gray-400">
            <li>
              <Link href="/" className="hover:text-white transition">الرئيسية</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-[#0EA5A5]" /> عن لقيناهو
              </Link>
            </li>
            <li>
              <Link href="/how" className="hover:text-white transition">كيف نعمل</Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-white transition flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-[#0EA5A5]" /> أسئلة شائعة
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* حقوق النشر */}
      <div className="border-t border-white/5 py-4 text-center text-xs text-gray-500">
        جميع الحقوق محفوظة © 2026 لقيناهو 🤍
      </div>
    </footer>
  );
}

// مكون الخصوصية الصغير الموجود أعلى الفوتر
function sectionPrivacy() {
  return (
    <div className="border-b border-white/5 bg-[#081322]/50 py-4 px-4 text-center">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-2 text-xs text-gray-300">
        <ShieldCheck className="w-4 h-4 text-[#0EA5A5]" />
        <span className="font-bold text-white">خصوصيتك مهمة:</span>
        <span>نحن نحافظ على خصوصية بياناتك ولا نشاركها مع أي جهة بدون إذنك.</span>
      </div>
    </div>
  );
}