'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Success() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(true);

    // Get query parameters using searchParams
    const session_id = searchParams.get('session_id');
    const project_id = searchParams.get('project_id');
    const amount = searchParams.get('amount');

    useEffect(() => {
        if (session_id) {
            console.log('Payment completed!', { session_id, project_id, amount });
            verifyPayment();
        } else {
            setLoading(false);
        }
    }, [session_id, project_id, amount]);

    const verifyPayment = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/verify-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: session_id })
            });

            if (!response.ok) {
                throw new Error('Payment verification failed');
            }

            const data = await response.json();
            setVerified(data.success);
        } catch (error) {
            console.error('Verification error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
            </div>
        );
    }

    if (!session_id) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <h1 className="text-2xl font-bold">Invalid Session</h1>
                    <p className="mt-2">No payment session found.</p>
                </div>
                <button
                    onClick={() => router.push('/')}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Back to Projects
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <h1 className="text-2xl font-bold">Payment Successful! 🎉</h1>
                <p className="mt-2">Thank you for your ${amount} donation!</p>
                <p className="text-sm mt-2">Session ID: {session_id}</p>
                {verified && <p className="text-sm">✅ Payment verified</p>}
            </div>

            <button
                onClick={() => router.push('/')}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Back to Projects
            </button>
        </div>
    );
}