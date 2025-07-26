import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import * as userService from '../services/user.service.js';

export const listUsers = catchAsync(async (req, res) => {
    const users = await userService.getUsersByOrg(req.user.organization._id);
    res.json(users);
});

export const getUser = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.user.organization._id, req.params.id);
    res.json(user);
});

export const updateUser = catchAsync(async (req, res) => {
    const updated = await userService.updateUser(req.user.organization._id, req.params.id, req.body);
    res.json(updated);
});

export const deleteUser = catchAsync(async (req, res) => {
    await userService.deleteUser(req.user.organization._id, req.params.id);
    res.status(httpStatus.NO_CONTENT).send();
});
