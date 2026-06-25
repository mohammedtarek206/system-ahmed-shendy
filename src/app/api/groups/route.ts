import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Group from "@/models/Group";
import Booking from "@/models/Booking";
import Grade from "@/models/Grade";

export async function GET() {
  try {
    await connectToDatabase();

    const groups = await Group.find({});

    // Dynamic booked seats calculation & booking fee lookup for each group
    const groupsWithDetails = await Promise.all(
      groups.map(async (group) => {
        const count = await Booking.countDocuments({ groupId: group.id });
        
        // Lookup grade to fetch default booking fee if group doesn't have an override
        let finalFee = group.bookingFee;
        if (finalFee === undefined || finalFee === null) {
          const gradeObj = await Grade.findOne({ name: group.grade });
          finalFee = gradeObj ? gradeObj.bookingFee : 0;
        }

        return {
          ...group.toObject(),
          bookedSeats: count,
          bookingFee: finalFee,
        };
      })
    );

    return NextResponse.json(groupsWithDetails);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const {
      grade,
      center,
      groupName,
      days,
      time,
      maxSeats,
      isOpen,
      teacher,
      notes,
      bookingFee,
      color,
      bgLight,
      borderLight,
    } = body;

    if (!grade || !center || !groupName || !days || !time) {
      return NextResponse.json(
        { error: "الرجاء إدخال الحقول الأساسية: المرحلة، السنتر، اسم المجموعة، الأيام، والوقت" },
        { status: 400 }
      );
    }

    // Auto-generate ID if not provided
    const id = `g_${Date.now()}`;

    // Theme defaults
    const defaultColor = color || "from-blue-500 to-primary-600";
    const defaultBgLight = bgLight || "bg-blue-50 dark:bg-blue-900/10";
    const defaultBorderLight = borderLight || "border-blue-200 dark:border-blue-800";

    const newGroup = await Group.create({
      id,
      grade,
      center,
      groupName,
      days,
      time,
      maxSeats: maxSeats !== undefined ? Number(maxSeats) : 50,
      isOpen: isOpen !== false,
      teacher: teacher || "",
      notes: notes || "",
      bookingFee: bookingFee !== undefined && bookingFee !== "" ? Number(bookingFee) : undefined,
      color: defaultColor,
      bgLight: defaultBgLight,
      borderLight: defaultBorderLight,
    });

    return NextResponse.json(newGroup);
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

    const count = await Booking.countDocuments({ groupId: id });

    return NextResponse.json({
      ...updatedGroup.toObject(),
      bookedSeats: count,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
