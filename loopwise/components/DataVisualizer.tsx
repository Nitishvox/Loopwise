
import React from 'react';

interface ChartData {
    name: string;
    value: number;
    color: string;
}

interface DataVisualizerProps {
    data: ChartData[];
}

const DataVisualizer: React.FC<DataVisualizerProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="text-center py-10 text-slate-500 dark:text-slate-400">No spending data available.</div>;
    }

    const sortedData = [...data].sort((a, b) => b.value - a.value);
    const maxValue = Math.max(...sortedData.map(item => item.value), 1); // Avoid division by zero

    return (
        <div className="space-y-4 pt-2">
            {sortedData.map((item, index) => (
                <div key={item.name} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms`}}>
                    <p className="text-sm text-slate-300 mb-2">{item.name}</p>
                    <div className="relative w-full bg-slate-700 rounded-full h-5">
                        <div
                            className="h-5 rounded-full flex items-center justify-end pr-2.5"
                            style={{ 
                                width: `${(item.value / maxValue) * 100}%`, 
                                backgroundColor: item.color,
                                minWidth: '5rem' // Ensure space for the label even on small values
                            }}
                        >
                           <span className="text-xs font-bold text-white">${item.value.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DataVisualizer;