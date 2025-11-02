

import React, { useState, useEffect, useCallback } from 'react';
import { User, Subscription, AiSuggestion, Transaction, Message, TeamMember, Session, SubscriptionStatus, Plan, Referral, Notification, NotificationType, View, NotificationSettings, Preferences } from './types';
import { mockApi } from './services/mockApi';
import { circleApi } from './services/circleApi';
import { CheckIcon, ChatBubbleLeftRightIcon } from './components/icons';
import SideNav from './components/SideNav';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Subscriptions from './components/Subscriptions';
import ConversationPanel from './components/ConversationPanel';
import Payments from './components/Payments';
import Audit from './components/Audit';
import Team from './components/Team';
import Help from './components/Help';
import Settings from './components/Settings';
import AddFundsModal from './components/AddFundsModal';
import TransactionDetailModal from './components/TransactionDetailModal';
import SchedulePaymentModal from './components/SchedulePaymentModal';
import Referrals from './components/Referrals';
import InviteMemberModal from './components/InviteMemberModal';
import SendFundsModal from './components/SendFundsModal';
import TransactionExplorerModal from './components/TransactionExplorerModal';
import NotificationPanel from './components/NotificationPanel';
import ImageCropModal from './components/ImageCropModal';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import ProfileSetupPage from './components/ProfileSetupPage';


