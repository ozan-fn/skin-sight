import { Router } from "express";
import { uploadLoader } from "../lib/cloudinary.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /api/upload:
 *   post:
 *     summary: Upload an image to Cloudinary
 *     tags: [Upload]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               slug:
 *                 type: string
 *                 description: Optional slug for public_id
 *     responses:
 *       200:
 *         description: Upload success
 */
router.post("/", authMiddleware, uploadLoader.single("image"), (req: any, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        res.json({
            url: req.file.path,
            public_id: req.file.filename,
        });
    } catch (error) {
        res.status(500).json({ message: "Upload failed", error });
    }
});

export default router;
