import React, { useState, useRef } from 'react';
import { Transaction, User } from '../types';
import Card from './Card';
import { DownloadIcon, ExternalLinkIcon, ArrowUpTrayIcon } from './icons';
import AuditCharts from './AuditCharts';


interface AuditProps {
    user: User | null;
    transactions: Transaction[];
    onImportTransactions: (transactions: Omit<Transaction, 'id' | 'txId'>[]) => void;
    onViewTxExplorer: (transaction: Transaction) => void;
    showToast: (message: string) => void;
}

type AuditView = 'timeline' | 'analysis';

const TypeBadge: React.FC<{ type: Transaction['type'] }> = ({ type }) => {
    const styles: Record<Transaction['type'], string> = {
        payment: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        refund: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        transfer: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
        deposit: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    };
    const style = styles[type] || 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${style}`}>
            {type}
        </span>
    );
};

const Audit: React.FC<AuditProps> = ({ user, transactions, onImportTransactions, onViewTxExplorer, showToast }) => {
    const [activeView, setActiveView] = useState<AuditView>('timeline');
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const importInputRef = useRef<HTMLInputElement>(null);

    const formatTxId = (txId: string) => `${txId.slice(0, 6)}...${txId.slice(-4)}`;

    const handleImportClick = () => {
        importInputRef.current?.click();
    };

    const handleExportCSV = () => {
        if (transactions.length === 0) {
            showToast("No transactions to export.");
            return;
        }

        const headers = ['id', 'timestamp', 'type', 'description', 'amount', 'currency', 'status', 'category', 'txId', 'notes'];
        
        const escapeCsvField = (field: any): string => {
            if (field === null || field === undefined) {
                return '';
            }
            const stringField = String(field);
            if (/[",\n\r]/.test(stringField)) {
                return `"${stringField.replace(/"/g, '""')}"`;
            }
            return stringField;
        };

        const csvContent = [
            headers.join(','),
            ...sortedTransactions.map(tx => 
                headers.map(header => escapeCsvField(tx[header as keyof Transaction])).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.href) {
            URL.revokeObjectURL(link.href);
        }
        link.href = URL.createObjectURL(blob);
        link.download = 'loopwise-transactions.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("Exporting transactions...");
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            if (!text) {
                showToast("Cannot read the file.");
                return;
            }

            try {
                // Generate a hash of the new file content
                const buffer = await file.arrayBuffer();
                const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const currentFileHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

                const lastFileHash = localStorage.getItem('lastImportedFileHash');

                if (currentFileHash === lastFileHash) {
                    showToast("This seems to be the same file you imported last.");
                    return;
                }
                
                showToast("New file detected, importing transactions...");

                const lines = text.split('\n');
                const header = lines[0].trim().split(',');
                const requiredColumns = ['timestamp', 'description', 'amount', 'type', 'category'];
                if (!requiredColumns.every(col => header.includes(col))) {
                    showToast("CSV file is missing required headers.");
                    return;
                }
                
                const imported: Omit<Transaction, 'id' | 'txId'>[] = [];
                for (const line of lines.slice(1)) {
                    if (!line.trim()) continue;

                    const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
                    const row: any = {};
                    header.forEach((key, i) => {
                        row[key] = values[i]?.replace(/"/g, '') || '';
                    });

                    // Basic validation
                    const amount = parseFloat(row.amount);
                    if (isNaN(new Date(row.timestamp).getTime())) {
                        console.warn(`Skipping row due to invalid date: ${line}`);
                        continue;
                    }
                    if (isNaN(amount)) {
                        console.warn(`Skipping row due to invalid amount: ${line}`);
                        continue;
                    }

                    imported.push({
                        timestamp: new Date(row.timestamp).toISOString(),
                        description: row.description,
                        amount: amount,
                        type: row.type as Transaction['type'] || 'payment',
                        category: row.category,
                        status: (row.status || 'completed') as Transaction['status'],
                        currency: 'USDC',
                        notes: row.notes,
                    });
                }
                
                if (imported.length > 0) {
                    onImportTransactions(imported);
                    localStorage.setItem('lastImportedFileHash', currentFileHash);
                } else {
                    showToast("No valid transactions found in the file.");
                }

            } catch (error) {
                console.error("Failed to parse CSV", error);
                showToast("Failed to parse CSV file.");
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    };
    
    const handleReceiptClick = (tx: Transaction) => {
        if (!user) return;

        const displayAmount = `${tx.type === 'refund' || tx.type === 'deposit' ? '+' : '-'} ${tx.amount.toFixed(2)} ${tx.currency}`;

        const receiptHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Receipt for Transaction ${tx.id}</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <style> body { -webkit-print-color-adjust: exact; } @media print { .no-print { display: none; } } </style>
            </head>
            <body class="bg-slate-50">
                <div class="max-w-2xl mx-auto my-8 p-8 bg-white rounded-lg shadow-lg">
                    <header class="flex justify-between items-center pb-6 border-b border-slate-200">
                        <div>
                            <h1 class="text-3xl font-bold text-slate-900">Receipt</h1>
                            <p class="text-slate-500 text-sm mt-1">Transaction ID: <span class="font-mono">${tx.txId}</span></p>
                        </div>
                        <div class="flex items-center gap-2">
                            <svg class="h-8 w-8 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 2V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 20V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 12H2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            <h2 class="text-xl font-bold text-slate-800">Loopwise</h2>
                        </div>
                    </header>
                    <section class="grid grid-cols-2 gap-8 my-6">
                        <div>
                            <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Billed To</h3>
                            <p class="font-medium text-slate-800 mt-2">${user.displayName}</p>
                            <p class="text-slate-500">${user.email}</p>
                        </div>
                        <div class="text-right">
                            <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Payment Details</h3>
                            <p class="font-medium text-slate-800 mt-2">Date: ${new Date(tx.timestamp).toLocaleString()}</p>
                            <p class="text-slate-500">Status: <span class="capitalize font-medium ${
                                tx.status === 'completed' ? 'text-green-600' :
                                tx.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                            }">${tx.status}</span></p>
                        </div>
                    </section>
                    <section class="border-t border-slate-200">
                        <table class="w-full text-left">
                            <thead>
                                <tr>
                                    <th class="p-3 pt-6 text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                                    <th class="p-3 pt-6 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="border-b border-slate-200">
                                    <td class="p-3 pb-6 text-slate-800 align-top">
                                        <p class="font-medium">${tx.description}</p>
                                        <p class="text-sm text-slate-500 capitalize">${tx.type}</p>
                                    </td>
                                    <td class="p-3 pb-6 text-right text-slate-800 font-medium align-top">
                                        ${displayAmount}
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot class="font-bold">
                                <tr>
                                    <td class="p-3 text-right text-slate-900">Total</td>
                                    <td class="p-3 text-right text-slate-900 text-xl">${displayAmount}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </section>
                    ${tx.notes ? `<section class="mt-6 pt-6 border-t border-slate-200"><h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Notes</h3><p class="mt-2 text-sm text-slate-600">${tx.notes}</p></section>` : ''}
                    <footer class="mt-8 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
                        <p>Thank you for using Loopwise. If you have any questions, please contact support@loopwise.app.</p>
                    </footer>
                    <div class="mt-8 text-center no-print">
                        <button onclick="window.print()" class="px-6 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 transition-colors">Print Receipt</button>
                    </div>
                </div>
            </body>
            </html>
        `;

        const receiptWindow = window.open('', '_blank');
        if (receiptWindow) {
            receiptWindow.document.write(receiptHtml);
            receiptWindow.document.close();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Audit & Receipts</h2>
                    <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                        An immutable timeline and analysis of all your account activity.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                     <input type="file" ref={importInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
                    <button onClick={handleImportClick} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                        <ArrowUpTrayIcon className="w-5 h-5" />
                        <span>Import CSV</span>
                    </button>
                    <button onClick={handleExportCSV} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                        <DownloadIcon className="w-5 h-5" />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>
            
            <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-1 max-w-sm">
                <button
                    onClick={() => setActiveView('timeline')}
                    className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                        activeView === 'timeline'
                            ? 'bg-primary-600 text-white'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                >
                    Timeline
                </button>
                 <button
                    onClick={() => setActiveView('analysis')}
                    className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                        activeView === 'analysis'
                            ? 'bg-primary-600 text-white'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                >
                    Analysis
                </button>
            </div>
            
            {activeView === 'timeline' ? (
                <Card className="p-0 sm:p-0">
                     {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Timestamp</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Details</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tx ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                                {sortedTransactions.map((tx, index) => (
                                    <tr key={tx.id} className="animate-fade-in hover:bg-slate-50 dark:hover:bg-slate-800/50" style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                            {new Date(tx.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <TypeBadge type={tx.type} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                                            {tx.description}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${tx.type === 'refund' || tx.type === 'deposit' ? 'text-green-600 dark:text-green-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                           {tx.type === 'refund' || tx.type === 'deposit' ? '+' : '-'} ${tx.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-mono">
                                            <button onClick={() => onViewTxExplorer(tx)} className="flex items-center gap-1 hover:text-primary-500 transition-colors">
                                                {formatTxId(tx.txId)}
                                                <ExternalLinkIcon className="w-3 h-3"/>
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button onClick={() => handleReceiptClick(tx)} className="flex items-center gap-1 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
                                                <DownloadIcon className="w-4 h-4" />
                                                Receipt
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Mobile Card View */}
                    <div className="md:hidden">
                        <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                            {sortedTransactions.map((tx) => (
                                <li key={tx.id} className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">{tx.description}</p>
                                            <TypeBadge type={tx.type} />
                                        </div>
                                        <p className={`font-medium ${tx.type === 'refund' || tx.type === 'deposit' ? 'text-green-600 dark:text-green-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                            {tx.type === 'refund' || tx.type === 'deposit' ? '+' : '-'} ${tx.amount.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                        <p>{new Date(tx.timestamp).toLocaleString()}</p>
                                        <button onClick={() => onViewTxExplorer(tx)} className="flex items-center gap-1 hover:text-primary-500 transition-colors font-mono text-xs">
                                            {formatTxId(tx.txId)}
                                            <ExternalLinkIcon className="w-3 h-3"/>
                                        </button>
                                    </div>
                                    <div>
                                        <button onClick={() => handleReceiptClick(tx)} className="flex items-center gap-1 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors text-sm font-medium">
                                            <DownloadIcon className="w-4 h-4" />
                                            Receipt
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Card>
            ) : (
                <AuditCharts transactions={transactions} />
            )}
        </div>
    );
};

export default Audit;