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
  const { user } = useAuth();

  // الحقول الأساسية
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
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // إرسال البلاغ مباشرة بدون الحاجة لكود تحقق (OTP)
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("الرجاء تسجيل الدخول أولاً.");
      router.push("/login");
      return;
    }

    // 1. فحص طول النص (ألا يقل عن 10 حروف) لضمان المصداقية ومنع السبام
    if (details.trim().length < 10) {
      alert("عذراً، يجب أن تكون تفاصيل المفقود أكثر من 10 حروف لضمان المصداقية.");
      return;
    }

    // 2. حماية منع التكرار السريع (Rate Limiting محلي لمنع ضغط الزر المتكرر)
    const lastReportTime = localStorage.getItem("last_report_time");
    const now = Date.now();
    if (lastReportTime && now - parseInt(lastReportTime) < 30000) { // منع إرسال بلاغ آخر إلا بعد 30 ثانية
      alert("الرجاء الانتظار قليلاً قبل إرسال بلاغ جديد لمنع الضغط على المنصة.");
      return;
    }

    const cleanPhone = phone.replace(/\s+/g, "").replace(/-/g, "");

    try {
      setSubmitting(true);

      // رفع البلاغ للـ Firestore مباشرة
      await addDoc(collection(db, "reports"), {
        name,
        age,
        state,
        city,
        missingSince,
        phone: cleanPhone,
        details,
        image: image || null,
        status: "missing",
        userName: user.fullName || "مستخدم",
        userPhone: user.phone || "",
        createdAt: serverTimestamp(),
      });

      // تسجيل وقت آخر بلاغ
      localStorage.setItem("last_report_time", now.toString());

      alert(
        "✨ تم نشر البلاغ بنجاح 🤍\n\n" +
        "﴿وَبَشِّرِ الصَّابِرِينَ﴾\n" +
        "اللهم رد كل غائب إلى أهله سالماً معافى 🤲"
      );

      router.push("/search");
    } catch (error: any) {
      console.error("خطأ في النشر:", error);
      alert("حدث خطأ أثناء نشر البلاغ. تأكد من اتصالك بالإنترنت وجرب لاحقاً.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#030914] text-white flex flex-col items-center justify-center p-4 text-center" dir="rtl">
        <div className="bg-[#081322] border border-white/10 p-8 rounded-2xl max-w-md w-full space-y-4">
          <h2 className="text-lg font-bold text-rose-400">تنبيه أمني</h2>
          <p className="text-xs text-gray-300">يجب تسجيل الدخول بحسابك أولاً لكي تتمكن من نشر بلاغ مفقود.</p>
          <Link href="/login" className="block w-full bg-[#0EA5A5] text-white font-bold py-3 rounded-xl text-xs transition hover:bg-[#0EA5A5]/90">
            تسجيل الدخول
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
            <h1 className="text-xl font-bold">إضافة بلاغ مفقود</h1>
            <p className="text-xs text-gray-400 mt-1">أهلاً بك، {user.fullName}</p>
          </div>
          <Link href="/" className="text-xs text-gray-400 hover:text-white flex items-center gap-1 bg-white/5 px-3 py-2 rounded-xl border border-white/10 transition">
            <ArrowRight className="w-4 h-4" /> الرئيسية
          </Link>
        </div>

        {/* نموذج البلاغ */}
        <form onSubmit={handleSubmitReport} className="bg-[#081322] border border-white/10 rounded-2xl p-6 space-y-5">
          
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
                placeholder="مثال: الخرطوم..."
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#0EA5A5]"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1">المدينة أو الحي</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="مثال: أمدرمان..."
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
                placeholder="مثال: أمس..."
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
                placeholder="0912345678"
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#0EA5A5] text-right"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">صورة المفقود (اختياري)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-400 file:ml-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#0EA5A5] file:text-white"
            />
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">تفاصيل إضافية أو علامات مميزة (أكثر من 10 حروف) <span className="text-rose-500">*</span></label>
            <textarea
              rows={4}
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="اكتب تفاصيل كافية عن حالة الفقدان..."
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#0EA5A5] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#0EA5A5] hover:bg-[#0EA5A5]/90 text-white font-bold py-3.5 rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
          >
            {submitting ? "جاري نشر البلاغ..." : "نشر البلاغ رسمياً"}
          </button>

        </form>
      </div>
    </div>
  );
}