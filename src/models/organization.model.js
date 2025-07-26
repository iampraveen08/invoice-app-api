import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true }
    },
    { timestamps: true }
);

export default mongoose.model('Organization', organizationSchema);
