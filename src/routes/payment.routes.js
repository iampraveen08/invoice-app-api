import express from 'express';
import { auth } from '../middlewares/auth.js';
import { createPaymentIntent } from '../controllers/payment.controller.js';

const router = express.Router();
router.post('/create-intent', auth, createPaymentIntent);
export default router;
