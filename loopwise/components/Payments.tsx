import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';
import Card from './Card';
import { CheckCircleIcon, ClockIcon, AlertCircleIcon, PlusIcon, PaperAirplaneIcon } from './icons';

interface PaymentsProps {
    transactions: Transaction[];
    onViewTransaction: (transaction: Transaction) => void;
    onSchedulePayment: () => void;
    onSendFunds: () => void;
}

const typeFilters: { label: string; value: 'all' | Transaction['type'] }[] = [
    { label: 'All', value: 'all' },
    { label: 'Payment', value: 'payment' },
    { label: 'Deposit', value: 'deposit' },
    { label: 'Refund', value: 'refund' },
    { label: 'Transfer', value: 'transfer' },
];

const statusFilters: { label: string; value: 'all' | Transaction['status'] }[] = [
    { label: 'All', value: 'all' },
    { label: 'Completed', value: 'completed' },
    { label: 'Pending', value: 'pending' },
    { label: 'Failed', value: 'failed' },
];

const TransactionStatus: React.FC<{ status: Transaction['status'] }> = ({ status }) => {
    const styles = {
        completed: { icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />, text: 'text-green-700 dark:text-green-300', bg: 'bg-green-50 dark:bg-green-500/10' },
        pending: { icon: <ClockIcon className="h-5 w-5 text-yellow-500" />, text: 'text-yellow-700 dark:text-yellow-300', bg: 'bg-yellow-50 dark:bg-yellow-500/10' },
        failed: { icon: <AlertCircleIcon className="h-5 w-5 text-red-500" />, text: 'text-red-700 dark:text-red-300', bg: 'bg-red-50 dark:bg-red-500/10' },
    };
    const { icon, text, bg } = styles[status] || styles.pending;

    return (
        <div className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
            {icon}
            <span className="capitalize">{status}</span>
        </div>
    );
};

const Payments: React.FC<PaymentsProps> = ({ transactions, onViewTransaction, onSchedulePayment, onSendFunds }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeType, setActiveType] = useState<'all' | Transaction['type']>('all');
    const [activeStatus, setActiveStatus] = useState<'all' | Transaction['status']>('all');

    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = activeType === 'all' || tx.type === activeType;
            const matchesStatus = activeStatus === 'all' || tx.status === activeStatus;
            return matchesSearch && matchesType && matchesStatus;
        });
    }, [transactions, searchTerm, activeType, activeStatus]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Payments & Billing</h2>
                    <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                        View your payment history, schedule future payments, and send funds.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onSendFunds} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-700 rounded-md hover:bg-slate-600 transition-colors shadow-sm">
                        <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
                        <span>Send Funds</span>
                    </button>
                    <button onClick={onSchedulePayment} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors shadow-sm">
                        <PlusIcon className="w-5 h-5" />
                        <span>Schedule Payment</span>
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Search by description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-1">
                        {typeFilters.map(filter => (
                            <button
                                key={filter.value}
                                onClick={() => setActiveType(filter.value)}
                                className={`flex-1 px-3 py-1 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                                    activeType === filter.value
                                        ? 'bg-primary-600 text-white'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-1">
                        {statusFilters.map(filter => (
                            <button
                                key={filter.value}
                                onClick={() => setActiveStatus(filter.value)}
                                className={`flex-1 px-3 py-1 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                                    activeStatus === filter.value
                                        ? 'bg-primary-600 text-white'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            
            <Card title="Payment History" className="p-0 sm:p-0">
                {filteredTransactions.length > 0 ? (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                                <thead className="bg-slate-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                                    {filteredTransactions.map((transaction, index) => (
                                        <tr key={transaction.id} className="animate-fade-in hover:bg-slate-50 dark:hover:bg-slate-800/50" style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{transaction.description}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${transaction.type === 'deposit' ? 'text-green-500' : 'text-slate-500 dark:text-slate-400'}`}>{transaction.type === 'deposit' ? '+' : ''}${transaction.amount.toFixed(2)} {transaction.currency}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(transaction.timestamp).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm"><TransactionStatus status={transaction.status} /></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => onViewTransaction(transaction)} className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Mobile Card View */}
                        <div className="md:hidden">
                            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                                {filteredTransactions.map((transaction, index) => (
                                    <li key={transaction.id} className="p-4 animate-fade-in" style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">{transaction.description}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(transaction.timestamp).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-medium ${transaction.type === 'deposit' ? 'text-green-500' : 'text-slate-500 dark:text-slate-400'}`}>{transaction.type === 'deposit' ? '+' : ''}${transaction.amount.toFixed(2)}</p>
                                                <button onClick={() => onViewTransaction(transaction)} className="text-primary-600 dark:text-primary-400 text-sm font-medium mt-1">View Details</button>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <TransactionStatus status={transaction.status} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12 px-6">
                        <p className="text-slate-500 dark:text-slate-400">No transactions match your filters.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Payments;