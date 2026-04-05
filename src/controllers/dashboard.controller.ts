import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';

export const getSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allRecords = await prisma.record.findMany();

        let totalIncome = 0;
        let totalExpense = 0;
        const categoryTotals: Record<string, number> = {};

        for (const record of allRecords) {
            if (record.type === 'INCOME') {
                totalIncome += record.amount;
            } else if (record.type === 'EXPENSE') {
                totalExpense += record.amount;
            }

            if (!categoryTotals[record.category]) {
                categoryTotals[record.category] = 0;
            }
            // Assuming categories can mean expenses or income, let's keep totals separated by type or just absolute values.
            // Usually, category totals are for expenses. We'll just sum them up absolute or signed.
            // Let's store absolute sum for each category
            categoryTotals[record.category] += record.amount;
        }

        const netBalance = totalIncome - totalExpense;

        const recentActivity = await prisma.record.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
        });

        res.json({
            success: true,
            data: {
                totalIncome,
                totalExpense,
                netBalance,
                categoryTotals,
                recentActivity,
            },
        });
    } catch (error) {
        next(error);
    }
};
