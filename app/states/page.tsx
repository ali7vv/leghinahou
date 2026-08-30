"use client";

import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

export default function StatesPage() {
  const states = [
    "الخرطوم", "الجزيرة", "نهر النيل", "الشمالية", 
    "البحر الأحمر", "القضارف", "كسلا", "سنار", 
    "النيل الأبيض", "النيل الأزرق", "شمال كردفان", "جنوب كردفان", 
    "غرب كردفان", "شمال دارفور", "جنوب دارفور", "غرب دارفور", 
    "وسط دارفور", "شرق دارفور"
  ];

  return (
    <div className="min-h-screen bg-[#030914] text-white p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="text-[#0EA5A5]" />
            البحث حسب الولاية
          </h1>
          <Link href="/" className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
            <ArrowRight className="w-4 h-4" /> العودة للرئيسية
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {states.map((stateName, index) => (
            <Link 
              key={index} 
              href={`/search?state=${encodeURIComponent(stateName)}`}
              className="bg-[#081322] border border-white/10 hover:border-[#0EA5A5] p-4 rounded-xl text-center transition flex flex-col items-center justify-center gap-2 group"
            >
              <MapPin className="w-6 h-6 text-[#0EA5A5] group-hover:scale-110 transition" />
              <span className="font-bold text-sm text-gray-200 group-hover:text-white">{stateName}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}