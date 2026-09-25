"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Calendar, User, ArrowRight, X, Phone, FileText, Inbox, Trash2, ZoomIn, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

// استيراد قاعدة البيانات والدوال الخاصة بـ Firebase Firestore
import { db, auth } from "@/app/firebase"; 
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";

// قائمة بجميع ولايات السودان الـ 18 والمدن الرئيسية
const SUDAN_LOCATIONS = [
  "كل المدن والولايات",
  "الخرطوم",
  "أم درمان",
  "بحري",
  "ود مدني",
  "بورتسودان",
  "ولاية الخرطوم",
  "ولاية الجزيرة",
  "ولاية البحر الأحمر",
  "ولاية كسلا",
  "ولاية القضارف",
  "ولاية سنار",
  "ولاية النيل الأبيض",
  "ولاية النيل الأزرق",
  "ولاية الشمالية",
  "ولاية نهر النيل",
  "ولاية شمال كردفان",
  "ولاية جنوب كردفان",
  "ولاية غرب كردفان",
  "ولاية شمال دارفور",
  "ولاية جنوب دارفور",
  "ولاية غرب دارفور",
  "ولاية وسط دارفور",
  "ولاية شرق دارفور"
];

const ADMIN_EMAIL = "b3eed2009@gmail.com";

interface Report {
  id: string;
  name: string;
  age: string;
  state?: string;
  city?: string;
  missingSince?: string;
  phone?: string;
  details?: string;
  image?: string | null;
  status?: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  createdAt?: any;
}

