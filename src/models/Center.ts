import mongoose, { Schema, Document } from "mongoose";

export interface ICenter extends Document {
  name: string;
  address: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CenterSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    address: { type: String, default: "" },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

if (mongoose.models.Center) {
  delete mongoose.models.Center;
}

export default mongoose.model<ICenter>("Center", CenterSchema);
