import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';

export const getRecords = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type, category, startDate, endDate } = req.query;

        const filters: any = {};
        if (type) filters.type = type;
        if (category) filters.category = category;
        if (startDate || endDate) {
            filters.date = {};
            if (startDate) filters.date.gte = new Date(startDate as string);
            if (endDate) filters.date.lte = new Date(endDate as string);
        }

        const records = await prisma.record.findMany({
            where: filters,
            orderBy: { date: 'desc' },
            include: {
                user: { select: { email: true } },
            },
        });

        res.json({ success: true, data: records });
    } catch (error) {
        next(error);
    }
};

export const getRecordById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const record = await prisma.record.findUnique({
            where: { id },
            include: { user: { select: { email: true } } },
        });

        if (!record) {
            res.status(404).json({ success: false, error: 'Record not found' });
            return;
        }

        res.json({ success: true, data: record });
    } catch (error) {
        next(error);
    }
};

export const createRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { amount, type, category, date, notes } = req.body;
        const userId = req.user!.userId;

        const newRecord = await prisma.record.create({
            data: {
                amount,
                type,
                category,
                date: new Date(date),
                notes,
                userId,
            },
        });

        res.status(201).json({ success: true, data: newRecord });
    } catch (error) {
        next(error);
    }
};

export const updateRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { amount, type, category, date, notes } = req.body;

        const dataToUpdate: any = {};
        if (amount !== undefined) dataToUpdate.amount = amount;
        if (type) dataToUpdate.type = type;
        if (category) dataToUpdate.category = category;
        if (date) dataToUpdate.date = new Date(date);
        if (notes !== undefined) dataToUpdate.notes = notes;

        const updatedRecord = await prisma.record.update({
            where: { id },
            data: dataToUpdate,
        });

        res.json({ success: true, data: updatedRecord });
    } catch (error) {
        next(error);
    }
};

export const deleteRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await prisma.record.delete({ where: { id } });
        res.json({ success: true, data: null });
    } catch (error) {
        next(error);
    }
};
