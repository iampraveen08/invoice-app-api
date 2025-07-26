import express from 'express';
import { auth } from '../middlewares/auth.js';
import { permit } from '../middlewares/rbac.js';
import { validate } from '../middlewares/validate.js';
import { createClientSchema } from '../utils/joiSchemas.js';
import * as clientCtrl from '../controllers/client.controller.js';

const router = express.Router();

router.use(auth);

router
    .route('/')
    .post(permit('Admin', 'Manager', 'Accountant'), validate(createClientSchema), clientCtrl.create)
    .get(clientCtrl.list);

router
    .route('/:id')
    .get(clientCtrl.get)
    .put(permit('Admin', 'Manager'), validate(createClientSchema), clientCtrl.update)
    .delete(permit('Admin'), clientCtrl.remove);

export default router;
