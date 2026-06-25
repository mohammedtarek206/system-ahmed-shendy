"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { User, Phone, PhoneCall, StickyNote, ArrowRight, ShieldCheck, Loader2, BookOpen, AlertTriangle } from "lucide-react";
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
  bookingFee: number;
}

function BookingFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");
  
  const [isLoading, setIsLoading] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchGroups() {
      try {
        const res = await fetch("/api/groups");
        if (res.ok) {
          const data = await res.json();
          setGroups(data);
        }
      } catch (err) {
        console.error("Error fetching groups:", err);
      } finally {
        setIsFetching(false);
      }
    }
    fetchGroups();
  }, []);

  const selectedGroup = groups.find((g) => g.id === groupId);

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        <p className="text-lg font-bold text-slate-600 dark:text-slate-400">جاري التحميل...</p>
      </div>
    );
  }

  if (!selectedGroup) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xl max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">لم يتم اختيار مجموعة صالحة</h2>
        <Link href="/booking" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors">
          <ArrowRight className="w-5 h-5" />
          العودة لاختيار المجموعة
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    
    const formData = new FormData(e.currentTarget);
    const payload = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      parentPhone: formData.get("parentPhone"),
      notes: formData.get("notes"),
      groupId: selectedGroup.id,
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push(`/booking/success?name=${encodeURIComponent(payload.fullName as string)}&id=${data.booking.bookingId}`);
      } else {
        setErrorMsg(data.error || "حدث خطأ أثناء إتمام الحجز. يرجى المحاولة مرة أخرى.");
      }
    } catch (err) {
      setErrorMsg("عذراً، فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/booking" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 font-medium transition-colors">
          <ArrowRight className="w-4 h-4" />
          تغيير المجموعة
        </Link>
      </div>

      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          تأكيد حجز مقعدك
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          يرجى إدخال بياناتك بدقة لتأكيد الحجز.
        </p>
      </div>

      {/* Selected Group Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm shrink-0">
            <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="text-sm text-primary-600 dark:text-primary-400 font-bold mb-1">المجموعة المختارة:</p>
            <p className="font-bold text-slate-900 dark:text-white">
              {selectedGroup.grade} - {selectedGroup.center} - {selectedGroup.groupName} - {selectedGroup.days} ({selectedGroup.time})
            </p>
          </div>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-2 flex items-center gap-2 font-black shrink-0">
          <span>💰 رسوم تأكيد الحجز:</span>
          <span>{selectedGroup.bookingFee} جنيه</span>
        </div>
      </motion.div>

      {errorMsg && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-8 flex items-center gap-3 text-red-700 dark:text-red-400 font-bold">
          <AlertTriangle className="w-6 h-6 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-primary-200" />
            <span className="font-bold text-lg">بيانات آمنة ومحفوظة</span>
          </div>
          <span className="text-primary-200 text-sm font-medium">الخطوة الأخيرة</span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6">
          
          <div className="space-y-2">
            <label className="block text-slate-700 dark:text-slate-300 font-bold text-sm">
              الاسم بالكامل <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input 
                name="fullName"
                type="text" 
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pr-12 pl-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="اكتب اسمك رباعي كما في البطاقة"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-slate-700 dark:text-slate-300 font-bold text-sm">
                رقم الهاتف <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input 
                  name="phone"
                  type="tel" 
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pr-12 pl-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-left dir-ltr"
                  placeholder="01xxxxxxxxx"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-700 dark:text-slate-300 font-bold text-sm">
                رقم ولي الأمر <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <input 
                  name="parentPhone"
                  type="tel" 
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pr-12 pl-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-left dir-ltr"
                  placeholder="01xxxxxxxxx"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-slate-700 dark:text-slate-300 font-bold text-sm">
              ملاحظات إضافية (اختياري)
            </label>
            <div className="relative">
              <div className="absolute top-3 right-0 pr-4 flex items-start pointer-events-none text-slate-400">
                <StickyNote className="w-5 h-5" />
              </div>
              <textarea 
                name="notes"
                rows={3}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pr-12 pl-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                placeholder="أي ملاحظات تود إضافتها للإدارة..."
              ></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="mb-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center justify-between font-black text-emerald-800 dark:text-emerald-400">
              <span>💰 رسوم تأكيد الحجز المطلوبة:</span>
              <span className="text-xl">{selectedGroup.bookingFee} جنيه</span>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  جاري تسجيل بياناتك وحجز المقعد...
                </>
              ) : (
                "تأكيد الحجز النهائي"
              )}
            </button>
            <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-4">
              سيتم إضافة الطلب في مجموعة: <span className="font-bold">{selectedGroup.grade}</span>
            </p>
          </div>

        </form>
      </motion.div>
    </div>
  );
}

export default function BookingFormPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20">
      <div className="container mx-auto px-4">
        <Suspense fallback={<div className="text-center py-20 font-bold text-primary-600">جاري التحميل...</div>}>
          <BookingFormContent />
        </Suspense>
      </div>
    </div>
  );
}
