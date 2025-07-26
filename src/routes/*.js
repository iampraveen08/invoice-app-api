import express from 'express';
import authCtrl from '../controllers/auth.controller.js';
import { auth, permit } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and organization management
 */

/**
 * @swagger
 * /auth/register-org:
 *   post:
 *     summary: Register a new organization and admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orgName
 *               - name
 *               - email
 *               - password
 *             properties:
 *               orgName:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Organization registered successfully
 *       400:
 *         description: Email already exists
 */
router.post('/register', authCtrl.registerOrganization);

/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authCtrl.login);

/**
 * @swagger
 * /v1/auth/invite:
 *   post:
 *     summary: Invite a new user (Admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Admin, Manager, Accountant]
 *     responses:
 *       200:
 *         description: User invited successfully
 */
router.post('/invite', auth, permit('Admin'), authCtrl.inviteUser);

export default router;
