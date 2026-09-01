"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

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

  // حالات التحقق برقم الهاتف (OTP)
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [codeSent, setCodeSent] = useState(false);
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

  // إعداد حماية الـ reCAPTCHA (مطلوبة من فايربيز للتحقق من الأرقام)
  useEffect(() => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          // تم التحقق بنجاح من أن المستخدم ليس روبوت
        },
      });
    }
  }, []);

  // خطوة 1: إرسال كود التحقق لرقم الهاتف
  const handleSendCode = async () => {
    const cleanPhone = phone.replace(/\s+/g, "").replace(/-/g, "");
    
    // فحص مبدئي للرقم السوداني أو الدولي
    const isSudanLocal = /^(09|01)\d{8}$/.test(cleanPhone);
    const isSudanInternational = /^(\+249|249)\d{9}$/.test(cleanPhone);

    if (!isSudanLocal && !isSudanInternational) {
      alert("عذراً، رقم الهاتف غير صحيح. يرجى إدخال رقم هاتف سوداني صحيح (يبدأ بـ 09 أو 01).");
      return;
    }

    // تنسيق الرقم بالصيغة الدولية المطلوبة لـ Firebase (+249...)
    const formattedPhone = isSudanLocal ? `+249${cleanPhone.substring(1)}` : `+${cleanPhone.replace(/^0+/, '')}`;

    try {
      setSubmitting(true);
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setCodeSent(true);
      alert("تم إرسال كود التحقق إلى رقم هاتفكم بنجاح 📩");
    } catch (error: any) {
      console.error("خطأ في إرسال الكود:", error);
      alert("فشل إرسال كود التحقق. تأكد من صحة الرقم أو جرب لاحقاً. (تأكد من تفعيل Phone Auth في Firebase)");
    } finally {
      setSubmitting(false);
    }
  };

  // خطوة 2: تأكيد الكود وإرسال البلاغ نهائياً
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("الرجاء تسجيل الدخول أولاً.");
      router.push("/login");
      return;
    }

    if (!confirmationResult) {
      alert("الرجاء إرسال كود التحقق أولاً.");
      return;
    }

    if (!verificationCode || verificationCode.length < 6) {
      alert("الرجاء إدخال كود التحقق المكون من 6 أرقام بشكل صحيح.");
      return;
    }

    if (details.trim().length < 10) {
      alert("عذراً، يجب أن تكون تفاصيل المفقود أكثر من 10 حروف لضمان المصداقية.");
      return;
    }

    try {
      setSubmitting(true);

      // تأكيد كود الـ OTP عبر فايربيز
      await confirmationResult.confirm(verificationCode);

      // رفع البلاغ للـ Firestore بعد نجاح التحقق التام من الرقم
      const cleanPhone = phone.replace(/\s+/g, "").replace(/-/g, "");
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
        userName: user.fullName,
        userPhone: user.phone,
        createdAt: serverTimestamp(),
      });

      alert(
        "✨ تم التحقق من الرقم ونشر البلاغ بنجاح 🤍\n\n" +
        "﴿وَبَشِّرِ الصَّابِرِينَ﴾\n" +
        "اللهم رد كل غائب إلى أهله سالماً معافى 🤲"
      );

      router.push("/search");
    } catch (error: any) {
      console.error("خطأ في التحقق أو النشر:", error);
      alert("كود التحقق غير صحيح أو انتهت صلاحيته. يرجى التأكد وإعادة المحاولة.");
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
      <div id="recaptcha-container"></div> {/* عنصر الـ reCAPTCHA المخفي */}
      
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* الشريط العلوي */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <h1 className="text-xl font-bold">إضافة بلاغ مفقود مع التحقق برقم الهاتف</h1>
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
              <label className="text-xs text-gray-300 block mb-1">رقم التواصل المراد التحقق منه <span className="text-rose-500">*</span></label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  disabled={codeSent}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912345678"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#0EA5Id5] dir-ltr text-right disabled:opacity-50"
                />
                {!codeSent && (
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={submitting}
                    className="bg-[#0EA5A5] hover:bg-[#0EA5A5]/90 text-white font-bold px-4 py-3 rounded-xl text-xs whitespace-nowrap transition cursor-pointer disabled:opacity-50"
                  >
                    إرسال الكود
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* حقل إدخال كود التحقق (يظهر فقط بعد إرسال الكود) */}
          {codeSent && (
            <div className="bg-[#0EA5A5]/10 border border-[#0EA5A5]/30 p-4 rounded-xl space-y-2">
              <label className="text-xs text-[#0EA5A5] font-bold block">أدخل كود التحقق المكون من 6 أرقام المرسل لهاتفك:</label>
              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="123456"
                className="w-full p-3 bg-white/5 border border-[#0EA5A5]/50 rounded-xl text-xs text-white outline-none tracking-widest text-center font-bold text-lg"
              />
              <p className="text-[10px] text-gray-400">إذا لم يصلك الكود، تأكد من الرقم أو أعد تحديث الصفحة.</p>
            </div>
          )}

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
            <label className="text-xs text-gray-300 block mb-1">تفاصيل إضافية أو علامات مميزة (أكثر من 10 حروف)</label>
            <textarea
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="اكتب أي معلومات أخرى..."
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#0EA5A5] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !codeSent}
            className="w-full bg-[#0EA5A5] hover:bg-[#0EA5A5]/90 text-white font-bold py-3.5 rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
          >
            {submitting ? "جاري التحقق والنشر..." : "تأكيد الكود ونشر البلاغ رسمياً"}
          </button>

        </form>
      </div>
    </div>
  );
}