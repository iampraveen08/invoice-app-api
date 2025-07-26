import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import httpStatus from 'http-status';
import { addDays } from 'date-fns';
import config from '../config/env.js';
import User, { ROLES } from '../models/user.model.js';
import Organization from '../models/organization.model.js';
import InviteToken from '../models/inviteToken.model.js';
import ApiError from '../utils/ApiError.js';
import { sendMail } from '../utils/email.js';

export const generateToken = (userId) => {
    return jwt.sign({ sub: userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};

export const registerOrganization = async ({ orgName, name, email, password }) => {
    const existing = await User.findOne({ email });
    if (existing) throw new ApiError(httpStatus.BAD_REQUEST, 'Email already registered');

    const org = await Organization.create({ name: orgName });
    const user = await User.create({
        organization: org._id,
        name,
        email,
        password,
        role: 'Admin'
    });

    return { org, user, token: generateToken(user._id) };
};

export const login = async ({ email, password }) => {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
    }
    return { user, token: generateToken(user._id) };
};

export const inviteUser = async (currentUser, { email, role }) => {
    if (!ROLES.includes(role)) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid role');

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = addDays(new Date(), 7);

    await InviteToken.create({
        organization: currentUser.organization,
        email,
        role,
        token,
        expiresAt
    });

    const inviteLink = `${config.baseUrl}/v1/auth/accept-invite?token=${token}`;
    const { previewUrl } = await sendMail({
        to: email,
        subject: 'You are invited!',
        html: `<p>You have been invited to join ${currentUser.organization.name} as ${role}.</p><p>Click <a href="${inviteLink}">here</a> to accept.</p>`
    });

    return { inviteLink, previewUrl };
};

export const acceptInvite = async ({ token, name, password }) => {
    const invite = await InviteToken.findOne({ token, used: false });
    if (!invite || invite.expiresAt < new Date()) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid/expired token');
    }

    const existing = await User.findOne({ email: invite.email });
    if (existing) throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists for this email');

    const user = await User.create({
        organization: invite.organization,
        name,
        email: invite.email,
        password,
        role: invite.role
    });

    invite.used = true;
    await invite.save();

    return { user, token: generateToken(user._id) };
};
