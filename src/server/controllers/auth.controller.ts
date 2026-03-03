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

        const accessToken = jwt.sign({ userId: user.id, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

        const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        // Bersihkan token lama agar tidak menumpuk di DB
        await prisma.refreshToken.deleteMany({
            where: { userId: user.id },
        });

        // Save refresh token to DB
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
            },
        });

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
        // Cari token di DB
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: oldRefreshToken },
            include: { user: true },
        });

        if (!storedToken) {
            // Jika token valid JWT tapi tidak ada di DB, kemungkinan sudah di-reuse (serangan!)
            // Opsional: Hapus semua refresh token user ini untuk keamanan extra
            res.status(401).json({ message: "Invalid refresh token" });
            return;
        }

        // Hapus token lama
        await prisma.refreshToken.delete({ where: { id: storedToken.id } });

        // Generate token baru
        const newAccessToken = jwt.sign({ userId: storedToken.user.id, email: storedToken.user.email }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

        const newRefreshToken = jwt.sign({ userId: storedToken.user.id }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        // Simpan token baru ke DB
        await prisma.refreshToken.create({
            data: {
                token: newRefreshToken,
                userId: storedToken.user.id,
            },
        });

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
                free: true,
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

export const logout = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
        await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }
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