const Toast: React.FC<{ message: string; show: boolean; onDismiss: () => void }> = ({ message, show, onDismiss }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onDismiss();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onDismiss]);

    return (
        <div
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
                show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
            <div className="flex items-center gap-2 bg-slate-800 text-slate-100 px-4 py-2 rounded-full shadow-lg border border-slate-700">
                <CheckIcon className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">{message}</span>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [page, setPage] = useState<'landing' | 'login' | 'profile-setup' | 'app'>('landing');

    const [preferences, setPreferences] = useState<Preferences>(() => {
        const saved = localStorage.getItem('preferences');
        const defaultPrefs: Preferences = {
            language: 'en-US',
            theme: 'system',
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
        return saved ? { ...defaultPrefs, ...JSON.parse(saved) } : defaultPrefs;
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [currentView, setCurrentView] = useState<View>('dashboard');

    const [user, setUser] = useState<User | null>(null);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
    const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
        const saved = localStorage.getItem('notificationSettings');
        return saved ? JSON.parse(saved) : { monthlyReports: true, aiSuggestions: true, securityAlerts: true };
    });

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ message: '', show: false });
    const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
    
    const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
    const [isSchedulePaymentModalOpen, setIsSchedulePaymentModalOpen] = useState(false);
    const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);
    const [isSendFundsModalOpen, setIsSendFundsModalOpen] = useState(false);
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [explorerTx, setExplorerTx] = useState<Transaction | null>(null);

    const showToast = useCallback((message: string) => {
        setToast({ message, show: true });
    }, []);

    const addNotification = useCallback((message: string, type: NotificationType) => {
        if (type === 'suggestion' && !notificationSettings.aiSuggestions) return;
        if (type === 'security' && !notificationSettings.securityAlerts) return;

        const newNotification: Notification = {
            id: mockApi.generateId('notif'),
            message,
            type,
            timestamp: new Date().toISOString(),
            read: false,
        };
        setNotifications(prev => [newNotification, ...prev].slice(0, 20));
        setHasUnreadNotifications(true);
    }, [notificationSettings]);

    const addTransaction = useCallback((newTxData: Omit<Transaction, 'id' | 'timestamp' | 'txId'>, customTimestamp?: string): Transaction => {
        const newTransaction: Transaction = {
            ...newTxData,
            id: mockApi.generateId('txn'),
            timestamp: customTimestamp || new Date().toISOString(),
            txId: mockApi.generateTxId(),
        };

        setTransactions(prev => [newTransaction, ...prev].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));

        if (user && newTransaction.status === 'completed') {
             setUser(prevUser => {
                if (!prevUser) return null;
                const newBalance = prevUser.balances.USDC + (newTransaction.type === 'deposit' || newTransaction.type === 'refund' ? newTransaction.amount : -newTransaction.amount);
                return { ...prevUser, balances: { ...prevUser.balances, USDC: newBalance } };
            });
        }
        return newTransaction;
    }, [user]);

    const generateAiSuggestions = useCallback(async () => {
        setIsGeneratingSuggestions(true);
        try {
            const suggestionsFromMock = await mockApi.getAiSuggestions();
            setSuggestions(suggestionsFromMock);
        } catch (error) {
            console.error("Error fetching AI suggestions:", error);
            showToast("Could not fetch AI suggestions.");
            setSuggestions([]);
        } finally {
            setIsGeneratingSuggestions(false);
        }
    }, [showToast]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
        const applyTheme = (t: Preferences['theme']) => {
            if (t === 'dark') {
                document.documentElement.classList.add('dark');
            } else if (t === 'light') {
                document.documentElement.classList.remove('dark');
            } else { // system
                if (mediaQuery.matches) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        };
        
        applyTheme(preferences.theme);
        localStorage.setItem('preferences', JSON.stringify(preferences));
    
        const handleChange = (e: MediaQueryListEvent) => {
            if (preferences.theme === 'system') {
                if (e.matches) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        };
    
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [preferences.theme]);
    
    useEffect(() => {
        localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    }, [notificationSettings]);
    
    const loadAppData = useCallback(async (welcomeMessage: string) => {
        setLoading(true);
        try {
            const [
                userData,
                subsData,
                aiSuggData,
                txData,
                msgData,
                teamData,
                sessionsData,
                referralsData,
            ] = await Promise.all([
                mockApi.getUser(),
                mockApi.getSubscriptions(),
                mockApi.getAiSuggestions(),
                mockApi.getTransactions(),
                mockApi.getInitialMessages(),
                mockApi.getTeam(),
                mockApi.getSessions(),
                mockApi.getReferrals(),
            ]);
            setUser(userData);
            setSubscriptions(subsData);
            setSuggestions(aiSuggData);
            setTransactions(txData);
            setMessages(msgData);
            setTeam(teamData);
            setSessions(sessionsData);
            setReferrals(referralsData);
            setPage('app');
            setCurrentView('dashboard');
            showToast(welcomeMessage);
        } catch (err) {
            console.error("Failed to load app data", err);
            showToast('Failed to load your data. Please try again.');
            setPage('login');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    const handleLoginSuccess = useCallback(() => {
        loadAppData(`Welcome back!`);
    }, [loadAppData]);

    const handleSignupSuccess = useCallback((newUser: User) => {
        setUser(newUser);
        setPage('profile-setup');
    }, []);

    const handleProfileSetupComplete = useCallback(async (updatedUser: User) => {
        setUser(updatedUser);
        await loadAppData(`Welcome, ${updatedUser.displayName}! Your setup is complete.`);
    }, [loadAppData]);

    const handleLogout = useCallback(() => {
        setUser(null);
        setSubscriptions([]);
        setSuggestions([]);
        setTransactions([]);
        setMessages([]);
        setTeam([]);
        setSessions([]);
        setReferrals([]);
        setNotifications([]);
        setPage('landing');
        showToast('You have been logged out.');
    }, [showToast]);

    const handleApplySuggestion = useCallback((suggestion: AiSuggestion) => {
        if (suggestion.subscriptionId) {
            if (suggestion.type === 'cancel_low_usage') {
                setSubscriptions(prev => prev.map(s => s.id === suggestion.subscriptionId ? { ...s, status: 'cancelled' } : s));
                addNotification(`Cancelled subscription based on AI suggestion.`, 'suggestion');
            }
        }
        setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
        showToast('AI suggestion applied!');
    }, [addNotification, showToast]);
    
    const handleDismissSuggestion = useCallback((suggestionId: string) => {
        setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
        showToast('Suggestion dismissed.');
    }, [showToast]);

    const handleSubscriptionStatusChange = useCallback((subscriptionId: string, status: SubscriptionStatus) => {
        let message = '';
        setSubscriptions(prev => prev.map(s => {
            if (s.id === subscriptionId) {
                if (status === 'cancelled') message = `Cancelled '${s.name}'.`;
                if (status === 'paused') message = `Paused '${s.name}'.`;
                if (status === 'active' && s.status === 'paused') message = `Resumed '${s.name}'.`;
                if (status === 'active' && s.status === 'cancelled') {
                    message = `Reactivated '${s.name}'.`;
                    const newNextPayment = new Date();
                    newNextPayment.setMonth(newNextPayment.getMonth() + 1);
                    addTransaction({
                        type: 'payment',
                        status: 'completed',
                        amount: 0,
                        currency: 'USDC',
                        description: `Reactivated ${s.name}`,
                        category: s.category,
                    });
                    return { ...s, status, nextPayment: newNextPayment.toISOString() };
                }
                return { ...s, status };
            }
            return s;
        }));
        if(message) addNotification(message, 'subscription');
    }, [addNotification, addTransaction]);

    const handlePlanChange = useCallback((subscriptionId: string, newPlanId: string) => {
        setSubscriptions(prev => prev.map(s => {
            if (s.id === subscriptionId) {
                const newPlan = s.availablePlans.find(p => p.id === newPlanId);
                const oldPlan = s.availablePlans.find(p => p.id === s.currentPlanId);
                if (newPlan && oldPlan) {
                    addTransaction({
                        type: 'payment',
                        status: 'completed',
                        amount: 0,
                        currency: 'USDC',
                        description: `Changed ${s.name} to ${newPlan.name} plan`,
                        category: s.category,
                    });
                    addNotification(`Plan for '${s.name}' changed to ${newPlan.name}.`, 'subscription');
                }
                return { ...s, currentPlanId: newPlanId };
            }
            return s;
        }));
        showToast('Subscription plan updated!');
    }, [addNotification, addTransaction, showToast]);

    const handleAddFunds = useCallback((amount: number) => {
        addTransaction({
            type: 'deposit',
            status: 'completed',
            amount,
            currency: 'USDC',
            description: 'User Deposit',
            category: 'Income',
        });
        addNotification(`Added $${amount.toFixed(2)} to your balance.`, 'payment');
        setIsAddFundsModalOpen(false);
        showToast('Funds added successfully!');
    }, [addTransaction, addNotification, showToast]);
    
    const handleSchedulePayment = useCallback((details: { subscriptionName: string; amount: number; paymentDate: string; notes?: string }) => {
        addTransaction({
            type: 'payment',
            status: 'pending',
            amount: details.amount,
            currency: 'USDC',
            description: details.subscriptionName,
            notes: details.notes,
            category: 'General',
        }, details.paymentDate);
        addNotification(`Scheduled payment for ${details.subscriptionName}.`, 'payment');
        setIsSchedulePaymentModalOpen(false);
        showToast('Payment scheduled!');
    }, [addTransaction, addNotification, showToast]);
    
    const handleSendFunds = useCallback(async (details: { recipientId: string; amount: number; notes?: string }): Promise<Transaction | undefined> => {
        if (!user || !user.walletId) {
            showToast('User wallet not configured.');
            return undefined;
        }
        if (user.balances.USDC < details.amount) {
            showToast('Insufficient funds.');
            return undefined;
        }
    
        try {
            const circleResponse = await circleApi.sendFunds(user.walletId, details.recipientId, details.amount);
            
            const newTx = addTransaction({
                type: 'transfer',
                status: circleResponse.data.status === 'COMPLETE' ? 'completed' : 'pending',
                amount: details.amount,
                currency: 'USDC',
                description: `Transfer to ${details.recipientId}`,
                notes: details.notes,
                category: 'Transfers',
            }, circleResponse.data.createDate);
            
            setTransactions(prev => prev.map(tx => tx.id === newTx.id ? { ...tx, txId: circleResponse.data.txHash } : tx));
    
            addNotification(`Sent $${details.amount.toFixed(2)} to ${details.recipientId}.`, 'transfer');
            showToast('Funds sent successfully!');
            
            const finalTx = { ...newTx, txId: circleResponse.data.txHash };
            return finalTx;
    
        } catch (error: any) {
            console.error("Circle API transfer failed:", error);
            showToast(`Transfer failed: ${error.message}`);
            return undefined;
        }
    }, [user, addTransaction, addNotification, showToast]);

    const handleSendMessage = useCallback(async (text: string) => {
        const userMessage: Message = { id: `msg_${Date.now()}`, text, sender: 'user', timestamp: new Date().toISOString() };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
    
        const aiResponse = await mockApi.getChatResponse(text, subscriptions, updatedMessages);
        setMessages(prev => [...prev, aiResponse]);
    
        if (aiResponse.action) {
            const { type, payload } = aiResponse.action;
            switch (type) {
                case 'navigate':
                    if (payload.view) {
                        setCurrentView(payload.view);
                        addNotification(`AI is navigating to ${payload.view}.`, 'suggestion');
                    }
                    break;
                case 'change_status':
                    if (payload.subscriptionId && payload.status) {
                        handleSubscriptionStatusChange(payload.subscriptionId, payload.status);
                        const subName = subscriptions.find(s => s.id === payload.subscriptionId)?.name || 'subscription';
                        const message = `AI has ${payload.status} your ${subName} subscription.`;
                        showToast(message);
                        addNotification(message, 'subscription');
                    }
                    break;
                default:
                    console.warn('Unknown AI action type:', type);
            }
        }
    }, [subscriptions, handleSubscriptionStatusChange, showToast, addNotification, messages]);
    
    const handleInviteMember = useCallback((email: string, role: TeamMember['role']) => {
        const newMember: TeamMember = {
            id: mockApi.generateId('tm'),
            name: 'Invited Member',
            email,
            role,
            status: 'pending',
        };
        setTeam(prev => [...prev, newMember]);
        addNotification(`Invited ${email} to the team.`, 'team');
        setIsInviteMemberModalOpen(false);
        showToast('Invitation sent!');
    }, [addNotification, showToast]);
    
    const handleRemoveMember = useCallback((memberId: string) => {
        const member = team.find(m => m.id === memberId);
        if (member) {
            setTeam(prev => prev.filter(m => m.id !== memberId));
            addNotification(`Removed ${member.name} from the team.`, 'team');
            showToast(`${member.name} removed.`);
        }
    }, [team, addNotification, showToast]);
    
    const handleResendInvite = useCallback((email: string) => {
        addNotification(`Resent invitation to ${email}.`, 'team');
        showToast(`Invitation resent to ${email}!`);
    }, [addNotification, showToast]);
    
    const handleImportTransactions = useCallback((importedTxs: Omit<Transaction, 'id' | 'txId'>[]) => {
        const newTransactions = importedTxs.map(txData => ({
            ...txData,
            id: mockApi.generateId('txn'),
            txId: mockApi.generateTxId(),
        }));
        
        const allTransactions = [...transactions, ...newTransactions].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setTransactions(allTransactions);
        
        const newBalance = allTransactions.reduce((balance, tx) => {
            if (tx.status !== 'completed') return balance;
            if (tx.type === 'deposit' || tx.type === 'refund') return balance + tx.amount;
            return balance - tx.amount;
        }, 0);
        
        setUser(prevUser => prevUser ? ({...prevUser, balances: { ...prevUser.balances, USDC: newBalance }}) : null);
        addNotification(`Imported ${newTransactions.length} transactions.`, 'payment');
    }, [transactions, addNotification]);
    
    const handleProfileImageSelect = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            setImageToCrop(reader.result as string);
            setIsCropModalOpen(true);
        };
        reader.readAsDataURL(file);
    };
    
    const handleCropComplete = (croppedImageUrl: string) => {
        setUser(prev => prev ? {...prev, avatarUrl: croppedImageUrl} : null);
        setIsCropModalOpen(false);
        setImageToCrop(null);
        addNotification('Profile picture updated.', 'security');
        showToast('Profile picture updated!');
    };
    
    const handleMarkNotificationsAsRead = () => {
        setHasUnreadNotifications(false);
        setNotifications(prev => prev.map(n => ({...n, read: true})));
    };

    const handleProfileUpdate = useCallback((updatedProfile: { displayName: string, username: string, bio: string }) => {
        setUser(prevUser => {
            if (!prevUser) return null;
            return { ...prevUser, ...updatedProfile };
        });
        addNotification('Your profile has been updated.', 'security');
        showToast('Profile saved successfully!');
    }, [addNotification, showToast]);

    const handleRevokeSession = useCallback((sessionId: string) => {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        addNotification('A device session was revoked.', 'security');
        showToast('Session signed out.');
    }, [addNotification, showToast]);

    const handleNotificationSettingsUpdate = useCallback((settings: NotificationSettings) => {
        setNotificationSettings(settings);
        showToast('Notification settings saved!');
    }, [showToast]);

    const handlePreferencesUpdate = useCallback((newPreferences: Preferences) => {
        setPreferences(newPreferences);
        showToast('Preferences saved!');
    }, [showToast]);

    const toggleTheme = useCallback(() => {
        setPreferences(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
    }, []);

    if (loading) {
        return <div className="flex h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
            <div className="text-center">
                <svg className="h-12 w-12 text-primary-600 animate-spin mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" opacity="0.2"/><path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <p className="mt-2 text-slate-600 dark:text-slate-400">Loading your dashboard...</p>
            </div>
        </div>;
    }

    if (page === 'landing') {
        return <LandingPage onNavigateToLogin={() => setPage('login')} onNavigateToSignup={() => setPage('login')} />;
    }

    if (page === 'login') {
        return <LoginPage onLoginSuccess={handleLoginSuccess} onSignupSuccess={handleSignupSuccess} onNavigateToLanding={() => setPage('landing')} />;
    }

    if (page === 'profile-setup' && user) {
        return <ProfileSetupPage user={user} onSetupComplete={handleProfileSetupComplete} />;
    }

    if (page === 'app' && user) {
        const mainContent = () => {
            switch (currentView) {
                case 'dashboard': return <Dashboard user={user} subscriptions={subscriptions} suggestions={suggestions} transactions={transactions} onApplySuggestion={handleApplySuggestion} onDismissSuggestion={handleDismissSuggestion} onRefreshSuggestions={generateAiSuggestions} isGeneratingSuggestions={isGeneratingSuggestions} onAddFunds={() => setIsAddFundsModalOpen(true)} />;
                case 'subscriptions': return <Subscriptions subscriptions={subscriptions} onStatusChange={handleSubscriptionStatusChange} onPlanChange={handlePlanChange} />;
                case 'payments': return <Payments transactions={transactions} onViewTransaction={setSelectedTransaction} onSchedulePayment={() => setIsSchedulePaymentModalOpen(true)} onSendFunds={() => setIsSendFundsModalOpen(true)} />;
                case 'audit': return <Audit user={user} transactions={transactions} onImportTransactions={handleImportTransactions} onViewTxExplorer={setExplorerTx} showToast={showToast} />;
                case 'team': return <Team teamMembers={team} onInviteClick={() => setIsInviteMemberModalOpen(true)} onRemoveMember={handleRemoveMember} onResendInvite={handleResendInvite} />;
                case 'referrals': return <Referrals referrals={referrals} user={user} showToast={showToast}/>;
                case 'help': return <Help />;
                case 'settings': return <Settings user={user} preferences={preferences} onPreferencesUpdate={handlePreferencesUpdate} sessions={sessions} onRevokeSession={handleRevokeSession} showToast={showToast} setCurrentView={setCurrentView} onProfileImageSelect={handleProfileImageSelect} onProfileUpdate={handleProfileUpdate} notificationSettings={notificationSettings} onNotificationSettingsUpdate={handleNotificationSettingsUpdate} />;
                default: return <Dashboard user={user} subscriptions={subscriptions} suggestions={suggestions} transactions={transactions} onApplySuggestion={handleApplySuggestion} onDismissSuggestion={handleDismissSuggestion} onRefreshSuggestions={generateAiSuggestions} isGeneratingSuggestions={isGeneratingSuggestions} onAddFunds={() => setIsAddFundsModalOpen(true)} />;
            }
        };

        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-200">
                <SideNav currentView={currentView} setCurrentView={setCurrentView} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <div className="md:pl-64 transition-all duration-300">
                    <Header 
                        user={user} 
                        theme={preferences.theme}
                        toggleTheme={toggleTheme}
                        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                        setCurrentView={setCurrentView}
                        hasUnreadNotifications={hasUnreadNotifications}
                        onNotificationsClick={() => setIsNotificationPanelOpen(p => !p)}
                        onLogout={handleLogout}
                    />
                    <main className="p-4 sm:p-6 lg:p-8">
                        {mainContent()}
                    </main>
                </div>
                <ConversationPanel isOpen={isChatOpen} setIsOpen={setIsChatOpen} messages={messages} onSendMessage={handleSendMessage} />
                
                {!isChatOpen && (
                    <button
                        onClick={() => setIsChatOpen(true)}
                        className="fixed bottom-8 right-8 z-40 h-16 w-16 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all duration-300 ease-in-out transform hover:scale-110 flex items-center justify-center animate-fade-in"
                        aria-label="Open AI Assistant"
                    >
                        <ChatBubbleLeftRightIcon className="h-8 w-8" />
                    </button>
                )}

                <AddFundsModal 
                    isOpen={isAddFundsModalOpen} 
                    onClose={() => setIsAddFundsModalOpen(false)} 
                    onAddFunds={handleAddFunds}
                    currentBalance={user.balances.USDC}
                    monthlyCost={subscriptions.filter(s => s.status === 'active').reduce((acc, sub) => acc + (sub.availablePlans.find(p => p.id === sub.currentPlanId)?.monthlyCost || 0), 0)}
                />
                <TransactionDetailModal
                    transaction={selectedTransaction}
                    onClose={() => setSelectedTransaction(null)}
                    onUpdate={(txId, updates) => console.log('Update Tx', txId, updates)}
                    onViewExplorer={(tx) => {
                        setSelectedTransaction(null);
                        setExplorerTx(tx);
                    }}
                />
                <SchedulePaymentModal isOpen={isSchedulePaymentModalOpen} onClose={() => setIsSchedulePaymentModalOpen(false)} onSchedulePayment={handleSchedulePayment} subscriptions={subscriptions.filter(s => s.status === 'active')} />
                <InviteMemberModal isOpen={isInviteMemberModalOpen} onClose={() => setIsInviteMemberModalOpen(false)} onInvite={handleInviteMember} />
                <SendFundsModal isOpen={isSendFundsModalOpen} onClose={() => setIsSendFundsModalOpen(false)} onSendFunds={handleSendFunds} currentUser={user} />
                <TransactionExplorerModal transaction={explorerTx} user={user} onClose={() => setExplorerTx(null)} />
                <NotificationPanel isOpen={isNotificationPanelOpen} onClose={() => { setIsNotificationPanelOpen(false); handleMarkNotificationsAsRead(); }} notifications={notifications} />
                <ImageCropModal isOpen={isCropModalOpen} onClose={() => setIsCropModalOpen(false)} imageSrc={imageToCrop} onCropComplete={handleCropComplete} />
                <Toast message={toast.message} show={toast.show} onDismiss={() => setToast({ message: '', show: false })} />
            </div>
        );
    }
    
    // Fallback just in case state becomes inconsistent
    return <LandingPage onNavigateToLogin={() => setPage('login')} onNavigateToSignup={() => setPage('login')} />;
};

export default App;