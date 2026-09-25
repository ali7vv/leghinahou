"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Heart, MapPin, Calendar, User } from "lucide-react";

// استيراد قاعدة البيانات من الفايربيس
import { db } from "@/app/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

interface FoundCase {
  id: string;
  name: string;
  age: string;
  location: string;
  foundDate: string;
  story: string;
  image?: string | null;
}

export default function FoundCasesPage() {
  const [foundCases, setFoundCases] = useState<FoundCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // جلب البلاغات التي حُددت حالتها كـ "تم العثور عليه" أو "found" فقط
    const reportsRef = collection(db, "reports");
    const q = query(
      reportsRef,
      where("status", "in", ["تم العثور عليه", "found", "FOUND", "تم العثور"])
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const cases: FoundCase[] = [];

        snapshot.docs.forEach((docItem) => {
          const data = docItem.data();

          // تنسيق تاريخ التحديث أو الإنشاء
          let dateFormatted = "حديثاً";
          if (data.updatedAt?.toDate) {
            dateFormatted = data.updatedAt.toDate().toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "long",
            });
          } else if (data.createdAt?.toDate) {
            dateFormatted = data.createdAt.toDate().toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "long",
            });
          }

          cases.push({
            id: docItem.id,
            name: data.name || data.personName || "شخص تم العثور عليه",
            age: data.age || "غير محدد",
            location: data.city ? `${data.city} ${data.state ? `- ${data.state}` : ""}` : data.state || "غير محدد",
            foundDate: dateFormatted,
            story: data.details || "الحمد لله، بفضل الله وتكاتف المجتمع وأهل الخير تم العثور على الشخص وهو بحالة جيدة وسط ذويه وأهله.",
            image: data.image || null,
          });
        });

        setFoundCases(cases);
        setLoading(false);
      },
      (error) => {
        console.error("خطأ في جلب حالات العثور عليهم من الفايربيس:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <main className="relative min-h-[90vh] bg-[#030914] py-16 px-4 overflow-hidden" dir="rtl">
      
      {/* خلفية متدرجة */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#030914] via-[#081322] to-slate-900 opacity-95" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#00B488]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        
        {/* رأس الصفحة */}
        <div className="bg-gradient-to-r from-[#00B488] to-emerald-700 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
          <div className="space-y-2 text-center md:text-right">
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>فرحة لم الشمل</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black">الحالات التي تم العثور عليها الحمد لله</h1>
            <p className="text-white/90 text-sm max-w-lg">
              هنا تجد قصص النجاح لأشخاص تم إرجاعهم إلى أسرهم بسلام، لزرع الأمل في قلوب الجميع.
            </p>
          </div>
          <Link 
            href="/" 
            className="bg-white text-[#00B488] hover:bg-slate-100 px-6 py-3 rounded-2xl font-bold text-xs transition shadow-md flex items-center gap-2 shrink-0"
          >
            <ArrowRight className="w-4 h-4" />
            <span>الرجوع للرئيسية</span>
          </Link>
        </div>

        {/* عرض حالة التحميل */}
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            جاري جلب حالات العثور عليهم من قاعدة البيانات...
          </div>
        ) : foundCases.length === 0 ? (
          /* في حالة عدم وجود حالات */
          <div className="bg-[#081322] border border-white/10 rounded-3xl p-12 text-center text-gray-400 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto opacity-50" />
            <h3 className="text-lg font-bold text-white">لا توجد حالات حالياً</h3>
            <p className="text-xs">عند تغيير حالة أي بلاغ إلى (تم العثور عليه)، سيظهر هنا فوراً تلقائياً.</p>
          </div>
        ) : (
          /* قائمة الحالات الحقيقية */
          <div className="grid gap-4">
            {foundCases.map((item) => (
              <div 
                key={item.id} 
                className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition hover:bg-white"
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* الصورة إن وجدت */}
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-slate-400" />
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="p-1.5 bg-emerald-50 text-[#00B488] rounded-xl">
                        <CheckCircle2 className="w-5 h-5" />
                      </span>
                      <h3 className="text-xl font-bold text-slate-800">{item.name}</h3>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-semibold">
                        العمر: {item.age} {typeof item.age === "number" || !isNaN(Number(item.age)) ? "سنة" : ""}
                      </span>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.story}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-400 font-medium pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#00B488]" />
                        {item.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#00B488]" />
                        {item.foundDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}