import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const getAllDrugs = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [drugs, total] = await Promise.all([
            prisma.drug.findMany({
                skip,
                take: limit,
                orderBy: { name: "asc" },
                include: {
                    drugDiseases: {
                        include: {
                            disease: true,
                        },
                    },
                },
            }),
            prisma.drug.count(),
        ]);

        res.json({
            data: drugs,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching drugs", error });
    }
};

export const getDrugBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const drug = await (prisma.drug as any).findUnique({
            where: { slug: slug as string },
            include: {
                drugDiseases: {
                    include: {
                        disease: true,
                    },
                },
            },
        });

        if (!drug) {
            res.status(404).json({ message: "Drug not found" });
            return;
        }

        res.json(drug);
    } catch (error) {
        res.status(500).json({ message: "Error fetching drug", error });
    }
};

export const createDrug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, slug, content, image, diseaseIds } = req.body;

        const drug = await (prisma.drug as any).create({
            data: {
                name,
                slug: slug as string,
                image: image as string,
                content: content as string,
                drugDiseases: {
                    create:
                        diseaseIds?.map((diseaseId: string) => ({
                            diseaseId,
                        })) || [],
                },
            },
            include: {
                drugDiseases: true,
            },
        });

        res.status(201).json(drug);
    } catch (error) {
        res.status(500).json({ message: "Error creating drug", error });
    }
};

export const updateDrug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, slug, content, image, diseaseIds } = req.body;

        const drug = await (prisma.drug as any).update({
            where: { id: id as string },
            data: {
                name,
                slug: slug as string,
                image: image as string,
                content: content as string,
                drugDiseases: diseaseIds
                    ? {
                          deleteMany: {},
                          create: diseaseIds.map((diseaseId: string) => ({
                              diseaseId,
                          })),
                      }
                    : undefined,
            },
            include: {
                drugDiseases: true,
            },
        });

        res.json(drug);
    } catch (error) {
        res.status(500).json({ message: "Error updating drug", error });
    }
};

export const deleteDrug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await (prisma as any).diseaseDrug.deleteMany({
            where: { drugId: id as string },
        });

        await (prisma.drug as any).delete({
            where: { id: id as string },
        });

        res.json({ message: "Drug deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting drug", error });
    }
};
