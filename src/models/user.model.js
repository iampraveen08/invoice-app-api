import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const roles = ['Admin', 'Manager', 'Accountant'];

const userSchema = new mongoose.Schema(
    {
        organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
        name: { type: String, required: true },
        email: { type: String, unique: true, lowercase: true, required: true },
        password: { type: String, required: true, select: false },
        role: { type: String, enum: roles, default: 'Accountant' },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function (raw) {
    return bcrypt.compare(raw, this.password);
};

export const ROLES = roles;
export default mongoose.model('User', userSchema);
