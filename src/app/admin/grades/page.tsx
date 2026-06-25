"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, CheckCircle2, X, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Grade {
  _id: string;
  name: string;
  bookingFee: number;
  createdAt: string;
}

interface GradeForm {
  name: string;
  bookingFee: string;
}

const emptyForm: GradeForm = { name: "", bookingFee: "0" };

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Grade | null>(null);
  const [form, setForm] = useState<GradeForm>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchGrades = async () => {
    try {
      const res = await fetch("/api/grades");
      if (res.ok) {
        const data = await res.json();
        setGrades(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchGrades(); }, []);

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setErrorMsg("");
    setShowModal(true);
  };

  const openEdit = (grade: Grade) => {
    setEditTarget(grade);
    setForm({ name: grade.name, bookingFee: String(grade.bookingFee) });
    setErrorMsg("");
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");

    try {
      const url = editTarget ? `/api/grades/${editTarget._id}` : "/api/grades";
      const method = editTarget ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, bookingFee: Number(form.bookingFee) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "حدث خطأ.");
        return;
      }
      setShowModal(false);
      setSuccessMsg(editTarget ? "تم تحديث المرحلة بنجاح ✅" : "تم إضافة المرحلة بنجاح ✅");
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchGrades();
    } catch {
      setErrorMsg("فشل الاتصال بالخادم.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (grade: Grade) => {
    if (!confirm(`هل أنت متأكد من حذف مرحلة "${grade.name}"؟`)) return;
    setDeletingId(grade._id);
    try {
      const res = await fetch(`/api/grades/${grade._id}`, { method: "DELETE" });
      if (res.ok) {
        setGrades(prev => prev.filter(g => g._id !== grade._id));
        setSuccessMsg("تم حذف المرحلة بنجاح ✅");
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
        <p className="text-lg font-bold text-slate-600 dark:text-slate-400">جاري تحميل المراحل الدراسية...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">إدارة المراحل الدراسية</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">إضافة وتعديل وحذف المراحل الدراسية ورسوم الحجز الخاصة بكل مرحلة</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          إضافة مرحلة جديدة
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl font-bold">
          <CheckCircle2 className="w-5 h-5" />
          {successMsg}
        </div>
      )}

      {/* Grades List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {grades.length === 0 ? (
          <div className="text-center py-20">
            <GraduationCap className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">لا توجد مراحل دراسية حتى الآن.</p>
            <button onClick={openAdd} className="mt-4 text-primary-600 font-bold hover:underline cursor-pointer">
              أضف أول مرحلة الآن
            </button>
          </div>
        ) : (
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium text-sm">
                <th className="p-4">#</th>
                <th className="p-4">المرحلة الدراسية</th>
                <th className="p-4">رسوم تأكيد الحجز</th>
                <th className="p-4">تاريخ الإضافة</th>
                <th className="p-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {grades.map((grade, i) => (
                <motion.tr
                  key={grade._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="p-4 text-slate-400 font-bold text-sm">{i + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{grade.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full font-black text-sm">
                      💰 {grade.bookingFee} جنيه
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-500 dark:text-slate-400">
                    {new Date(grade.createdAt).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEdit(grade)}
                        className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors cursor-pointer"
                        title="تعديل"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(grade)}
                        disabled={deletingId === grade._id}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        title="حذف"
                      >
                        {deletingId === grade._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
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
                  {editTarget ? "تعديل المرحلة الدراسية" : "إضافة مرحلة جديدة"}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">اسم المرحلة الدراسية <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="مثال: أولى ثانوي"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">رسوم تأكيد الحجز (جنيه)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.bookingFee}
                    onChange={e => setForm({ ...form, bookingFee: e.target.value })}
                    placeholder="مثال: 100"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">يمكن تجاوز هذه القيمة على مستوى المجموعة بشكل منفصل</p>
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
                    {isSaving ? "جاري الحفظ..." : editTarget ? "حفظ التعديلات" : "إضافة المرحلة"}
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
