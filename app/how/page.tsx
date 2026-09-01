import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Search, ShieldAlert } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#030914] text-white p-6 md:p-12" dir="rtl">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* زر العودة للرئيسية */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-[#0EA5A5] hover:underline">
          <ArrowRight className="w-4 h-4" /> العودة إلى الرئيسية
        </Link>

        {/* العنوان الرئيسي */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white">كيف تعمل منصة لقيناهو؟</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            منصة مجتمعية سودانية تهدف إلى توحيد الجهود المجتمعية والتقنية للمساعدة في البحث عن الأشخاص المفقودين وإعادتهم إلى ذويهم بأسرع وقت ممكن.
          </p>
        </div>

        {/* خطوات الاستخدام */}
        <div className="space-y-4">
          
          <div className="bg-[#081322] border border-white/10 p-5 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-[#0EA5A5] font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" /> 1. تصفح البلاغات المتاحة
            </div>
            <p className="text-xs text-gray-300 leading-relaxed pr-7">
              يمكنك الدخول إلى صفحة "البحث عن شخص" للاطلاع على أحدث البلاغات النشطة للمفقودين، والبحث بالاسم أو التفاصيل للتعرف عليهم.
            </p>
          </div>

          <div className="bg-[#081322] border border-white/10 p-5 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-[#0EA5A5] font-bold text-sm">
              <FileText className="w-5 h-5" /> 2. تقديم بلاغ عن مفقود
            </div>
            <p className="text-xs text-gray-300 leading-relaxed pr-7">
              في حال فقدان شخص عزيز، توجه إلى صفحة "أبلغ عن مفقود" وقم بتعبئة كافة التفاصيل بدقة (الاسم، آخر مكان شوهد فيه، العمر، وصورة حديثة إن وجدت، مع أرقام التواصل الصحيحة).
            </p>
          </div>

          <div className="bg-[#081322] border border-white/10 p-5 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-[#0EA5A5] font-bold text-sm">
              <Search className="w-5 h-5" /> 3. المشاركة والنشر
            </div>
            <p className="text-xs text-gray-300 leading-relaxed pr-7">
              مشاركتك لروابط البلاغات عبر وسائط التواصل الاجتماعي تساهم بشكل كبير في سرعة الوصول للمفقود، فكل نشر قد يكون سبباً في لم شمل عائلة.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}