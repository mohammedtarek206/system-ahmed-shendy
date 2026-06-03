"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    if (username === "admin" && password === "admin") {
      router.push("/admin");
    } else {
      alert("بيانات الدخول غير صحيحة");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4" dir="rtl">
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="relative w-24 h-24 mx-auto mb-4 border-4 border-white dark:border-slate-800 rounded-full shadow-lg overflow-hidden">
          <Image src="/logo.png" alt="العميد" fill className="object-cover" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">منصة العميد</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">تسجيل الدخول للوحة التحكم الإدارية</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-primary-600 to-primary-900 p-6 flex justify-center text-white">
          <ShieldCheck className="w-12 h-12" />
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-slate-700 dark:text-slate-300 font-bold text-sm">اسم المستخدم</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pr-12 pl-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-left dir-ltr"
                placeholder="admin"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-slate-700 dark:text-slate-300 font-bold text-sm">كلمة المرور</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pr-12 pl-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-left dir-ltr"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg rounded-xl shadow-lg transition-colors"
          >
            تسجيل الدخول
          </button>
        </form>
      </motion.div>
    </div>
  );
}
