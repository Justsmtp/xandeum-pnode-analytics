// backend/routes/pNodeRoutes.js
import express from 'express';
import { getAllPNodes, getPNodeById, getStatistics } from '../controllers/pNodeController.js';

const router = express.Router();

// GET /api/pnodes - Get all pNodes
router.get('/', getAllPNodes);

// GET /api/pnodes/stats - Get statistics
router.get('/stats', getStatistics);

// GET /api/pnodes/:id - Get specific pNode
router.get('/:id', getPNodeById);

export default router;