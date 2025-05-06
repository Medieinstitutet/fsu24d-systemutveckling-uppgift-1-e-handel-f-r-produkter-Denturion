import { useEffect, useState } from 'react';
import { useCart } from '../components/contexts/CartContext';
import { Title } from '../components/styled/AdminNav';
import { ICreateCustomer } from '../components/types/ICreateCustomer';

import {
	CustomerFormButtonBack,
	CustomerFormButtonNext,
	FormInput,
	FormLabel,
} from '../components/styled/FormInput';
import { createOrder } from '../services/orderServices';
import {
	calculateTotalPrice,
	mapCartToOrderItems,
} from '../utils/cartHandlers';
import {
	createCustomer,
	fetchCustomerByEmail,
} from '../services/customerServices';
import { ICreateOrder } from '../components/types/ICreateOrder';
// import { useSearchParams } from 'react-router';
import { CartItem, CartSummary } from '../components/styled/CartItem';
import { ICustomer } from '../components/types/ICustomer';

export const CartPage: React.FC = () => {
	const { cart, removeFromCart, setCart } = useCart();
	const [loading, setLoading] = useState<boolean>(false);
	const [currentStep, setCurrentStep] = useState<
		'cart' | 'customerInfo' | 'success' | 'orderSummary'
	>('cart');
	const [customerInfo, setCustomerInfo] = useState<ICreateCustomer>(() => {
		const savedCustomerInfo = localStorage.getItem('customerInfo');
		return savedCustomerInfo
			? JSON.parse(savedCustomerInfo)
			: {
					firstname: '',
					lastname: '',
					email: '',
					password: '',
					phone: '',
					street_address: '',
					postal_code: '',
					city: '',
					country: '',
			  };
	});

	const [error, setError] = useState<string | null>(null);

	const [orderSummary, setOrderSummary] = useState<{
		customer: ICreateCustomer;
		products: typeof cart;
		total: number;
	} | null>(null);

	// const [searchParams] = useSearchParams();

	useEffect(() => {
		const savedCustomerInfo = localStorage.getItem('customerInfo');
		if (savedCustomerInfo) {
			setCustomerInfo(JSON.parse(savedCustomerInfo));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
	}, [customerInfo]);

	const handleGoToCheckout = () => {
		setCurrentStep('customerInfo');
	};

	const handleBackToCart = () => {
		setCurrentStep('cart');
	};

	const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setCustomerInfo((prev) => ({ ...prev, [name]: value }));
	};

	const validateCustomerInfo = (): boolean => {
		for (const key in customerInfo) {
			if (customerInfo[key as keyof ICreateCustomer].trim() === '') {
				setError('Please fill in all fields.');
				return false;
			}
		}

		setError(null);
		return true;
	};

	const handleQuantityChange = (productId: string, newQuantity: number) => {
		setCart((prevCart) => {
			const updatedCart = prevCart.map((product) =>
				product.id === productId
					? { ...product, quantity: newQuantity }
					: product
			);
			localStorage.setItem('cart', JSON.stringify(updatedCart));
			return updatedCart;
		});
	};

	const handleSubmitCustomerInfo = async () => {
		console.log('handleSubmitCustomerInfo triggered');

		if (!validateCustomerInfo()) {
			return;
		}
		try {
			setLoading(true);
			loading;
			let customer: ICustomer;

			try {
				const response = await fetchCustomerByEmail(customerInfo.email);
				customer = response;
			} catch (error: any) {
				if (error.response?.status === 404) {
					console.log('Customer does not exist, creating a new one...');
					customer = await createCustomer({
						firstname: customerInfo.firstname,
						lastname: customerInfo.lastname,
						email: customerInfo.email,
						password: customerInfo.password,
						phone: customerInfo.phone,
						street_address: customerInfo.street_address,
						postal_code: customerInfo.postal_code,
						city: customerInfo.city,
						country: customerInfo.country,
					});
				} else {
					console.error('Error checking customer existence:', error);
					setError('Failed to check customer existence. Please try again.');
					setLoading(false);
					return;
				}
			}

			if (!customer || !customer.id) {
				setError('Failed to retrieve customer information.');
				setLoading(false);
				return;
			}

			const orderItems = mapCartToOrderItems(cart);
			const totalPrice = calculateTotalPrice(cart);

			const newOrder: ICreateOrder = {
				customer_id: customer.id,
				total_price: totalPrice,
				payment_status: 'Paid',
				payment_id: '',
				order_status: 'Pending',
				customer_firstname: customerInfo.firstname,
				customer_lastname: customerInfo.lastname,
				customer_email: customerInfo.email,
				customer_phone: customerInfo.phone,
				customer_street_address: customerInfo.street_address,
				customer_postal_code: customerInfo.postal_code,
				customer_city: customerInfo.city,
				customer_country: customerInfo.country,
				order_items: orderItems,
			};

			console.log('Creating order:', newOrder);
			const createdOrder = await createOrder(newOrder);
			console.log('Order created successfully:', createdOrder);

			setCart([]);
			localStorage.removeItem('customerInfo');
			setCurrentStep('orderSummary');
			setOrderSummary({
				customer: customerInfo,
				products: cart,
				total: totalPrice,
			});
		} catch (error) {
			console.error('Error during order creation:', error);
			setError('Failed to complete the checkout process. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	if (cart.length === 0 && currentStep === 'cart') {
		return <div>Your cart is empty.</div>;
	}

	return (
		<main>
			{currentStep === 'cart' && (
				<div>
					<Title>Your Cart</Title>
					<ul>
						{cart.map((product, index) => (
							<CartItem key={product.id ?? `product-${index}`}>
								<img src={product.image} alt={product.name} />
								<div className='details'>
									<h2>{product.name}</h2>
									<p>{product.description}</p>
									<p>Price: ${product.price}</p>
									<div className='quantity'>
										<span>Quantity:</span>
										<select
											value={product.quantity || 1}
											onChange={(e) =>
												handleQuantityChange(
													product.id!,
													parseInt(e.target.value, 10)
												)
											}
										>
											{[1, 2, 3, 4, 5].map((qty) => (
												<option key={qty} value={qty}>
													{qty}
												</option>
											))}
										</select>
									</div>
								</div>

								<button onClick={() => removeFromCart(product.id!)}>
									Remove
								</button>
							</CartItem>
						))}
					</ul>
					<CartSummary>
						<div className='total'>Total: ${calculateTotalPrice(cart)}</div>
						<button onClick={handleGoToCheckout}>Go to Checkout</button>
					</CartSummary>
				</div>
			)}

			{currentStep === 'customerInfo' && (
				<div>
					<Title>Customer Information</Title>
					{error && <p style={{ color: 'red' }}>{error}</p>}
					<form onSubmit={(e) => e.preventDefault()}>
						<FormLabel>First name</FormLabel>
						<FormInput
							type='text'
							name='firstname'
							placeholder='First Name'
							value={customerInfo.firstname}
							onChange={handleCustomerInfoChange}
						/>
						<FormLabel>Last name</FormLabel>
						<FormInput
							type='text'
							name='lastname'
							placeholder='Last Name'
							value={customerInfo.lastname}
							onChange={handleCustomerInfoChange}
						/>
						<FormLabel>Email</FormLabel>
						<FormInput
							type='email'
							name='email'
							placeholder='Email'
							value={customerInfo.email}
							onChange={handleCustomerInfoChange}
						/>

						<FormLabel>Password</FormLabel>
						<FormInput
							type='password'
							name='password'
							placeholder='Password'
							value={customerInfo.password}
							onChange={handleCustomerInfoChange}
						/>

						<FormLabel>Phone</FormLabel>
						<FormInput
							type='text'
							name='phone'
							placeholder='Phone'
							value={customerInfo.phone}
							onChange={handleCustomerInfoChange}
						/>
						<FormLabel>Street address</FormLabel>
						<FormInput
							type='text'
							name='street_address'
							placeholder='Street Address'
							value={customerInfo.street_address}
							onChange={handleCustomerInfoChange}
						/>
						<FormLabel>Postal code</FormLabel>
						<FormInput
							type='text'
							name='postal_code'
							placeholder='Postal Code'
							value={customerInfo.postal_code}
							onChange={handleCustomerInfoChange}
						/>
						<FormLabel>City</FormLabel>
						<FormInput
							type='text'
							name='city'
							placeholder='City'
							value={customerInfo.city}
							onChange={handleCustomerInfoChange}
						/>
						<FormLabel>Country</FormLabel>
						<FormInput
							type='text'
							name='country'
							placeholder='Country'
							value={customerInfo.country}
							onChange={handleCustomerInfoChange}
						/>
						<CustomerFormButtonBack onClick={handleBackToCart}>
							Back to Cart
						</CustomerFormButtonBack>
						<CustomerFormButtonNext onClick={handleSubmitCustomerInfo}>
							Proceed to checkout
						</CustomerFormButtonNext>
					</form>
				</div>
			)}

			{currentStep === 'orderSummary' && orderSummary && (
				<div>
					<Title>Order Summary</Title>
					<h3>Customer Information</h3>
					<p>
						{orderSummary.customer.firstname} {orderSummary.customer.lastname}
					</p>
					<p>Email: {orderSummary.customer.email}</p>
					<p>Phone: {orderSummary.customer.phone}</p>
					<p>
						Address: {orderSummary.customer.street_address},{' '}
						{orderSummary.customer.postal_code} {orderSummary.customer.city},{' '}
						{orderSummary.customer.country}
					</p>
					<h3>Products</h3>
					<ul>
						{orderSummary.products.map((product) => (
							<li key={product.id || Math.random()}>
								{product.name} - ${product.price} x {product.quantity || 1}
							</li>
						))}
					</ul>
					<h3>Total: ${orderSummary.total.toFixed(2)}</h3>
				</div>
			)}
		</main>
	);
};
