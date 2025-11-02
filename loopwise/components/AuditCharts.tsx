import React, { useMemo, useState } from 'react';
import { Transaction } from '../types';
import Card from './Card';
import LineChart from './charts/LineChart';
import BarChart from './charts/BarChart';
import ChartModal from './ChartModal';

interface AuditChartsProps {
    transactions: Transaction[];
}

const categoryColors: { [key: string]: string } = {
    "Entertainment": "#a855f7",
    "Productivity": "#3b82f6",
    "Health": "#ef4444",
    "Utilities": "#10b981",
    "Lifestyle": "#f97316",
    "Team": "#6366f1",
    "Transfers": "#8b5cf6",
    "Income": "#22c55e",
    "General": "#64748b",
};


const AuditCharts: React.FC<AuditChartsProps> = ({ transactions }) => {
    const [enlargedChart, setEnlargedChart] = useState<'line' | 'bar' | null>(null);

    const analysis = useMemo(() => {
        const monthlySpending: { [key: string]: number } = {};
        const categorySpending: { [key: string]: number } = {};
        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach(tx => {
            if (tx.status !== 'completed') return;

            const date = new Date(tx.timestamp);
            const monthYear = `${date.toLocaleString('default', { month: 'short' })} '${date.getFullYear().toString().slice(2)}`;
            
            if (tx.type === 'payment' || tx.type === 'transfer') {
                if (!monthlySpending[monthYear]) monthlySpending[monthYear] = 0;
                monthlySpending[monthYear] += tx.amount;

                if (!categorySpending[tx.category]) categorySpending[tx.category] = 0;
                categorySpending[tx.category] += tx.amount;

                totalExpense += tx.amount;
            } else if (tx.type === 'deposit' || tx.type === 'refund') {
                totalIncome += tx.amount;
            }
        });

        const spendingTrendData = Object.entries(monthlySpending)
            .map(([month, amount]) => ({ x: month, y: amount }))
            .sort((a,b) => new Date(`01 ${a.x.replace("'", "")}`).getTime() - new Date(`01 ${b.x.replace("'", "")}`).getTime())
            .slice(-6); 

        const categoryBreakdownData = Object.entries(categorySpending)
            .map(([label, value]) => ({ label, value, color: categoryColors[label] || '#64748b' }));

        return { spendingTrendData, categoryBreakdownData, totalIncome, totalExpense };

    }, [transactions]);

    const handleCloseModal = () => {
        setEnlargedChart(null);
    };

    return (
        <>
            <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <Card>
                        <div className="p-4">
                            <h4 className="text-md font-semibold text-slate-700 dark:text-slate-300">Total Income</h4>
                            <p className="text-3xl font-bold text-green-500 mt-1">${analysis.totalIncome.toFixed(2)}</p>
                        </div>
                     </Card>
                     <Card>
                        <div className="p-4">
                            <h4 className="text-md font-semibold text-slate-700 dark:text-slate-300">Total Expenses</h4>
                            <p className="text-3xl font-bold text-red-500 mt-1">${analysis.totalExpense.toFixed(2)}</p>
                        </div>
                    </Card>
                </div>
                <Card>
                    <div className="cursor-pointer transition-all duration-300 hover:scale-[1.01]" onClick={() => setEnlargedChart('line')}>
                        <LineChart data={analysis.spendingTrendData} title="Spending Trend (Last 6 Months)" />
                    </div>
                </Card>
                <Card>
                     <div className="cursor-pointer transition-all duration-300 hover:scale-[1.01]" onClick={() => setEnlargedChart('bar')}>
                        <BarChart data={analysis.categoryBreakdownData} title="Spending by Category" />
                    </div>
                </Card>
            </div>

            <ChartModal
                isOpen={!!enlargedChart}
                onClose={handleCloseModal}
                title={enlargedChart === 'line' ? "Spending Trend" : "Spending by Category"}
            >
                {enlargedChart === 'line' && (
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-4">
                        <LineChart data={analysis.spendingTrendData} title="" width={800} height={400} />
                    </div>
                )}
                {enlargedChart === 'bar' && (
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-4">
                        <BarChart data={analysis.categoryBreakdownData} title="" />
                    </div>
                )}
            </ChartModal>
        </>
    );
};

export default AuditCharts;