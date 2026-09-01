"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // تم تصحيح المسار هنا ليطابق مكان ملف الفايربيس

interface User {
  fullName: string;
  phone: string;
  state: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("liqinahem_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // دالة تسجيل الدخول والحفظ التلقائي في قاعدة البيانات (Firestore)
  const login = async (userData: User) => {
    try {
      // 1. حفظ البيانات محلياً للسرعة
      setUser(userData);
      localStorage.setItem("liqinahem_user", JSON.stringify(userData));

      // 2. حفظ أو تحديث المستخدم في Firestore باستخدام رقم الهاتف كـ ID
      const userRef = doc(db, "users", userData.phone);
      await setDoc(userRef, {
        fullName: userData.fullName,
        phone: userData.phone,
        state: userData.state,
        lastLogin: new Date().toISOString(),
      }, { merge: true }); // الـ merge عشان لو المستخدم قديم ما يمسح بياناته القديمة ويحدثها بس

    } catch (error) {
      console.error("خطأ أثناء حفظ بيانات المستخدم في قاعدة البيانات:", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("liqinahem_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}