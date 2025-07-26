import mongoose from 'mongoose';

const inviteTokenSchema = new mongoose.Schema(
    {
        organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
        email: { type: String, required: true },
        role: { type: String, required: true },
        token: { type: String, required: true, unique: true },
        expiresAt: { type: Date, required: true },
        used: { type: Boolean, default: false }
    },
    { timestamps: true }
);

inviteTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('InviteToken', inviteTokenSchema);
