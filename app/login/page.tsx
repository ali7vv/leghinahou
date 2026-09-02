"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { db } from "@/app/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { login } = useAuth();

  const getFormattedPhone = (rawPhone: string) => {
    const cleaned = rawPhone.replace(/\D/g, "");
    if (cleaned.startsWith("249")) {
      return "+" + cleaned;
    }
    return "+249" + cleaned.replace(/^0+/, "");
  };

  const handleRequestSecureOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      alert("الرجاء إدخال الاسم الكامل ورقم الهاتف.");
      return;
    }

    const formattedPhone = getFormattedPhone(phone);
    const secureOtp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      await setDoc(doc(db, "verificationCodes", formattedPhone), {
        otp: secureOtp,
        createdAt: new Date(),
      });

      // تم التحديث لاستخدام رابط السيرفر السحابي على Render بدلاً من localhost
      const response = await fetch("https://laqaynaho-whatsapp-bot.onrender.com/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formattedPhone,
          otp: secureOtp,
          fullName: fullName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPhone(formattedPhone);
        setStep(2);
        alert("✅ تم إرسال رمز التحقق إلى واتساب الخاص بك تلقائياً عبر البوت!");
      } else {
        alert("❌ فشل إرسال الرسالة عبر البوت: " + (data.error || "خطأ غير معروف"));
      }
    } catch (error) {
      console.error("خطأ في الاتصال بالسيرفر:", error);
      alert("⚠️ حدث خطأ أثناء الاتصال بسيرفر البوت السحابي.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPhone = phone.startsWith("+") ? phone : getFormattedPhone(phone);

    try {
      const docRef = doc(db, "verificationCodes", formattedPhone);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        alert("انتهت صلاحية الرمز. الرجاء طلب رمز جديد.");
        setStep(1);
        return;
      }

      const serverOtp = docSnap.data().otp;

      if (enteredOtp !== serverOtp) {
        alert("رمز التحقق غير صحيح!");
        return;
      }

      login(formattedPhone, fullName, "الخرطوم");
      alert("تم التحقق وتسجيل الدخول بنجاح!");
      router.push("/");
    } catch (error) {
      console.error("خطأ:", error);
      alert("حدث خطأ أثناء مطابقة الرمز.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" dir="rtl">
      <div className="max-w-md w-full bg-card border border-border p-8 rounded-3xl shadow-sm">
        <h2 className="text-xl font-bold mb-2 text-foreground">تسجيل الدخول الآمن والمحمي</h2>
        <p className="text-xs text-muted-foreground mb-6">التحقق يتم عبر إرسال رمز سري حصري لواتساب الرقم آلياً</p>

        {step === 1 ? (
          <form onSubmit={handleRequestSecureOtp} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-2">الاسم الكامل</label>
              <input
                type="text"
                placeholder="مثال: علي عوض"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-xs text-foreground focus:outline-none focus:border-[#0EA5A5]"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground block mb-2">رقم الهاتف (المرتبط بالواتساب)</label>
              <input
                type="text"
                placeholder="912345678 أو 0117550533"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-xs text-foreground focus:outline-none focus:border-[#0EA5A5]"
                dir="ltr"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#0EA5A5] text-white py-3 rounded-2xl font-bold text-xs hover:opacity-90 transition"
            >
              إرسال رمز التحقق للواتساب
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-xs text-emerald-600 space-y-2">
              <p className="font-bold">تم إرسال الرمز تلقائياً لرقم الواتساب: {phone}</p>
              <p className="text-muted-foreground">أدخل الرمز المكون من 6 أرقام الوصلك في رسالة البوت أدناه:</p>
            </div>

            <div>
              <label className="text-xs text-muted-foreground block mb-2">رمز التحقق</label>
              <input
                type="text"
                placeholder="123456"
                maxLength={6}
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm font-mono tracking-widest text-center text-foreground focus:outline-none focus:border-[#0EA5A5]"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold text-xs hover:opacity-90 transition"
            >
              تأكيد الدخول
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground mt-2"
            >
              الرجوع لتعديل رقم الهاتف
            </button>
          </form>
        )}
      </div>
    </div>
  );
}