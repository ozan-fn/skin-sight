import { Router } from "express";
import * as drugController from "../controllers/drug.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /api/drugs:
 *   get:
 *     summary: Get all drugs with pagination
 *     tags: [Drugs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: List of drugs
 */
router.get("/", drugController.getAllDrugs);

/**
 * @openapi
 * /api/drugs/{slug}:
 *   get:
 *     summary: Get drug by slug
 *     tags: [Drugs]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Drug detail
 */
router.get("/:slug", drugController.getDrugBySlug);

/**
 * @openapi
 * /api/drugs:
 *   post:
 *     summary: Create new drug
 *     tags: [Drugs]
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
 *               diseaseIds: { type: array, items: { type: string } }
 *     responses:
 *       201:
 *         description: Drug created
 */
router.post("/", authMiddleware, drugController.createDrug);

/**
 * @openapi
 * /api/drugs/{id}:
 *   put:
 *     summary: Update drug
 *     tags: [Drugs]
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
 *               diseaseIds: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: Drug updated
 */
router.put("/:id", authMiddleware, drugController.updateDrug);

/**
 * @openapi
 * /api/drugs/{id}:
 *   delete:
 *     summary: Delete drug
 *     tags: [Drugs]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Drug deleted
 */
router.delete("/:id", authMiddleware, drugController.deleteDrug);

export default router;
