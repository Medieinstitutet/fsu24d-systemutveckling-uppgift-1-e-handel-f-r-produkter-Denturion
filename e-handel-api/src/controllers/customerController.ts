import { RequestHandler } from 'express';
import Customer from '../models/ICustomer';

// Create new customer
export const createCustomer: RequestHandler = async (req, res) => {
	try {
		const customer = new Customer(req.body);
		const savedCustomer = await customer.save();
		res.status(201).json(savedCustomer);
	} catch (error) {
		res.status(500).json({ message: 'Failed to create customer', error });
	}
};

// Fetch all customers
export const fetchAllCustomers: RequestHandler = async (req, res) => {
	try {
		const customers = await Customer.find();
		res.status(200).json(customers);
	} catch (error) {
		res.status(500).json({ message: 'Failed to fetch customers', error });
	}
};

// Fetch customer by email
export const fetchCustomerByEmail: RequestHandler = async (req, res) => {
	try {
		const customer = await Customer.findOne({ email: req.params.email });
		if (!customer) {
			res.status(404).json({ message: 'Customer not found' });
			return;
		}
		res.status(200).json(customer);
	} catch (error) {
		res.status(500).json({ message: 'Failed to fetch customer', error });
	}
};

//Fetch customer by ID
export const fetchCustomerById: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const customer = await Customer.findById(id);

		if (!customer) {
			res.status(404).json({ message: 'Customer not found' });
			return;
		}

		res.status(200).json(customer);
	} catch (error) {
		console.error('Error fetching customer by ID:', error);
		res.status(500).json({ message: 'Failed to fetch customer', error });
	}
};

// Update customer
export const updateCustomer: RequestHandler = async (req, res) => {
	try {
		const updatedCustomer = await Customer.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		if (!updatedCustomer) {
			res.status(404).json({ message: 'Customer not found' });
			return;
		}
		res.status(200).json(updatedCustomer);
	} catch (error) {
		res.status(500).json({ message: 'Failed to update customer', error });
	}
};

//Delete a customer
export const deleteCustomer: RequestHandler = async (req, res) => {
	try {
		const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
		if (!deletedCustomer) {
			res.status(404).json({ message: 'Customer not found' });
			return;
		}
		res.status(200).json({ message: 'Customer deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Failed to delete customer', error });
	}
};
