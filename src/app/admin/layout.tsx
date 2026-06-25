"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Settings, LogOut, LayoutDashboard, Menu, X, MapPin, GraduationCap, UsersRound } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === "/admin/login") return <>{children}</>;

  const menuItems = [
    { name: "لوحة التحكم", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "الطلاب والحجوزات", href: "/admin/students", icon: <Users className="w-5 h-5" /> },
    { name: "إدارة السناتر", href: "/admin/centers", icon: <MapPin className="w-5 h-5" /> },
    { name: "إدارة المراحل", href: "/admin/grades", icon: <GraduationCap className="w-5 h-5" /> },
    { name: "إدارة المجموعات", href: "/admin/groups", icon: <UsersRound className="w-5 h-5" /> },
    { name: "الإعدادات", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex" dir="rtl">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:sticky top-0 right-0 z-50 h-screen w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary-600 dark:text-primary-400">لوحة الإدارة</h2>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6 text-slate-500" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  pathname === item.href
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 font-bold"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <Link href="/admin/login" className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
              <LogOut className="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </Link>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 lg:px-8">
          <button className="lg:hidden mr-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">المدير</div>
            <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">م</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
