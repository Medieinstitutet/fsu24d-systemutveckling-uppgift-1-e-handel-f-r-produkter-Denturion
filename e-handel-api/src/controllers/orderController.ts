import { RequestHandler } from 'express';
import Order from '../models/IOrder';
import OrderItem from '../models/IOrderitem';

//Create new order
export const createOrder: RequestHandler = async (req, res) => {
	try {
		console.log('Incoming data', req.body);

		const order = new Order({
			...req.body,
			order_items: [],
		});

		const savedOrder = await order.save();

		const orderItems = await OrderItem.insertMany(
			req.body.order_items.map((item: any) => ({
				...item,
				order_id: savedOrder._id,
			}))
		);

		savedOrder.order_items = orderItems.map((item) => item._id);
		await savedOrder.save();

		res.status(201).json(savedOrder);
	} catch (error) {
		console.error('Error creating order', error);

		res.status(500).json({ message: 'Failed to create order', error });
	}
};

//Fetch all orders
export const fetchAllOrders: RequestHandler = async (_req, res) => {
	try {
		const orders = await Order.find().populate('order_items');

		res.status(200).json(orders);
	} catch (error) {
		res.status(500).json({ message: 'Failed to fetch order', error });
	}
};

//Fetch order by ID
export const fetchOrderById: RequestHandler = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id)
			.populate('order_items')
			.populate('customer_id');
		res.status(200).json(order);
	} catch (error) {
		res.status(500).json({ message: 'Failed to fetch order', error });
	}
};

//Update order
export const updateOrder: RequestHandler = async (req, res) => {
	try {
		const updatedOrder = await Order.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		if (!updatedOrder) {
			res.status(404).json({ message: 'Order not found' });
			return;
		}
		res.status(500).json({ updatedOrder });
	} catch (error) {
		res.status(500).json({ message: 'Failed to update order', error });
	}
};

//Delete order
export const deleteOrder: RequestHandler = async (req, res) => {
	try {
		const deletedOrder = await Order.findByIdAndDelete(req.params.id);
		if (!deletedOrder) {
			res.status(404).json({ message: 'Order not found' });
			return;
		}
		res.status(200).json({ message: 'Order deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Failed to delete order', error });
	}
};
