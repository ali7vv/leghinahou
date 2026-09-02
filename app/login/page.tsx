"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LogIn, Phone, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { db, app } from "../firebase"; 
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const auth = getAuth(app);

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: إدخال الرقم، 2: إدخال كود التحقق
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  // إعداد حماية الـ reCAPTCHA الخاصة بـ Firebase (مخفية أمنياً)
  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
      }, app);
    }
  };

  // الخطوة 1: إرسال كود التحقق لرقم الهاتف
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || phone.length < 9) {
      alert("الرجاء إدخال رقم هاتف صحيح");
      return;
    }

    setLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      // ضبط مفتاح الدولة تلقائياً للسودان +249
      const formattedPhone = phone.startsWith("+") ? phone : "+249" + phone.replace(/^0+/, "");

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setStep(2); // الانتقال لخطوة إدخال الرمز
      alert("تم إرسال رمز التحقق إلى هاتفك بنجاح.");
    } catch (error) {
      console.error("خطأ أثناء إرسال الكود:", error);
      alert("حدث خطأ أثناء إرسال الكود، تأكد من صحة الرقم أو حاول لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  // الخطوة 2: التحقق من الكود المدخل وحفظ بيانات المستخدم ودخول المنصة
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. تأكيد كود الـ OTP مع فايربيز
      await confirmationResult.confirm(otp);

      const fullName = phone === "0912345678" ? "محمد أحمد" : `مستخدم (${phone})`;

      // 2. حفظ البيانات في مجموعة users داخل Firestore
      await setDoc(doc(db, "users", phone), {
        fullName: fullName,
        phone: phone,
        state: "السودان",
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      }, { merge: true });

      // 3. تحديث حالة السياق (Context)
      login({
        fullName: fullName,
        phone: phone,
        state: "السودان",
      });

      alert("تم التحقق وتسجيل الدخول بنجاح!");
      router.push("/");
    } catch (error) {
      console.error("رمز التحقق غير صحيح:", error);
      alert("رمز التحقق غير صحيح، تأكد من الرمز المدخل.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030914] text-white flex items-center justify-center p-4" dir="rtl">
      
      {/* عنصر ريكابتشا الإجباري لعمل فايربيز هاتفياً */}
      <div id="recaptcha-container"></div>

      <div className="bg-[#081322] border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <LogIn className="text-[#0EA5A5] w-5 h-5" />
            {step === 1 ? "تسجيل الدخول برقم الهاتف" : "إدخال رمز التحقق (OTP)"}
          </h1>
          <Link href="/" className="text-xs text-gray-400 hover:text-white flex items-center gap-1 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10 transition">
            <ArrowRight className="w-3.5 h-3.5" /> الرئيسية
          </Link>
        </div>

        {step === 1 ? (
          /* خطوة إدخال رقم الهاتف */
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">رقم الهاتف</label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <Phone className="w-4 h-4" />
                </span>
                <input 
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912345678"
                  className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 outline-none focus:border-[#0EA5A5]"
                  dir="ltr"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">سيرسل النظام كود تحقق SMS لضمان أمان حسابك.</p>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#0EA5A5] hover:bg-[#0EA5A5]/90 text-white font-bold text-sm py-3 rounded-xl transition duration-200 mt-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? "جاري إرسال الكود..." : "إرسال رمز التحقق"}
            </button>
          </form>
        ) : (
          /* خطوة إدخال رمز التحقق الأمني */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">أدخل الرمز المكون من 6 أرقام</label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-[#0EA5A5]" />
                </span>
                <input 
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-center tracking-widest font-mono text-lg text-white placeholder-gray-500 outline-none focus:border-[#0EA5A5]"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3 rounded-xl transition duration-200 mt-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? "جاري التحقق..." : "تأكيد ودخول للمنصة ✅"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-xs text-gray-400 hover:text-white mt-2 transition"
            >
              تغيير رقم الهاتف أو إعادة الإرسال
            </button>
          </form>
        )}

        <p className="text-xs text-center text-gray-400 mt-6 pt-4 border-t border-white/5">
          منصة لقيناهو موثقة وآمنة لحماية بلاغات المفقودات.
        </p>
      </div>
    </div>
  );
}