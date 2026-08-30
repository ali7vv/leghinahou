"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// استيراد الأثنتيكيشن وقاعدة البيانات بمسار صحيح من مجلد app
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

export default function ReportPage() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

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

  // التحقق الفوري من حالة تسجيل الدخول للمستخدم
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        alert("عذراً، يجب تسجيل الدخول بحسابك أولاً لتتمكن من نشر بلاغ.");
        router.push("/login"); // توجيه لصفحة تسجيل الدخول فوراً
      }
    });
    return () => unsubscribe();
  }, [router]);

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
        userId: user.uid,
        userEmail: user.email || "unknown",
        createdAt: serverTimestamp(),
      });

      alert("تم نشر البلاغ بنجاح!");
      router.push("/search");
    } catch (error) {
      console.error("خطأ أثناء النشر:", error);
      alert("حدث خطأ أثناء رفع البلاغ، تأكد من اتصال الإنترنت.");
    } finally {
      setSubmitting(false);
    }
  };

  // شاشة تحميل أثناء فحص حالة المستخدم
  if (loading) {
    return (
      <div className="min-h-screen bg-[#030914] text-white flex items-center justify-center">
        <p className="text-xs text-gray-400">جاري التحقق من صلاحيات الحساب...</p>
      </div>
    );
  }

  // لو ما مسجل ما نعرض الصفحة أساساً
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#030914] text-white p-4 md:p-8" dir="rtl">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* الشريط العلوي */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <h1 className="text-xl font-bold">إضافة بلاغ مفقود جديد</h1>
            <p className="text-xs text-gray-400 mt-1">البلاغات تتطلب تسجيل الدخول لضمان المصداقية.</p>
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
            className="w-full bg-[#0EA5A5] hover:bg-[#0EA5A5]/90 text-white font-bold py-3.5 rounded-xl text-xs transition"
          >
            {submitting ? "جاري نشر البلاغ..." : "نشر البلاغ رسمياً"}
          </button>

        </form>
      </div>
    </div>
  );
}