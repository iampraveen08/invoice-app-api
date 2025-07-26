import express from 'express';
import { validate } from '../middlewares/validate.js';
import { auth } from '../middlewares/auth.js';
import { permit } from '../middlewares/rbac.js';
import {
    registerOrgSchema,
    loginSchema,
    inviteSchema,
    acceptInviteSchema
} from '../utils/joiSchemas.js';
import * as authCtrl from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register-org', validate(registerOrgSchema), authCtrl.registerOrg);
router.post('/login', validate(loginSchema), authCtrl.login);
router.post('/accept-invite', validate(acceptInviteSchema), authCtrl.acceptInvite);

router.get('/me', auth, authCtrl.me);
router.post('/invite', auth, permit('Admin'), validate(inviteSchema), authCtrl.invite);

export default router;
