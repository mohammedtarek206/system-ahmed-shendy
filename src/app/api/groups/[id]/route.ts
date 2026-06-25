import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Group from "@/models/Group";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
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

    const group = await Group.findOne({ id });
    if (!group) {
      return NextResponse.json({ error: "المجموعة غير موجودة" }, { status: 404 });
    }

    if (grade !== undefined) group.grade = grade;
    if (center !== undefined) group.center = center;
    if (groupName !== undefined) group.groupName = groupName;
    if (days !== undefined) group.days = days;
    if (time !== undefined) group.time = time;
    if (maxSeats !== undefined) group.maxSeats = Number(maxSeats);
    if (isOpen !== undefined) group.isOpen = isOpen;
    if (teacher !== undefined) group.teacher = teacher;
    if (notes !== undefined) group.notes = notes;
    if (color !== undefined) group.color = color;
    if (bgLight !== undefined) group.bgLight = bgLight;
    if (borderLight !== undefined) group.borderLight = borderLight;

    if (bookingFee !== undefined) {
      group.bookingFee = bookingFee === "" || bookingFee === null ? undefined : Number(bookingFee);
    }

    await group.save();
    return NextResponse.json(group);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const deleted = await Group.findOneAndDelete({ id });
    if (!deleted) {
      return NextResponse.json({ error: "المجموعة غير موجودة" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "تم حذف المجموعة بنجاح" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
