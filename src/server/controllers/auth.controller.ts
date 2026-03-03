import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(409).json({ message: "User already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                createdAt: true,
            },
        });

        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const accessToken = jwt.sign({ userId: user.id, email: user.email, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ userId: user.id, email: user.email, role: user.role }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
    const oldRefreshToken = req.cookies?.refreshToken;
    if (!oldRefreshToken) {
        res.status(401).json({ message: "Refresh token missing" });
        return;
    }

    try {
        // Verifikasi langsung tanpa kueri database (Stateless)
        const decoded = jwt.verify(oldRefreshToken, REFRESH_TOKEN_SECRET) as any;

        // Generate sepasang token baru (pastikan role dibawa)
        const newAccessToken = jwt.sign({ userId: decoded.userId, email: decoded.email, role: decoded.role }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

        const newRefreshToken = jwt.sign({ userId: decoded.userId, email: decoded.email, role: decoded.role }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        // Set cookie baru
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(401).json({ message: "Refresh token expired or invalid" });
    }
};

export const me = async (req: any, res: Response): Promise<void> => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                free: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error });
    }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
};

export const updateProfile = async (req: any, res: Response): Promise<void> => {
    try {
        const { name, avatar } = req.body;
        const userId = req.user.userId;

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(name && { name }),
                ...(avatar && { avatar }),
            },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                free: true,
                updatedAt: true,
            },
        });

        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error });
    }
};

export const updatePassword = async (req: any, res: Response): Promise<void> => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.userId;

        if (!oldPassword || !newPassword) {
            res.status(400).json({ message: "Old and new password are required" });
            return;
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid old password" });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating password", error });
    }
};
