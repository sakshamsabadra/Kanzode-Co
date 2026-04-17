import mongoose, { Schema } from "mongoose";

const ServiceCatalogItemSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  billingModel: { type: String, enum: ["one_time", "monthly"], required: true },
  defaultTaxPercent: { type: Number, default: 18 },
  tags: { type: [String], default: [] },
}, { timestamps: true });

ServiceCatalogItemSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

export default mongoose.models.ServiceCatalogItem || mongoose.model("ServiceCatalogItem", ServiceCatalogItemSchema);
