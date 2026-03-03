import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";

export const authMiddleware = (req: any, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        res.status(401).json({ message: "No token, authorization denied" });
        return;
    }

    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
};
