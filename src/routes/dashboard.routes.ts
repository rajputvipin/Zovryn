import { Router } from 'express';
import { getSummary } from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = Router();

// Only ANALYST and ADMIN can view dashboard summary
router.use(authenticate, authorize(['ANALYST', 'ADMIN']));

router.get('/summary', getSummary);

export default router;
