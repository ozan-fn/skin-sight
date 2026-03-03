import { Router } from "express";
import { getDashboardStats } from "../controllers/stats.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

// Admin only check
const adminOnly = (req: any, res: any, next: any) => {
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden: Admin access only" });
    }
    next();
};

/**
 * @openapi
 * /api/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Stats]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Statistics data
 */
router.get("/", adminOnly, getDashboardStats);

export default router;
