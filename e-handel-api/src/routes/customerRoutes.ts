import express from 'express';
import {
	createCustomer,
	deleteCustomer,
	fetchAllCustomers,
	fetchCustomerByEmail,
	fetchCustomerById,
	updateCustomer,
} from '../controllers/customerController';

const router = express.Router();

router.post('/', createCustomer);
router.get('/', fetchAllCustomers);
router.get('/email/:email', fetchCustomerByEmail);
router.get('/:id', fetchCustomerById);
router.patch('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

export default router;
