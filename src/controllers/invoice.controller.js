import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import * as invoiceService from '../services/invoice.service.js';
import { sendMail } from '../utils/email.js';

export const create = catchAsync(async (req, res) => {
    const payload = { ...req.body };
    if (req.file) payload.pdfUrl = `/uploads/${req.file.filename}`;
    const invoice = await invoiceService.createInvoice(req.user.organization._id, payload);
    res.status(httpStatus.CREATED).json(invoice);
});

export const list = catchAsync(async (req, res) => {
    const invoices = await invoiceService.listInvoices(req.user.organization._id, req.query);
    res.json(invoices);
});

export const get = catchAsync(async (req, res) => {
    const invoice = await invoiceService.getInvoice(req.user.organization._id, req.params.id);
    res.json(invoice);
});

export const update = catchAsync(async (req, res) => {
    const payload = { ...req.body };
    if (req.file) payload.pdfUrl = `/uploads/${req.file.filename}`;
    const invoice = await invoiceService.updateInvoice(req.user.organization._id, req.params.id, payload);
    res.json(invoice);
});

export const remove = catchAsync(async (req, res) => {
    await invoiceService.deleteInvoice(req.user.organization._id, req.params.id);
    res.status(httpStatus.NO_CONTENT).send();
});

export const sendEmail = catchAsync(async (req, res) => {
    const invoice = await invoiceService.getInvoice(req.user.organization._id, req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    const { previewUrl } = await sendMail({
        to: invoice.client.email,
        subject: `Invoice #${invoice._id}`,
        html: `<p>Please find your invoice of amount ${invoice.amount}. Due: ${invoice.dueDate}</p>`
    });

    res.json({ message: 'Email sent', previewUrl });
});
