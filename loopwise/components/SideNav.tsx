

import React from 'react';
import { HomeIcon, LayersIcon, CreditCardIcon, FileTextIcon, UsersIcon, HelpCircleIcon, XIcon, GiftIcon, CogIcon } from './icons';
import { View } from '../types';

interface SideNavProps {
    currentView: View;
    setCurrentView: (view: View) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <li
        onClick={onClick}
        className={`flex items-center justify-between p-3 my-1 rounded-lg cursor-pointer transition-colors ${
            isActive
                ? 'bg-primary-600 text-white'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
    >
        <div className="flex items-center">
            <div className={`w-6 h-6 mr-3 ${isActive ? 'text-white' : 'text-slate-400'}`}>{icon}</div>
            <span className="font-medium">{label}</span>
        </div>
    </li>
);

const SideNav: React.FC<SideNavProps> = ({ currentView, setCurrentView, isSidebarOpen, setIsSidebarOpen }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
        { id: 'subscriptions', label: 'Subscriptions', icon: <LayersIcon /> },
        { id: 'payments', label: 'Payments', icon: <CreditCardIcon /> },
        { id: 'audit', label: 'Audit & Receipts', icon: <FileTextIcon /> },
        { id: 'team', label: 'Team', icon: <UsersIcon /> },
    ];
    
    const secondaryNavItems = [
        { id: 'referrals', label: 'Referrals', icon: <GiftIcon /> },
        { id: 'settings', label: 'Settings', icon: <CogIcon /> },
        { id: 'help', label: 'Help & FAQ', icon: <HelpCircleIcon /> },
    ];

    const handleNavigation = (view: View) => {
        setCurrentView(view);
        setIsSidebarOpen(false); // Close sidebar on mobile after navigation
    };

    const navContent = (
         <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 h-16">
                <div className="flex items-center gap-2">
                    <svg className="h-8 w-8 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Loopwise</h1>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-500 hover:text-slate-400">
                    <XIcon className="h-6 w-6"/>
                </button>
            </div>
            <nav className="flex-1 p-2 mt-4 flex flex-col justify-between">
                <ul>
                    {navItems.map((item) => (
                        <NavItem
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            isActive={currentView === item.id}
                            onClick={() => handleNavigation(item.id as View)}
                        />
                    ))}
                </ul>
                <div>
                    <ul>
                        {secondaryNavItems.map((item) => (
                            <NavItem
                                key={item.id}
                                icon={item.icon}
                                label={item.label}
                                isActive={currentView === item.id}
                                onClick={() => handleNavigation(item.id as View)}
                            />
                        ))}
                    </ul>
                </div>
            </nav>
        </div>
    );

    return (
        <>
            {/* Mobile Sidebar */}
            <div
                className={`fixed inset-0 z-50 bg-black/30 transition-opacity md:hidden ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform md:hidden ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {navContent}
            </aside>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex md:fixed md:inset-y-0 md:w-64 md:flex-col md:border-r md:border-slate-200 md:dark:border-slate-800 md:bg-white md:dark:bg-slate-900">
                {navContent}
            </aside>
        </>
    );
};

export default SideNav;