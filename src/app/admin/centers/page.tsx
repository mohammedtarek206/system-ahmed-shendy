"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, CheckCircle2, X, MapPin, ToggleLeft, ToggleRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Center {
  _id: string;
  name: string;
  address: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

interface CenterForm {
  name: string;
  address: string;
  description: string;
  isActive: boolean;
}

const emptyForm: CenterForm = { name: "", address: "", description: "", isActive: true };

export default function CentersPage() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Center | null>(null);
  const [form, setForm] = useState<CenterForm>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCenters = async () => {
    try {
      const res = await fetch("/api/centers");
      if (res.ok) {
        const data = await res.json();
        setCenters(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCenters(); }, []);

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setErrorMsg("");
    setShowModal(true);
  };

  const openEdit = (center: Center) => {
    setEditTarget(center);
    setForm({ name: center.name, address: center.address, description: center.description, isActive: center.isActive });
    setErrorMsg("");
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");

    try {
      const url = editTarget ? `/api/centers/${editTarget._id}` : "/api/centers";
      const method = editTarget ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "حدث خطأ.");
        return;
      }
      setShowModal(false);
      setSuccessMsg(editTarget ? "تم تحديث السنتر بنجاح ✅" : "تم إضافة السنتر بنجاح ✅");
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchCenters();
    } catch {
      setErrorMsg("فشل الاتصال بالخادم.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (center: Center) => {
    if (!confirm(`هل أنت متأكد من حذف سنتر "${center.name}"؟`)) return;
    setDeletingId(center._id);
    try {
      const res = await fetch(`/api/centers/${center._id}`, { method: "DELETE" });
      if (res.ok) {
        setCenters(prev => prev.filter(c => c._id !== center._id));
        setSuccessMsg("تم حذف السنتر بنجاح ✅");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        const data = await res.json();
        alert(data.error || "فشل الحذف.");
      }
    } catch {
      alert("فشل الاتصال بالخادم.");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        <p className="text-lg font-bold text-slate-600 dark:text-slate-400">جاري تحميل السناتر...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">إدارة السناتر</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">إضافة وتعديل وحذف السناتر المتاحة</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          إضافة سنتر جديد
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl font-bold">
          <CheckCircle2 className="w-5 h-5" />
          {successMsg}
        </div>
      )}

      {/* Centers Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {centers.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <MapPin className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">لا يوجد سناتر حتى الآن.</p>
            <button onClick={openAdd} className="mt-4 text-primary-600 font-bold hover:underline cursor-pointer">
              أضف أول سنتر الآن
            </button>
          </div>
        ) : (
          centers.map((center) => (
            <motion.div
              key={center._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{center.name}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${center.isActive ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>
                      {center.isActive ? "مفعّل" : "غير مفعّل"}
                    </span>
                  </div>
                </div>
              </div>

              {center.address && (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">العنوان:</span> {center.address}
                </p>
              )}
              {center.description && (
                <p className="text-sm text-slate-500 dark:text-slate-500 leading-relaxed">{center.description}</p>
              )}

              <div className="flex gap-2 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => openEdit(center)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors font-bold text-sm cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(center)}
                  disabled={deletingId === center._id}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-bold text-sm cursor-pointer disabled:opacity-50"
                >
                  {deletingId === center._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  حذف
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editTarget ? "تعديل السنتر" : "إضافة سنتر جديد"}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">اسم السنتر <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="مثال: سنتر الأباصيري"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">العنوان</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    placeholder="مثال: بجوار الرقابة الإدارية"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الوصف</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="وصف مختصر للسنتر..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">حالة السنتر</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={form.isActive}
                      onChange={e => setForm({ ...form, isActive: e.target.checked })}
                    />
                    {form.isActive
                      ? <ToggleRight className="w-8 h-8 text-green-500" />
                      : <ToggleLeft className="w-8 h-8 text-slate-400" />
                    }
                    <span className={`text-sm font-bold ${form.isActive ? "text-green-600 dark:text-green-400" : "text-slate-500"}`}>
                      {form.isActive ? "مفعّل" : "غير مفعّل"}
                    </span>
                  </label>
                </div>

                {errorMsg && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-bold">
                    {errorMsg}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                    {isSaving ? "جاري الحفظ..." : editTarget ? "حفظ التعديلات" : "إضافة السنتر"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
