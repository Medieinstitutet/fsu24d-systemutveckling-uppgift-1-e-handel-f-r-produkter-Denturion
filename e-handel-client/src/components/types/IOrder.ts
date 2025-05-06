import { IOrderItem } from './IOrderItem';

export interface IOrder {
	id: string;
	customer_id: string;
	customer_firstname?: string;
	customer_lastname?: string;
	customer_email?: string;
	total_price: number;
	payment_status: string;
	order_status: string;
	order_items: IOrderItem[];
	created_at: Date;
}
