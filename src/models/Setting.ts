import mongoose, { Schema, Document } from "mongoose";

export interface ISetting extends Document {
  key: string;
  platformName: string;
  bannerMessage: string;
  globalBookingClosedMessage: string;
  isBookingOpen: boolean;
  notificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "global_settings" },
    platformName: { type: String, default: "منصة العميد التعليمية" },
    bannerMessage: { type: String, default: "📢 يبدأ الحجز يوم 06 / 06 / 2026" },
    globalBookingClosedMessage: { type: String, default: "نشكركم على اهتمامكم بالتسجيل في منصة العميد التعليمية. تم إغلاق باب الحجز حالياً." },
    isBookingOpen: { type: Boolean, default: true },
    notificationsEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Setting || mongoose.model<ISetting>("Setting", SettingSchema);
