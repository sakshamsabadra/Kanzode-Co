import mongoose, { Schema, Document } from "mongoose";

const PricingPreferencesSchema = new Schema({
  preferredBillingCycle: { type: String, enum: ["one_time", "monthly", "quarterly", "annual"] },
  preferredCurrency: { type: String, default: "INR" },
  anchorAmount: { type: Number },
  notes: { type: [String] },
}, { _id: false });

const ClientPastServiceSchema = new Schema({
  serviceName: { type: String, required: true },
  serviceCategory: { type: String, required: true },
  price: { type: Number, required: true },
  completedAt: { type: String, required: true },
}, { _id: true });

const ClientSchema = new Schema({
  name: { type: String, required: true },
  companyName: { type: String, required: true },
  email: { type: String, required: true },
  whatsappNumber: { type: String, required: true },
  clientType: { type: String, enum: ["startup", "sme", "professional_firm", "foreign_subsidiary"], required: true },
  gstNumber: { type: String },
  pan: { type: String },
  address: { type: String },
  pastServices: [ClientPastServiceSchema],
  pricingPreferences: PricingPreferencesSchema,
  standardTerms: { type: [String], default: [] },
}, { timestamps: true });

// Convert _id to id when toJSON is called
ClientSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

export default mongoose.models.Client || mongoose.model("Client", ClientSchema);
