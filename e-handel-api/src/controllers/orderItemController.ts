import { Request, RequestHandler, Response } from 'express';
import OrderItem from '../models/IOrderitem';

//Update an order item
export const updateOrderItem: RequestHandler = async (req, res) => {
	try {
		const updatedOrderItem = await OrderItem.findByIdAndDelete(req.params.id);
		if (!updatedOrderItem) {
			res.status(404).json({ message: 'Order item not found' });
			return;
		}
		res.status(200).json(updatedOrderItem);
	} catch (error) {
		res.status(500).json({ message: 'Failed to update order item', error });
	}
};

//Delete an order item
export const deleteOrderItem: RequestHandler = async (req, res) => {
	try {
		const deletedOrderItem = await OrderItem.findByIdAndDelete(req.params.id);
		if (!deletedOrderItem) {
			res.status(404).json({ message: 'Order item not found' });
			return;
		}
		res.status(200).json({ message: 'Order item deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Failed to delete order item', error });
	}
};
