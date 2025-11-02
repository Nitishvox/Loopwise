
import React, { useState } from 'react';
import { XIcon, SparklesIcon } from './icons';

interface AddFundsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddFunds: (amount: number) => void;
    currentBalance: number;
    monthlyCost: number;
}

const presetAmounts = [50, 100, 250, 500];

const AddFundsModal: React.FC<AddFundsModalProps> = ({ isOpen, onClose, onAddFunds, currentBalance, monthlyCost }) => {
    const [amount, setAmount] = useState('');
    const [aiSuggestion, setAiSuggestion] = useState<string>('');
    const [isThinking, setIsThinking] = useState(false);

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
        if (numericAmount > 0) {
            onAddFunds(numericAmount);
            setAmount('');
            setAiSuggestion('');
        }
    };
    
    const getAiSuggestion = async () => {
        setIsThinking(true);
        setAiSuggestion('');
        
        // Simulate thinking delay
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            let suggestedAmount = 50; // Default suggestion
            if (monthlyCost > 0) {
                // Aim to have enough for ~2.5 months
                const targetBalance = monthlyCost * 2.5;
                const needed = Math.max(0, targetBalance - currentBalance);
                
                if (needed > 0) {
                    // Round up to a nice number
                    if (needed < 50) {
                        suggestedAmount = Math.ceil(needed / 10) * 10;
                    } else {
                        suggestedAmount = Math.ceil(needed / 50) * 50;
                    }
                    if (suggestedAmount < 20) suggestedAmount = 20;
                }
            }
            
            const suggestedAmountStr = suggestedAmount.toFixed(2);
            setAmount(suggestedAmountStr);
            setAiSuggestion(`We suggest adding $${suggestedAmountStr} to cover your upcoming payments.`);

        } catch (error) {
            console.error("Mock AI fund suggestion error:", error);
            setAiSuggestion("Sorry, I couldn't generate a suggestion right now.");
        } finally {
            setIsThinking(false);
        }
    };


    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div 
                className="relative bg-slate-900 border border-slate-800 w-full max-w-md m-4 rounded-xl shadow-2xl animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 id="modal-title" className="text-xl font-bold text-white">Add Funds</h2>
                            <p className="text-slate-400 text-sm mt-1">Top up your USDC balance.</p>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="p-1 rounded-full text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                            aria-label="Close modal"
                        >
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="mt-6">
                        <div className="space-y-4">
                             <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-slate-400 mb-1">Amount</label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">$</span>
                                    <input
                                        type="text"
                                        id="amount"
                                        name="amount"
                                        value={amount}
                                        onChange={handleAmountChange}
                                        placeholder="0.00"
                                        className="w-full pl-7 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-2">
                                {presetAmounts.map(preset => (
                                    <button key={preset} type="button" onClick={() => setAmount(String(preset))} className="px-2 py-2 text-sm font-semibold bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 text-slate-300 transition-colors">
                                        ${preset}
                                    </button>
                                ))}
                            </div>

                            <div>
                                <button
                                    type="button"
                                    onClick={getAiSuggestion}
                                    disabled={isThinking}
                                    className="w-full flex justify-center items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-300 bg-primary-500/10 rounded-lg hover:bg-primary-500/20 disabled:opacity-60 transition-colors"
                                >
                                    <SparklesIcon className="w-5 h-5"/>
                                    {isThinking ? 'Analyzing...' : 'Suggest an amount'}
                                </button>
                                {aiSuggestion && <p className="text-xs text-primary-300/80 text-center mt-2 animate-fade-in">{aiSuggestion}</p>}
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={!amount || parseFloat(amount) <= 0}
                                className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-not-allowed transition-colors"
                            >
                                Add ${amount || '0.00'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddFundsModal;
