import mongoose, { Schema, Document } from "mongoose";

export interface IGroup extends Document {
  id: string; // e.g. 'g1', 'g2'
  grade: string;
  subject: string;
  days: string;
  time: string;
  isOpen: boolean;
  color: string;
  bgLight: string;
  borderLight: string;
}

const GroupSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    grade: { type: String, required: true },
    subject: { type: String, required: true },
    days: { type: String, required: true },
    time: { type: String, required: true },
    isOpen: { type: Boolean, default: true },
    color: { type: String, required: true },
    bgLight: { type: String, required: true },
    borderLight: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Group || mongoose.model<IGroup>("Group", GroupSchema);
