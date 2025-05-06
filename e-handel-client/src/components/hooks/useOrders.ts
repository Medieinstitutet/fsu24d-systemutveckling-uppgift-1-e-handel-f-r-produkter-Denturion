import { useEffect, useState } from 'react';
import {
	deleteOrder,
	fetchAllOrdersWithItems,
} from '../../services/orderServices';
import { IOrder } from '../types/IOrder';
import { fetchCustomerById } from '../../services/customerServices';

export const useOrders = () => {
	const [orders, setOrders] = useState<IOrder[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const loadOrders = async () => {
		setLoading(true);
		setError(null);
		try {
			const fetchedOrders = await fetchAllOrdersWithItems();
			// console.log('Fetched orders:', fetchedOrders);

			const ordersWithCustomerDetails = await Promise.all(
				fetchedOrders.map(async (order) => {
					try {
						const customer = await fetchCustomerById(order.customer_id);

						return {
							...order,
							customer_firstname: customer.firstname,
							customer_lastname: customer.lastname,
							customer_email: customer.email,
						};
					} catch (error) {
						console.error(
							`Failed to fetch customer details for customer ID ${order.customer_id}:`,
							error
						);

						return {
							...order,
							customer_firstname: 'Unknown',
							customer_lastname: '',
							customer_email: 'Unknown',
						};
					}
				})
			);
			setOrders(ordersWithCustomerDetails);
		} catch (error) {
			setError('Failed to fetch orders');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (orderId: string) => {
		try {
			await deleteOrder(orderId);
			alert('Order deleted successfully!');
			loadOrders();
		} catch (error) {
			alert('Error deleting order');
			console.error(error);
		}
	};

	useEffect(() => {
		loadOrders();
	}, []);
	return { orders, loading, error, loadOrders, handleDelete };
};
