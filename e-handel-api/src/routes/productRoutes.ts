import express from 'express';
import {
	createProduct,
	deleteProduct,
	fetchAllProducts,
	updateProduct,
} from '../controllers/productController';

const router = express.Router();

router.post('/', createProduct);
router.get('/', fetchAllProducts);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
