import express from 'express';
import authRoutes from './auth.routes.js';
import clientRoutes from './clients.routes.js';
import invoiceRoutes from './invoices.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import userRoutes from './users.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/clients', clientRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', userRoutes);

export default router;
