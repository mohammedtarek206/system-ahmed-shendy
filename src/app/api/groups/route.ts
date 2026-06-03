import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Group from "@/models/Group";
import Booking from "@/models/Booking";

const defaultGroups = [
  {
    id: "g1",
    grade: "الصف الثالث الثانوي",
    subject: "(إحصاء)",
    days: "السبت والثلاثاء",
    time: "11:30 صباحاً",
    isOpen: true,
    color: "from-blue-500 to-primary-600",
    bgLight: "bg-blue-50 dark:bg-blue-900/10",
    borderLight: "border-blue-200 dark:border-blue-800",
  },
  {
    id: "g2",
    grade: "الصف الثاني الثانوي",
    subject: "(بكالوريا)",
    days: "السبت والثلاثاء",
    time: "1:00 ظهراً",
    isOpen: false,
    color: "from-accent-500 to-accent-600",
    bgLight: "bg-orange-50 dark:bg-orange-900/10",
    borderLight: "border-orange-200 dark:border-orange-800",
  },
];

export async function GET() {
  try {
    await connectToDatabase();

    // Check if groups exist in MongoDB, if not seed them
    let groups = await Group.find({});
    if (groups.length === 0) {
      await Group.insertMany(defaultGroups);
      groups = await Group.find({});
    }

    // Dynamic booked seats calculation for each group
    const groupsWithSeats = await Promise.all(
      groups.map(async (group) => {
        const count = await Booking.countDocuments({ groupId: group.id });
        return {
          ...group.toObject(),
          bookedSeats: count,
        };
      })
    );

    return NextResponse.json(groupsWithSeats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { id, isOpen } = body;

    if (!id) {
      return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
    }

    const updatedGroup = await Group.findOneAndUpdate(
      { id },
      { isOpen },
      { new: true }
    );

    if (!updatedGroup) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Get updated booking count
    const count = await Booking.countDocuments({ groupId: id });

    return NextResponse.json({
      ...updatedGroup.toObject(),
      bookedSeats: count,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
