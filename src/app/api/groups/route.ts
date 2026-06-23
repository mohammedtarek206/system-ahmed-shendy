import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Group from "@/models/Group";
import Booking from "@/models/Booking";

import { groupsData as defaultGroups } from "@/lib/data";

export async function GET() {
  try {
    await connectToDatabase();

    // Sync groups from data.ts to MongoDB
    for (const defaultGroup of defaultGroups) {
      const exists = await Group.findOne({ id: defaultGroup.id });
      if (!exists) {
        await Group.create(defaultGroup);
        console.log(`[Seed] Inserted missing group: ${defaultGroup.id} - ${defaultGroup.grade}`);
      } else {
        // Update schema fields in case they changed, but preserve isOpen
        await Group.updateOne(
          { id: defaultGroup.id },
          {
            $set: {
              grade: defaultGroup.grade,
              center: defaultGroup.center,
              groupName: defaultGroup.groupName,
              days: defaultGroup.days,
              time: defaultGroup.time,
              maxSeats: defaultGroup.maxSeats || 50,
              color: defaultGroup.color,
              bgLight: defaultGroup.bgLight,
              borderLight: defaultGroup.borderLight
            }
          }
        );
      }
    }

    let groups = await Group.find({});
    console.log(`[API] Total groups retrieved from DB: ${groups.length}`);

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
