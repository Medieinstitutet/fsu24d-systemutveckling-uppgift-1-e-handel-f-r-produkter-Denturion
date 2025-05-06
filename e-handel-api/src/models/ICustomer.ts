import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
	id: number | null;
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	phone: string;
	street_address: string;
	postal_code: string;
	city: string;
	country: string;
	created_at: Date;
}

const CustomerSchema: Schema = new Schema({
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	phone: { type: String, required: true },
	street_address: { type: String, required: true },
	postal_code: { type: String, required: true },
	city: { type: String, required: true },
	country: { type: String, required: true },
	created_at: { type: Date, default: Date.now },
});

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
