import Invoice from '../models/invoice.model.js';

export const createInvoice = (orgId, payload) => Invoice.create({ ...payload, organization: orgId });

export const listInvoices = (orgId, { status, start, end }) => {
    const q = { organization: orgId };
    if (status) q.status = status;
    if (start || end) q.createdAt = {};
    if (start) q.createdAt.$gte = new Date(start);
    if (end) q.createdAt.$lte = new Date(end);
    return Invoice.find(q).populate('client').sort({ createdAt: -1 });
};

export const getInvoice = (orgId, id) => Invoice.findOne({ _id: id, organization: orgId }).populate('client');

export const updateInvoice = (orgId, id, payload) =>
    Invoice.findOneAndUpdate({ _id: id, organization: orgId }, payload, { new: true });

export const deleteInvoice = (orgId, id) => Invoice.deleteOne({ _id: id, organization: orgId });
