"use client";

import { useState, useEffect } from "react";
import { Users, TrendingUp, BookOpen, Loader2, MapPin, GraduationCap, UsersRound } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Group {
  id: string;
  grade: string;
  center: string;
  groupName: string;
  days: string;
  time: string;
  maxSeats: number;
  isOpen: boolean;
  color: string;
  bgLight: string;
  borderLight: string;
  bookedSeats: number;
}

export default function AdminDashboard() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [globalSettings, setGlobalSettings] = useState({ isBookingOpen: true });
  const [isLoading, setIsLoading] = useState(true);
  const [todayBookingsCount, setTodayBookingsCount] = useState(0);
  const [centersCount, setCentersCount] = useState(0);
  const [gradesCount, setGradesCount] = useState(0);

  const fetchData = async () => {
    try {
      const [groupsRes, settingsRes, bookingsRes, centersRes, gradesRes] = await Promise.all([
        fetch("/api/groups"),
        fetch("/api/settings"),
        fetch("/api/bookings"),
        fetch("/api/centers"),
        fetch("/api/grades"),
      ]);

      if (groupsRes.ok) setGroups(await groupsRes.json());
      if (settingsRes.ok) { const s = await settingsRes.json(); setGlobalSettings({ isBookingOpen: s.isBookingOpen }); }
      if (centersRes.ok) { const c = await centersRes.json(); setCentersCount(c.length); }
      if (gradesRes.ok) { const g = await gradesRes.json(); setGradesCount(g.length); }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        const todayStr = new Date().toDateString();
        setTodayBookingsCount(bookingsData.filter((b: any) => new Date(b.createdAt).toDateString() === todayStr).length);
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Toggle group status
  const handleToggleGroup = async (groupId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/groups", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: groupId, isOpen: !currentStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setGroups(groups.map((g) => (g.id === groupId ? { ...g, isOpen: updated.isOpen } : g)));
      }
    } catch (err) {
      console.error("Error toggling group booking:", err);
    }
  };

  // Toggle global settings booking
  const handleToggleGlobalBooking = async () => {
    const newStatus = !globalSettings.isBookingOpen;
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBookingOpen: newStatus }),
      });

      if (res.ok) {
        setGlobalSettings({ isBookingOpen: newStatus });
      }
    } catch (err) {
      console.error("Error toggling global booking:", err);
    }
  };

  // Export Excel trigger
  const handleExportExcel = () => {
    window.location.href = "/api/export";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        <p className="text-lg font-bold text-slate-600 dark:text-slate-400">جاري تحميل إحصائيات لوحة التحكم...</p>
      </div>
    );
  }

  const totalStudents = groups.reduce((acc, g) => acc + (g.bookedSeats || 0), 0);

  const stats = [
    { label: "إجمالي الطلاب المسجلين", value: totalStudents.toString(), icon: <Users className="w-8 h-8 text-blue-500" />, bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "حجوزات اليوم", value: todayBookingsCount.toString(), icon: <TrendingUp className="w-8 h-8 text-green-500" />, bg: "bg-green-50 dark:bg-green-900/20" },
    { label: "المجموعات", value: groups.length.toString(), icon: <UsersRound className="w-8 h-8 text-purple-500" />, bg: "bg-purple-50 dark:bg-purple-900/20" },
    { label: "السناتر", value: centersCount.toString(), icon: <MapPin className="w-8 h-8 text-orange-500" />, bg: "bg-orange-50 dark:bg-orange-900/20" },
    { label: "المراحل الدراسية", value: gradesCount.toString(), icon: <GraduationCap className="w-8 h-8 text-teal-500" />, bg: "bg-teal-50 dark:bg-teal-900/20" },
    { label: "المقاعد المحجوزة", value: `${totalStudents} / ${groups.reduce((a, g) => a + g.maxSeats, 0)}`, icon: <BookOpen className="w-8 h-8 text-indigo-500" />, bg: "bg-indigo-50 dark:bg-indigo-900/20" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">نظرة عامة على المنصة</h1>
        <div className="flex gap-2 flex-wrap">
          <Link href="/admin/centers" className="px-4 py-2 text-sm font-bold bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-xl hover:bg-orange-200 dark:hover:bg-orange-900/40 transition-colors">🏢 السناتر</Link>
          <Link href="/admin/grades" className="px-4 py-2 text-sm font-bold bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 rounded-xl hover:bg-teal-200 dark:hover:bg-teal-900/40 transition-colors">🎓 المراحل</Link>
          <Link href="/admin/groups" className="px-4 py-2 text-sm font-bold bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors">👥 المجموعات</Link>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4"
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        
        {/* Groups Overview */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">إحصائيات المجموعات</h2>
          <div className="space-y-4">
            {groups.map((group) => {
              return (
                <div key={group.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {group.grade} - {group.center}
                      </p>
                      <p className="text-sm text-slate-500 font-medium">
                        {group.groupName} | {group.days} - {group.time}
                      </p>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg flex gap-3 items-center text-sm">
                      <div className="text-center">
                        <p className="font-black text-slate-900 dark:text-white text-lg">{group.bookedSeats}</p>
                        <p className="text-xs text-slate-500">مسجل</p>
                      </div>
                      <div className="w-px h-8 bg-slate-300 dark:bg-slate-600" />
                      <div className="text-center">
                        <p className={`font-black text-lg ${(group.maxSeats - group.bookedSeats) <= 5 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                          {Math.max(0, group.maxSeats - group.bookedSeats)}
                        </p>
                        <p className="text-xs text-slate-500">متبقي</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Manual Open/Close Toggle for the group */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">حالة الحجز للمجموعة:</span>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={group.isOpen}
                        onChange={() => handleToggleGroup(group.id, group.isOpen)}
                      />
                      <div className="w-11 h-6 bg-red-500 peer-focus:outline-none rounded-full peer dark:bg-red-600 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-green-500"></div>
                      <span className={`ml-3 mr-3 text-sm font-bold ${group.isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {group.isOpen ? "مفتوح" : "مغلق"}
                      </span>
                    </label>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick controls */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">التحكم السريع</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">حالة الحجز العام</p>
                <p className="text-sm text-slate-500 font-medium">تعطيل / تفعيل إمكانية حجز جميع الطلاب</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={globalSettings.isBookingOpen}
                  onChange={handleToggleGlobalBooking}
                />
                <div className="w-11 h-6 bg-red-500 peer-focus:outline-none rounded-full peer dark:bg-red-600 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-green-500"></div>
                <span className={`ml-3 mr-3 text-sm font-bold ${globalSettings.isBookingOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {globalSettings.isBookingOpen ? "مفتوح" : "مغلق"}
                </span>
              </label>
            </div>
            
            <button 
              onClick={handleExportExcel}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-[1.02]"
            >
              تصدير بيانات جميع الطلاب (Excel)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
