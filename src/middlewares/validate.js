import ApiError from '../utils/ApiError.js';
import httpStatus from 'http-status';

export const validate = (schema, property = 'body') => (req, _res, next) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false });
    if (error) return next(new ApiError(httpStatus.BAD_REQUEST, error.details.map(d => d.message).join(', ')));
    req[property] = value;
    next();
};
