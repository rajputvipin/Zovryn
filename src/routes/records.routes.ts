import { Router } from 'express';
import {
    getRecords,
    getRecordById,
    createRecord,
    updateRecord,
    deleteRecord,
} from '../controllers/records.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
    createRecordSchema,
    updateRecordSchema,
    getRecordsQuerySchema,
    recordIdParamSchema,
} from '../schemas/record.schema';

const router = Router();

// All roles need to be authenticated
router.use(authenticate);

// Everyone can view records
router.get('/', validate(getRecordsQuerySchema), getRecords);
router.get('/:id', validate(recordIdParamSchema), getRecordById);

// Only ADMIN can create/update/delete records
router.post('/', authorize(['ADMIN']), validate(createRecordSchema), createRecord);
router.patch('/:id', authorize(['ADMIN']), validate(updateRecordSchema), updateRecord);
router.delete('/:id', authorize(['ADMIN']), validate(recordIdParamSchema), deleteRecord);

export default router;
