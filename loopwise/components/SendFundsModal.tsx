
import React, { useState, useEffect } from 'react';
import { User, Transaction } from '../types';
import { XIcon, PaperAirplaneIcon, CheckCircleIcon } from './icons';

interface SendFundsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSendFunds: (details: { recipientId: string; amount: number; notes?: string }) => Promise<Transaction | undefined>;
    currentUser: User | null;
}

const SendFundsModal: React.FC<SendFundsModalProps> = ({ isOpen, onClose, onSendFunds, currentUser }) => {
    const [view, setView] = useState<'form' | 'sending' | 'receipt'>('form');
    const [completedTx, setCompletedTx] = useState<Transaction | null>(null);

    const [recipientId, setRecipientId] = useState('');
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    
    // Reset state when modal is opened or closed
    useEffect(() => {
        if (isOpen) {
            setView('form');
            setCompletedTx(null);
            setRecipientId('');
            setAmount('');
            setNotes('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*\.?\d{0,2}$/.test(value)) {
            setAmount(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(amount);
        if (numericAmount > 0 && recipientId.trim()) {
            setView('sending');
            const newTx = await onSendFunds({
                recipientId: recipientId.trim(),
                amount: numericAmount,
                notes,
            });
            if (newTx) {
                setCompletedTx(newTx);
                setTimeout(() => setView('receipt'), 2500); // Wait for animation
            } else {
                // Handle error case (e.g., insufficient funds)
                setView('form'); 
            }
        }
    };
    
    const currentBalance = currentUser?.balances.USDC || 0;

    const renderContent = () => {
        switch (view) {
            case 'sending':
                return (
                    <div className="p-6 h-80 flex flex-col items-center justify-center text-center">
                        <div className="relative w-full h-24 overflow-hidden">
                            <PaperAirplaneIcon className="w-12 h-12 text-primary-400 absolute top-1/2 -translate-y-1/2 animate-fly-in-out" />
                        </div>
                        <h2 className="text-xl font-bold text-white mt-4">Sending Funds...</h2>
                        <p className="text-slate-400 text-sm mt-1">Your transaction is being processed securely.</p>
                    </div>
                );
            case 'receipt':
                if (!completedTx) return null;
                return (
                    <div className="p-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full mx-auto flex items-center justify-center">
                                <svg className="w-10 h-10 text-green-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
                                    <path className="animate-draw-check" d="M7 13l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 20, strokeDashoffset: 20 }}/>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mt-4">Transfer Successful!</h2>
                            <p className="text-slate-400 mt-1">You sent <span className="font-semibold text-slate-200">${completedTx.amount.toFixed(2)}</span> to <span className="font-semibold text-slate-200">{recipientId}</span>.</p>
                        </div>
                        <div className="mt-6 border-t border-b border-slate-800 divide-y divide-slate-800 text-sm">
                            <div className="flex justify-between py-3"><span className="text-slate-400">Amount</span><span className="font-medium text-slate-200">${completedTx.amount.toFixed(2)} {completedTx.currency}</span></div>
                            <div className="flex justify-between py-3"><span className="text-slate-400">To</span><span className="font-medium text-slate-200">{recipientId}</span></div>
                            <div className="flex justify-between py-3"><span className="text-slate-400">Transaction ID</span><span className="font-mono text-xs text-slate-400">{completedTx.txId.slice(0,12)}...</span></div>
                        </div>
                        <div className="mt-6">
                            <button onClick={onClose} className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
                                Done
                            </button>
                        </div>
                    </div>
                );
            case 'form':
            default:
                return (
                    <form onSubmit={handleSubmit}>
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 id="modal-title" className="text-xl font-bold text-white">Send Funds</h2>
                                    <p className="text-slate-400 text-sm mt-1">Transfer USDC to another Loopwise user.</p>
                                </div>
                                <button type="button" onClick={onClose} className="p-1 rounded-full text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors" aria-label="Close modal">
                                    <XIcon className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="mt-6 space-y-4">
                                <div>
                                    <label htmlFor="recipientId" className="block text-sm font-medium text-slate-400 mb-1">Recipient's Username or Address</label>
                                    <input id="recipientId" type="text" value={recipientId} onChange={(e) => setRecipientId(e.target.value)} placeholder="e.g., alex_rivera or 0x..." className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white" required />
                                </div>
                                <div>
                                    <div className="flex justify-between">
                                        <label htmlFor="amount" className="block text-sm font-medium text-slate-400 mb-1">Amount</label>
                                        <span className="text-xs text-slate-500">Balance: ${currentBalance.toFixed(2)}</span>
                                    </div>
                                    <div className="relative">
                                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">$</span>
                                        <input type="text" id="amount" value={amount} onChange={handleAmountChange} placeholder="0.00" className="w-full pl-7 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white" required />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-slate-400 mb-1">Notes (Optional)</label>
                                    <textarea id="notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., For dinner last night" className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white text-sm" />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-950/50 rounded-b-xl mt-2 flex justify-end gap-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">Cancel</button>
                            <button type="submit" disabled={!amount || parseFloat(amount) <= 0 || !recipientId.trim() || parseFloat(amount) > currentBalance} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-not-allowed transition-colors">
                                <PaperAirplaneIcon className="w-4 h-4 -rotate-45" />
                                Send Funds
                            </button>
                        </div>
                    </form>
                );
        }
    };


    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
            onClick={view !== 'sending' ? onClose : undefined}
        >
            <div 
                className="relative bg-slate-900 border border-slate-800 w-full max-w-lg m-4 rounded-xl shadow-2xl animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
               {renderContent()}
            </div>
        </div>
    );
};

export default SendFundsModal;