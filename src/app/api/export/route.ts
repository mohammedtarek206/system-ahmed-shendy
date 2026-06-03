import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Booking from "@/models/Booking";
import Group from "@/models/Group";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch all bookings and groups for formatting
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    const groups = await Group.find({});
    
    // Create a group lookup map
    const groupMap = groups.reduce((acc: any, g: any) => {
      acc[g.id] = `${g.grade} ${g.subject}`;
      return acc;
    }, {});

    // Format data for Excel with Arabic headers
    const excelData = bookings.map((b: any) => ({
      "رقم الحجز": b.bookingId,
      "اسم الطالب": b.fullName,
      "رقم الهاتف": b.phone,
      "رقم ولي الأمر": b.parentPhone,
      "المجموعة": groupMap[b.groupId] || b.groupId,
      "تاريخ التسجيل": new Date(b.createdAt).toLocaleDateString("ar-EG"),
      "ملاحظات": b.notes || "",
    }));

    // Generate Excel worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "الطلاب المحجوزين");

    // Write to a buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Return the response with Excel headers for download
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="students-bookings.xlsx"',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
