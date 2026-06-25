import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Grade from "@/models/Grade";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const { name, bookingFee } = body;

    const grade = await Grade.findById(id);
    if (!grade) {
      return NextResponse.json({ error: "المرحلة غير موجودة" }, { status: 404 });
    }

    if (name && name !== grade.name) {
      const exists = await Grade.findOne({ name });
      if (exists) {
        return NextResponse.json({ error: "اسم المرحلة الدراسية مستخدم بالفعل" }, { status: 400 });
      }
      grade.name = name;
    }

    if (bookingFee !== undefined) {
      grade.bookingFee = Number(bookingFee);
    }

    await grade.save();
    return NextResponse.json(grade);
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

    const deleted = await Grade.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "المرحلة غير موجودة" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "تم حذف المرحلة الدراسية بنجاح" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
