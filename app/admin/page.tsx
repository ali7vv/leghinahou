"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // تم تعديل مسار الفايربيز هنا ليطابق مشروعك مباشرة
import Link from "next/link";
import { ArrowRight, Users, FileText, ShieldCheck, Phone } from "lucide-react";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // جلب المستخدمين
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersList);

        // جلب البلاغات
        const reportsSnapshot = await getDocs(collection(db, "reports"));
        const reportsList = reportsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReports(reportsList);

      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#030914] text-white p-6 md:p-12" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* رأس الصفحة وزر العودة */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-[#0EA5A5]" /> لوحة تحكم الأدمن
            </h1>
            <p className="text-xs text-gray-400 mt-1">متابعة المستخدمين المسجلين وأرقام هواتفهم والبلاغات النشطة في المنصة.</p>
          </div>
          <Link href="/" className="inline-flex items-center gap-1 text-xs text-[#0EA5A5] hover:underline bg-[#081322] border border-white/10 px-4 py-2 rounded-xl">
            <ArrowRight className="w-4 h-4" /> الرئيسية
          </Link>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#081322] border border-white/10 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-[#0EA5A5]/10 text-[#0EA5A5] rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400">إجمالي المستخدمين المسجلين</p>
              <h3 className="text-xl font-bold text-white">{users.length}</h3>
            </div>
          </div>

          <div className="bg-[#081322] border border-white/10 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-[#0EA5A5]/10 text-[#0EA5A5] rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400">إجمالي البلاغات المقدمة</p>
              <h3 className="text-xl font-bold text-white">{reports.length}</h3>
            </div>
          </div>
        </div>

        {/* قسم المستخدمين وأرقام هواتفهم */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white border-r-2 border-[#0EA5A5] pr-2">المستخدمون المسجلون بأرقامهم</h2>
          
          {loading ? (
            <p className="text-xs text-gray-400">جاري تحميل البيانات...</p>
          ) : users.length === 0 ? (
            <p className="text-xs text-gray-400 bg-[#081322] p-5 rounded-2xl border border-white/10">لا يوجد مستخدمين مسجلين حتى الآن.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <div key={user.id} className="bg-[#081322] border border-white/10 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{user.fullName || "مستخدم"}</span>
                    <span className="text-[10px] text-gray-500">{user.state || "السودان"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#0EA5A5] bg-[#030914] p-2.5 rounded-xl border border-white/5">
                    <Phone className="w-3.5 h-3.5" />
                    <span dir="ltr" className="font-mono">{user.phone || user.id}</span>
                  </div>
                  <p className="text-[10px] text-gray-500">
                    آخر دخول: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "غير محدد"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}