import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Booking from "@/models/Booking";
import Group from "@/models/Group";
import Grade from "@/models/Grade";

export async function GET() {
  try {
    await connectToDatabase();
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { fullName, phone, parentPhone, notes, groupId } = body;

    if (!fullName || !phone || !parentPhone || !groupId) {
      return NextResponse.json(
        { error: "جميع الحقول المطلوبة يجب إدخالها" },
        { status: 400 }
      );
    }

    // Check if group exists and is open
    const group = await Group.findOne({ id: groupId });
    if (!group) {
      return NextResponse.json(
        { error: "المجموعة الدراسية المختارة غير موجودة" },
        { status: 404 }
      );
    }

    if (!group.isOpen) {
      return NextResponse.json(
        { error: "عذراً، باب الحجز مغلق حالياً لهذه المجموعة" },
        { status: 400 }
      );
    }

    // Check capacity / seat limit
    const bookedCount = await Booking.countDocuments({ groupId });
    if (bookedCount >= group.maxSeats) {
      return NextResponse.json(
        { error: "🚫 عذراً، تم اكتمال العدد في هذه المجموعة واكتمل الحجز تلقائياً." },
        { status: 400 }
      );
    }

    // Determine booking fee dynamically
    let finalBookingFee = group.bookingFee;
    if (finalBookingFee === undefined || finalBookingFee === null) {
      const gradeObj = await Grade.findOne({ name: group.grade });
      finalBookingFee = gradeObj ? gradeObj.bookingFee : 0;
    }

    // Generate unique sequential Booking ID safely
    let nextIdNumber = 1001;
    const lastBooking = await Booking.findOne().sort({ createdAt: -1 });
    
    if (lastBooking && lastBooking.bookingId && lastBooking.bookingId.startsWith('ALAMEED-')) {
      const lastIdStr = lastBooking.bookingId.split('-')[1];
      const lastIdNum = parseInt(lastIdStr, 10);
      if (!isNaN(lastIdNum)) {
        nextIdNumber = lastIdNum + 1;
      }
    }

    let bookingId = `ALAMEED-${nextIdNumber}`;
    let isUnique = false;

    // Ensure absolutely no duplicates in case of race conditions or manual deletions
    while (!isUnique) {
      const existing = await Booking.findOne({ bookingId });
      if (existing) {
        nextIdNumber++;
        bookingId = `ALAMEED-${nextIdNumber}`;
      } else {
        isUnique = true;
      }
    }

    const newBooking = await Booking.create({
      bookingId,
      fullName,
      phone,
      parentPhone,
      notes,
      groupId,
      grade: group.grade,
      center: group.center,
      days: group.days,
      time: group.time,
      groupName: group.groupName,
      bookingFee: finalBookingFee,
    });

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Clears all bookings (Danger zone action)
export async function DELETE() {
  try {
    await connectToDatabase();
    await Booking.deleteMany({});
    return NextResponse.json({ success: true, message: "تم حذف جميع الحجوزات بنجاح" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
