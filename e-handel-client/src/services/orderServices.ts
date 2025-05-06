import axios from 'axios';
import { IOrder } from '../components/types/IOrder';
import { ICreateOrder } from '../components/types/ICreateOrder';
const API_URL = import.meta.env.VITE_API_URL;

export const createOrder = async (order: ICreateOrder): Promise<IOrder> => {
	try {
		console.log('Creating order with data:', order);
		const response = await axios.post(`${API_URL}/orders`, order);
		console.log('Order creation response:', response.data);
		return {
			...response.data,
			id: response.data._id,
			customer_id: response.data.customer_id?.toString(),
			order_items: response.data.order_items.map((item: any) => ({
				...item,
				id: item._id,
				order_id: item.order_id?.toString(),
				product_id: item.product_id?.toString(),
			})),
		};
	} catch (error) {
		console.error('Error creating order:');
		throw error;
	}
};

export const fetchAllOrders = async (): Promise<IOrder[]> => {
	try {
		const response = await axios.get(`${API_URL}/orders`);
		return response.data.map((order: any) => ({
			...order,
			id: order._id.toString(),
			customer_id: order.customer_id?.toString(),
			customer_firstname: order.customer_firstname || 'Unknown',
			customer_lastname: order.customer_lastname || 'Unknown',
			customer_email: order.customer_email || 'Unknown',
			order_items: order.order_items.map((item: any) => ({
				...item,
				id: item._id.toString(),
				order_id: item.order_id?.toString(),
				product_id: item.product_id?.toString(),
			})),
		}));
	} catch (error) {
		console.error('Error fetching orders:', error);
		throw error;
	}
};

export const updateOrder = async (
	orderId: string,
	updates: {
		payment_status?: string;
		payment_id?: string;
		order_status?: string;
	}
): Promise<IOrder> => {
	try {
		const response = await axios.patch(`${API_URL}/orders/${orderId}`, updates);
		return {
			...response.data,
			id: response.data._id,
		};
	} catch (error) {
		console.error('Error updating order:', error);
		throw error;
	}
};

export const deleteOrder = async (orderId: string): Promise<void> => {
	try {
		await axios.delete(`${API_URL}/orders/${orderId}`);
	} catch (error) {
		console.error(`Error deleting order: ${orderId}`, error);
		throw error;
	}
};

export const fetchAllOrdersWithItems = async (): Promise<IOrder[]> => {
	try {
		const response = await axios.get(`${API_URL}/orders`);
		const orders: IOrder[] = response.data;

		const ordersWithItems = await Promise.all(
			orders.map(async (order) => {
				try {
					const orderId = order._id || order.id;
					if (!orderId) {
						console.error('Order is mssing an ID:', order);
						return { ...order, order_items: [] };
					}

					const orderDetailsResponse = await axios.get(
						`${API_URL}/orders/${orderId}`
					);
					return {
						...order,
						id: orderId.toString(),
						order_items: orderDetailsResponse.data.order_items || [],
					};
				} catch (error) {
					console.error(
						`Error fetching details for order ID ${order.id || order._id}:`,
						error
					);
					return {
						...order,
						id: order._id?.toString() || order.id?.toString(),
						order_items: [],
					};
				}
			})
		);

		return ordersWithItems;
	} catch (error) {
		console.error('Error fetching orders with items:', error);
		throw error;
	}
};

export const deleteOrderItem = async (orderItemId: string) => {
	try {
		await axios.patch(`${API_URL}/order-items/${orderItemId}`);
	} catch (error) {
		console.error('Error deleting order item:', error);
		throw error;
	}
};

export const updateOrderItemQuantity = async (
	orderItemId: string,
	newQuantity: number
): Promise<void> => {
	try {
		await axios.patch(`${API_URL}/order-items/${orderItemId}`, {
			quantity: newQuantity,
		});
	} catch (error) {
		console.error('Error updating order item quantity', error);
		throw error;
	}
};

export const updateOrderStatus = async (
	orderId: string,
	newStatus: string
): Promise<void> => {
	try {
		await axios.patch(`${API_URL}/orders/${orderId}`, {
			order_status: newStatus,
		});
	} catch (error) {
		console.error('Error updating order status', error);
		throw error;
	}
};
