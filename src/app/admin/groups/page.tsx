"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, CheckCircle2, X, Users, Lock, Unlock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Group {
  _id: string;
  id: string;
  grade: string;
  center: string;
  groupName: string;
  days: string;
  time: string;
  maxSeats: number;
  isOpen: boolean;
  bookedSeats: number;
  teacher?: string;
  notes?: string;
  bookingFee?: number;
  color: string;
  bgLight: string;
  borderLight: string;
}

interface Grade { _id: string; name: string; bookingFee: number; }
interface Center { _id: string; name: string; isActive: boolean; }

const COLOR_OPTIONS = [
  { label: "أزرق", color: "from-blue-500 to-primary-600", bg: "bg-blue-50 dark:bg-blue-900/10", border: "border-blue-200 dark:border-blue-800" },
  { label: "برتقالي", color: "from-accent-500 to-accent-600", bg: "bg-orange-50 dark:bg-orange-900/10", border: "border-orange-200 dark:border-orange-800" },
  { label: "سماوي", color: "from-cyan-500 to-blue-600", bg: "bg-cyan-50 dark:bg-cyan-900/10", border: "border-cyan-200 dark:border-cyan-800" },
  { label: "أخضر", color: "from-green-500 to-emerald-600", bg: "bg-green-50 dark:bg-green-900/10", border: "border-green-200 dark:border-green-800" },
  { label: "زمردي", color: "from-teal-500 to-cyan-600", bg: "bg-teal-50 dark:bg-teal-900/10", border: "border-teal-200 dark:border-teal-800" },
  { label: "بنفسجي", color: "from-indigo-500 to-violet-600", bg: "bg-indigo-50 dark:bg-indigo-900/10", border: "border-indigo-200 dark:border-indigo-800" },
  { label: "أرجواني", color: "from-purple-500 to-fuchsia-600", bg: "bg-purple-50 dark:bg-purple-900/10", border: "border-purple-200 dark:border-purple-800" },
  { label: "وردي", color: "from-pink-500 to-rose-600", bg: "bg-pink-50 dark:bg-pink-900/10", border: "border-pink-200 dark:border-pink-800" },
];

