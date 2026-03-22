import { Router } from "express";
import {
    getApiKeys,
    getApiKeyById,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    toggleApiKeyStatus
} from "../controllers/apikey.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Proteksi semua route dengan authMiddleware
router.use(authMiddleware);

// Helper middleware untuk cek admin role
const adminOnly = (req: any, res: any, next: any) => {
    if (req.user?.role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden: Admin access only" });
    }
    next();
};

/**
 * @openapi
 * /api/api-keys:
 *   get:
 *     summary: Get all Gemini API Keys
 *     tags: [API Keys]
 *     security: [{ bearerAuth: [] }]
 */
router.get("/", adminOnly, getApiKeys);

/**
 * @openapi
 * /api/api-keys/{id}:
 *   get:
 *     summary: Get Gemini API Key by ID
 *     tags: [API Keys]
 *     security: [{ bearerAuth: [] }]
 */
router.get("/:id", adminOnly, getApiKeyById);

/**
 * @openapi
 * /api/api-keys:
 *   post:
 *     summary: Create new Gemini API Key
 *     tags: [API Keys]
 *     security: [{ bearerAuth: [] }]
 */
router.post("/", adminOnly, createApiKey);

/**
 * @openapi
 * /api/api-keys/{id}:
 *   put:
 *     summary: Update Gemini API Key
 *     tags: [API Keys]
 *     security: [{ bearerAuth: [] }]
 */
router.put("/:id", adminOnly, updateApiKey);

/**
 * @openapi
 * /api/api-keys/{id}:
 *   delete:
 *     summary: Delete Gemini API Key
 *     tags: [API Keys]
 *     security: [{ bearerAuth: [] }]
 */
router.delete("/:id", adminOnly, deleteApiKey);

/**
 * @openapi
 * /api/api-keys/{id}/toggle:
 *   patch:
 *     summary: Toggle API Key active status
 *     tags: [API Keys]
 *     security: [{ bearerAuth: [] }]
 */
router.patch("/:id/toggle", adminOnly, toggleApiKeyStatus);

export default router;
