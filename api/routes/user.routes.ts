import { Router } from "express";
import { getAllUsers, deleteUser, updateUserRole } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Semua route di sini diproteksi authMiddleware
router.use(authMiddleware);

// Helper middleware untuk cek admin role (pindahkan ke middleware tersendiri jika sudah banyak)
const adminOnly = (req: any, res: any, next: any) => {
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden: Admin access only" });
    }
    next();
};

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", adminOnly, getAllUsers);

/**
 * @openapi
 * /api/users/{id}/role:
 *   patch:
 *     summary: Update user role
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role: { type: string, enum: [ADMIN, USER] }
 *     responses:
 *       200:
 *         description: Role updated
 */
router.patch("/:id/role", adminOnly, updateUserRole);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete("/:id", adminOnly, deleteUser);

export default router;
