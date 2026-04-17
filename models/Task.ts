import mongoose, { Schema } from "mongoose";

const TaskSchema = new Schema({
  taskName: { type: String, required: true },
  assignedTo: { type: String, required: true },
  status: { type: String, enum: ["pending", "in_progress", "completed"], default: "pending" },
}, { timestamps: true });

TaskSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
