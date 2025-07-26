import express from 'express';
import multer from 'multer';
import path from 'path';
import { auth } from '../middlewares/auth.js';
import { permit } from '../middlewares/rbac.js';
import { validate } from '../middlewares/validate.js';
import { createInvoiceSchema, listInvoiceQuerySchema } from '../utils/joiSchemas.js';
import * as invoiceCtrl from '../controllers/invoice.controller.js';

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.join(process.cwd(), 'uploads')),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

const router = express.Router();
router.use(auth);

router
    .route('/')
    .post(permit('Admin', 'Manager', 'Accountant'), upload.single('pdf'), validate(createInvoiceSchema), invoiceCtrl.create)
    .get(validate(listInvoiceQuerySchema, 'query'), invoiceCtrl.list);

router
    .route('/:id')
    .get(invoiceCtrl.get)
    .put(permit('Admin', 'Manager'), upload.single('pdf'), invoiceCtrl.update)
    .delete(permit('Admin'), invoiceCtrl.remove);

router.post('/:id/send-email', permit('Admin', 'Manager'), invoiceCtrl.sendEmail);

export default router;
