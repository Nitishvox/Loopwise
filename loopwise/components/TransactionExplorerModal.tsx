import React, { useState } from 'react';
import { Transaction, User } from '../types';
import { XIcon, DocumentDuplicateIcon, CheckIcon, UserCircleIcon, ArrowRightIcon } from './icons';

const DetailItem: React.FC<{ label: string; children: React.ReactNode; mono?: boolean }> = ({ label, children, mono }) => (
    <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</h3>
        <div className={`mt-1 text-slate-200 ${mono ? 'font-mono text-sm' : ''}`}>{children}</div>
    </div>
);

const TransactionExplorerModal: React.FC<{ transaction: Transaction | null; user: User | null; onClose: () => void; }> = ({ transaction, user, onClose }) => {
    const [copied, setCopied] = useState(false);

    if (!transaction || !user) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(transaction.txId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getRecipientDetails = () => {
        switch (transaction.type) {
            case 'transfer':
                // Assuming description is 'Transfer to {recipient}' or 'To {recipient}'
                const match = transaction.description.match(/(?:to|To)\s(.+)/);
                return { name: match ? match[1] : transaction.description, address: 'Unknown Address' };
            case 'payment':
                return { name: transaction.description, address: 'Service Provider' };
            case 'deposit':
                return { name: user.displayName, address: user.address };
            case 'refund':
                return { name: user.displayName, address: user.address };
            default:
                return { name: 'Unknown', address: 'Unknown' };
        }
    };
    
    const getSenderDetails = () => {
         switch (transaction.type) {
            case 'refund':
                return { name: transaction.description, address: 'Service Provider' };
            case 'deposit':
                return { name: 'External Source', address: 'Unknown Address' };
            default:
                return { name: user.displayName, address: user.address };
        }
    };

    const recipient = getRecipientDetails();
    const sender = getSenderDetails();
    const isExpense = transaction.type === 'payment' || transaction.type === 'transfer';

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className="relative bg-slate-900 border border-slate-800 w-full max-w-2xl m-4 rounded-xl shadow-2xl animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Transaction Details</h2>
                    <button 
                        onClick={onClose} 
                        className="p-1 rounded-full text-slate-500 hover:text-slate-200 hover:bg-slate-800"
                        aria-label="Close modal"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    <DetailItem label="Transaction Hash" mono>
                        <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-md">
                           <span className="truncate">{transaction.txId}</span>
                           <button onClick={handleCopy} className="p-1 text-slate-400 hover:text-white" aria-label="Copy transaction hash">
                               {copied ? <CheckIcon className="w-4 h-4 text-green-400"/> : <DocumentDuplicateIcon className="w-4 h-4"/>}
                           </button>
                        </div>
                    </DetailItem>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <DetailItem label="Status">
                            <span className={`capitalize px-2 py-1 text-xs rounded-full ${
                                transaction.status === 'completed' ? 'bg-green-500/10 text-green-300' :
                                transaction.status === 'pending' ? 'bg-yellow-500/10 text-yellow-300' :
                                'bg-red-500/10 text-red-300'
                            }`}>
                                {transaction.status}
                            </span>
                        </DetailItem>
                        <DetailItem label="Timestamp">{new Date(transaction.timestamp).toLocaleString()}</DetailItem>
                        <DetailItem label="Amount">
                            <span className={isExpense ? 'text-red-400' : 'text-green-400'}>
                                {isExpense ? '-' : '+'} ${transaction.amount.toFixed(2)} {transaction.currency}
                            </span>
                        </DetailItem>
                    </div>

                    <div className="flex items-center justify-center gap-4 md:gap-8 py-4">
                        <div className="text-center w-1/3">
                             <UserCircleIcon className="w-10 h-10 mx-auto text-slate-500" />
                             <p className="mt-2 font-semibold text-slate-200 truncate">{sender.name}</p>
                             <p className="text-xs text-slate-400 font-mono truncate">{sender.address}</p>
                        </div>
                        <div className="flex-shrink-0">
                           <ArrowRightIcon className="w-8 h-8 text-slate-600" />
                        </div>
                        <div className="text-center w-1/3">
                             <UserCircleIcon className="w-10 h-10 mx-auto text-slate-500" />
                             <p className="mt-2 font-semibold text-slate-200 truncate">{recipient.name}</p>
                             <p className="text-xs text-slate-400 font-mono truncate">{recipient.address}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionExplorerModal;
