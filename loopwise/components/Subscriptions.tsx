

import React, { useState, useMemo } from 'react';
import { Subscription, SubscriptionStatus, Plan } from '../types';
import SubscriptionCard from './SubscriptionCard';
import SubscriptionDetailModal from './SubscriptionDetailModal';

interface SubscriptionsProps {
    subscriptions: Subscription[];
    onStatusChange: (subscriptionId: string, status: SubscriptionStatus) => void;
    onPlanChange: (subscriptionId: string, newPlanId: string) => void;
}

const statusFilters: { label: string; value: SubscriptionStatus | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Paused', value: 'paused' },
    { label: 'Cancelled', value: 'cancelled' },
];


const Subscriptions: React.FC<SubscriptionsProps> = ({ subscriptions, onStatusChange, onPlanChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeStatus, setActiveStatus] = useState<SubscriptionStatus | 'all'>('all');
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

    const filteredSubscriptions = useMemo(() => {
        return subscriptions.filter(sub => {
            const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) || sub.provider.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = activeStatus === 'all' || sub.status === activeStatus;
            return matchesSearch && matchesStatus;
        });
    }, [subscriptions, searchTerm, activeStatus]);

    const handleManageClick = (subscription: Subscription) => {
        setSelectedSubscription(subscription);
    };
    
    const handleCloseModal = () => {
        setSelectedSubscription(null);
    };

    const handleCancelSubscription = (subscriptionId: string) => {
        onStatusChange(subscriptionId, 'cancelled');
        handleCloseModal();
    }

    const handlePlanChangeAndClose = (subscriptionId: string, newPlanId: string) => {
        onPlanChange(subscriptionId, newPlanId);
        // Optimistically update the selected subscription to reflect the change immediately in the modal
        const updatedSub = subscriptions.find(s => s.id === subscriptionId);
        if (updatedSub) {
            setSelectedSubscription({ ...updatedSub, currentPlanId: newPlanId });
        }
    }


    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-grow">
                        <input
                            type="text"
                            placeholder="Search subscriptions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full max-w-lg px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-white"
                        />
                    </div>
                     <div className="flex-shrink-0 flex items-center space-x-2 bg-slate-900 border border-slate-700 rounded-lg p-1">
                        {statusFilters.map(filter => (
                            <button
                                key={filter.value}
                                onClick={() => setActiveStatus(filter.value)}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                                    activeStatus === filter.value
                                        ? 'bg-primary-600 text-white'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredSubscriptions.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSubscriptions.map((sub, index) => (
                            <div key={sub.id} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}>
                                <SubscriptionCard 
                                    subscription={sub} 
                                    onManageClick={handleManageClick}
                                    onStatusChange={onStatusChange}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 rounded-lg bg-slate-900 border border-slate-800">
                        <p className="text-slate-500 dark:text-slate-400">No subscriptions match your filters.</p>
                    </div>
                )}
            </div>
            
            <SubscriptionDetailModal 
                subscription={selectedSubscription}
                onClose={handleCloseModal}
                onCancelSubscription={handleCancelSubscription}
                onPlanChange={handlePlanChangeAndClose}
                onStatusChange={(subId, newStatus) => {
                    onStatusChange(subId, newStatus);
                    handleCloseModal();
                }}
            />
        </>
    );
};

export default Subscriptions;