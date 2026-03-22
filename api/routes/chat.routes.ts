import { Router } from 'express';
import { createChat, continueChat, getChatHistory, getChatById, deleteChat } from '../controllers/chat.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Proteksi semua route chat dengan authMiddleware
router.use(authMiddleware);

/**
 * @openapi
 * /api/chats:
 *   post:
 *     summary: Create a new chat session with Gemini (First message with optional image)
 *     tags: [Chat]
 *     security: [{ bearerAuth: [] }]
 */
router.post('/', createChat);

/**
 * @openapi
 * /api/chats:
 *   get:
 *     summary: Get all chat history for the logged-in user
 *     tags: [Chat]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/', getChatHistory);

/**
 * @openapi
 * /api/chats/{id}:
 *   get:
 *     summary: Get specific chat session by ID with all messages
 *     tags: [Chat]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/:id', getChatById);

/**
 * @openapi
 * /api/chats/{id}/continue:
 *   post:
 *     summary: Continue an existing chat session (with context/history)
 *     tags: [Chat]
 *     security: [{ bearerAuth: [] }]
 */
router.post('/:id/continue', continueChat);

/**
 * @openapi
 * /api/chats/{id}:
 *   delete:
 *     summary: Delete a specific chat session
 *     tags: [Chat]
 *     security: [{ bearerAuth: [] }]
 */
router.delete('/:id', deleteChat);

export default router;
