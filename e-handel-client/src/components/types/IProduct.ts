export interface IProduct {
	id: string;
	name: string;
	description: string;
	price: number;
	stock: number;
	category: string;
	image: string;
	created_at: Date;
	quantity?: number;
}
