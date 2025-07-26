import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema(
    {
        description: String,
        quantity: Number,
        unitPrice: Number
    },
    { _id: false }
);

const invoiceSchema = new mongoose.Schema(
    {
        organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
        client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
        items: [invoiceItemSchema],
        amount: { type: Number, required: true },
        dueDate: { type: Date, required: true },
        status: { type: String, enum: ['draft', 'sent', 'paid', 'overdue'], default: 'draft' },
        pdfUrl: { type: String }
    },
    { timestamps: true }
);

export default mongoose.model('Invoice', invoiceSchema);
