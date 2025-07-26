import httpStatus from 'http-status';

class ApiError extends Error {
    constructor(statusCode = httpStatus.INTERNAL_SERVER_ERROR, message = 'Something went wrong') {
        super(message);
        this.statusCode = statusCode;
    }
}
export default ApiError;
