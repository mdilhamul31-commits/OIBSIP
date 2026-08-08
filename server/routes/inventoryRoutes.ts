import express from 'express';
import { getInventory, updateInventory, addInventory } from '../controllers/inventoryController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.get('/', getInventory); // Public for pizza builder
router.put('/:id', protect, admin, updateInventory);
router.post('/', protect, admin, addInventory);

export default router;
