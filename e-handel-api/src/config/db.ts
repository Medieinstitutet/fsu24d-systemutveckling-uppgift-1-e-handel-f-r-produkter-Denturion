import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectToDB = async () => {
	try {
		console.log('MONGO_URI:', process.env.MONGO_URI);

		await mongoose.connect(process.env.MONGO_URI || '', {
			dbName: 'webshop',
		});
		console.log('Connected to MongoDB Atlas');
	} catch (error) {
		console.error('Failed to connect to MongoDB', error);
		process.exit(1);
	}
};
