"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Upload, CheckCircle2, User, Phone, MapPin, Calendar, FileText, Heart } from "lucide-react"

// استيراد قاعدة البيانات من ملف الـ firebase البأنشأناهو
import { db } from "@/app/firebase" // عدل المسار لو ملف الـ firebase موجود في مكان تاني مثل "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export default function ReportPage() {
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    state: "",
    city: "",
    missingSince: "",
    phone: "",
    details: "",
    status: "missing",
  })

  // معالجة رفع الصورة وتحويلها لـ Base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // حفظ البلاغ في قاعدة بيانات Firebase Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // إرسال البيانات مباشرة لسيرفر فايربيس (ليراها اللابتوب والتلفون فوراً)
      await addDoc(collection(db, "reports"), {
        ...formData,
        image: imagePreview,
        createdAt: serverTimestamp(),
      })

      setSubmitted(true)
      setTimeout(() => {
        router.push("/search") // أو صفحة العرض عندك
      }, 3500)

    } catch (error) {
      console.error("خطأ أثناء رفع البلاغ:", error)
      alert("حدث خطأ أثناء رفع البلاغ، تأكد من اتصال الإنترنت.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#030914] text-white p-4 md:p-8" dir="rtl">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* الشريط العلوي */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">إضافة بلاغ عن مفقود</h1>
            <p className="text-xs text-gray-400 mt-1">أدخل بيانات الشخص المفقود بدقة للمساعدة في الوصول إليه</p>
          </div>
          <Link href="/" className="text-xs text-gray-400 hover:text-white flex items-center gap-1 bg-white/5 px-3 py-2 rounded-xl border border-white/10 transition">
            <ArrowRight className="w-4 h-4" /> الرئيسية
          </Link>
        </div>

        {submitted ? (
          <div className="bg-[#081322] border border-emerald-500/30 rounded-2xl p-8 text-center space-y-4 my-8 shadow-2xl backdrop-blur-xl">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h2 className="text-2xl font-bold text-white">تم نشر البلاغ بنجاح</h2>
            
            {/* رسالة الأمل والدعاء */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 max-w-lg mx-auto space-y-2">
              <p className="text-sm font-bold text-[#0EA5A5] flex items-center justify-center gap-1.5">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                راجعين بإذن الله...
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">
                وإن شاء الله تلقوهو وتفرحوا بلم شمله في القريب العاجل. جهودكم في النشر هي الأمل بعد ربنا سبحانه وتعالى.
              </p>
            </div>

            <p className="text-xs text-gray-400 pt-2">جاري توجيهك إلى صفحة البلاغات...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#081322] border border-white/10 rounded-2xl p-6 space-y-5 shadow-2xl backdrop-blur-xl">
            
            {/* رفع الصورة */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#0EA5A5]" /> صورة المفقود (إن وجدت)
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
                  <Upload className="w-4 h-4 text-[#0EA5A5]" />
                  <span>اختر صورة</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>

            {/* الاسم والعمر */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">الاسم الثلاثي / الرباعي *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="أدخل اسم المفقود"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#0EA5A5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">العمر *</label>
                <input
                  type="number"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="مثال: 25"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#0EA5A5]"
                />
              </div>
            </div>

            {/* المنطقة وتاريخ الفقدان */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0EA5A5]" /> المنطقة / المدينة *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="مثال: الخرطوم - بحري - المزاد"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#0EA5A5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" /> تاريخ الفقدان *
                </label>
                <input
                  type="date"
                  required
                  value={formData.missingSince}
                  onChange={(e) => setFormData({ ...formData, missingSince: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#0EA5A5]"
                />
              </div>
            </div>

            {/* رقم الهاتف */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#0EA5A5]" /> رقم التواصل *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0912345678"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#0EA5A5] dir-ltr text-right"
              />
            </div>

            {/* تفاصيل إضافية */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-gray-400" /> تفاصيل ومواصفات إضافية
              </label>
              <textarea
                rows={3}
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="أدخل المواصفات (الملابس، الطول، أي علامات مميزة...)"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#0EA5A5]"
              />
            </div>

            {/* زر الإرسال */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0EA5A5] hover:bg-[#0EA5A5]/90 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg flex items-center justify-center"
            >
              {loading ? "جاري نشر البلاغ..." : "نشر البلاغ الآن"}
            </button>
          </form>
        )}

      </div>
    </div>
  )
}