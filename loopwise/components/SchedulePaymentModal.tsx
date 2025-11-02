
import React, { useState, useEffect } from 'react';
import { Subscription } from '../types';
import { XIcon } from './icons';

interface SchedulePaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSchedulePayment: (details: { subscriptionName: string; amount: number; paymentDate: string; notes?: string }) => void;
    subscriptions: Subscription[];
}

const SchedulePaymentModal: React.FC<SchedulePaymentModalProps> = ({ isOpen, onClose, onSchedulePayment, subscriptions }) => {
    const [subscriptionName, setSubscriptionName] = useState<string>('');
    const [amount, setAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Reset state when modal opens
            const firstSub = subscriptions.length > 0 ? subscriptions[0] : null;
            setSubscriptionName(firstSub?.name || '');
            const plan = firstSub?.availablePlans.find(p => p.id === firstSub.currentPlanId);
            setAmount(plan ? plan.monthlyCost.toFixed(2) : '');
            
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setPaymentDate(tomorrow.toISOString().split('T')[0]);
            setNotes('');
        }
    }, [isOpen, subscriptions]);
    
    useEffect(() => {
        const selectedSub = subscriptions.find(s => s.name === subscriptionName);
        if (selectedSub) {
            const plan = selectedSub.availablePlans.find(p => p.id === selectedSub.currentPlanId);
            if (plan) {
                setAmount(plan.monthlyCost.toFixed(2));
            }
        } else {
            // If it's a new subscription name that doesn't match, clear the amount
            if (subscriptionName.trim() && !subscriptions.some(s => s.name === subscriptionName)) {
                setAmount('');
            }
        }
    }, [subscriptionName, subscriptions]);

    if (!isOpen) return null;

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*\.?\d{0,2}$/.test(value)) {
            setAmount(value);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(amount);
        if (numericAmount > 0 && subscriptionName && paymentDate) {
            onSchedulePayment({
                subscriptionName,
                amount: numericAmount,
                paymentDate: `${paymentDate}T12:00:00.000Z`, // Use noon UTC to avoid timezone issues
                notes,
            });
        }
    };

    const tomorrowDateString = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div 
                className="relative bg-slate-900 border border-slate-800 w-full max-w-lg m-4 rounded-xl shadow-2xl animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 id="modal-title" className="text-xl font-bold text-white">Schedule a Payment</h2>
                                <p className="text-slate-400 text-sm mt-1">Set up a future payment for a subscription.</p>
                            </div>
                            <button 
                                type="button"
                                onClick={onClose} 
                                className="p-1 rounded-full text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                                aria-label="Close modal"
                            >
                                <XIcon className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="mt-6 space-y-4">
                            <div>
                                <label htmlFor="subscription-name" className="block text-sm font-medium text-slate-400 mb-1">Subscription</label>
                                <input
                                    id="subscription-name"
                                    type="text"
                                    list="subscriptions-list"
                                    value={subscriptionName}
                                    onChange={(e) => setSubscriptionName(e.target.value)}
                                    placeholder="Select or type a subscription name"
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                                    required
                                />
                                <datalist id="subscriptions-list">
                                    {subscriptions.map(sub => (
                                        <option key={sub.id} value={sub.name} />
                                    ))}
                                </datalist>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="amount" className="block text-sm font-medium text-slate-400 mb-1">Amount</label>
                                    <div className="relative">
                                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">$</span>
                                        <input
                                            type="text"
                                            id="amount"
                                            value={amount}
                                            onChange={handleAmountChange}
                                            placeholder="0.00"
                                            className="w-full pl-7 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="paymentDate" className="block text-sm font-medium text-slate-400 mb-1">Payment Date</label>
                                    <input
                                        type="date"
                                        id="paymentDate"
                                        value={paymentDate}
                                        onChange={(e) => setPaymentDate(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                                        min={tomorrowDateString()}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-slate-400 mb-1">Notes (Optional)</label>
                                <textarea
                                    id="notes"
                                    rows={3}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="e.g., One-time extra payment"
                                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white text-sm"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6 bg-slate-950/50 rounded-b-xl mt-4">
                        <button
                            type="submit"
                            disabled={!amount || parseFloat(amount) <= 0 || !subscriptionName || !paymentDate}
                            className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-not-allowed transition-colors"
                        >
                            Schedule Payment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SchedulePaymentModal;
