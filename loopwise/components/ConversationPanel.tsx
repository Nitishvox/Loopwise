import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { PaperAirplaneIcon, XIcon } from './icons';

interface ConversationPanelProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    messages: Message[];
    onSendMessage: (text: string) => void;
}

const renderFormattedText = (text: string) => {
    // A simple parser for **bold** and * lists
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];

    const parseInline = (line: string) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-2">
                    {listItems.map((item, index) => <li key={index}>{parseInline(item)}</li>)}
                </ul>
            );
            listItems = [];
        }
    };

    lines.forEach((line) => {
        if (line.startsWith('* ') || line.startsWith('- ')) {
            listItems.push(line.substring(2));
        } else {
            flushList();
            if (line.trim()) {
                elements.push(<div key={`p-${elements.length}`}>{parseInline(line)}</div>);
            }
        }
    });

    flushList();

    return elements;
};


const ConversationPanel: React.FC<ConversationPanelProps> = ({ isOpen, setIsOpen, messages, onSendMessage }) => {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = () => {
        if (inputValue.trim()) {
            onSendMessage(inputValue.trim());
            setInputValue('');
        }
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div
            className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-slate-950 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col border-l border-slate-200 dark:border-slate-800 ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">AI Assistant</h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    aria-label="Close chat panel"
                >
                    <XIcon className="h-6 w-6" />
                </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-2">
                {messages.map(message => (
                    <div key={message.id} className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in-up`} style={{animationDuration: '0.4s'}}>
                        <div
                            className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-2xl ${
                                message.sender === 'user'
                                    ? 'bg-primary-600 text-white rounded-br-lg'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-lg'
                            }`}
                        >
                            <div className="text-sm">{renderFormattedText(message.text)}</div>
                        </div>
                         {message.sender === 'ai' && message.suggestions && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {message.suggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => onSendMessage(suggestion)}
                                        className="px-3 py-1.5 text-xs bg-slate-200 dark:bg-slate-800 text-primary-600 dark:text-primary-400 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <div className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything..."
                        className="w-full pl-4 pr-12 py-2 bg-slate-100 dark:bg-slate-800 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                    />
                    <button
                        onClick={handleSend}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-300 transition-colors"
                        disabled={!inputValue.trim()}
                        aria-label="Send message"
                    >
                        <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConversationPanel;