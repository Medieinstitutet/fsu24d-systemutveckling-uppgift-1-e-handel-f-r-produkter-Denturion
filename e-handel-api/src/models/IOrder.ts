import mongoose, { Document, Schema } from 'mongoose';
import { IOrderItem } from './IOrderitem';

export interface IOrder extends Document {
	customer_id: mongoose.Types.ObjectId;
	total_price: number;
	payment_status: string;
	payment_id: string;
	order_status: string;
	created_at: Date;
	order_items: IOrderItem[];
}

const OrderSchema: Schema = new Schema({
	customer_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Customer',
		required: true,
	},
	total_price: { type: Number, required: true },
	payment_status: { type: String, required: true },
	order_status: { type: String, required: true },
	created_at: { type: Date, default: Date.now },
	order_items: [
		{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem', required: true },
	],
});

export default mongoose.model<IOrder>('Order', OrderSchema);
