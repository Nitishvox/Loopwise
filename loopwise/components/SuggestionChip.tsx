import React from 'react';
import { AiSuggestion } from '../types';

interface SuggestionChipProps {
    suggestion: AiSuggestion;
    onApply: (suggestion: AiSuggestion) => void;
    onDismiss: (suggestionId: string) => void;
}

const SuggestionChip: React.FC<SuggestionChipProps> = ({ suggestion, onApply, onDismiss }) => {
    return (
        <div className="bg-slate-800/50 border border-slate-700/80 rounded-xl p-4 transition-all hover:border-primary-500/40 relative overflow-hidden">
             <div className="absolute top-3 right-3 text-xs font-bold text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-full">
                {Math.round(suggestion.confidence * 100)}%
            </div>
            <h4 className="font-semibold text-slate-100 pr-12">{suggestion.title}</h4>
            <p className="text-sm text-slate-400 mt-2 mb-4">{suggestion.description}</p>
            <div className="flex gap-2">
                <button 
                    onClick={() => onApply(suggestion)}
                    className="flex-1 text-sm font-semibold bg-primary-600 text-white px-4 py-1.5 rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-900"
                >
                    Apply
                </button>
                <button 
                    onClick={() => onDismiss(suggestion.id)}
                    className="flex-1 text-sm font-semibold bg-slate-700/50 text-slate-300 px-4 py-1.5 rounded-lg hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-900"
                >
                    Dismiss
                </button>
            </div>
        </div>
    );
};

export default SuggestionChip;