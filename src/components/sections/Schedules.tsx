import { CalendarDays, Clock } from "lucide-react";
import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import Group from "@/models/Group";
import Booking from "@/models/Booking";

import { groupsData as defaultGroups } from "@/lib/data";

// Force dynamic fetch so updates inside admin dashboard instantly reflect on homepage
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function Schedules() {
  let groupsData = defaultGroups.map(g => ({ ...g, bookedSeats: 0 }));

  try {
    await connectToDatabase();

    // Sync groups from data.ts to MongoDB
    for (const defaultGroup of defaultGroups) {
      const exists = await Group.findOne({ id: defaultGroup.id });
      if (!exists) {
        await Group.create(defaultGroup);
        console.log(`[Schedules Seed] Inserted missing group: ${defaultGroup.id}`);
      } else {
        await Group.updateOne(
          { id: defaultGroup.id },
          {
            $set: {
              grade: defaultGroup.grade,
              center: defaultGroup.center,
              groupName: defaultGroup.groupName,
              days: defaultGroup.days,
              time: defaultGroup.time,
              maxSeats: defaultGroup.maxSeats || 50,
              color: defaultGroup.color,
              bgLight: defaultGroup.bgLight,
              borderLight: defaultGroup.borderLight
            }
          }
        );
      }
    }

    let groups = await Group.find({});
    console.log(`[Schedules] Total groups retrieved from DB: ${groups.length}`);

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
          isOpen: g.isOpen,
          color: g.color,
          bgLight: g.bgLight,
          borderLight: g.borderLight,
          bookedSeats: count,
        };
      })
    );
  } catch (error) {
    console.error("⚠️ Database connection failed in Schedules component, using static fallback. Details:", error);
  }

  return (
    <section id="schedules" className="py-24 bg-slate-50 dark:bg-slate-950 relative">
      {/* Decorative Background Gradients */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl pointer-events-none"></div>

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
            const isClosed = !group.isOpen;

            return (
              <div
                key={group.id}
                className={`relative overflow-hidden rounded-3xl border ${group.borderLight} ${group.bgLight} p-8 shadow-xl flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl`}
              >
                <div
                  className={`absolute top-0 right-0 w-full h-2 bg-gradient-to-r ${group.color}`}
                ></div>

                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      {group.grade}
                    </h3>
                    <span className="inline-block px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-sm font-bold shadow-sm text-slate-700 dark:text-slate-300">
                      {group.center} - {group.groupName}
                    </span>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${group.color} flex items-center justify-center text-white shadow-lg`}
                  >
                    <CalendarDays className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-4 mb-8 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-primary-600 dark:text-primary-400">
                      <CalendarDays className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        أيام الحضور
                      </p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {group.days}
                      </p>
                    </div>
                  </div>

                  <div className="w-full h-px bg-slate-100 dark:bg-slate-700"></div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-accent-600 dark:text-accent-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        موعد الحصة
                      </p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {group.time}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  {isClosed ? (
                    <button
                      disabled
                      className="block w-full py-4 rounded-xl text-center font-bold bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                    >
                      تم إغلاق الحجز
                    </button>
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
