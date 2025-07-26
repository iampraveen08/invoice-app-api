/**
 * @swagger
 * /auth/register-org:
 *   post:
 *     summary: Register an organization
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orgName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.post('/register-org', validate(registerOrgSchema), authCtrl.registerOrg);
