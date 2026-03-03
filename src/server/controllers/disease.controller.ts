import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const getAllDiseases = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [diseases, total] = await Promise.all([
            prisma.disease.findMany({
                skip,
                take: limit,
                orderBy: { name: "asc" },
                include: {
                    drugDiseases: {
                        include: {
                            drug: true,
                        },
                    },
                },
            }),
            prisma.disease.count(),
        ]);

        res.json({
            data: diseases,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching diseases", error });
    }
};

export const getDiseaseBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const disease = await (prisma.disease as any).findUnique({
            where: { slug: slug as string },
            include: {
                drugDiseases: {
                    include: {
                        drug: true,
                    },
                },
            },
        });

        if (!disease) {
            res.status(404).json({ message: "Disease not found" });
            return;
        }

        res.json(disease);
    } catch (error) {
        res.status(500).json({ message: "Error fetching disease", error });
    }
};

export const createDisease = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, slug, content, drugIds } = req.body;

        const disease = await (prisma.disease as any).create({
            data: {
                name,
                slug: slug as string,
                content: content as string,
                drugDiseases: {
                    create:
                        drugIds?.map((drugId: string) => ({
                            drugId,
                        })) || [],
                },
            },
            include: {
                drugDiseases: true,
            },
        });

        res.status(201).json(disease);
    } catch (error) {
        res.status(500).json({ message: "Error creating disease", error });
    }
};

export const updateDisease = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, slug, content, drugIds } = req.body;

        // update disease and sync drug relationships
        const disease = await (prisma.disease as any).update({
            where: { id: id as string },
            data: {
                name,
                slug: slug as string,
                content: content as string,
                drugDiseases: drugIds
                    ? {
                          deleteMany: {}, // remove all existing relationships
                          create: drugIds.map((drugId: string) => ({
                              drugId,
                          })),
                      }
                    : undefined,
            },
            include: {
                drugDiseases: true,
            },
        });

        res.json(disease);
    } catch (error) {
        res.status(500).json({ message: "Error updating disease", error });
    }
};

export const deleteDisease = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Cascade delete is usually handled by Prisma if defined in schema,
        // but let's be safe or just delete the main record.
        // Actually, for MongoDB, we might need to delete relations manually if not using @db.ObjectId properly with cascade.
        // Actually, for MongoDB, we might need to delete relations manually if not using @db.ObjectId properly with cascade.
        await (prisma as any).diseaseDrug.deleteMany({
            where: { diseaseId: id as string },
        });

        await (prisma.disease as any).delete({
            where: { id: id as string },
        });

        res.json({ message: "Disease deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting disease", error });
    }
};
