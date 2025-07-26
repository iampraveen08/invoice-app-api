import Client from '../models/client.model.js';

export const createClient = (orgId, payload) => Client.create({ ...payload, organization: orgId });

export const listClients = (orgId) => Client.find({ organization: orgId }).sort({ createdAt: -1 });

export const getClient = (orgId, id) => Client.findOne({ _id: id, organization: orgId });

export const updateClient = (orgId, id, payload) =>
    Client.findOneAndUpdate({ _id: id, organization: orgId }, payload, { new: true });

export const deleteClient = (orgId, id) => Client.deleteOne({ _id: id, organization: orgId });
