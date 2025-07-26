import Joi from 'joi';
import { ROLES } from '../models/user.model.js';

export const registerOrgSchema = Joi.object({
    orgName: Joi.string().min(2).required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const inviteSchema = Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string().valid(...ROLES).required()
});

export const acceptInviteSchema = Joi.object({
    token: Joi.string().required(),
    name: Joi.string().required(),
    password: Joi.string().min(6).required()
});

export const createClientSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    address: Joi.string().allow('')
});

export const createInvoiceSchema = Joi.object({
    clientId: Joi.string().required(),
    items: Joi.array()
        .items(Joi.object({ description: Joi.string(), quantity: Joi.number().min(1), unitPrice: Joi.number().min(0) }))
        .required(),
    amount: Joi.number().min(0).required(),
    dueDate: Joi.date().required(),
    status: Joi.string().valid('draft', 'sent', 'paid', 'overdue'),
});

export const listInvoiceQuerySchema = Joi.object({
    status: Joi.string().valid('draft', 'sent', 'paid', 'overdue'),
    start: Joi.date(),
    end: Joi.date()
});