const emptyForm = {
  grade: "", center: "", groupName: "", days: "", time: "",
  maxSeats: "50", isOpen: true, teacher: "", notes: "",
  bookingFee: "", colorIdx: 0,
};

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Group | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      const [gRes, grRes, cRes] = await Promise.all([
        fetch("/api/groups"), fetch("/api/grades"), fetch("/api/centers"),
      ]);
      if (gRes.ok) setGroups(await gRes.json());
      if (grRes.ok) setGrades(await grRes.json());
      if (cRes.ok) setCenters(await cRes.json());
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => {
    setEditTarget(null);
    setForm({ ...emptyForm, grade: grades[0]?.name || "", center: centers[0]?.name || "" });
    setErrorMsg("");
    setShowModal(true);
  };

  const openEdit = (g: Group) => {
    setEditTarget(g);
    const ci = COLOR_OPTIONS.findIndex(c => c.color === g.color);
    setForm({
      grade: g.grade, center: g.center, groupName: g.groupName,
      days: g.days, time: g.time, maxSeats: String(g.maxSeats),
      isOpen: g.isOpen, teacher: g.teacher || "", notes: g.notes || "",
      bookingFee: g.bookingFee !== undefined ? String(g.bookingFee) : "",
      colorIdx: ci >= 0 ? ci : 0,
    });
    setErrorMsg("");
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true); setErrorMsg("");
    const chosen = COLOR_OPTIONS[form.colorIdx];
    const payload = {
      grade: form.grade, center: form.center, groupName: form.groupName,
      days: form.days, time: form.time, maxSeats: Number(form.maxSeats),
      isOpen: form.isOpen, teacher: form.teacher, notes: form.notes,
      bookingFee: form.bookingFee === "" ? undefined : Number(form.bookingFee),
      color: chosen.color, bgLight: chosen.bg, borderLight: chosen.border,
    };
    try {
      const url = editTarget ? `/api/groups/${editTarget.id}` : "/api/groups";
      const method = editTarget ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error || "حدث خطأ."); return; }
      setShowModal(false);
      setSuccessMsg(editTarget ? "تم تحديث المجموعة ✅" : "تم إضافة المجموعة ✅");
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchAll();
    } catch { setErrorMsg("فشل الاتصال بالخادم."); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (g: Group) => {
    if (!confirm(`حذف مجموعة "${g.groupName}"؟`)) return;
    setDeletingId(g.id);
    try {
      const res = await fetch(`/api/groups/${g.id}`, { method: "DELETE" });
      if (res.ok) { setGroups(prev => prev.filter(x => x.id !== g.id)); setSuccessMsg("تم الحذف ✅"); setTimeout(() => setSuccessMsg(""), 3000); }
      else { const d = await res.json(); alert(d.error || "فشل."); }
    } catch { alert("خطأ."); }
    finally { setDeletingId(null); }
  };

  const handleToggle = async (g: Group) => {
    setTogglingId(g.id);
    try {
      const res = await fetch("/api/groups", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: g.id, isOpen: !g.isOpen }) });
      if (res.ok) { const updated = await res.json(); setGroups(prev => prev.map(x => x.id === g.id ? { ...x, isOpen: updated.isOpen } : x)); }
    } catch { alert("خطأ."); }
    finally { setTogglingId(null); }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
      <p className="text-lg font-bold text-slate-600 dark:text-slate-400">جاري التحميل...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">إدارة المجموعات</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">إضافة وتعديل وحذف المجموعات الدراسية والتحكم في المقاعد</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-sm transition-colors cursor-pointer">
          <Plus className="w-5 h-5" /> إضافة مجموعة جديدة
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl font-bold">
          <CheckCircle2 className="w-5 h-5" />{successMsg}
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {groups.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">لا توجد مجموعات. أضف مجموعات من قاعدة البيانات.</p>
            <button onClick={openAdd} className="mt-4 text-primary-600 font-bold hover:underline cursor-pointer">أضف أول مجموعة</button>
          </div>
        ) : groups.map((g) => {
          const remaining = g.maxSeats - (g.bookedSeats || 0);
          const pct = Math.min(100, Math.round(((g.bookedSeats || 0) / g.maxSeats) * 100));
          return (
            <motion.div key={g.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border ${g.borderLight} shadow-sm p-6 flex flex-col gap-3`}>
              <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${g.color}`} />
              <div className="flex justify-between items-start pt-1">
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-base">{g.grade}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{g.center} — {g.groupName}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${g.isOpen && remaining > 0 ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>
                  {!g.isOpen ? "مغلق" : remaining <= 0 ? "اكتمل" : "مفتوح"}
                </span>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <p>📅 {g.days} | ⏰ {g.time}</p>
                {g.teacher && <p>👨‍🏫 {g.teacher}</p>}
                {g.bookingFee !== undefined && <p>💰 رسوم الحجز: <span className="font-bold text-emerald-600 dark:text-emerald-400">{g.bookingFee} جنيه</span></p>}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span>المقاعد: {g.bookedSeats || 0} / {g.maxSeats}</span>
                  <span className={remaining <= 5 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}>متبقي: {remaining}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-green-500"}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
              {g.notes && <p className="text-xs text-slate-400 dark:text-slate-500 italic">{g.notes}</p>}
              <div className="flex gap-2 mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
                <button onClick={() => handleToggle(g)} disabled={togglingId === g.id}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer disabled:opacity-50 ${g.isOpen ? "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20" : "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"}`}>
                  {togglingId === g.id ? <Loader2 className="w-4 h-4 animate-spin" /> : g.isOpen ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  {g.isOpen ? "إغلاق" : "فتح"}
                </button>
                <button onClick={() => openEdit(g)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl text-sm font-bold transition-colors cursor-pointer">
                  <Pencil className="w-4 h-4" /> تعديل
                </button>
                <button onClick={() => handleDelete(g)} disabled={deletingId === g.id}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-sm font-bold transition-colors cursor-pointer disabled:opacity-50">
                  {deletingId === g.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} حذف
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-slate-100 dark:border-slate-800 my-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{editTarget ? "تعديل المجموعة" : "إضافة مجموعة جديدة"}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"><X className="w-5 h-5 text-slate-500" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">المرحلة الدراسية <span className="text-red-500">*</span></label>
                    {grades.length > 0 ? (
                      <select required value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="">اختر المرحلة</option>
                        {grades.map(g => <option key={g._id} value={g.name}>{g.name}</option>)}
                      </select>
                    ) : (
                      <input required value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} placeholder="أولى ثانوي"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">السنتر <span className="text-red-500">*</span></label>
                    {centers.length > 0 ? (
                      <select required value={form.center} onChange={e => setForm({ ...form, center: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="">اختر السنتر</option>
                        {centers.filter(c => c.isActive).map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                      </select>
                    ) : (
                      <input required value={form.center} onChange={e => setForm({ ...form, center: e.target.value })} placeholder="سنتر الأباصيري"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">اسم المجموعة <span className="text-red-500">*</span></label>
                  <input required value={form.groupName} onChange={e => setForm({ ...form, groupName: e.target.value })} placeholder="المجموعة الأولى"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">أيام الحضور <span className="text-red-500">*</span></label>
                    <input required value={form.days} onChange={e => setForm({ ...form, days: e.target.value })} placeholder="الأحد والأربعاء"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الموعد <span className="text-red-500">*</span></label>
                    <input required value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="5:00 مساءً"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">عدد المقاعد</label>
                    <input type="number" min="1" value={form.maxSeats} onChange={e => setForm({ ...form, maxSeats: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">رسوم الحجز (جنيه)</label>
                    <input type="number" min="0" value={form.bookingFee} onChange={e => setForm({ ...form, bookingFee: e.target.value })} placeholder="اتركه فارغاً للاستخدام رسوم المرحلة"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">المدرس</label>
                  <input value={form.teacher} onChange={e => setForm({ ...form, teacher: e.target.value })} placeholder="اسم المدرس (اختياري)"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">ملاحظات</label>
                  <textarea rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="ملاحظات إضافية..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">اللون</label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_OPTIONS.map((c, i) => (
                      <button key={i} type="button" onClick={() => setForm({ ...form, colorIdx: i })}
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${c.color} transition-all cursor-pointer ${form.colorIdx === i ? "ring-2 ring-offset-2 ring-slate-500 scale-110" : "opacity-70 hover:opacity-100"}`} title={c.label} />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">حالة الحجز</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="sr-only" checked={form.isOpen} onChange={e => setForm({ ...form, isOpen: e.target.checked })} />
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${form.isOpen ? "bg-green-500" : "bg-red-400"}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.isOpen ? "right-0.5" : "left-0.5"}`} />
                    </div>
                    <span className={`text-sm font-bold ${form.isOpen ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{form.isOpen ? "مفتوح" : "مغلق"}</span>
                  </label>
                </div>

                {errorMsg && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-bold">{errorMsg}</div>}

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSaving ? "جاري الحفظ..." : editTarget ? "حفظ التعديلات" : "إضافة المجموعة"}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="px-5 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors cursor-pointer">إلغاء</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
