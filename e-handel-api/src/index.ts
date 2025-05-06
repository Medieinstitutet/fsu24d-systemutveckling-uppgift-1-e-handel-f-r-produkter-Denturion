import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDB } from './config/db';
import productRoutes from './routes/productRoutes';
import customerRoutes from './routes/customerRoutes';
import orderRoutes from './routes/orderRoutes';
import orderItemRoutes from './routes/orderItemRoutes';

dotenv.config();
connectToDB();

const app = express();

app.use(
	cors({
		origin: 'http://localhost:5173',
	})
);

app.use(express.json());

app.use('/products', productRoutes);
app.use('/customers', customerRoutes);
app.use('/orders', orderRoutes);
app.use('/order-items', orderItemRoutes);

app.get('/', (req, res) => {
	res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
