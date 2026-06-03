import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Setting from "@/models/Setting";

export async function GET() {
  try {
    await connectToDatabase();
    let setting = await Setting.findOne({ key: "global_settings" });

    // Seed default settings if none exist
    if (!setting) {
      setting = await Setting.create({
        key: "global_settings",
        platformName: "منصة العميد التعليمية",
        bannerMessage: "📢 يبدأ الحجز يوم 06 / 06 / 2026",
        globalBookingClosedMessage: "نشكركم على اهتمامكم بالتسجيل في منصة العميد التعليمية. تم إغلاق باب الحجز حالياً.",
        isBookingOpen: true,
        notificationsEnabled: true,
      });
    }

    return NextResponse.json(setting);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    // Update or create settings
    const updatedSetting = await Setting.findOneAndUpdate(
      { key: "global_settings" },
      { ...body },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, setting: updatedSetting });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
