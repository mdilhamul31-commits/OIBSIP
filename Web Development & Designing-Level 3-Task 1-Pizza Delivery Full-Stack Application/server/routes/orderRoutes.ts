import express from 'express';
import { 
  createOrder, 
  getMyOrders, 
  getOrderById, 
  getOrders, 
  updateOrderStatus 
} from '../controllers/orderController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin routes
router.get('/', protect, admin, getOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;
