import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const [diseaseCount, drugCount, userCount, relationCount] = await Promise.all([prisma.disease.count(), prisma.drug.count(), prisma.user.count(), prisma.diseaseDrug.count()]);

        // Get daily stats (e.g., users created today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const newUsersToday = await prisma.user.count({
            where: {
                createdAt: {
                    gte: today,
                },
            },
        });

        res.json({
            diseases: diseaseCount,
            drugs: drugCount,
            users: userCount,
            relations: relationCount,
            newUsersToday,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching dashboard stats", error });
    }
};
