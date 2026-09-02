"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import { Search, MapPin, CheckCircle, MessageCircle, Share2, User } from "lucide-react";

export default function LatestReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("الكل");

  useEffect(() => {
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reportsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReports(reportsList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching reports: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleMarkAsResolved = async (reportId: string) => {
    if (confirm("هل أنت متأكد من تغيير حالة البلاغ إلى (تم العثور عليه)؟")) {
      try {
        const reportRef = doc(db, "reports", reportId);
        await updateDoc(reportRef, { status: "تم العثور عليه ✅" });
      } catch (error) {
        console.error("Error updating status: ", error);
        alert("حدث خطأ أثناء تحديث الحالة.");
      }
    }
  };

  const shareOnWhatsApp = (report: any) => {
    const text = `🚨 بلاغ مفقود عاجل:\n👤 الاسم: ${report.name || report.missingName}\n📍 المكان: ${report.lastPlace || report.location}\n📞 الهاتف: ${report.phone}\n\nشارِك البلاغ عله يساهم في إيجاده عبر منصة لقيناهو.`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const filteredReports = reports.filter((report) => {
    const nameMatch = (report.name || report.missingName || "").toLowerCase().includes(searchTerm.toLowerCase());
    const locationMatch = selectedLocation === "الكل" || (report.lastPlace || report.location || "").includes(selectedLocation);
    return nameMatch && locationMatch;
  });

  return (
    <section id="latest-reports-section" className="mx-auto max-w-6xl px-4 py-12" dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">أحدث البلاغات المباشرة</h2>
          <p className="text-xs text-muted-foreground mt-1">تابع أحدث حالات المفقودات وساهم في نشرها</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setSearchTerm("");
              setSelectedLocation("الكل");
            }}
            className="text-xs text-[#0EA5A5] hover:underline font-bold cursor-pointer transition"
          >
            عرض الكل
          </button>
          <span className="text-xs text-[#0EA5A5] bg-[#0EA5A5]/10 border border-[#0EA5A5]/20 px-3 py-1.5 rounded-xl font-bold">
            {filteredReports.length} بلاغ نشط
          </span>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute right-3.5 top-3.5 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="ابحث باسم المفقود..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 pr-10 text-xs text-foreground focus:outline-none focus:border-[#0EA5A5] shadow-sm"
          />
        </div>

        <div className="relative">
          <MapPin className="absolute right-3.5 top-3.5 size-4 text-muted-foreground" />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 pr-10 text-xs text-foreground focus:outline-none focus:border-[#0EA5A5] shadow-sm"
          >
            <option value="الكل">كل المدن والولايات</option>
            <option value="الخرطوم">الخرطوم</option>
            <option value="أمدرمان">أمدرمان</option>
            <option value="بحري">بحري</option>
            <option value="ودمدني">ودمدني</option>
            <option value="بورتسودان">بورتسودان</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block size-6 animate-spin rounded-full border-2 border-solid border-[#0EA5A5] border-r-transparent"></div>
          <p className="text-xs text-muted-foreground mt-3">جاري تحميل البلاغات الحية...</p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-2xl p-8 shadow-sm">
          <p className="text-xs text-muted-foreground">لا توجد بلاغات تطابق بحثك حالياً.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredReports.map((report) => (
            <article
              key={report.id}
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#0EA5A5]/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-3.5 p-4 pb-3">
                  <div className="relative shrink-0">
                    <img
                      src={report.image || report.imageUrl || "/placeholder.svg"}
                      alt={report.name || report.missingName}
                      className="size-20 rounded-2xl object-cover border border-border group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className={`absolute -bottom-2 -right-2 rounded-full px-2 py-0.5 text-[9px] font-bold text-white shadow-md ${
                      report.status === "تم العثور عليه ✅" ? "bg-emerald-600" : "bg-rose-500 animate-pulse"
                    }`}>
                      {report.status || "نشط"}
                    </span>
                  </div>

                  <div className="flex flex-col justify-center gap-1 text-right w-full overflow-hidden">
                    <h3 className="text-sm font-bold text-foreground truncate">
                      {report.name || report.missingName}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded-md">
                        <User className="size-3 text-[#0EA5A5]" /> العمر: {report.age || "غير محدد"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground truncate mt-0.5">
                      <MapPin className="size-3 text-rose-500 shrink-0" />
                      <span className="truncate">{report.lastPlace || report.location || "غير محدد"}</span>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-3">
                  <div className="bg-muted/40 border border-border/50 p-2.5 rounded-2xl">
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {report.details || report.description || "لا توجد تفاصيل إضافية مسجلة لهذا البلاغ."}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-3">
                  <div className="flex items-center justify-between bg-[#0EA5A5]/5 border border-[#0EA5A5]/15 px-3 py-2 rounded-xl text-xs text-[#0EA5A5]">
                    <span className="font-semibold text-[10px] text-muted-foreground">رقم التواصل:</span>
                    <span className="font-mono font-bold tracking-wider" dir="ltr">
                      {report.phone || "بدون رقم"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border bg-muted/20 p-3 flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => shareOnWhatsApp(report)}
                    className="flex items-center justify-center gap-1 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 py-2 text-[11px] font-bold transition"
                  >
                    <MessageCircle className="size-3.5" /> واتساب
                  </button>

                  <button
                    onClick={() => shareOnFacebook()}
                    className="flex items-center justify-center gap-1 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 py-2 text-[11px] font-bold transition"
                  >
                    <Share2 className="size-3.5" /> فيسبوك
                  </button>
                </div>

                {report.status !== "تم العثور عليه ✅" && (
                  <button
                    onClick={() => handleMarkAsResolved(report.id)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2 text-[11px] font-bold text-foreground hover:bg-muted transition shadow-sm"
                  >
                    <CheckCircle className="size-3.5 text-emerald-500" /> تم العثور عليه؟
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}