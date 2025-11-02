

import React from 'react';
import { Subscription, SubscriptionStatus } from '../types';

interface SubscriptionCardProps {
    subscription: Subscription;
    onManageClick: (subscription: Subscription) => void;
    onStatusChange: (subscriptionId: string, newStatus: SubscriptionStatus) => void;
}

const statusStyles: { [key in SubscriptionStatus]: { dot: string; text: string } } = {
    active: { dot: 'bg-green-400', text: 'text-green-400' },
    paused: { dot: 'bg-yellow-400', text: 'text-yellow-400' },
    cancelled: { dot: 'bg-red-400', text: 'text-red-400' },
};

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, onManageClick, onStatusChange }) => {
    const { id, name, provider, status, nextPayment, category, availablePlans, currentPlanId, imageUrl } = subscription;
    const { dot, text } = statusStyles[status];
    const currentPlan = availablePlans.find(p => p.id === currentPlanId);
    const monthlyCost = currentPlan?.monthlyCost || 0;


    return (
        <article className="p-5 h-full rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between transition-all hover:border-primary-500/50 hover:-translate-y-1 shadow-lg shadow-black/10">
            <div>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        {imageUrl ? (
                            <img src={imageUrl} alt={`${name} logo`} className="w-10 h-10 rounded-lg flex-shrink-0" />
                        ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center font-bold text-slate-300 flex-shrink-0">
                                {name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <p className="text-xs font-medium text-primary-400 uppercase tracking-wider">{category}</p>
                            <h3 className="text-lg font-bold text-slate-100 mt-1">{name}</h3>
                            <p className="text-sm text-slate-400">{provider}</p>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-xl font-bold text-white">{monthlyCost.toFixed(2)}</div>
                        <div className="text-sm text-slate-500">USDC</div>
                    </div>
                </div>

                <div className="mt-4 border-t border-slate-800 pt-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Next Payment:</span>
                        <span className="font-medium text-slate-300">
                            {status === 'active' ? new Date(nextPayment).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-2">
                        <span className="text-slate-500">Status:</span>
                        <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${dot}`}></span>
                            <span className={`font-medium capitalize ${text}`}>{status}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex gap-2">
                {status === 'cancelled' ? (
                     <button 
                        onClick={() => onManageClick(subscription)}
                        className="w-full text-sm font-semibold bg-green-500/10 text-green-300 px-4 py-2 rounded-lg hover:bg-green-500/20 transition-colors"
                    >
                        Reactivate
                    </button>
                ) : (
                    <>
                        <button 
                            onClick={() => onManageClick(subscription)}
                            className="flex-1 text-sm font-semibold bg-slate-700/70 text-slate-200 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                            Manage
                        </button>
                        {status === 'active' && (
                            <button 
                                onClick={() => onStatusChange(id, 'paused')}
                                className="flex-1 text-sm font-semibold bg-primary-900/50 text-primary-300 px-4 py-2 rounded-lg hover:bg-primary-900/80 transition-colors"
                            >
                                Pause
                            </button>
                        )}
                        {status === 'paused' && (
                            <button 
                                onClick={() => onStatusChange(id, 'active')}
                                className="flex-1 text-sm font-semibold bg-green-500/10 text-green-300 px-4 py-2 rounded-lg hover:bg-green-500/20 transition-colors"
                            >
                                Resume
                            </button>
                        )}
                    </>
                )}
            </div>
        </article>
    );
};

export default SubscriptionCard;