import mongoose, { Schema } from "mongoose";

const ClientInteractionSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
  channel: { type: String, enum: ["email", "whatsapp", "call", "meeting"], required: true },
  summary: { type: String, required: true },
  relatedQuotationId: { type: Schema.Types.ObjectId, ref: "Quotation" },
  relatedInvoiceId: { type: Schema.Types.ObjectId, ref: "Invoice" },
}, { timestamps: true });

ClientInteractionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

export default mongoose.models.ClientInteraction || mongoose.model("ClientInteraction", ClientInteractionSchema);
