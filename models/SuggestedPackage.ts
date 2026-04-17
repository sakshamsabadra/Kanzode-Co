import mongoose, { Schema } from "mongoose";

const SuggestedPackageSchema = new Schema({
  clientType: { type: String, enum: ["startup", "sme", "professional_firm", "foreign_subsidiary"], required: true },
  packageName: { type: String, required: true },
  rationale: { type: String, required: true },
  includedServiceIds: { type: [String], default: [] },
  recommendedTerms: { type: [String], default: [] },
  estimatedSubtotal: { type: Number, required: true },
  matchScore: { type: Number, required: true },
}, { timestamps: true });

SuggestedPackageSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

export default mongoose.models.SuggestedPackage || mongoose.model("SuggestedPackage", SuggestedPackageSchema);
