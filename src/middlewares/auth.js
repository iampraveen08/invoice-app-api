import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import config from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/user.model.js';

export const auth = async (req, _res, next) => {
    try {
        const token = (req.headers.authorization || '').replace('Bearer ', '');
        if (!token) throw new ApiError(httpStatus.UNAUTHORIZED, 'No token provided');

        const payload = jwt.verify(token, config.jwt.secret);
        const user = await User.findById(payload.sub).populate('organization');
        if (!user || !user.isActive) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');

        req.user = user; // attach user & organization
        next();
    } catch (e) {
        next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
    }
};
