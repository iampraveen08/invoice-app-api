// 1. auth.routes.js

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and organization management
 */

/**
 * @swagger
 * /v1/auth/register:
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

// 2. users.routes.js

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management within the organization
 */

/**
 * @swagger
 * /v1/users:
 *   get:
 *     summary: List all users in the organization
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns all users
 */
router.get('/', auth, permit('Admin', 'Manager'), userCtrl.listUsers);

/**
 * @swagger
 * /v1/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns user details
 *       404:
 *         description: User not found
 */
router.get('/:id', auth, permit('Admin', 'Manager'), userCtrl.getUser);

/**
 * @swagger
 * /v1/users/{id}:
 *   put:
 *     summary: Update user details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put('/:id', auth, permit('Admin'), userCtrl.updateUser);

/**
 * @swagger
 * /v1/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete('/:id', auth, permit('Admin'), userCtrl.deleteUser);

// 3. clients.routes.js
/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Client management for invoices
 */

/**
 * @swagger
 * /v1/clients:
 *   post:
 *     summary: Create a new client
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
router.post('/', auth, permit('Admin', 'Manager'), clientCtrl.createClient);

/**
 * @swagger
 * /v1/clients:
 *   get:
 *     summary: List all clients
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns all clients
 */
router.get('/', auth, permit('Admin', 'Manager', 'Accountant'), clientCtrl.listClients);

/**
 * @swagger
 * /v1/clients/{id}:
 *   get:
 *     summary: Get a client by ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns client details
 *       404:
 *         description: Client not found
 */
router.get('/:id', auth, permit('Admin', 'Manager', 'Accountant'), clientCtrl.getClient);

/**
 * @swagger
 * /v1/clients/{id}:
 *   put:
 *     summary: Update client details
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Client updated successfully
 */
router.put('/:id', auth, permit('Admin', 'Manager'), clientCtrl.updateClient);

/**
 * @swagger
 * /v1/clients/{id}:
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
 *     responses:
 *       200:
 *         description: Client deleted successfully
 */
router.delete('/:id', auth, permit('Admin'), clientCtrl.deleteClient);

//4. invoices.routes.js

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Invoice management
 */

/**
 * @swagger
 * /v1/invoices:
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
 *             properties:
 *               clientId:
 *                 type: string
 *               amount:
 *                 type: number
 *               dueDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [paid, unpaid, draft]
 *               pdf:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Invoice created successfully
 */
router.post('/', auth, permit('Admin', 'Manager'), upload.single('pdf'), invoiceCtrl.createInvoice);

/**
 * @swagger
 * /v1/invoices:
 *   get:
 *     summary: List all invoices
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: dateRange
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns all invoices
 */
router.get('/', auth, permit('Admin', 'Manager', 'Accountant'), invoiceCtrl.listInvoices);

/**
 * @swagger
 * /v1/invoices/{id}:
 *   get:
 *     summary: Get an invoice by ID
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns invoice details
 *       404:
 *         description: Invoice not found
 */
router.get('/:id', auth, permit('Admin', 'Manager', 'Accountant'), invoiceCtrl.getInvoice);

/**
 * @swagger
 * /v1/invoices/{id}:
 *   put:
 *     summary: Update invoice details
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Invoice updated successfully
 */
router.put('/:id', auth, permit('Admin', 'Manager'), invoiceCtrl.updateInvoice);

/**
 * @swagger
 * /v1/invoices/{id}:
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
 *     responses:
 *       200:
 *         description: Invoice deleted successfully
 */
router.delete('/:id', auth, permit('Admin'), invoiceCtrl.deleteInvoice);

// 5. dashboard.routes.js

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard stats
 */

/**
 * @swagger
 * /v1/dashboard/summary:
 *   get:
 *     summary: Get dashboard summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns dashboard stats
 */
router.get('/summary', auth, permit('Admin', 'Manager', 'Accountant'), dashboardCtrl.getSummary);

