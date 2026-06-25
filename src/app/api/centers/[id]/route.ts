import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Center from "@/models/Center";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const { name, address, description, isActive } = body;

    const center = await Center.findById(id);
    if (!center) {
      return NextResponse.json({ error: "السنتر غير موجود" }, { status: 404 });
    }

    if (name && name !== center.name) {
      const exists = await Center.findOne({ name });
      if (exists) {
        return NextResponse.json({ error: "اسم السنتر مستخدم بالفعل" }, { status: 400 });
      }
      center.name = name;
    }

    if (address !== undefined) center.address = address;
    if (description !== undefined) center.description = description;
    if (isActive !== undefined) center.isActive = isActive;

    await center.save();
    return NextResponse.json(center);
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

    const deleted = await Center.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "السنتر غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "تم حذف السنتر بنجاح" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
