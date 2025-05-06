export interface IOrderItem {
	id: string;
	order_id: string;
	product_id: string;
	product_name: string;
	quantity: number;
	unit_price: number;
	created_at: Date;
}
