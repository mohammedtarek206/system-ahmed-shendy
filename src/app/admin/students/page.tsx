"use client";

import { useState, useEffect } from "react";
import { Search, Download, Trash2, Loader2, AlertCircle } from "lucide-react";

interface Booking {
  _id: string;
  bookingId: string;
  fullName: string;
  phone: string;
  parentPhone: string;
  notes?: string;
  groupId: string;
  grade: string;
  center: string;
  groupName: string;
  time: string;
  createdAt: string;
}

interface Group {
  id: string;
  grade: string;
  center: string;
  groupName: string;
  time: string;
}

export default function StudentsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const bookingsRes = await fetch("/api/bookings");
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData);
      }

      const groupsRes = await fetch("/api/groups");
      if (groupsRes.ok) {
        const groupsData = await groupsRes.json();
        setGroups(groupsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle student booking deletion
  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا الحجز نهائياً؟")) return;

    setIsDeleting(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Refetch or filter local state
        setBookings(bookings.filter((b) => b._id !== id));
      } else {
        alert("فشل حذف الحجز.");
      }
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("حدث خطأ أثناء محاولة الاتصال بالخادم.");
    } finally {
      setIsDeleting(null);
    }
  };

  // Export Excel trigger
  const handleExportExcel = () => {
    window.location.href = "/api/export";
  };

  // Group mappings
  const groupMap = groups.reduce((acc: any, g) => {
    acc[g.id] = { grade: g.grade, center: g.center, groupName: g.groupName, time: g.time };
    return acc;
  }, {});

  // Filter logic
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm) ||
      b.parentPhone.includes(searchTerm);

    const matchesGrade = selectedGrade === "" || b.groupId === selectedGrade;

    return matchesSearch && matchesGrade;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        <p className="text-lg font-bold text-slate-600 dark:text-slate-400">جاري تحميل قائمة الطلاب...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">إدارة الطلاب والحجوزات</h1>
        <button 
          onClick={handleExportExcel}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          <Download className="w-5 h-5" />
          تصدير Excel
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="ابحث بالاسم أو رقم الحجز أو رقم الهاتف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pr-10 pl-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select 
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 w-full md:w-auto"
          >
            <option value="">جميع الصفوف</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.grade} - {g.center} - {g.groupName}
              </option>
            ))}
          </select>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-500">لا يوجد طلاب مسجلين يتطابقون مع البحث حالياً.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium text-sm">
                  <th className="p-4 whitespace-nowrap">رقم الحجز</th>
                  <th className="p-4 whitespace-nowrap">اسم الطالب</th>
                  <th className="p-4 whitespace-nowrap">رقم الهاتف</th>
                  <th className="p-4 whitespace-nowrap">رقم ولي الأمر</th>
                  <th className="p-4 whitespace-nowrap">الصف الدراسي</th>
                  <th className="p-4 whitespace-nowrap">السنتر</th>
                  <th className="p-4 whitespace-nowrap">المجموعة</th>
                  <th className="p-4 whitespace-nowrap">الموعد</th>
                  <th className="p-4 whitespace-nowrap">تاريخ الحجز</th>
                  <th className="p-4 whitespace-nowrap text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredBookings.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-mono text-primary-600 dark:text-primary-400 font-bold">{student.bookingId}</td>
                    <td className="p-4 font-bold">{student.fullName}</td>
                    <td className="p-4 dir-ltr text-right">{student.phone}</td>
                    <td className="p-4 dir-ltr text-right">{student.parentPhone}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                        {student.grade || groupMap[student.groupId]?.grade || "-"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                        {student.center || groupMap[student.groupId]?.center || "-"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                        {student.groupName || groupMap[student.groupId]?.groupName || "-"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                        {student.time || groupMap[student.groupId]?.time || "-"}
                      </span>
                    </td>
                    <td className="p-4 text-sm">{new Date(student.createdAt).toLocaleDateString("ar-EG")}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleDelete(student._id)}
                          disabled={isDeleting === student._id}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer disabled:opacity-50" 
                          title="حذف"
                        >
                          {isDeleting === student._id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
