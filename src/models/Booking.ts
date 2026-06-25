import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  bookingId: string;
  fullName: string;
  phone: string;
  parentPhone: string;
  notes?: string;
  groupId: string;
  grade: string;
  center: string;
  days: string;
  time: string;
  groupName: string;
  bookingFee: number;
  createdAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    parentPhone: { type: String, required: true },
    notes: { type: String },
    groupId: { type: String, required: true },
    grade: { type: String, required: true },
    center: { type: String, required: true },
    days: { type: String, required: true },
    time: { type: String, required: true },
    groupName: { type: String, required: true },
    bookingFee: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

if (mongoose.models.Booking) {
  delete mongoose.models.Booking;
}
export default mongoose.model<IBooking>("Booking", BookingSchema);