export default function SearchPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("كل المدن والولايات");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const { user } = useAuth(); // جلب بيانات المستخدم المسجل حالياً

  // جلب البيانات بالوقت الفعلي (Real-time) من Firebase
  useEffect(() => {
    const q = collection(db, "reports");
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reportsData: Report[] = snapshot.docs.map((docItem) => {
        const data = docItem.data();
        return {
          id: docItem.id,
          name: data.name || data.personName || "بدون اسم",
          age: data.age || "",
          state: data.state || "",
          city: data.city || "",
          missingSince: data.missingSince || "",
          phone: data.phone || "",
          details: data.details || "",
          image: data.image || null,
          status: data.status || "نشط",
          userId: data.userId || "",
          userEmail: data.userEmail || data.email || "",
          userName: data.userName || "",
          createdAt: data.createdAt,
        };
      }) as Report[];
      
      // ترتيب البلاغات من الأحدث للأقدم
      reportsData.sort((a: any, b: any) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      
      setReports(reportsData);
    }, (error) => {
      console.error("خطأ في جلب البلاغات:", error);
    });

    return () => unsubscribe();
  }, []);

  // التحقق الشامل هل المستخدم الحالي هو صاحب البلاغ أم الأدمن
  const isOwnerOrAdmin = (report: Report) => {
    const firebaseUser = auth.currentUser;
    const currentUserEmail = user?.email || firebaseUser?.email || "";
    const currentUserId = user?.id || firebaseUser?.uid || "";

    if (!currentUserEmail && !currentUserId) return false;

    // 1. صلاحية الأدمن
    if (currentUserEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase()) return true;

    // 2. مطابقة الـ userId
    if (report.userId && report.userId === currentUserId) return true;

    // 3. مطابقة البريد الإلكتروني
    if (report.userEmail && currentUserEmail && report.userEmail.toLowerCase() === currentUserEmail.toLowerCase()) return true;

    // 4. مطابقة اسم المستخدم للبلاغات القديمة
    if (report.userName && firebaseUser?.displayName && report.userName === firebaseUser.displayName) return true;

    return false;
  };

  // دالة تغيير حالة البلاغ إلى "تم العثور عليه"
  const handleMarkAsFound = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (confirm("هل أنت متأكد من تغيير حالة البلاغ إلى (تم العثور عليه)؟")) {
      try {
        await updateDoc(doc(db, "reports", id), {
          status: "تم العثور عليه",
          updatedAt: new Date()
        });
        if (selectedReport?.id === id) {
          setSelectedReport((prev) => prev ? { ...prev, status: "تم العثور عليه" } : null);
        }
        alert("تم تحديث حالة البلاغ بنجاح! 🎉");
      } catch (error: any) {
        console.error("خطأ أثناء تحديث الحالة:", error);
        alert("حدث خطأ أثناء تحديث الحالة: " + (error?.message || ""));
      }
    }
  };

  // دالة حذف البلاغ من Firebase
  const handleDeleteReport = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (confirm("هل أنت متأكد من رغبتك في حذف هذا البلاغ نهائياً؟")) {
      try {
        await deleteDoc(doc(db, "reports", id));
        if (selectedReport?.id === id) {
          setSelectedReport(null);
        }
        alert("تم حذف البلاغ بنجاح.");
      } catch (error: any) {
        console.error("خطأ أثناء حذف البلاغ:", error);
        alert("حدث خطأ أثناء الحذف: " + (error?.message || ""));
      }
    }
  };

  // فلترة البلاغات حسب البحث والولاية/المدينة
  const filteredReports = reports.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.city && item.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.state && item.state.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLocation =
      selectedLocation === "كل المدن والولايات" ||
      item.city === selectedLocation ||
      item.state === selectedLocation;

    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-[#030914] text-white p-4 md:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* الشريط العلوي للبحث واختيار الولاية */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">عرض البلاغات والبحث</h1>
            <p className="text-xs text-gray-400 mt-1">
              عدد النتائج المطابقة: <span className="text-[#0EA5A5] font-bold">{filteredReports.length}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* القائمة المنسدلة للولايات والمدن الـ 18 */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-[#081322] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#0EA5A5] cursor-pointer"
            >
              {SUDAN_LOCATIONS.map((loc) => (
                <option key={loc} value={loc} className="bg-[#081322] text-white">
                  {loc}
                </option>
              ))}
            </select>

            {/* مربع البحث بالاسم */}
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="ابحث بالاسم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-400 outline-none focus:border-[#0EA5A5]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
            </div>

            <Link href="/" className="text-xs text-gray-400 hover:text-white flex items-center gap-1 bg-white/5 px-3 py-2 rounded-xl border border-white/10 transition">
              <ArrowRight className="w-4 h-4" /> الرئيسية
            </Link>
          </div>
        </div>

        {/* في حالة عدم وجود بلاغات */}
        {filteredReports.length === 0 ? (
          <div className="bg-[#081322] border border-white/10 rounded-2xl p-12 text-center max-w-md mx-auto my-12 space-y-4">
            <div className="w-16 h-16 bg-white/5 text-gray-400 rounded-2xl flex items-center justify-center mx-auto border border-white/10">
              <Inbox className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">لا توجد بلاغات مسجلة حالياً</h3>
              <p className="text-xs text-gray-400 mt-1">عند قيام أي شخص بنشر بلاغ جديد، سيظهر هنا فوراً.</p>
            </div>
            <Link
              href="/report"
              className="inline-block bg-[#0EA5A5] hover:bg-[#0EA5A5]/90 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition"
            >
              إضافة بلاغ جديد
            </Link>
          </div>
        ) : (
          /* عرض كروت البلاغات */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => {
              const canControl = isOwnerOrAdmin(report);

              return (
                <div
                  key={report.id}
                  className="bg-[#081322] border border-white/10 rounded-2xl p-5 space-y-4 relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span
                        className={`text-[10px] px-3 py-1 rounded-full font-bold ${
                          report.status === "تم العثور عليه" || report.status === "found"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {report.status === "تم العثور عليه" || report.status === "found" ? "تم العثور عليه" : "مفقود"}
                      </span>

                      {/* أزرار الإدارة (تظهر فقط لصاحب البلاغ أو الأدمن) */}
                      {canControl && (
                        <div className="flex items-center gap-1.5">
                          {report.status !== "تم العثور عليه" && report.status !== "found" && (
                            <button
                              onClick={(e) => handleMarkAsFound(report.id, e)}
                              title="تم العثور عليه"
                              className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20 transition"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDeleteReport(report.id, e)}
                            title="حذف البلاغ"
                            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-1.5 rounded-lg border border-rose-500/20 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">{report.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">العمر: {report.age} سنة</p>
                      </div>

                      {/* الصورة القابلة للضغط والتكبير */}
                      <div 
                        onClick={() => report.image && setZoomedImage(report.image)}
                        className={`w-16 h-16 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0 group relative ${
                          report.image ? "cursor-pointer hover:border-[#0EA5A5]" : ""
                        }`}
                      >
                        {report.image ? (
                          <>
                            <img
                              src={report.image}
                              alt={report.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                              <ZoomIn className="w-5 h-5 text-white" />
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-slate-800/80 flex items-center justify-center text-gray-400">
                            <User className="w-7 h-7 stroke-[1.5]" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 space-y-1.5 text-xs text-gray-300 border-t border-white/5 pt-3">
                      {(report.city || report.state) && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#0EA5A5]" />
                          <span>{report.city} {report.state ? `- ${report.state}` : ''}</span>
                        </div>
                      )}
                      {report.missingSince && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>تاريخ الفقدان: {report.missingSince}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedReport(report)}
                    className="w-full bg-[#0EA5A5]/10 hover:bg-[#0EA5A5] text-[#0EA5A5] hover:text-white border border-[#0EA5A5]/30 py-2.5 rounded-xl text-xs font-bold transition mt-3"
                  >
                    التفاصيل الكاملة ورقم التواصل
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* النافذة المنبثقة للتفاصيل */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-40">
            <div className="bg-[#081322] border border-white/10 rounded-2xl p-6 max-w-lg w-full space-y-5 relative shadow-2xl">
              <button
                onClick={() => setSelectedReport(null)}
                className="absolute left-4 top-4 text-gray-400 hover:text-white p-1 rounded-lg bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                <div
                  onClick={() => selectedReport.image && setZoomedImage(selectedReport.image)}
                  className={`w-16 h-16 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0 relative group ${
                    selectedReport.image ? "cursor-pointer hover:border-[#0EA5A5]" : ""
                  }`}
                >
                  {selectedReport.image ? (
                    <>
                      <img src={selectedReport.image} alt={selectedReport.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-slate-800/80 flex items-center justify-center text-gray-400">
                      <User className="w-8 h-8 stroke-[1.5]" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedReport.name}</h2>
                  <p className="text-xs text-gray-400">العمر: {selectedReport.age} سنة</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0EA5A5]" />
                  <span>الموقع: {selectedReport.city || selectedReport.state || "غير محدد"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>تاريخ الفقدان: {selectedReport.missingSince || "غير محدد"}</span>
                </div>

                {selectedReport.details && (
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <div className="flex items-center gap-1.5 text-[#0EA5A5] font-bold">
                      <FileText className="w-4 h-4" />
                      <span>تفاصيل إضافية:</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{selectedReport.details}</p>
                  </div>
                )}

                <div className="bg-[#0EA5A5]/10 border border-[#0EA5A5]/30 p-4 rounded-xl flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Phone className="w-5 h-5 text-[#0EA5A5]" />
                    <span>رقم التواصل:</span>
                  </div>
                  <a
                    href={`tel:${selectedReport.phone}`}
                    className="text-base font-bold text-[#0EA5A5] hover:underline dir-ltr"
                  >
                    {selectedReport.phone || "غير متوفر"}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                {/* أزرار الإدارة داخل النافذة المنبثقة */}
                {isOwnerOrAdmin(selectedReport) && (
                  <>
                    {selectedReport.status !== "تم العثور عليه" && selectedReport.status !== "found" && (
                      <button
                        onClick={() => handleMarkAsFound(selectedReport.id)}
                        className="flex-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تم العثور عليه</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteReport(selectedReport.id)}
                      className="flex-1 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>حذف البلاغ</span>
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => setSelectedReport(null)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2.5 rounded-xl transition"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}

        {/* نافذة تكبير الصورة (LightBox) */}
        {zoomedImage && (
          <div 
            onClick={() => setZoomedImage(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 cursor-pointer animate-in fade-in duration-200"
          >
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-6 right-6 text-white hover:text-gray-300 p-2 rounded-full bg-white/10 border border-white/20"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="max-w-4xl max-h-[85vh] p-2 bg-[#081322] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={zoomedImage}
                alt="معاينة مكبرة"
                className="w-full h-full max-h-[80vh] object-contain rounded-xl"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}