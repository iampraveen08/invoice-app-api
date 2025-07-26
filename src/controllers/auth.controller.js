import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import * as authService from '../services/auth.service.js';

export const registerOrg = catchAsync(async (req, res) => {
    const data = await authService.registerOrganization(req.body);
    res.status(httpStatus.CREATED).json(data);
});

export const login = catchAsync(async (req, res) => {
    const data = await authService.login(req.body);
    res.json(data);
});

export const me = catchAsync(async (req, res) => {
    res.json({ user: req.user });
});

export const invite = catchAsync(async (req, res) => {
    const data = await authService.inviteUser(req.user, req.body);
    res.status(201).json(data);
});

export const acceptInvite = catchAsync(async (req, res) => {
    const data = await authService.acceptInvite(req.body);
    res.json(data);
});
