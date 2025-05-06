import axios from 'axios';
import { ICustomer } from '../components/types/ICustomer';
import { ICreateCustomer } from '../components/types/ICreateCustomer';

const API_URL = import.meta.env.VITE_API_URL;
export const createCustomer = async (
	customer: ICreateCustomer
): Promise<ICustomer> => {
	try {
		// console.log('Creating customer with payload:', customer);

		const response = await axios.post(`${API_URL}/customers`, customer);

		return {
			...response.data,
			id: response.data._id,
		};
	} catch (error) {
		console.error('Error creating customer:', error);
		throw error;
	}
};

export const fetchAllCustomers = async (): Promise<ICustomer[]> => {
	try {
		const response = await axios.get(`${API_URL}/customers`);
		return response.data.map((customer: any) => ({
			...customer,
			id: customer._id,
		}));
	} catch (error) {
		console.error('Error fetching customers:', error);
		throw error;
	}
};

export const fetchCustomerByEmail = async (
	email: string
): Promise<ICustomer> => {
	try {
		const response = await axios.get(`${API_URL}/customers/email/${email}`);
		return { ...response.data, id: response.data._id };
	} catch (error) {
		console.error('Error fetching customer by email:', email, error);
		throw error;
	}
};

export const fetchCustomerById = async (
	customerId: string
): Promise<ICustomer> => {
	try {
		// console.log(`Fetching customer: ${customerId}`);

		const response = await axios.get(`${API_URL}/customers/${customerId}`);
		// console.log('Customer data:', response.data);

		return { ...response.data, id: response.data._id };
	} catch (error) {
		console.error(`Error fetching customer with ID ${customerId}:`, error);
		throw error;
	}
};

export const updateCustomer = async (
	customer: ICustomer
): Promise<ICustomer> => {
	try {
		const response = await axios.patch(
			`${API_URL}/customers/${customer.id}`,
			customer
		);
		return {
			...response.data,
			id: response.data._id,
		};
	} catch (error) {
		console.error('Error updating customer');
		throw error;
	}
};
export const deleteCustomer = async (customerId: string): Promise<void> => {
	try {
		await axios.delete(`${API_URL}/customers/${customerId}`);
	} catch (error) {
		console.error('Error deleting customer:', error);
		throw error;
	}
};
