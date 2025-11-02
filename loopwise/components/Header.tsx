import React, { useState, useEffect, useRef } from 'react';
import { User, View } from '../types';
import { SunIcon, MoonIcon, MenuIcon, BellIcon, ChevronDownIcon, ChevronUpIcon, CogIcon, HelpCircleIcon, LogOutIcon } from './icons';

interface HeaderProps {
    user: User | null;
    toggleTheme: () => void;
    theme: string;
    toggleSidebar: () => void;
    setCurrentView: (view: View) => void;
    hasUnreadNotifications: boolean;
    onNotificationsClick: () => void;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, toggleTheme, theme, toggleSidebar, setCurrentView, hasUnreadNotifications, onNotificationsClick, onLogout }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleNavigation = (view: View) => {
        setCurrentView(view);
        setIsDropdownOpen(false);
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8">
            <button
                onClick={toggleSidebar}
                className="md:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                aria-label="Toggle sidebar"
            >
                <MenuIcon className="h-6 w-6" />
            </button>
            <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Welcome, {user?.displayName || 'User'}!</h1>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                </button>
                <button
                    onClick={onNotificationsClick}
                    className="p-2 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
                    aria-label="Notifications"
                >
                    <BellIcon className="h-5 w-5" />
                    {hasUnreadNotifications && <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-primary-500 ring-2 ring-white dark:ring-slate-950"></span>}
                </button>

                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.displayName} className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                {user?.displayName?.charAt(0)}
                            </div>
                        )}
                        <div className="hidden sm:flex items-center gap-1 cursor-pointer">
                            <span className="font-medium text-slate-700 dark:text-slate-300">{user?.displayName}</span>
                            {isDropdownOpen ? <ChevronUpIcon className="h-4 w-4 text-slate-500" /> : <ChevronDownIcon className="h-4 w-4 text-slate-500" />}
                        </div>
                    </button>
                    {isDropdownOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 dark:ring-slate-700 focus:outline-none animate-scale-in">
                            <div className="py-1">
                                <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{user?.displayName}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                                </div>
                                <a onClick={() => handleNavigation('settings')} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                    <CogIcon className="h-5 w-5" />
                                    <span>Settings</span>
                                </a>
                                <a onClick={() => handleNavigation('help')} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                    <HelpCircleIcon className="h-5 w-5" />
                                    <span>Help</span>
                                </a>
                                <div className="border-t border-slate-200 dark:border-slate-700 my-1" />
                                <a onClick={onLogout} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                    <LogOutIcon className="h-5 w-5" />
                                    <span>Log out</span>
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
