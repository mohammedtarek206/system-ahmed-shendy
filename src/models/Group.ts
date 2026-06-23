import mongoose, { Schema, Document } from "mongoose";

export interface IGroup extends Document {
  id: string; // e.g. 'g1', 'g2'
  grade: string;
  center: string;
  groupName: string;
  days: string;
  time: string;
  maxSeats: number;
  isOpen: boolean;
  color: string;
  bgLight: string;
  borderLight: string;
}

const GroupSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    grade: { type: String, required: true },
    center: { type: String, required: true },
    groupName: { type: String, required: true },
    days: { type: String, required: true },
    time: { type: String, required: true },
    maxSeats: { type: Number, default: 50 },
    isOpen: { type: Boolean, default: true },
    color: { type: String, required: true },
    bgLight: { type: String, required: true },
    borderLight: { type: String, required: true },
  },
  { timestamps: true }
);

if (mongoose.models.Group) {
  delete mongoose.models.Group;
}
export default mongoose.model<IGroup>("Group", GroupSchema);
