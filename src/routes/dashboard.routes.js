import express from 'express';
import { auth } from '../middlewares/auth.js';
import * as dashboardCtrl from '../controllers/dashboard.controller.js';

const router = express.Router();
router.use(auth);
router.get('/summary', dashboardCtrl.summary);
export default router;
