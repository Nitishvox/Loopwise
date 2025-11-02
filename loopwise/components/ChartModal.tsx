import React from 'react';
import { XIcon } from './icons';

interface ChartModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
}

const ChartModal: React.FC<ChartModalProps> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chart-modal-title"
        >
            <div 
                className="relative bg-slate-900 border border-slate-800 w-full max-w-4xl m-4 rounded-xl shadow-2xl animate-scale-in flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 sm:p-6 border-b border-slate-800 flex justify-between items-center">
                    <h2 id="chart-modal-title" className="text-xl font-bold text-white">{title}</h2>
                    <button 
                        onClick={onClose} 
                        className="p-1 rounded-full text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                        aria-label="Close modal"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-2 sm:p-4 bg-slate-950/50">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ChartModal;