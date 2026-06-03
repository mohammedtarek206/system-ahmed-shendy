import mongoose, { Schema, Document } from "mongoose";

export interface IVideo extends Document {
  title: string;
  duration: string;
  url: string;
  createdAt: Date;
}

const VideoSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    duration: { type: String, required: true },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Video || mongoose.model<IVideo>("Video", VideoSchema);
