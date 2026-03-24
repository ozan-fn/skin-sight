import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import { cloudinary } from '../lib/cloudinary';

// Helper function to get a random active API Key
const getActiveApiKey = async () => {
    const keys = await prisma.geminiApiKey.findMany({
        where: { active: true },
    });

    if (keys.length === 0) {
        throw new Error('No active Gemini API Keys available.');
    }

    const randomIndex = Math.floor(Math.random() * keys.length);
    const selectedKey = keys[randomIndex];

    // Increment usage
    await prisma.geminiApiKey.update({
        where: { id: selectedKey.id },
        data: { usage: { increment: 1 } },
    });

    return selectedKey.key;
};

// Helper function to upload base64 to Cloudinary
const uploadToCloudinary = async (base64Image: string) => {
    try {
        const uploadResponse = await cloudinary.uploader.upload(base64Image, {
            folder: 'skinsight/chats',
        });
        return uploadResponse.secure_url;
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        return null;
    }
};

export const createChat = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { message, image } = req.body; // image as base64

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        let imageUrl = null;
        if (image) {
            imageUrl = await uploadToCloudinary(image);
        }

        // 1. Create new chat record
        const chat = await prisma.chat.create({
            data: {
                userId,
                title: message.substring(0, 50),
            },
        });

        // 2. Save User Message
        await prisma.message.create({
            data: {
                chatId: chat.id,
                role: 'user',
                content: message,
                image: imageUrl,
            },
        });

        // 3. Call Gemini
        const apiKey = await getActiveApiKey();
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const promptParts: (string | Part)[] = [message];

        if (image) {
            const base64Data = image.split(',')[1];
            const mimeType = image.split(';')[0].split(':')[1];
            promptParts.push({
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType,
                },
            });
        }

        const result = await model.generateContent(promptParts);
        const responseText = result.response.text();

        // 4. Save AI Response
        await prisma.message.create({
            data: {
                chatId: chat.id,
                role: 'model',
                content: responseText,
            },
        });

        res.status(201).json({
            chatId: chat.id,
            messages: [
                { role: 'user', content: message, image: imageUrl },
                { role: 'model', content: responseText },
            ],
        });
    } catch (error: any) {
        console.error('Chat Error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const continueChat = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Chat ID
        const { message, image } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        let imageUrl = null;
        if (image) {
            imageUrl = await uploadToCloudinary(image);
        }

        // 1. Fetch History for Context
        const history = await prisma.message.findMany({
            where: { chatId: id },
            orderBy: { createdAt: 'asc' },
            take: 20, // Increased context limit
        });

        // 2. Save New User Message
        await prisma.message.create({
            data: {
                chatId: id,
                role: 'user',
                content: message,
                image: imageUrl,
            },
        });

        // 3. Prepare Gemini Chat Session
        const apiKey = await getActiveApiKey();
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' });

        const chatSession = model.startChat({
            history: history.map((msg) => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }],
            })),
        });

        const promptParts: (string | Part)[] = [message];
        if (image) {
            const base64Data = image.split(',')[1];
            const mimeType = image.split(';')[0].split(':')[1];
            promptParts.push({
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType,
                },
            });
        }

        const result = await chatSession.sendMessage(promptParts);
        const responseText = result.response.text();

        // 4. Save AI Response
        await prisma.message.create({
            data: {
                chatId: id,
                role: 'model',
                content: responseText,
            },
        });

        res.status(200).json({
            role: 'model',
            content: responseText,
        });
    } catch (error: any) {
        console.error('Continue Chat Error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getChatHistory = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const chats = await prisma.chat.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        res.status(200).json(chats);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getChatById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const chat = await prisma.chat.findUnique({
            where: { id },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!chat) return res.status(404).json({ message: 'Chat not found' });
        res.status(200).json(chat);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteChat = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.userId;

        const chat = await prisma.chat.findUnique({
            where: { id },
            include: { messages: true },
        });

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        if (chat.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // Delete images from Cloudinary
        const imageUrls = chat.messages.map((msg) => msg.image).filter((url): url is string => !!url);

        for (const url of imageUrls) {
            try {
                // Extract public_id from Cloudinary URL
                // Example: https://res.cloudinary.com/demo/image/upload/v12345678/skinsight/chats/abc.jpg
                const parts = url.split('/');
                const folderIndex = parts.indexOf('skinsight');
                if (folderIndex !== -1) {
                    const publicIdWithExtension = parts.slice(folderIndex).join('/');
                    const publicId = publicIdWithExtension.split('.')[0];
                    await cloudinary.uploader.destroy(publicId);
                }
            } catch (err) {
                console.error('Failed to delete image from Cloudinary:', url, err);
            }
        }

        await prisma.chat.delete({
            where: { id },
        });

        res.status(200).json({ message: 'Chat deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
