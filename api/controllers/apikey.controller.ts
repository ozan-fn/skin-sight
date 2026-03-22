import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getApiKeys = async (req: Request, res: Response) => {
    try {
        const keys = await prisma.geminiApiKey.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(keys);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getApiKeyById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const key = await prisma.geminiApiKey.findUnique({
            where: { id },
        });
        if (!key) return res.status(404).json({ message: 'API Key not found' });
        res.status(200).json(key);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createApiKey = async (req: Request, res: Response) => {
    try {
        const { key, active } = req.body;

        const existingKey = await prisma.geminiApiKey.findUnique({
            where: { key },
        });

        if (existingKey) {
            return res.status(400).json({ message: 'API Key already exists' });
        }

        const newKey = await prisma.geminiApiKey.create({
            data: {
                key,
                active: active ?? true,
            },
        });
        res.status(201).json(newKey);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateApiKey = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { key, active, usage } = req.body;

        const updatedKey = await prisma.geminiApiKey.update({
            where: { id },
            data: {
                key,
                active,
                usage,
            },
        });
        res.status(200).json(updatedKey);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'API Key not found' });
        }
        res.status(500).json({ message: error.message });
    }
};

export const deleteApiKey = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.geminiApiKey.delete({
            where: { id },
        });
        res.status(200).json({ message: 'API Key deleted successfully' });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'API Key not found' });
        }
        res.status(500).json({ message: error.message });
    }
};

export const toggleApiKeyStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const currentKey = await prisma.geminiApiKey.findUnique({ where: { id } });

        if (!currentKey) return res.status(404).json({ message: 'API Key not found' });

        const updatedKey = await prisma.geminiApiKey.update({
            where: { id },
            data: { active: !currentKey.active },
        });
        res.status(200).json(updatedKey);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
