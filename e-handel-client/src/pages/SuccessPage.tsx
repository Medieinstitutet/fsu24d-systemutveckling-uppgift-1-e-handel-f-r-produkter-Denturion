import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { fetchPaymentDetails } from '../services/stripeServices';
import { useCart } from '../components/contexts/CartContext';

export const SuccessPage: React.FC = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { clearCart } = useCart();

	useEffect(() => {
		const handleSuccess = async () => {
			const sessionId = searchParams.get('session_id');
			console.log('Session ID:', sessionId);
			if (!sessionId) {
				console.error('Session ID is missing.');

				return;
			}
			try {
				const paymentDetails = await fetchPaymentDetails(sessionId);
				console.log('Payment details:', paymentDetails);

				clearCart();

				navigate(`/order-summary?session_id=${sessionId}`);
			} catch (error) {
				console.error('Error fetching payment');
			}
		};
		handleSuccess();
	}, [searchParams, navigate]);
	return <div>Processing your payment...</div>;
};
