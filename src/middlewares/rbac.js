import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';

export const permit = (...roles) => (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
    next();
};
