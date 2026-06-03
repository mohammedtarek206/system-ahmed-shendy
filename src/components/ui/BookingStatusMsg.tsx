"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Clock } from "lucide-react";

export function BookingStatusMsg() {
  const [settings, setSettings] = useState({
    isBookingOpen: true,
    bannerMessage: "📢 يبدأ الحجز يوم 06 / 06 / 2026",
    globalBookingClosedMessage: "نشكركم على اهتمامكم بالتسجيل في منصة العميد التعليمية. تم إغلاق باب الحجز حالياً.",
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings({
            isBookingOpen: data.isBookingOpen,
            bannerMessage: data.bannerMessage,
            globalBookingClosedMessage: data.globalBookingClosedMessage,
          });
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    }
    fetchSettings();
  }, []);

  if (!settings.isBookingOpen) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-y border-red-200 dark:border-red-800 py-3">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-3 text-red-700 dark:text-red-400 font-bold text-center">
          <AlertCircle className="w-5 h-5 animate-pulse" />
          <span>{settings.globalBookingClosedMessage}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-right font-bold text-sm sm:text-base"
        >
          <div className="flex items-center gap-2">
            <span>{settings.bannerMessage}</span>
          </div>
          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/50"></div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>⏳ الحجز متاح حتى إغلاق المجموعة من الإدارة.</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
