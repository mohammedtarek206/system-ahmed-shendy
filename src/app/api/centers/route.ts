import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Center from "@/models/Center";

export async function GET() {
  try {
    await connectToDatabase();
    const centers = await Center.find({}).sort({ name: 1 });
    return NextResponse.json(centers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, address, description, isActive } = body;

    if (!name) {
      return NextResponse.json({ error: "اسم السنتر مطلوب" }, { status: 400 });
    }

    const exists = await Center.findOne({ name });
    if (exists) {
      return NextResponse.json({ error: "هذا السنتر موجود بالفعل" }, { status: 400 });
    }

    const newCenter = await Center.create({
      name,
      address: address || "",
      description: description || "",
      isActive: isActive !== false,
    });

    return NextResponse.json(newCenter);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
