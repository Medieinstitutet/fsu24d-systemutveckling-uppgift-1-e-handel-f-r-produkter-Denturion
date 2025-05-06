import { IOrderItem } from '../components/types/IOrderItem';
import { IProduct } from '../components/types/IProduct';

export const calculateTotalPrice = (cart: IProduct[]): number => {
	return cart.reduce(
		(sum, product) => sum + product.price * (product.quantity || 1),
		0
	);
};

export const mapCartToOrderItems = (
	cart: IProduct[]
): Omit<IOrderItem, 'id' | 'order_id' | 'created_at'>[] => {
	return cart.map((product) => ({
		product_id: product.id,
		product_name: product.name,
		quantity: product.quantity || 1,
		unit_price: product.price,
	}));
};
