import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from 'http-status';

/**
 * Get all users for an organization
 */
export const getUsersByOrg = (orgId) => {
    return User.find({ organization: orgId }).select('-password').sort({ createdAt: -1 });
};

/**
 * Get single user
 */
export const getUserById = async (orgId, userId) => {
    const user = await User.findOne({ _id: userId, organization: orgId }).select('-password');
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    return user;
};

/**
 * Update user (Admin only)
 */
export const updateUser = async (orgId, userId, updates) => {
    const user = await User.findOneAndUpdate(
        { _id: userId, organization: orgId },
        updates,
        { new: true }
    ).select('-password');
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    return user;
};

/**
 * Deactivate or delete user
 */
export const deleteUser = async (orgId, userId) => {
    const user = await User.findOneAndDelete({ _id: userId, organization: orgId });
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    return user;
};
