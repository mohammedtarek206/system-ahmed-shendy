import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  bookingId: string;
  fullName: string;
  phone: string;
  parentPhone: string;
  notes?: string;
  groupId: string;
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
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
