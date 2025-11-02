import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    icon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, icon }) => {
    return (
        <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-6 transition-shadow duration-300 ease-in-out ${className}`}>
            {title && (
                <div className="flex items-center mb-4">
                    {icon && <div className="mr-3 text-slate-400 dark:text-slate-500">{icon}</div>}
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;