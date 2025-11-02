
import React from 'react';
import { User, Subscription, AiSuggestion, Transaction } from '../types';
import Card from './Card';
import SuggestionChip from './SuggestionChip';
import DataVisualizer from './DataVisualizer';
import { CreditCardIcon, ClockIcon, CheckCircleIcon, AlertCircleIcon, LayersIcon, ArrowPathIcon, PlusIcon } from './icons';

interface DashboardProps {
    user: User | null;
    subscriptions: Subscription[];
    suggestions: AiSuggestion[];
    transactions: Transaction[];
    onApplySuggestion: (suggestion: AiSuggestion) => void;
    onDismissSuggestion: (suggestionId: string) => void;
    onRefreshSuggestions: () => void;
    isGeneratingSuggestions: boolean;
    onAddFunds: () => void;
}

const StatCard: React.FC<{ title: string; value: string; children?: React.ReactNode; button?: React.ReactNode }> = ({ title, value, children, button }) => (
    <Card>
        <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h4>
            {button}
        </div>
        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{value}</p>
        {children && <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{children}</div>}
    </Card>
);

const Dashboard: React.FC<DashboardProps> = ({ user, subscriptions, suggestions, transactions, onApplySuggestion, onDismissSuggestion, onRefreshSuggestions, isGeneratingSuggestions, onAddFunds }) => {

    const getPlanCost = (sub: Subscription) => sub.availablePlans.find(p => p.id === sub.currentPlanId)?.monthlyCost || 0;

    const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
    const totalMonthlyCost = activeSubscriptions.reduce((acc, sub) => acc + getPlanCost(sub), 0);
    const upcomingPayment = subscriptions
        .filter(s => s.status === 'active' && s.nextPayment !== 'N/A')
        .sort((a, b) => new Date(a.nextPayment).getTime() - new Date(b.nextPayment).getTime())[0];

    const categorySpending = activeSubscriptions.reduce((acc, sub) => {
        if (!acc[sub.category]) {
            acc[sub.category] = 0;
        }
        acc[sub.category] += getPlanCost(sub);
        return acc;
    }, {} as { [key: string]: number });

    const categoryColors: { [key: string]: string } = {
        "Entertainment": "#a855f7", // purple-500
        "Productivity": "#3b82f6", // blue-500
        "Health": "#ef4444",       // red-500
        "Utilities": "#10b981",    // emerald-500
        "Lifestyle": "#f97316",    // orange-500
    };

    const chartData = Object.entries(categorySpending).map(([name, value]) => ({
        name,
        value,
        color: categoryColors[name] || '#64748b' // slate-500
    }));

    const TransactionStatusIcon: React.FC<{ type: Transaction['type'], status: Transaction['status'] }> = ({ type, status }) => {
        if (status === 'failed') return <AlertCircleIcon className="h-5 w-5 text-red-400" />;
        if (status === 'pending') return <ClockIcon className="h-5 w-5 text-yellow-400" />;
        if (type === 'deposit') return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
    }

    const recentTransactions = transactions.slice(0, 3);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <div className="animate-fade-in-up" style={{ animationDelay: `0ms` }}>
                    <StatCard 
                        title="USDC Balance" 
                        value={`$${user?.balances.USDC.toFixed(2)}`}
                        button={<button onClick={onAddFunds} className="text-xs flex items-center gap-1 font-semibold text-primary-600 dark:text-primary-400 hover:underline"><PlusIcon className="w-3 h-3"/> Add Funds</button>} 
                    />
                 </div>
                 <div className="animate-fade-in-up" style={{ animationDelay: `100ms` }}><StatCard title="Active Subscriptions" value={`${activeSubscriptions.length}`} /></div>
                 <div className="animate-fade-in-up" style={{ animationDelay: `200ms` }}><StatCard title="Monthly Cost" value={`$${totalMonthlyCost.toFixed(2)}`} /></div>
                 <div className="animate-fade-in-up" style={{ animationDelay: `300ms` }}>
                    <StatCard title="Next Payment" value={upcomingPayment ? `$${getPlanCost(upcomingPayment).toFixed(2)}` : 'N/A'}>
                        {upcomingPayment ? <p>{upcomingPayment.name} on {new Date(upcomingPayment.nextPayment).toLocaleDateString()}</p> : <p>No upcoming payments</p>}
                    </StatCard>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    <Card title="Monthly Spending by Category" icon={<LayersIcon className="w-5 h-5" />}>
                        <DataVisualizer data={chartData} />
                    </Card>
                 </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                           <LayersIcon className="w-5 h-5 text-slate-400" />
                           AI Suggestions
                        </h3>
                        <button 
                            onClick={onRefreshSuggestions} 
                            disabled={isGeneratingSuggestions} 
                            className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-wait transition-colors"
                            aria-label="Refresh AI Suggestions"
                        >
                            <ArrowPathIcon className={`w-5 h-5 ${isGeneratingSuggestions ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {isGeneratingSuggestions ? (
                             <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                                <p>Analyzing subscriptions...</p>
                            </div>
                        ) : suggestions.length > 0 ? (
                            suggestions.map((suggestion, index) => (
                               <div key={suggestion.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                 <SuggestionChip 
                                     suggestion={suggestion} 
                                     onApply={onApplySuggestion}
                                     onDismiss={onDismissSuggestion}
                                 />
                               </div>
                            ))
                        ) : (
                            <Card className="text-center py-10">
                                <p className="text-slate-500 dark:text-slate-400">No suggestions right now. Great job!</p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                <Card title="Recent Activity" icon={<CreditCardIcon className="w-5 h-5" />}>
                    <ul role="list" className="space-y-4 mt-2">
                        {recentTransactions.map((transaction) => (
                            <li key={transaction.id}>
                                <div className="relative flex items-center space-x-4">
                                     <div className="flex-shrink-0">
                                        <span className={`h-10 w-10 rounded-full flex items-center justify-center
                                            ${transaction.status === 'completed' ? 'bg-green-500/10' : ''}
                                            ${transaction.status === 'pending' ? 'bg-yellow-500/10' : ''}
                                            ${transaction.status === 'failed' ? 'bg-red-500/10' : ''}
                                        `}>
                                            <TransactionStatusIcon type={transaction.type} status={transaction.status} />
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1 flex justify-between items-center space-x-4">
                                        <div>
                                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                {transaction.description}
                                            </p>
                                             <p className="text-sm text-slate-500 dark:text-slate-400">
                                                <span className={`font-medium ${transaction.type === 'deposit' ? 'text-green-500' : ''}`}>
                                                    {transaction.type === 'deposit' ? '+' : ''}(${transaction.amount.toFixed(2)})
                                                </span>
                                            </p>
                                        </div>
                                        <div className="text-right text-sm whitespace-nowrap text-slate-500 dark:text-slate-400">
                                            <time dateTime={transaction.timestamp}>{new Date(transaction.timestamp).toLocaleDateString()}</time>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;