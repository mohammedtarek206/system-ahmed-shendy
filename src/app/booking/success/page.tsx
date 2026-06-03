"use client";

import { motion } from "framer-motion";
import { CheckCircle, Calendar, Clock, MapPin, Download, Home, Printer } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "الطالب";
  const bookingId = searchParams.get("id") || "ALAMEED-0001";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>

        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          تم تأكيد الحجز بنجاح
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
          مرحباً / <span className="font-bold text-primary-600 dark:text-primary-400">{name}</span>
          <br />
          تم تسجيل بياناتك بنجاح في منصة العميد التعليمية.
        </p>

        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-8 relative print:border-2 print:border-black">

          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 px-4 text-sm font-bold text-slate-500 border border-slate-200 dark:border-slate-700 rounded-full">
            رقم الحجز
          </div>

          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-widest my-4">
            {bookingId}
          </div>

          <div className="w-full h-px bg-slate-200 dark:bg-slate-700 my-6"></div>

          <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-lg">موعد تأكيد الحجز النهائي:</h3>

          <div className="space-y-4 text-right inline-block mx-auto text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span className="font-bold text-lg">18 / 07 / 2026</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span className="font-bold">من الساعة 3:00 مساءً حتى 6:00 مساءً</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-1 shrink-0" />
              <span className="font-bold leading-relaxed">
                سنتر الأباصيري <br />
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400">بجوار الرقابة الإدارية وماركت الصعيدي</span>
              </span>
            </div>
          </div>
        </div>

        {/* Developer Card — Premium Design */}
        <div className="relative mb-8 max-w-sm mx-auto print:hidden">
          {/* Glowing border effect */}
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 opacity-50 blur-sm"></div>
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl px-6 py-5 flex flex-col items-center gap-3 shadow-xl">
            {/* Top label */}
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-slate-300 dark:to-slate-600"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Powered & Developed By
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-slate-300 dark:to-slate-600"></div>
            </div>

            {/* Developer Name */}
            <div className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-500 dark:from-primary-400 dark:to-accent-400 tracking-wide">
              Mohammed Tarek Mohammed
            </div>

            {/* Phone Button */}
            <a
              href="tel:01284621015"
              className="flex items-center gap-2.5 px-5 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-bold rounded-full shadow-md hover:shadow-primary-500/40 transition-all duration-200 hover:-translate-y-0.5 text-sm"
            >
              <span>📞</span>
              <span dir="ltr" className="tracking-wider">01284621015</span>
            </a>
          </div>
        </div>

        <p className="text-red-600 dark:text-red-400 font-bold mb-8">
          * يرجى الاحتفاظ برقم الحجز وإحضاره عند الحضور للمركز. واحضار قيمه الحجز 250 جنيها
        </p>

        <div className="flex flex-col sm:flex-row gap-4 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg transition-colors"
          >
            <Printer className="w-5 h-5" />
            طباعة أو حفظ PDF
          </button>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-xl shadow-md transition-colors"
          >
            <Home className="w-5 h-5" />
            العودة للرئيسية
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 flex items-center justify-center">
      <Suspense fallback={<div className="text-center text-primary-600 text-xl font-bold">جاري تحميل البيانات...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
