import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prisma';
import { generateToken } from '../utils/jwt.utils';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, role } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ success: false, error: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role || 'VIEWER';

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: userRole,
            },
        });

        res.status(201).json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
            return;
        }

        const token = generateToken({ userId: user.id, role: user.role });

        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};
