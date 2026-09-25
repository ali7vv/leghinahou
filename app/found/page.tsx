"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Upload, CheckCircle2, User, Phone, MapPin, Activity, Heart } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

// استيراد الفايربيس بدلاً من LocalStorage
import { db, auth } from "@/app/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// قائمة بجميع ولايات السودان الـ 18
const SUDAN_STATES = [
  "الخرطوم",
  "الجزيرة",
  "البحر الأحمر",
  "كسلا",
  "القضارف",
  "سنار",
  "النيل الأبيض",
  "النيل الأزرق",
  "الشمالية",
  "نهر النيل",
  "شمال كردفان",
  "غرب كردفان",
  "جنوب كردفان",
  "شمال دارفور",
  "جنوب دارفور",
  "غرب دارفور",
  "وسط دارفور",
  "شرق دارفور",
];

export default function FoundReportPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    state: "",
    city: "",
    phone: "",
    details: "",
  });

  // معالجة رفع صورة المعثور عليه
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // حفظ بلاغ العثور في Firebase Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentUser = auth.currentUser;
    const currentUserId = currentUser?.uid || user?.id || "";

    try {
      setSubmitting(true);

      const cleanPhone = formData.phone.replace(/\s+/g, "").replace(/-/g, "");

      // رفع البلاغ إلى مجموعة reports في الفايربيس
      await addDoc(collection(db, "reports"), {
        userId: currentUserId,
        name: formData.name || "شخص غير معروف (تم العثور عليه)",
        personName: formData.name || "شخص غير معروف (تم العثور عليه)",
        age: formData.age || "غير محدد",
        state: formData.state || "",
        city: formData.city || "",
        phone: cleanPhone,
        details: formData.details || "",
        status: "تم العثور عليه", // تحديد الحالة بالعربي لمطابقة صفحة البحث
        image: imagePreview || null,
        userName: user?.fullName || currentUser?.displayName || "فاعل خير",
        userEmail: user?.email || currentUser?.email || "",
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setTimeout(() => {
        router.push("/search");
      }, 2000);
    } catch (error: any) {
      console.error("خطأ في نشر بلاغ العثور عليه:", error);
      alert("حدث خطأ أثناء نشر البلاغ: " + (error?.message || ""));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030914] text-white p-4 md:p-8" dir="rtl">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* الشريط العلوي */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                <span>لقيت زول؟</span>
                <Heart className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold">الإبلاغ عن شخص تم العثور عليه</h1>
            <p className="text-xs text-gray-400 mt-1">أدخل البيانات المتاحة للمساعدة في وصول الشخص لأهله</p>
          </div>
          <Link href="/" className="text-xs text-gray-400 hover:text-white flex items-center gap-1 bg-white/5 px-3 py-2 rounded-xl border border-white/10 transition">
            <ArrowRight className="w-4 h-4" /> الرئيسية
          </Link>
        </div>

        {submitted ? (
          <div className="bg-[#081322] border border-emerald-500/30 rounded-2xl p-8 text-center space-y-4 my-8">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">جزاك الله خيراً! تم نشر البلاغ بنجاح</h2>
            <p className="text-xs text-gray-300">جاري توجيهك إلى قائمة البلاغات لمشاهدته...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#081322] border border-white/10 rounded-2xl p-6 space-y-5">
            
            {/* رفع صورة المعثور عليه */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-400" /> صورة الشخص (إن وجدت)
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {imagePreview ? (
                    <img src={imagePreview} alt="المعاينة" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-gray-500" />
                  )}
                </div>
                <label className="cursor-pointer bg-white/5 hover:bg-white/10 text-xs text-white border border-white/10 px-4 py-2.5 rounded-xl flex items-center gap-2 transition">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>اختر صورة</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>

            {/* الاسم والعمر التقريبي */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">الاسم (إن وجد)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: أحمد عبد الله (أو اتركه فارغاً)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">العمر التقريبي</label>
                <input
                  type="text"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="مثال: 25 سنة أو طفل"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* الولاية والمدينة */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> الولاية *
                </label>
                <select
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-[#081322] border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-400"
                >
                  <option value="">اختر الولاية...</option>
                  {SUDAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> المدينة / الحي *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="مثال: أم درمان - الثورة"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* رقم التواصل */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> رقم التواصل مع المتواجد معه *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0912345678"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-400 dir-ltr text-right"
              />
            </div>

            {/* تفاصيل إضافية والحالة الصحية */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-gray-400" /> تفاصيل إضافية / الحالة الصحية
              </label>
              <textarea
                rows={3}
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="أي علامات مميزة، الملابس التي يرتديها، أو مكان تواجده حالياً..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-400"
              />
            </div>

            {/* زر الإرسال */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {submitting ? "جاري نشر البلاغ..." : "نشر البلاغ الآن"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}