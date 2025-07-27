import express from 'express';
import authCtrl from '../controllers/auth.controller.js';
import { auth, permit } from '../middlewares/auth.js';
import * as clientCtrl from "redis";
import * as invoiceCtrl from "../services/invoice.service.js";
import * as userCtrl from "../services/user.service.js";
import * as paymentCtrl from "../controllers/payment.controller.js";

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
 * /auth/login:
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
 * /auth/invite:
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

/**
 * @swagger
 * /auth/accept-invite:
 *   post:
 *     summary: Accept an invitation and set password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Invitation accepted successfully
 *       400:
 *         description: Invalid or expired invitation token
 */
router.post('/accept-invite', authCtrl.acceptInvite);



/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Client management for each organization
 */

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Get all clients for the organization
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of clients
 */
router.get('/', auth, clientCtrl.getAllClients);

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Add a new client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Client created successfully
 */

router.post('/', auth, permit('Manager', 'Admin'), clientCtrl.createClient);

/**
 * @swagger
 * /clients/{id}:
 *   put:
 *     summary: Update an existing client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client updated successfully
 */
router.put('/:id', auth, permit('Manager', 'Admin'), clientCtrl.updateClient);

/**
 * @swagger
 * /clients/{id}:
 *   delete:
 *     summary: Delete a client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client deleted successfully
 */
router.delete('/:id', auth, permit('Admin'), clientCtrl.deleteClient);


// // Multer configuration for PDF uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/invoices');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname);
//     },
// });
// const upload = multer({ storage });
/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Invoice management for organizations
 */

/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: Get all invoices with optional filters
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status (paid/unpaid/draft)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date
 *     responses:
 *       200:
 *         description: List of invoices
 */
router.get('/', auth, invoiceCtrl.getInvoices);

/**
 * @swagger
 * /invoices:
 *   post:
 *     summary: Create a new invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *               - items
 *               - amount
 *               - dueDate
 *             properties:
 *               clientId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     quantity:
 *                       type: number
 *               amount:
 *                 type: number
 *               dueDate:
 *                 type: string
 *                 format: date
 *               pdf:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Invoice created successfully
 */
router.post('/', auth, permit('Manager', 'Admin'), upload.single('pdf'), invoiceCtrl.createInvoice);

/**
 * @swagger
 * /invoices/{id}:
 *   put:
 *     summary: Update an invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Invoice ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Invoice updated successfully
 */
router.put('/:id', auth, permit('Manager', 'Admin'), invoiceCtrl.updateInvoice);

/**
 * @swagger
 * /invoices/{id}:
 *   delete:
 *     summary: Delete an invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Invoice ID
 *     responses:
 *       200:
 *         description: Invoice deleted successfully
 */
router.delete('/:id', auth, permit('Admin'), invoiceCtrl.deleteInvoice);

/**
 * @swagger
 * /invoices/{id}/send:
 *   post:
 *     summary: Send invoice email to client
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Invoice ID
 *     responses:
 *       200:
 *         description: Invoice email sent successfully
 */
router.post('/:id/send', auth, permit('Manager', 'Admin'), invoiceCtrl.sendInvoiceEmail);


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management for organizations
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all users in the organization
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', auth, permit('Admin', 'Manager'), userCtrl.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 */
router.get('/:id', auth, permit('Admin', 'Manager'), userCtrl.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user (role or details)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Admin, Manager, Accountant]
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put('/:id', auth, permit('Admin'), userCtrl.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete('/:id', auth, permit('Admin'), userCtrl.deleteUser);


/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard summary and analytics
 */

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Get dashboard summary for the organization
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalInvoices:
 *                   type: number
 *                 totalPaid:
 *                   type: number
 *                 totalUnpaid:
 *                   type: number
 *                 totalClients:
 *                   type: number
 */
router.get('/summary', auth, dashboardCtrl.getSummary);

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get detailed dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *         description: Filter stats for a specific month (e.g., 2025-07)
 *     responses:
 *       200:
 *         description: Dashboard statistics data
 */
router.get('/stats', auth, dashboardCtrl.getStats);

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Invoice payment management (Stripe)
 */

/**
 * @swagger
 * /payments/create-intent:
 *   post:
 *     summary: Create a Stripe Payment Intent for an invoice
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invoiceId
 *               - amount
 *             properties:
 *               invoiceId:
 *                 type: string
 *               amount:
 *                 type: number
 *                 example: 4999
 *     responses:
 *       201:
 *         description: Payment intent created successfully
 */
router.post('/create-intent', auth, paymentCtrl.createPaymentIntent);

/**
 * @swagger
 * /payments/confirm:
 *   post:
 *     summary: Confirm payment for a Stripe Payment Intent
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentIntentId
 *             properties:
 *               paymentIntentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment confirmed successfully
 */
router.post('/confirm', auth, paymentCtrl.confirmPayment);

/**
 * @swagger
 * /payments/history:
 *   get:
 *     summary: Get all payment transactions for the organization
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payments
 */
router.get('/history', auth, paymentCtrl.getPaymentHistory);

export default router;
