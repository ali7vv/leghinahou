import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#030914] text-white p-6 md:p-12" dir="rtl">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* زر العودة للرئيسية */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-[#0EA5A5] hover:underline">
          <ArrowRight className="w-4 h-4" /> العودة إلى الرئيسية
        </Link>

        {/* العنوان الرئيسي */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-7 h-7 text-[#0EA5A5]" /> الأسئلة الشائعة
          </h1>
          <p className="text-gray-400 text-sm">
            إليك إجابات لأبرز الأسئلة حول منصة لقيناهو وطريقة عملها وحماية البيانات.
          </p>
        </div>

        {/* قائمة الأسئلة */}
        <div className="space-y-4">
          
          <div className="bg-[#081322] border border-white/10 p-5 rounded-2xl space-y-2">
            <h3 className="font-bold text-white text-sm">هل استخدام منصة "لقيناهو" مجاني؟</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              نعم، المنصة مجانية بالكامل ومكرسة للعمل الإنساني لمساعدة المجتمع السوداني في ظروفه الحالية لوجه الله تعالى.
            </p>
          </div>

          <div className="bg-[#081322] border border-white/10 p-5 rounded-2xl space-y-2">
            <h3 className="font-bold text-white text-sm">كيف يتم التأكد من مصداقية البلاغات؟</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              نحرص على ربط كل بلاغ بأرقام تواصل مباشرة لذوي المفقود، ونطلب إدخال تفاصيل دقيقة لضمان جدية البلاغات ومساعدة المتطوعين.
            </p>
          </div>

          <div className="bg-[#081322] border border-white/10 p-5 rounded-2xl space-y-2">
            <h3 className="font-bold text-white text-sm">ماذا أفعل إذا تم العثور على الشخص المفقود؟</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              يمكنك التواصل مع صاحب البلاغ أو الجهات المعنية عبر الأرقام المرفقة في البلاغ لتحديث حالته وإغلاقه فوراً.
            </p>
          </div>

          <div className="bg-[#081322] border border-white/10 p-5 rounded-2xl space-y-2">
            <h3 className="font-bold text-white text-sm">هل بياناتي الشخصية آمنة؟</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              بالتأكيد. نحن نطبق سياسات صارمة لحماية الخصوصية، ولا يتم مشاركة أي بيانات حساسة إلا بما يخدم عملية البحث عن المفقود بالتنسيق مع أهله.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}