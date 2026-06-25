import mongoose, { Schema, Document } from "mongoose";

export interface IGrade extends Document {
  name: string;
  bookingFee: number;
  createdAt: Date;
  updatedAt: Date;
}

const GradeSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    bookingFee: { type: Number, default: 0 },
  },
  { timestamps: true }
);

if (mongoose.models.Grade) {
  delete mongoose.models.Grade;
}

export default mongoose.model<IGrade>("Grade", GradeSchema);
