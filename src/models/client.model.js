import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
    {
        organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String }
    },
    { timestamps: true }
);

export default mongoose.model('Client', clientSchema);
