import express from 'express';
import { auth } from '../middlewares/auth.js';
import { permit } from '../middlewares/rbac.js';
import * as userCtrl from '../controllers/user.controller.js';

const router = express.Router();

router.use(auth);

/**
 * Admin-only endpoints for managing organization users
 */
router.get('/', permit('Admin', 'Manager'), userCtrl.listUsers);
router
    .route('/:id')
    .get(permit('Admin', 'Manager'), userCtrl.getUser)
    .put(permit('Admin'), userCtrl.updateUser)
    .delete(permit('Admin'), userCtrl.deleteUser);

export default router;
