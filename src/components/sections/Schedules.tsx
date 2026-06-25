import { CalendarDays, Clock } from "lucide-react";
import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import Group from "@/models/Group";
import Booking from "@/models/Booking";

// Force dynamic fetch so updates inside admin dashboard instantly reflect on homepage
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function Schedules() {
  let groupsData: any[] = [];

  try {
    await connectToDatabase();

    const groups = await Group.find({});

    groupsData = await Promise.all(
      groups.map(async (g) => {
        const count = await Booking.countDocuments({ groupId: g.id });
        return {
          id: g.id,
          grade: g.grade,
          center: g.center,
          groupName: g.groupName,
          days: g.days,
          time: g.time,
          maxSeats: g.maxSeats || 50,
          isOpen: g.isOpen,
          color: g.color,
          bgLight: g.bgLight,
          borderLight: g.borderLight,
          bookedSeats: count,
        };
      })
    );
  } catch (error) {
    console.error("⚠️ Database connection failed in Schedules component:", error);
  }

  if (groupsData.length === 0) {
    return (
      <section id="schedules" className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">مواعيد المجموعات الدراسية</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-6 text-lg">لم يتم إضافة مجموعات بعد. تابع الإعلانات.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="schedules" className="py-24 bg-slate-50 dark:bg-slate-950 relative">
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
            مواعيد المجموعات الدراسية
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            اختر المجموعة المناسبة لك وبادر بالحجز قبل إغلاق الحجز
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {groupsData.map((group) => {
            const isFull = group.bookedSeats >= group.maxSeats;
            const isClosed = !group.isOpen || isFull;

            return (
              <div
                key={group.id}
                className={`relative overflow-hidden rounded-3xl border ${group.borderLight} ${group.bgLight} p-8 shadow-xl flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl`}
              >
                <div className={`absolute top-0 right-0 w-full h-2 bg-gradient-to-r ${group.color}`} />

                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{group.grade}</h3>
                    <span className="inline-block px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-sm font-bold shadow-sm text-slate-700 dark:text-slate-300">
                      {group.center} - {group.groupName}
                    </span>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${group.color} flex items-center justify-center text-white shadow-lg`}>
                    <CalendarDays className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-4 mb-6 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-primary-600 dark:text-primary-400">
                      <CalendarDays className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">أيام الحضور</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{group.days}</p>
                    </div>
                  </div>
                  <div className="w-full h-px bg-slate-100 dark:bg-slate-700" />
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

                {/* Seats indicator */}
                <div className="mb-6 bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm">
                  <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                    <span>المقاعد المتبقية: {Math.max(0, group.maxSeats - group.bookedSeats)}</span>
                    <span>{group.bookedSeats} / {group.maxSeats}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${group.bookedSeats / group.maxSeats >= 0.9 ? "bg-red-500" : group.bookedSeats / group.maxSeats >= 0.7 ? "bg-amber-500" : "bg-green-500"}`}
                      style={{ width: `${Math.min(100, (group.bookedSeats / group.maxSeats) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-auto">
                  {isClosed ? (
                    <div className="text-center py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <p className="text-red-600 dark:text-red-400 font-bold">🚫 {isFull ? "تم اكتمال العدد في هذه المجموعة." : "تم إغلاق الحجز"}</p>
                    </div>
                  ) : (
                    <Link
                      href={`/booking/form?groupId=${group.id}`}
                      className={`block w-full py-4 rounded-xl text-center font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl bg-gradient-to-r ${group.color}`}
                    >
                      احجز في هذه المجموعة
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
