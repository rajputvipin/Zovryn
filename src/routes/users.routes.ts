import { Router } from 'express';
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from '../controllers/users.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
    createUserSchema,
    updateUserSchema,
    userIdParamSchema,
} from '../schemas/user.schema';

const router = Router();

// Only ADMIN can manage users
router.use(authenticate, authorize(['ADMIN']));

router.get('/', getUsers);
router.get('/:id', validate(userIdParamSchema), getUserById);
router.post('/', validate(createUserSchema), createUser);
router.patch('/:id', validate(updateUserSchema), updateUser);
router.delete('/:id', validate(userIdParamSchema), deleteUser);

export default router;
