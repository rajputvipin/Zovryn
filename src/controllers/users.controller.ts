import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prisma';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, role: true, createdAt: true },
        });
        res.json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, email: true, role: true, createdAt: true },
        });

        if (!user) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }

        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
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
            select: { id: true, email: true, role: true },
        });

        res.status(201).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { email, password, role } = req.body;

        const dataToUpdate: any = {};
        if (email) dataToUpdate.email = email;
        if (password) dataToUpdate.password = await bcrypt.hash(password, 10);
        if (role) dataToUpdate.role = role;

        const user = await prisma.user.update({
            where: { id },
            data: dataToUpdate,
            select: { id: true, email: true, role: true },
        });

        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id } });
        res.json({ success: true, data: null });
    } catch (error) {
        next(error);
    }
};
