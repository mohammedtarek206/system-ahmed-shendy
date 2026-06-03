"use client";

import { useState, useEffect } from "react";
import { Save, ShieldAlert, Globe, Bell, Loader2, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    platformName: "منصة العميد التعليمية",
    bannerMessage: "📢 يبدأ الحجز يوم 06 / 06 / 2026",
    globalBookingClosedMessage: "نشكركم على اهتمامكم بالتسجيل في منصة العميد التعليمية. تم إغلاق باب الحجز حالياً.",
    notificationsEnabled: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isClearingBookings, setIsClearingBookings] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings({
          platformName: data.platformName || "منصة العميد التعليمية",
          bannerMessage: data.bannerMessage || "",
          globalBookingClosedMessage: data.globalBookingClosedMessage || "",
          notificationsEnabled: data.notificationsEnabled ?? true,
        });
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert("فشل حفظ التعديلات.");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearAllBookings = async () => {
    const confirmation = prompt(
      '⚠️ تحذير خطير جداً!\nهذا الإجراء سيقوم بحذف جميع حجوزات الطلاب تماماً ولا يمكن استرجاعها.\nلتأكيد الحذف النهائي، اكتب الكلمة "مسح" في الحقل أدناه:'
    );

    if (confirmation !== "مسح") {
      alert("تم إلغاء عملية الحذف.");
      return;
    }

    setIsClearingBookings(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "DELETE",
      });

      if (res.ok) {
        alert("تم تفريغ جميع حجوزات الطلاب بنجاح.");
      } else {
        alert("فشل مسح الحجوزات.");
      }
    } catch (err) {
      console.error("Error clearing bookings:", err);
      alert("حدث خطأ أثناء محاولة الاتصال بالخادم.");
    } finally {
      setIsClearingBookings(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        <p className="text-lg font-bold text-slate-600 dark:text-slate-400">جاري تحميل الإعدادات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">الإعدادات العامة</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Main Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">إعدادات المنصة</h2>
              </div>
              {saveSuccess && (
                <div className="flex items-center gap-1.5 text-green-600 font-bold text-sm bg-green-50 dark:bg-green-950/30 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تم الحفظ بنجاح</span>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold text-sm mb-2">اسم المنصة</label>
                <input 
                  type="text" 
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold text-sm mb-2">رسالة شريط الإعلانات أعلى الموقع</label>
                <input 
                  type="text" 
                  value={settings.bannerMessage}
                  onChange={(e) => setSettings({ ...settings, bannerMessage: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold text-sm mb-2">رسالة إغلاق الحجز العامة</label>
                <textarea 
                  rows={3}
                  value={settings.globalBookingClosedMessage}
                  onChange={(e) => setSettings({ ...settings, globalBookingClosedMessage: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      حفظ التعديلات
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <Bell className="w-5 h-5 text-accent-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">الإشعارات</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">إشعار بالبريد عند حجز جديد</span>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.notificationsEnabled}
                    onChange={(e) => setSettings({ ...settings, notificationsEnabled: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/50 p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-100 dark:border-red-900/30">
              <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h2 className="text-lg font-bold text-red-600 dark:text-red-400">منطقة الخطر</h2>
            </div>
            
            <div className="space-y-4 text-center">
              <p className="text-sm text-red-600 dark:text-red-400 mb-4">هذا الإجراء سيقوم بحذف جميع حجوزات الطلاب بشكل نهائي لبدء عام دراسي جديد.</p>
              <button 
                onClick={handleClearAllBookings}
                disabled={isClearingBookings}
                className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isClearingBookings ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري حذف الحجوزات...
                  </>
                ) : (
                  "حذف جميع الحجوزات"
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
