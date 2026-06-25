import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Grade from "@/models/Grade";

export async function GET() {
  try {
    await connectToDatabase();
    const grades = await Grade.find({}).sort({ createdAt: 1 });
    return NextResponse.json(grades);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, bookingFee } = body;

    if (!name) {
      return NextResponse.json({ error: "اسم المرحلة الدراسية مطلوب" }, { status: 400 });
    }

    const exists = await Grade.findOne({ name });
    if (exists) {
      return NextResponse.json({ error: "هذه المرحلة الدراسية موجودة بالفعل" }, { status: 400 });
    }

    const newGrade = await Grade.create({
      name,
      bookingFee: bookingFee !== undefined ? Number(bookingFee) : 0,
    });

    return NextResponse.json(newGrade);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
