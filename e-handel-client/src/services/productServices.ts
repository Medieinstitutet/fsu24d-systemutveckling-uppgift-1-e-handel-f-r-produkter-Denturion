import axios from 'axios';
import { IProduct } from '../components/types/IProduct';
import { ICreateProduct } from '../components/types/ICreateProduct';

const API_URL = import.meta.env.VITE_API_URL;
export const createProduct = async (
	product: ICreateProduct
): Promise<IProduct> => {
	try {
		const response = await axios.post(`${API_URL}/products`, product);

		return { ...response.data, id: response.data._id };
	} catch (error) {
		console.error('Error creating product:', error);
		throw error;
	}
};

export const fetchAllProducts = async (): Promise<IProduct[]> => {
	try {
		const response = await axios.get(`${API_URL}/products`);
		// console.log('Response data:', response.data);
		if (!Array.isArray(response.data)) {
			throw new Error('Invalid response format: Expected an array');
		}

		return response.data.map((product: any) => ({
			...product,
			id: product._id,
		}));
	} catch (error) {
		console.error('Error fetching products:', error);
		throw error;
	}
};

export const updateProduct = async (product: IProduct): Promise<IProduct> => {
	try {
		const response = await axios.patch(
			`${API_URL}/products/${product.id}`,
			product
		);
		return {
			...response.data,
			id: response.data._id,
		};
	} catch (error) {
		console.error('Erorr updating product:', error);
		throw error;
	}
};

export const deleteProduct = async (productId: string): Promise<void> => {
	try {
		await axios.delete(`${API_URL}/products/${productId}`);
	} catch (error) {
		console.error('Error deleting product:', error);
		throw error;
	}
};
