import express from 'express';
import {
	createOrder,
	deleteOrder,
	fetchAllOrders,
	fetchOrderById,
	updateOrder,
} from '../controllers/orderController';

const router = express.Router();

router.post('/', createOrder);
router.get('/', fetchAllOrders);
router.get('/:id', fetchOrderById);
router.patch('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;
