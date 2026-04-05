import { z } from 'zod';

export const createRecordSchema = z.object({
    body: z.object({
        amount: z.number().positive(),
        type: z.enum(['INCOME', 'EXPENSE']),
        category: z.string().min(1),
        date: z.string().datetime(),
        notes: z.string().optional(),
    }),
});

export const updateRecordSchema = z.object({
    body: z.object({
        amount: z.number().positive().optional(),
        type: z.enum(['INCOME', 'EXPENSE']).optional(),
        category: z.string().min(1).optional(),
        date: z.string().datetime().optional(),
        notes: z.string().optional(),
    }),
    params: z.object({
        id: z.string().uuid(),
    }),
});

export const getRecordsQuerySchema = z.object({
    query: z.object({
        type: z.enum(['INCOME', 'EXPENSE']).optional(),
        category: z.string().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
    }),
});

export const recordIdParamSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
});
