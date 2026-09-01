"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "../firebase";
import Link from "next/link";
import { ArrowRight, Users, FileText, ShieldCheck, Phone, Lock, Mail, LogOut, Trash2, Calendar, MapPin } from "lucide-react";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // حالات تسجيل الدخول
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // مراقبة حالة تسجيل الدخول
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchData();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      // جلب المستخدمين
      const usersSnapshot = await getDocs(collection(db, "users"));
      setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // جلب البلاغات
      const reportsSnapshot = await getDocs(collection(db, "reports"));
      setReports(reportsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setLoginError("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // دالة حذف أي بلاغ عشوائي أو مزعج بضغطة زر
  const handleDeleteReport = async (reportId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا البلاغ نهائياً؟")) {
      try {
        await deleteDoc(doc(db, "reports", reportId));
        // إزالة البلاغ من القائمة محلياً لتحديث الشاشة فوراً
        setReports(reports.filter(report => report.id !== reportId));
      } catch (error) {
        console.error("Error deleting report: ", error);
        alert("حدث خطأ أثناء محاولة الحذف.");
      }
    }
  };

  // لو المستخدم ما مسجل دخول، اعرض ليهو شاشة تسجيل الدخول
  if (!user) {
    return (
      <div className="min-h-screen bg-[#030914] text-white flex items-center justify-center p-6" dir="rtl">
        <div className="max-w-md w-full bg-[#081322] border border-white/10 p-8 rounded-2xl space-y-6 shadow-xl">
          
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-[#0EA5A5]/10 text-[#0EA5A5] rounded-2xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-white">لوحة تحكم الأدمن</h1>
            <p className="text-xs text-gray-400">سجل دخولك بصفتك المسؤول للوصول للبيانات</p>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-300">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="b3eed2009@gmail.com"
                  className="w-full bg-[#030914] border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-xs text-white focus:outline-none focus:border-[#0EA5A5]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-300">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#030914] border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-xs text-white focus:outline-none focus:border-[#0EA5A5]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-[#0EA5A5] text-[#030914] font-bold py-3 rounded-xl text-xs transition hover:bg-[#0EA5A5]/90 disabled:opacity-50"
            >
              {loginLoading ? "جاري الدخول..." : "تسجيل الدخول"}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white transition">
              <ArrowRight className="w-3.5 h-3.5" /> العودة إلى الرئيسية
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // لو مسجل دخول، اعرض ليهو لوحة التحكم الكاملة
  return (
    <div className="min-h-screen bg-[#030914] text-white p-6 md:p-12" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* الهيدر وزر الخروج */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-[#0EA5A5]" /> لوحة تحكم الأدمن
            </h1>
            <p className="text-xs text-gray-400 mt-1">متابعة المستخدمين المسجلين، أرقام هواتفهم، وإدارة البلاغات بحرية.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/" className="inline-flex items-center gap-1 text-xs text-[#0EA5A5] bg-[#081322] border border-white/10 px-4 py-2 rounded-xl">
              <ArrowRight className="w-4 h-4" /> الرئيسية
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl hover:bg-red-500/20 transition"
            >
              <LogOut className="w-4 h-4" /> خروج
            </button>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#081322] border border-white/10 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-[#0EA5A5]/10 text-[#0EA5A5] rounded-xl"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-xs text-gray-400">إجمالي المستخدمين المسجلين</p>
              <h3 className="text-xl font-bold text-white">{users.length}</h3>
            </div>
          </div>

          <div className="bg-[#081322] border border-white/10 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-[#0EA5A5]/10 text-[#0EA5A5] rounded-xl"><FileText className="w-6 h-6" /></div>
            <div>
              <p className="text-xs text-gray-400">إجمالي البلاغات المقدمة</p>
              <h3 className="text-xl font-bold text-white">{reports.length}</h3>
            </div>
          </div>
        </div>

        {/* قسم البلاغات مع زر الحذف للإدارة */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white border-r-2 border-[#0EA5A5] pr-2">إدارة البلاغات (حذف اللعب والبلاغات الوهمية)</h2>
          {loading ? (
            <p className="text-xs text-gray-400">جاري تحميل البلاغات...</p>
          ) : reports.length === 0 ? (
            <p className="text-xs text-gray-400 bg-[#081322] p-5 rounded-2xl border border-white/10">لا توجد بلاغات مسجلة حتى الآن.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((report) => (
                <div key={report.id} className="bg-[#081322] border border-white/10 p-5 rounded-2xl space-y-3 relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">{report.missingName || report.name || "مفقود"}</h3>
                      <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{report.details || report.description || "لا توجد تفاصيل إضافية."}</p>
                    </div>
                    <span className="text-[10px] bg-[#030914] border border-white/10 px-2.5 py-1 rounded-lg text-[#0EA5A5]">
                      {report.status || "نشط"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-gray-400 pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#0EA5A5]" /> {report.location || "غير محدد"}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#0EA5A5]" /> <span dir="ltr">{report.phone || "بدون رقم"}</span></span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-[10px] text-gray-500 font-mono">ID: {report.id}</span>
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="inline-flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs px-3 py-1.5 rounded-xl transition border border-red-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> حذف البلاغ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* قسم المستخدمين المسجلين */}
        <div className="space-y-4 pt-6">
          <h2 className="text-lg font-bold text-white border-r-2 border-[#0EA5A5] pr-2">المستخدمون المسجلون بأرقامهم</h2>
          {users.length === 0 ? (
            <p className="text-xs text-gray-400 bg-[#081322] p-5 rounded-2xl border border-white/10">لا يوجد مستخدمين مسجلين حتى الآن.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((userItem) => (
                <div key={userItem.id} className="bg-[#081322] border border-white/10 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{userItem.fullName || "مستخدم"}</span>
                    <span className="text-[10px] text-gray-500">{userItem.state || "السودان"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#0EA5A5] bg-[#030914] p-2.5 rounded-xl border border-white/5">
                    <Phone className="w-3.5 h-3.5" />
                    <span dir="ltr" className="font-mono">{userItem.phone || userItem.id}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}