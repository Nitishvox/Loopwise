import React from 'react';
import { Notification, NotificationType } from '../types';
import { XIcon, LayersIcon, CreditCardIcon, PaperAirplaneIcon, ShieldCheckIcon, SparklesIcon, UsersIcon } from './icons';

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
}

const typeIcons: Record<NotificationType, React.ReactNode> = {
    subscription: <LayersIcon className="w-5 h-5 text-purple-400" />,
    payment: <CreditCardIcon className="w-5 h-5 text-blue-400" />,
    transfer: <PaperAirplaneIcon className="w-5 h-5 text-green-400 -rotate-45" />,
    security: <ShieldCheckIcon className="w-5 h-5 text-red-400" />,
    suggestion: <SparklesIcon className="w-5 h-5 text-yellow-400" />,
    team: <UsersIcon className="w-5 h-5 text-indigo-400" />,
};

function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose, notifications }) => {
    return (
         <div className={`fixed inset-0 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
            <div
                className={`fixed top-16 right-4 h-auto max-h-[calc(100vh-5rem)] w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl rounded-lg transform transition-all duration-300 ease-in-out z-50 flex flex-col border border-slate-200 dark:border-slate-800 origin-top-right ${
                    isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Notifications</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        aria-label="Close notifications panel"
                    >
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="text-center p-16 text-slate-500 dark:text-slate-400">
                            <p>No new notifications</p>
                            <p className="text-sm">You're all caught up!</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                            {notifications.map((notif, index) => (
                                <li key={notif.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50" style={{ animation: `fade-in-up 0.3s ease-out ${index * 50}ms forwards`, opacity: 0 }}>
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            {typeIcons[notif.type]}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{notif.message}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{timeAgo(notif.timestamp)}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
         </div>
    );
};

export default NotificationPanel;
