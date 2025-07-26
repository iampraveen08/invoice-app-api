import httpStatus from 'http-status';
import config from '../config/env.js';

export const errorConverter = (err, _req, _res, next) => {
    if (!err.statusCode) {
        err.statusCode = err.status || httpStatus.INTERNAL_SERVER_ERROR;
        err.message = err.message || httpStatus[err.statusCode];
    }
    next(err);
};

export const errorHandler = (err, _req, res, _next) => {
    const { statusCode, message, stack } = err;
    const response = {
        code: statusCode,
        message
    };
    if (config.env === 'development') response.stack = stack;
    res.status(statusCode).json(response);
};
