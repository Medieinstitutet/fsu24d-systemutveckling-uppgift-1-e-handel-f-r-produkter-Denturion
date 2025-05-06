import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem extends Document {
	order_id: mongoose.Types.ObjectId;
	product_id: mongoose.Types.ObjectId;
	product_name: string;
	quantity: number;
	unit_price: number;
	created_at: Date;
}

const OrderItemSchema: Schema = new Schema({
	order_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Order',
		required: true,
	},
	product_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product',
		required: true,
	},
	product_name: { type: String, required: true },
	quantity: { type: Number, required: true },
	unit_price: { type: Number, required: true },
	created_at: { type: Date, default: Date.now },
});

export default mongoose.model<IOrderItem>('OrderItem', OrderItemSchema);
