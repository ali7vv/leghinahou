"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ReportPage() {
  const router = useRouter();
  const { user } = useAuth(); // سحب بيانات المستخدم من الـ Context المربوط بالـ localStorage

  // الحقول
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [missingSince, setMissingSince] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // تحويل الصورة لـ Base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // إرسال البلاغ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من أن المستخدم مسجل دخول عبر الكونتكست
    if (!user) {
      alert("الرجاء تسجيل الدخول أولاً.");
      router.push("/login");
      return;
    }

    if (!name || !age || !phone) {
      alert("الرجاء تعبئة الحقول الأساسية (الاسم، العمر، ورقم التواصل).");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "reports"), {
        name,
        age,
        state,
        city,
        missingSince,
        phone,
        details,
        image: image || null,
        status: "missing",
        userName: user.fullName,
        userPhone: user.phone,
        createdAt: serverTimestamp(),
      });

      // رسالة النجاح المعززة بآيات الصبر والقلوب والمشاعر الدافئة
      alert(
        "✨ تم نشر البلاغ بنجاح 🤍\n\n" +
        "﴿وَبَشِّرِ الصَّابِرِينَ﴾\n" +
        "اللهم رد كل غائب إلى أهله سالماً معافى 🤲\n" +
        "اصبروا واحتسبوا، وإن شاء الله ستلقونه قريباً وتقر أعينكم برؤيته سليماً معافى."
      );
      
      // التحويل المباشر لصفحة البحث/البلاغات
      router.push("/search");
    } catch (error) {
      console.error("خطأ أثناء النشر:", error);
      alert("حدث خطأ أثناء رفع البلاغ، تأكد من اتصال الإنترنت وقواعد الصلاحيات.");
    } finally {
      setSubmitting(false);
    }
  };

  // لو المستخدم غير مسجل دخول، اعرض له تنبيه احترافي
  if (!user) {
    return (
      <div className="min-h-screen bg-[#030914] text-white flex flex-col items-center justify-center p-4 text-center" dir="rtl">
        <div className="bg-[#081322] border border-white/10 p-8 rounded-2xl max-w-md w-full space-y-4">
          <h2 className="text-lg font-bold text-rose-400">تنبيه أمني</h2>
          <p className="text-xs text-gray-300">يجب تسجيل الدخول بحسابك أولاً لكي تتمكن من نشر بلاغ مفقود لضمان المصداقية.</p>
          <Link href="/login" className="block w-full bg-[#0EA5A5] text-white font-bold py-3 rounded-xl text-xs transition hover:bg-[#0EA5A5]/90">
            الانتقال لصفحة تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030914] text-white p-4 md:p-8" dir="rtl">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* الشريط العلوي */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <h1 className="text-xl font-bold">إضافة بلاغ مفقود جديد</h1>
            <p className="text-xs text-gray-400 mt-1">أهلاً بك، {user.fullName} ({user.phone})</p>
          </div>
          <Link href="/" className="text-xs text-gray-400 hover:text-white flex items-center gap-1 bg-white/5 px-3 py-2 rounded-xl border border-white/10 transition">
            <ArrowRight className="w-4 h-4" /> الرئيسية
          </Link>
        </div>

        {/* نموذج البلاغ */}
        <form onSubmit={handleSubmit} className="bg-[#081322] border border-white/10 rounded-2xl p-6 space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-300 block mb-1">اسم المفقود <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="الاسم الثلاثي أو الرباعي"
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#0EA5A5]"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1">العمر <span className="text-rose-500">*</span></label>
              <input
                type="number"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="بالسنوات"
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#0EA5A5]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-300 block mb-1">الولاية / المنطقة</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="مثال: الخرطوم، الجزيرة..."
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#0EA5A5]"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1">المدينة أو الحي</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="مثال: أمدرمان، الحتانة..."
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#0EA5A5]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-300 block mb-1">تاريخ الفقدان</label>
              <input
                type="text"
                value={missingSince}
                onChange={(e) => setMissingSince(e.target.value)}
                placeholder="مثال: أمس، الأسبوع الماضي..."
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#0EA5A5]"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1">رقم التواصل <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="رقم الهاتف للتواصل"
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#0EA5A5] dir-ltr text-right"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">صورة المفقود (اختياري)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-400 file:ml-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#0EA5A5] file:text-white hover:file:bg-[#0EA5A5]/80"
            />
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">تفاصيل إضافية أو علامات مميزة</label>
            <textarea
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="اكتب أي معلومات أخرى تفيد في العثور عليه..."
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#0EA5A5] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#0EA5A5] hover:bg-[#0EA5A5]/90 text-white font-bold py-3.5 rounded-xl text-xs transition cursor-pointer"
          >
            {submitting ? "جاري نشر البلاغ..." : "نشر البلاغ رسمياً"}
          </button>

        </form>
      </div>
    </div>
  );
}