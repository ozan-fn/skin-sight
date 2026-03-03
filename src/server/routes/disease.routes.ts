import { Router } from "express";
import * as diseaseController from "../controllers/disease.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /api/diseases:
 *   get:
 *     summary: Get all diseases with pagination
 *     tags: [Diseases]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: List of diseases
 */
router.get("/", diseaseController.getAllDiseases);

/**
 * @openapi
 * /api/diseases/{slug}:
 *   get:
 *     summary: Get disease by slug
 *     tags: [Diseases]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Disease detail
 */
router.get("/:slug", diseaseController.getDiseaseBySlug);

/**
 * @openapi
 * /api/diseases:
 *   post:
 *     summary: Create new disease
 *     tags: [Diseases]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug, content]
 *             properties:
 *               name: { type: string }
 *               slug: { type: string }
 *               content: { type: string }
 *               drugIds: { type: array, items: { type: string } }
 *     responses:
 *       201:
 *         description: Disease created
 */
router.post("/", authMiddleware, diseaseController.createDisease);

/**
 * @openapi
 * /api/diseases/{id}:
 *   put:
 *     summary: Update disease
 *     tags: [Diseases]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               slug: { type: string }
 *               content: { type: string }
 *               drugIds: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: Disease updated
 */
router.put("/:id", authMiddleware, diseaseController.updateDisease);

/**
 * @openapi
 * /api/diseases/{id}:
 *   delete:
 *     summary: Delete disease
 *     tags: [Diseases]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Disease deleted
 */
router.delete("/:id", authMiddleware, diseaseController.deleteDisease);

export default router;
