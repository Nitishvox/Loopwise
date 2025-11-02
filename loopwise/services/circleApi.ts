

// WARNING: Storing API keys in frontend code is extremely insecure and should never be done in a real application.
// This is for demonstration purposes only. In a production environment, all API calls should be proxied through a secure backend server.
const CIRCLE_API_KEY = import.meta.env.VITE_CIRCLE_API_KEY;
const CIRCLE_API_URL = 'past the url here';

interface CircleTransferResponse {
    data: {
        id: string;
        source: { type: string; id: string };
        destination: { type: string; id: string };
        amount: { amount: string; currency: string };
        txHash: string;
        status: 'PENDING' | 'RUNNING' | 'COMPLETE' | 'FAILED';
        createDate: string;
    };
}

const sendFunds = async (sourceWalletId: string, destinationWalletId: string, amount: number): Promise<CircleTransferResponse> => {
    // A simple UUID generator for the idempotency key
    const idempotencyKey = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    const response = await fetch(CIRCLE_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CIRCLE_API_KEY}`
        },
        body: JSON.stringify({
            idempotencyKey,
            source: {
                type: 'wallet',
                id: sourceWalletId
            },
            destination: {
                type: 'wallet',
                id: destinationWalletId
            },
            amount: {
                amount: amount.toFixed(2),
                currency: 'USDC'
            }
        })
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error('Circle API Error:', errorBody);
        throw new Error(errorBody.message || 'Failed to initiate transfer.');
    }

    return response.json();
};

export const circleApi = {
    sendFunds
};
