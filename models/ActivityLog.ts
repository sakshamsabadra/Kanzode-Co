import mongoose, { Schema } from "mongoose";

const ActivityLogSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
  entityType: { type: String, enum: ["quotation", "invoice"], required: true },
  entityId: { type: Schema.Types.ObjectId, required: true },
  action: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

ActivityLogSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

export default mongoose.models.ActivityLog || mongoose.model("ActivityLog", ActivityLogSchema);
