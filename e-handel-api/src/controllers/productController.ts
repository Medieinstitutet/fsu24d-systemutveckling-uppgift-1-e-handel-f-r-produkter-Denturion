import { Request, RequestHandler, Response } from 'express';
import Product from '../models/IProduct';

//Create new product
export const createProduct: RequestHandler = async (req, res) => {
	try {
		const product = new Product(req.body);
		const savedProduct = await product.save();
		res.status(201).json(savedProduct);
	} catch (error) {
		res.status(500).json({ message: 'Failed to create product', error });
	}
};

//Fetch all products
export const fetchAllProducts: RequestHandler = async (_req, res) => {
	try {
		const products = await Product.find();
		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({ message: 'Failed to fetch products', error });
	}
};

//Update a product
export const updateProduct: RequestHandler = async (req, res) => {
	try {
		const updatedProduct = await Product.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		if (!updatedProduct) {
			res.status(404).json({ message: 'Product not found' });
			return;
		}
		res.status(200).json(updatedProduct);
	} catch (error) {
		res.status(500).json({ message: 'Failed to update product', error });
	}
};

//Delete product
export const deleteProduct: RequestHandler = async (req, res) => {
	try {
		const deletedProduct = await Product.findByIdAndDelete(req.params.id);
		if (!deletedProduct) {
			res.status(404).json({ message: 'Product deleted successfully' });
			return;
		}
		res.status(200).json({ message: 'Product deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Failed to delete product', error });
	}
};
