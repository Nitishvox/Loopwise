import React from 'react';

interface LineChartData {
    x: string;
    y: number;
}

interface LineChartProps {
    data: LineChartData[];
    title: string;
    color?: string;
    width?: number;
    height?: number;
}

const LineChart: React.FC<LineChartProps> = ({ data, title, color = '#0B5FFF', width = 500, height = 200 }) => {
    if (!data || data.length < 2) {
        return <div className="text-center py-10 text-slate-500 dark:text-slate-400">Not enough data to draw a chart.</div>;
    }

    const padding = 40;

    const maxY = Math.max(...data.map(d => d.y)) * 1.1; // 10% buffer
    const minY = 0;

    const getX = (index: number) => padding + (index / (data.length - 1)) * (width - padding * 2);
    const getY = (value: number) => height - padding - ((value - minY) / (maxY - minY)) * (height - padding * 2);

    const pathD = data.map((point, index) => {
        const x = getX(index);
        const y = getY(point.y);
        return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');

    const yAxisLabels = [minY, maxY / 2, maxY];

    return (
        <div className="p-4">
            {title && <h4 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-2">{title}</h4>}
            <div className="w-full overflow-x-auto">
                <svg viewBox={`0 0 ${width} ${height}`} className={`min-w-[${width}px]`}>
                    {/* Y-axis grid lines */}
                    {yAxisLabels.map(label => (
                        <g key={label}>
                             <line x1={padding} y1={getY(label)} x2={width - padding} y2={getY(label)} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />
                            <text x={padding - 10} y={getY(label) + 4} textAnchor="end" className="text-xs fill-current text-slate-500 dark:text-slate-400">${label.toFixed(0)}</text>
                        </g>
                    ))}
                    
                    {/* X-axis labels */}
                    {data.map((point, index) => (
                         <text key={index} x={getX(index)} y={height - padding + 15} textAnchor="middle" className="text-xs fill-current text-slate-500 dark:text-slate-400">{point.x}</text>
                    ))}

                    {/* Line Path */}
                    <path d={pathD} stroke={color} strokeWidth="2" fill="none" />
                    
                    {/* Data Points */}
                    {data.map((point, index) => (
                        <circle key={index} cx={getX(index)} cy={getY(point.y)} r="3" fill={color} />
                    ))}
                </svg>
            </div>
        </div>
    );
};

export default LineChart;