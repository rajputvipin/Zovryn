import { z } from 'zod';

export const createUserSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(6),
        role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional(),
    }),
});

export const updateUserSchema = z.object({
    body: z.object({
        email: z.string().email().optional(),
        password: z.string().min(6).optional(),
        role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional(),
    }),
    params: z.object({
        id: z.string().uuid(),
    }),
});

export const userIdParamSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
});
