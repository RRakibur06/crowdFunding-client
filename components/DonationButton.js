import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const DonationButton = ({ projectId, projectName, amount }) => {
    const handleDonation = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount,
                    projectId,
                    projectName,
                    successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&project_id=${projectId}&amount=${amount}`,
                    cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`
                }),
            });

            const { sessionId } = await response.json();
            const stripe = await stripePromise;

            const { error } = await stripe.redirectToCheckout({
                sessionId,
            });

            if (error) {
                console.error('Stripe error:', error);
            }
        } catch (error) {
            console.error('Payment error:', error);
        }
    };

    return (
        <button
            onClick={handleDonation}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
            Donate ${amount}
        </button>
    );
};

export default DonationButton;