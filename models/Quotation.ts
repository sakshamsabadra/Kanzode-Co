import mongoose, { Schema } from "mongoose";

const QuotationLineItemSchema = new Schema({
  serviceCatalogItemId: { type: String },
  title: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  amount: { type: Number, required: true },
}, { _id: true });

const QuotationSchema = new Schema({
  quotationNumber: { type: String, required: true, unique: true },
  challanNumber: { type: String, required: true },
  clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
  partyId: { type: Schema.Types.ObjectId, ref: "Party" },
  quotationType: { type: String, enum: ["direct_invoice", "manual"], required: true },
  sourceText: { type: String },
  extractedIntent: { type: String },
  lineItems: [QuotationLineItemSchema],
  subtotal: { type: Number, required: true },
  taxPercent: { type: Number, required: true },
  taxAmount: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ["draft", "generated", "sent", "opened", "approved", "invoiced"], default: "draft" },
  validityDays: { type: Number, default: 7 },
  terms: { type: [String], default: [] },
  notes: { type: String },
  sentAt: { type: Date },
  openedAt: { type: Date },
  approvedAt: { type: Date },
}, { timestamps: true });

QuotationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

export default mongoose.models.Quotation || mongoose.model("Quotation", QuotationSchema);
