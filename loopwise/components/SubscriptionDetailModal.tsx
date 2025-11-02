

import React, { Fragment, useState, useEffect } from 'react';
import { Subscription, Plan, SubscriptionStatus } from '../types';
import { XIcon, ExclamationTriangleIcon, SparklesIcon, CheckIcon } from './icons';

interface SubscriptionDetailModalProps {
    subscription: Subscription | null;
    onClose: () => void;
    onCancelSubscription: (subscriptionId: string) => void;
    onPlanChange: (subscriptionId: string, newPlanId: string) => void;
    onStatusChange: (subscriptionId: string, newStatus: SubscriptionStatus) => void;
}

const statusStyles = {
    active: 'text-green-400 bg-green-500/10',
    paused: 'text-yellow-400 bg-yellow-500/10',
    cancelled: 'text-red-400 bg-red-500/10',
};

const SubscriptionDetailModal: React.FC<SubscriptionDetailModalProps> = ({ subscription, onClose, onCancelSubscription, onPlanChange, onStatusChange }) => {
    const [aiAdvice, setAiAdvice] = useState<string>('');
    const [isThinking, setIsThinking] = useState(false);
    const [isConfirmingReactivation, setIsConfirmingReactivation] = useState(false);

    useEffect(() => {
        if (subscription) {
            setIsConfirmingReactivation(false);
            setAiAdvice('');
        }
    }, [subscription]);

    if (!subscription) return null;

    const { id, name, provider, status, lastPayment, nextPayment, category, currentPlanId, availablePlans, usageScore, imageUrl } = subscription;
    const currentPlan = availablePlans.find(p => p.id === currentPlanId);

    const getAiPlanAdvice = async () => {
        setIsThinking(true);
        setAiAdvice('');
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            const cheaperPlan = availablePlans.find(p => p.monthlyCost < (currentPlan?.monthlyCost || 0));
            const moreExpensivePlan = availablePlans.find(p => p.monthlyCost > (currentPlan?.monthlyCost || 0));
            let advice = "Recommendation: Your current plan seems to be a good fit for your usage.";

            if (usageScore < 0.5 && cheaperPlan) {
                advice = `Recommendation: Your usage is low. You could save $${((currentPlan?.monthlyCost || 0) - cheaperPlan.monthlyCost).toFixed(2)} by switching to the '${cheaperPlan.name}' plan.`;
            } else if (usageScore > 0.9 && moreExpensivePlan) {
                advice = `Recommendation: Your usage is high. Consider upgrading to the '${moreExpensivePlan.name}' plan for more features.`;
            }

            setAiAdvice(advice);
        } catch (error) {
            console.error("Mock AI plan advice error:", error);
            setAiAdvice("Sorry, I couldn't generate advice right now.");
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
                className="relative bg-slate-900 border border-slate-800 w-full max-w-lg m-4 rounded-xl shadow-2xl animate-scale-in flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-6 border-b border-slate-800 flex-shrink-0">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            {imageUrl ? (
                                <img src={imageUrl} alt={`${name} logo`} className="w-12 h-12 rounded-lg flex-shrink-0" />
                            ) : (
                                <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-slate-300 flex-shrink-0 text-xl">
                                    {name.charAt(0)}
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-semibold text-primary-400 uppercase tracking-wider">{category}</p>
                                <h2 id="modal-title" className="text-2xl font-bold text-white mt-1">{name}</h2>
                                <p className="text-slate-400">{provider}</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="p-1 rounded-full text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                            aria-label="Close modal"
                        >
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                             <div>
                                <p className="text-sm text-slate-400">Status</p>
                                <p className="text-sm font-medium text-slate-200 mt-1">
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-md capitalize ${statusStyles[status]}`}>{status}</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Current Plan</p>
                                <p className="text-sm font-medium text-slate-200 mt-1">{currentPlan?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Monthly Cost</p>
                                <p className="text-sm font-medium text-slate-200 mt-1">{currentPlan?.monthlyCost.toFixed(2)} USDC</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Next Payment</p>
                                <p className="text-sm font-medium text-slate-200 mt-1">{status === 'active' ? new Date(nextPayment).toLocaleDateString() : 'N/A'}</p>
                            </div>
                             <div>
                                <p className="text-sm text-slate-400">Last Payment</p>
                                <p className="text-sm font-medium text-slate-200 mt-1">{new Date(lastPayment).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-slate-800 pt-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-md font-semibold text-slate-200">Manage Plan</h3>
                                <button onClick={getAiPlanAdvice} disabled={isThinking || status === 'cancelled'} className="flex items-center gap-1.5 text-xs font-semibold text-primary-400 hover:text-primary-300 disabled:opacity-50">
                                    <SparklesIcon className="w-4 h-4"/>
                                    {isThinking ? 'Thinking...' : 'Get Plan Advice'}
                                </button>
                            </div>

                            {aiAdvice && (
                                <div className="mt-3 p-3 text-sm text-primary-200 bg-primary-500/10 rounded-lg border border-primary-500/20 animate-fade-in">
                                    {aiAdvice}
                                </div>
                            )}

                            <div className="mt-4 space-y-3">
                                {availablePlans.map(plan => (
                                     <div key={plan.id} className={`p-4 rounded-lg border-2 transition-all ${currentPlanId === plan.id ? 'bg-primary-500/10 border-primary-500' : 'bg-slate-800/50 border-slate-700'}`}>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="font-bold text-slate-100">{plan.name}</h4>
                                                <p className="text-xs text-slate-400">{plan.features.join(' · ')}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-white">${plan.monthlyCost.toFixed(2)}</p>
                                                <p className="text-xs text-slate-500">/month</p>
                                            </div>
                                        </div>
                                        {currentPlanId !== plan.id && status === 'active' && (
                                            <button 
                                                onClick={() => onPlanChange(id, plan.id)}
                                                className="mt-3 w-full text-sm font-semibold bg-slate-700 text-slate-200 px-4 py-1.5 rounded-lg hover:bg-slate-600 transition-colors"
                                            >
                                                Switch to {plan.name}
                                            </button>
                                        )}
                                         {currentPlanId === plan.id && (
                                             <div className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-green-400">
                                                 <CheckIcon className="w-5 h-5" /> Current Plan
                                            </div>
                                         )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="p-6 bg-slate-950/50 rounded-b-xl border-t border-slate-800 flex-shrink-0">
                    {status === 'cancelled' ? (
                        !isConfirmingReactivation ? (
                            <div className="text-center animate-fade-in">
                                <p className="text-slate-300">This subscription is currently cancelled.</p>
                                <button
                                    onClick={() => setIsConfirmingReactivation(true)}
                                    className="mt-3 w-full text-sm font-semibold bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                                >
                                    Reactivate Subscription
                                </button>
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <h3 className="text-md font-semibold text-center text-white">Confirm Reactivation</h3>
                                <p className="text-sm text-center text-slate-400 mt-2">
                                    You're about to reactivate your <span className="font-bold text-slate-200">{name}</span> subscription on the <span className="font-bold text-slate-200">{currentPlan?.name}</span> plan for <span className="font-bold text-slate-200">${currentPlan?.monthlyCost.toFixed(2)}/month</span>.
                                </p>
                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => setIsConfirmingReactivation(false)}
                                        className="flex-1 text-sm font-semibold bg-slate-700 text-slate-200 px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => onStatusChange(id, 'active')}
                                        className="flex-1 text-sm font-semibold bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Confirm & Reactivate
                                    </button>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/10">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 text-red-400">
                                    <ExclamationTriangleIcon className="w-5 h-5 mt-0.5" />
                                </div>
                                <div>
                                    <h3 className="text-md font-semibold text-red-300">Danger Zone</h3>
                                    <p className="text-sm text-red-300/80 mt-1">Cancelling your subscription is a permanent action and cannot be undone.</p>
                                    <button 
                                        onClick={() => onCancelSubscription(subscription.id)}
                                        className="mt-3 text-sm font-semibold bg-red-600/80 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-md"
                                    >
                                        Cancel Subscription
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </footer>
            </div>
        </div>
    );
};

export default SubscriptionDetailModal;