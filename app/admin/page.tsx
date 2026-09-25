"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

interface UserData {
  id: string;
  name?: string;
  email?: string;
  photoURL?: string;
  createdAt?: any;
}

interface ReportData {
  id: string;
  personName?: string;
  location?: string;
  status?: string;
  createdAt?: any;
  [key: string]: any;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "reports">("reports");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. جلب قائمة المستخدمين
      const usersSnap = await getDocs(collection(db, "users"));
      const usersList: UserData[] = [];
      usersSnap.forEach((docSnap) => {
        usersList.push({ id: docSnap.id, ...docSnap.data() } as UserData);
      });
      setUsers(usersList);

      // 2. جلب قائمة البلاغات
      const reportsSnap = await getDocs(collection(db, "reports"));
      const reportsList: ReportData[] = [];
      reportsSnap.forEach((docSnap) => {
        reportsList.push({ id: docSnap.id, ...docSnap.data() } as ReportData);
      });
      setReports(reportsList);
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error);
    } finally {
      setLoading(false);
    }
  };

  // حذف بلاغ معين
  const handleDeleteReport = async (reportId: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا البلاغ نهائياً؟")) return;

    try {
      console.log("محاولة حذف البلاغ برقم:", reportId);
      await deleteDoc(doc(db, "reports", reportId));
      setReports(reports.filter((r) => r.id !== reportId));
      alert("تم حذف البلاغ بنجاح.");
    } catch (error: any) {
      console.error("خطأ أثناء الحذف بالتفصيل:", error);
      alert(`تعذر حذف البلاغ. تأكد من قواعد الفايربيس (Firestore Rules). الخطأ: ${error.message || error}`);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-white">جاري تحميل لوحة التحكم...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* الهيدر والتبويب */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h1 className="text-xl font-bold">لوحة تحكم الأدمن (لقيناهو)</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "reports"
                  ? "bg-[#00B488] text-white"
                  : "bg-slate-900 border border-slate-800 text-slate-400"
              }`}
            >
              إدارة البلاغات ({reports.length})
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "users"
                  ? "bg-[#00B488] text-white"
                  : "bg-slate-900 border border-slate-800 text-slate-400"
              }`}
            >
              المستخدمين المسجلين ({users.length})
            </button>
          </div>
        </div>

        {/* جدول البلاغات */}
        {activeTab === "reports" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
            <h2 className="text-sm font-bold mb-4">قائمة البلاغات المرفوعة</h2>
            {reports.length === 0 ? (
              <p className="text-xs text-slate-400">لا توجد بلاغات حالياً.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">اسم المفقود/المعثور عليه</th>
                      <th className="p-3">الموقع/الولاية</th>
                      <th className="p-3">الحالة</th>
                      <th className="p-3 text-center">التحكم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {reports.map((report) => (
                      <tr key={report.id} className="hover:bg-slate-800/30 transition">
                        <td className="p-3 font-medium">{report.personName || report.name || "غير محدد"}</td>
                        <td className="p-3">{report.location || report.city || "غير محدد"}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                            {report.status || "نشط"}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteReport(report.id)}
                            className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-xl font-bold transition text-[11px]"
                          >
                            حذف البلاغ
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* جدول المستخدمين المسجلين */}
        {activeTab === "users" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
            <h2 className="text-sm font-bold mb-4">قائمة حسابات المستخدمين المسجلين</h2>
            {users.length === 0 ? (
              <p className="text-xs text-slate-400">لا يوجد مستخدمين مسجلين حتى الآن.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">المستخدم</th>
                      <th className="p-3">البريد الإلكتروني</th>
                      <th className="p-3">معرف المستخدم (UID)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/30 transition">
                        <td className="p-3 flex items-center gap-2">
                          {u.photoURL ? (
                            <img src={u.photoURL} alt="" className="w-7 h-7 rounded-full" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#00B488] text-white flex items-center justify-center font-bold text-[10px]">
                              {u.name?.[0] || "U"}
                            </div>
                          )}
                          <span className="font-bold">{u.name || "مستخدم"}</span>
                        </td>
                        <td className="p-3 font-mono dir-ltr text-right">{u.email || "بدون بريد"}</td>
                        <td className="p-3 font-mono text-slate-400 text-[10px]">{u.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}