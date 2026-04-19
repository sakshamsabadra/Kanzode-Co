import mongoose, { Schema } from "mongoose";

const QuotationLineItemSchema = new Schema({
  serviceCatalogItemId: { type: String },
  title: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  amount: { type: Number, required: true },
}, { _id: true });

const InvoiceSchema = new Schema({
  quotationId: { type: Schema.Types.ObjectId, ref: "Quotation" },
  challanNumber: { type: String, required: true },
  challanAmount: { type: Number, default: 0 },
  clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
  partyId: { type: Schema.Types.ObjectId, ref: "Party" },
  invoiceNumber: { type: String, required: true, unique: true },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  lineItems: [QuotationLineItemSchema],
  subtotal: { type: Number, required: true },
  taxPercent: { type: Number, required: true },
  taxAmount: { type: Number, required: true },
  total: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ["unpaid", "paid", "overdue"], default: "unpaid" },
  paidAt: { type: Date },
}, { timestamps: true });

InvoiceSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

export default mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);
