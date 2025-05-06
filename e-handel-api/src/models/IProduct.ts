import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
	id: number | null;
	name: string;
	description: string;
	price: number;
	stock: number;
	category: string;
	image: string;
	created_at: Date;
}

const ProductSchema: Schema = new Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	price: { type: Number, required: true },
	stock: { type: Number, required: true },
	category: { type: String, required: true },
	image: { type: String, required: true },
	created_at: { type: Date, default: Date.now },
});

export default mongoose.model<IProduct>('Product', ProductSchema);
