"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface UserType {
  phone: string;
  fullName: string;
  location?: string;
}

interface AuthContextType {
  user: UserType | null;
  login: (phone: string, fullName: string, location?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("laqaynaho_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (phone: string, fullName: string, location = "الخرطوم") => {
    const userData = { phone, fullName, location };
    setUser(userData);
    localStorage.setItem("laqaynaho_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("laqaynaho_user");
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