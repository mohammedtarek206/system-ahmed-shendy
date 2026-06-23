"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface Group {
  id: string;
  grade: string;
  center: string;
  groupName: string;
  days: string;
  time: string;
  isOpen: boolean;
  color: string;
  bgLight: string;
  borderLight: string;
  bookedSeats: number;
}

export default function GroupSelectionPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      const res = await fetch("/api/groups");
      if (res.ok) {
        const data = await res.json();
        console.log(`[Booking Page] Retrieved ${data.length} groups from API.`);
        setGroups(data);
      } else {
        setError("فشل تحميل المجموعات الدراسية.");
      }
    } catch (err) {
      setError("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const filteredGroups = groups.filter(
    (group) => selectedGrade === null || group.grade === selectedGrade
  );
  
  if (!isLoading && !error) {
    console.log(`[Booking Page] Rendered groups after filter (${selectedGrade || "الكل"}):`, filteredGroups.length);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 font-medium mb-8 transition-colors">
          <ArrowRight className="w-4 h-4" />
          العودة للرئيسية
        </Link>

        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <span className="text-4xl">🎓</span> اختر مجموعتك الدراسية
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            اختر الصف الدراسي ثم المجموعة المناسبة لك وأكمل عملية الحجز.
          </p>
        </div>

        {!isLoading && !error && (
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <button
              onClick={() => setSelectedGrade(null)}
              className={`px-6 py-2 rounded-xl font-bold transition-colors ${
                selectedGrade === null
                  ? "bg-primary-600 text-white shadow-lg"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              }`}
            >
              الكل
            </button>
            {Array.from(new Set(groups.map((g) => g.grade))).map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-6 py-2 rounded-xl font-bold transition-colors ${
                  selectedGrade === grade
                    ? "bg-primary-600 text-white shadow-lg"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
            <p className="text-lg font-bold text-slate-600 dark:text-slate-400">جاري تحميل المجموعات المتاحة...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-3xl p-8 text-center max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-red-800 dark:text-red-400 font-bold text-lg">{error}</p>
            <button 
              onClick={fetchGroups}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredGroups.map((group, idx) => {
              const isClosed = !group.isOpen;

              return (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`relative overflow-hidden rounded-3xl border ${group.borderLight} ${group.bgLight} p-8 shadow-xl flex flex-col`}
                >
                  <div className={`absolute top-0 right-0 w-full h-2 bg-gradient-to-r ${group.color}`}></div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {group.grade}
                      </h3>
                      <span className="inline-block px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-sm font-bold shadow-sm text-slate-700 dark:text-slate-300">
                        {group.center} - {group.groupName}
                      </span>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${group.color} flex items-center justify-center text-white shadow-lg`}>
                      <CalendarDays className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-4 mb-8 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-primary-600 dark:text-primary-400">
                        <CalendarDays className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">أيام الحضور</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{group.days}</p>
                      </div>
                    </div>
                    
                    <div className="w-full h-px bg-slate-100 dark:bg-slate-700"></div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-accent-600 dark:text-accent-400">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">موعد الحصة</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{group.time}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-4">
                    {isClosed ? (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 font-bold mb-1">
                          <AlertCircle className="w-5 h-5" />
                          🚫 تم إغلاق الحجز في هذه المجموعة.
                        </div>
                        <p className="text-sm text-red-500 dark:text-red-300">
                          يرجى اختيار مجموعة أخرى أو انتظار فتح الحجز مرة أخرى من قِبل الإدارة.
                        </p>
                      </div>
                    ) : (
                      <Link 
                        href={`/booking/form?groupId=${group.id}`}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-1"
                      >
                        <CheckCircle className="w-5 h-5" />
                        ✅ احجز في هذه المجموعة
                      </Link>
                    )}
                  </div>
                </motion.div>
                );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
