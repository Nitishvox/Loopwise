

import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { XIcon, ExternalLinkIcon, CheckCircleIcon, ClockIcon, AlertCircleIcon } from './icons';

interface TransactionDetailModalProps {
    transaction: Transaction | null;
    onClose: () => void;
    onUpdate: (txId: string, updates: { notes?: string }) => void;
    onViewExplorer: (transaction: Transaction) => void;
}

const StatusDisplay: React.FC<{ status: Transaction['status'] }> = ({ status }) => {
    const styles = {
        completed: { icon: <CheckCircleIcon className="h-5 w-5 text-green-400" />, text: 'text-green-300' },
        pending: { icon: <ClockIcon className="h-5 w-5 text-yellow-400" />, text: 'text-yellow-300' },
        failed: { icon: <AlertCircleIcon className="h-5 w-5 text-red-400" />, text: 'text-red-300' },
    };
    const { icon, text } = styles[status] || styles.pending;

    return (
        <div className={`flex items-center gap-2 text-sm font-medium ${text}`}>
            {icon}
            <span className="capitalize">{status}</span>
        </div>
    );
};

const DetailRow: React.FC<{ label: string; value: React.ReactNode; isMono?: boolean }> = ({ label, value, isMono = false }) => (
    <div className="flex justify-between items-start py-3">
        <p className="text-sm text-slate-400">{label}</p>
        <div className={`text-sm font-medium text-slate-200 text-right ${isMono ? 'font-mono' : ''}`}>{value}</div>
    </div>
);

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ transaction, onClose, onUpdate, onViewExplorer }) => {
    const [notes, setNotes] = useState(transaction?.notes || '');

    useEffect(() => {
        setNotes(transaction?.notes || '');
    }, [transaction]);

    if (!transaction) return null;
    
    const handleSaveNotes = () => {
        onUpdate(transaction.id, { notes });
        onClose();
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
                className="relative bg-slate-900 border border-slate-800 w-full max-w-lg m-4 rounded-xl shadow-2xl animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-primary-400 uppercase tracking-wider capitalize">{transaction.type} Details</p>
                            <h2 id="modal-title" className="text-2xl font-bold text-white mt-1">{transaction.description}</h2>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="p-1 rounded-full text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                            aria-label="Close modal"
                        >
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="mt-6 border-t border-b border-slate-800 divide-y divide-slate-800">
                        <DetailRow label="Status" value={<StatusDisplay status={transaction.status} />} />
                        <DetailRow label="Amount" value={`${transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)} ${transaction.currency}`} />
                        <DetailRow label="Date" value={new Date(transaction.timestamp).toLocaleString()} />
                        <DetailRow 
                            label="Transaction ID" 
                            value={
                                <button onClick={() => onViewExplorer(transaction)} className="flex items-center gap-1.5 hover:text-primary-400 transition-colors">
                                    {`${transaction.txId.slice(0, 10)}...${transaction.txId.slice(-8)}`}
                                    <ExternalLinkIcon className="w-4 h-4" />
                                </button>
                            }
                            isMono 
                        />
                    </div>
                    
                    <div className="mt-6">
                        <label htmlFor="notes" className="block text-sm font-medium text-slate-400 mb-2">Notes</label>
                        <textarea
                            id="notes"
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add a personal note..."
                            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white text-sm"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSaveNotes}
                            className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                        >
                           Save & Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailModal;