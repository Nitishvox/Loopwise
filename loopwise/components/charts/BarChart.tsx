import React from 'react';

interface BarChartData {
    label: string;
    value: number;
    color: string;
}

interface BarChartProps {
    data: BarChartData[];
    title: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
    if (!data || data.length === 0) {
        return <div className="text-center py-10 text-slate-500 dark:text-slate-400">No data available for this chart.</div>;
    }

    const maxValue = Math.max(...data.map(d => d.value));
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    return (
        <div className="p-4">
            <h4 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">{title}</h4>
            <div className="space-y-4">
                {sortedData.map((item, index) => (
                    <div key={item.label} className="grid grid-cols-4 gap-4 items-center animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                        <div className="col-span-1 text-sm text-slate-600 dark:text-slate-400 truncate">{item.label}</div>
                        <div className="col-span-3 flex items-center gap-2">
                             <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-6">
                                <div
                                    className="h-6 rounded-full flex items-center justify-end pr-2"
                                    style={{ 
                                        width: `${(item.value / maxValue) * 100}%`, 
                                        backgroundColor: item.color,
                                        minWidth: '3rem',
                                    }}
                                >
                                </div>
                            </div>
                             <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 w-20 text-right">${item.value.toFixed(2)}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BarChart;
