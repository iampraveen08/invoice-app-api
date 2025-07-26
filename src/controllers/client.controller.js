import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import * as clientService from '../services/client.service.js';

export const create = catchAsync(async (req, res) => {
    const client = await clientService.createClient(req.user.organization._id, req.body);
    res.status(httpStatus.CREATED).json(client);
});

export const list = catchAsync(async (req, res) => {
    const clients = await clientService.listClients(req.user.organization._id);
    res.json(clients);
});

export const get = catchAsync(async (req, res) => {
    const client = await clientService.getClient(req.user.organization._id, req.params.id);
    res.json(client);
});

export const update = catchAsync(async (req, res) => {
    const client = await clientService.updateClient(req.user.organization._id, req.params.id, req.body);
    res.json(client);
});

export const remove = catchAsync(async (req, res) => {
    await clientService.deleteClient(req.user.organization._id, req.params.id);
    res.status(httpStatus.NO_CONTENT).send();
});
