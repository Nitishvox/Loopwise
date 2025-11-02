


import React, { useState, Fragment, useRef, useEffect } from 'react';
import { User, Session, View, NotificationSettings, Preferences } from '../types';
import Card from './Card';
import { UserCircleIcon, ShieldCheckIcon, PaintBrushIcon, BellIcon, LinkIcon, ExclamationTriangleIcon, DesktopComputerIcon, GlobeAltIcon, XIcon, ArrowUpTrayIcon } from './icons';

type SettingsSection = 'profile' | 'security' | 'preferences' | 'notifications' | 'privacy' | 'linked-accounts' | 'danger-zone';

interface SettingsProps {
    user: User | null;
    preferences: Preferences;
    onPreferencesUpdate: (preferences: Preferences) => void;
    sessions: Session[];
    onRevokeSession: (sessionId: string) => void;
    showToast: (message: string) => void;
    setCurrentView: (view: View) => void;
    onProfileImageSelect: (file: File) => void;
    onProfileUpdate: (profile: { displayName: string, username: string, bio: string }) => void;
    notificationSettings: NotificationSettings;
    onNotificationSettingsUpdate: (settings: NotificationSettings) => void;
}

const settingsSections = [
    { id: 'profile', label: 'Profile', icon: <UserCircleIcon className="w-5 h-5" /> },
    { id: 'security', label: 'Security', icon: <ShieldCheckIcon className="w-5 h-5" /> },
    { id: 'preferences', label: 'Preferences', icon: <PaintBrushIcon className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <BellIcon className="w-5 h-5" /> },
    { id: 'linked-accounts', label: 'Linked Accounts', icon: <LinkIcon className="w-5 h-5" /> },
    { id: 'privacy', label: 'Privacy', icon: <ShieldCheckIcon className="w-5 h-5" /> },
    { id: 'danger-zone', label: 'Danger Zone', icon: <ExclamationTriangleIcon className="w-5 h-5" /> },
] as const;


const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        {...props}
        className={`w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-sm ${props.className || ''}`}
    />
);
const TextAreaInput: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea
        {...props}
        className={`w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-sm ${props.className || ''}`}
    />
);

const SelectInput: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
     <select
        {...props}
        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-sm"
    />
);

const FormRow: React.FC<{ label: string; description?: string; children: React.ReactNode; }> = ({ label, description, children }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 py-4">
        <div className="md:col-span-1">
            <label className="font-medium text-slate-700 dark:text-slate-300">{label}</label>
            {description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>}
        </div>
        <div className="md:col-span-2">
            {children}
        </div>
    </div>
);

const ToggleSwitch: React.FC<{ enabled: boolean, setEnabled: (enabled: boolean) => void }> = ({ enabled, setEnabled }) => (
    <button
      onClick={() => setEnabled(!enabled)}
      type="button"
      className={`${enabled ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900`}
      role="switch"
      aria-checked={enabled}
    >
      <span
        aria-hidden="true"
        className={`${enabled ? 'translate-x-5' : 'translate-x-0'} inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
);

const languages = [
    { value: 'en-US', label: 'English (United States)' }, { value: 'es-ES', label: 'Español (España)' },
    { value: 'fr-FR', label: 'Français (France)' }, { value: 'de-DE', label: 'Deutsch (Deutschland)' },
    { value: 'zh-CN', label: '中文 (简体)' }, { value: 'ja-JP', label: '日本語 (日本)' },
    { value: 'ko-KR', label: '한국어 (대한민국)' }, { value: 'ru-RU', label: 'Русский (Россия)' },
    { value: 'pt-BR', label: 'Português (Brasil)' }, { value: 'it-IT', label: 'Italiano (Italia)' },
    { value: 'hi-IN', label: 'हिन्दी (भारत)' }, { value: 'ar-SA', label: 'العربية (المملكة العربية السعودية)' },
    { value: 'nl-NL', label: 'Nederlands (Nederland)' }, { value: 'sv-SE', label: 'Svenska (Sverige)' },
    { value: 'nb-NO', label: 'Norsk bokmål (Norge)' }, { value: 'da-DK', label: 'Dansk (Danmark)' },
    { value: 'fi-FI', label: 'Suomi (Suomi)' }, { value: 'pl-PL', label: 'Polski (Polska)' },
    { value: 'tr-TR', label: 'Türkçe (Türkiye)' }, { value: 'id-ID', label: 'Bahasa Indonesia' },
    { value: 'ms-MY', label: 'Bahasa Melayu' }, { value: 'vi-VN', label: 'Tiếng Việt (Việt Nam)' },
    { value: 'th-TH', label: 'ไทย (ประเทศไทย)' }, { value: 'el-GR', label: 'Ελληνικά (Ελλάδα)' },
    { value: 'he-IL', label: 'עברית (ישראל)' }, { value: 'cs-CZ', label: 'Čeština (Česká republika)' },
    { value: 'hu-HU', label: 'Magyar (Magyarország)' }, { value: 'ro-RO', label: 'Română (România)' },
    { value: 'uk-UA', label: 'Українська (Україна)' }, { value: 'fil-PH', label: 'Filipino (Pilipinas)' }
];

const timeZones = [
    'UTC', 'GMT', 'Europe/London', 'Europe/Berlin', 'Europe/Moscow',
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/Anchorage', 'Pacific/Honolulu',
    'America/Sao_Paulo', 'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Kolkata', 'Australia/Sydney'
].sort();

const Settings: React.FC<SettingsProps> = ({ user, preferences, onPreferencesUpdate, sessions, onRevokeSession, showToast, setCurrentView, onProfileImageSelect, onProfileUpdate, notificationSettings, onNotificationSettingsUpdate }) => {
    const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [isAccountDeleted, setIsAccountDeleted] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profile, setProfile] = useState({
        displayName: user?.displayName || '',
        username: user?.username || '',
        bio: user?.bio || '',
    });
    
    useEffect(() => {
        if (user) {
            setProfile({
                displayName: user.displayName,
                username: user.username,
                bio: user.bio,
            });
        }
    }, [user]);

    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    const [localNotificationSettings, setLocalNotificationSettings] = useState(notificationSettings);
    
    useEffect(() => {
        setLocalNotificationSettings(notificationSettings);
    }, [notificationSettings]);
    
    const [localPreferences, setLocalPreferences] = useState(preferences);

    useEffect(() => {
        setLocalPreferences(preferences);
    }, [preferences]);
    
    const [privacy, setPrivacy] = useState({
        publicProfile: false,
    });
    
    const [linkedAccounts, setLinkedAccounts] = useState({
        google: false,
        metamask: true,
    });

    if (!user) return <div>Loading user settings...</div>;
    
    if (isAccountDeleted) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Account Deleted</h2>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Your account has been permanently deleted. Thank you for using Loopwise.</p>
            </div>
        );
    }
    
    const handleProfileSave = () => {
        onProfileUpdate(profile);
    };
    const handlePreferencesSave = () => {
        onPreferencesUpdate(localPreferences);
    };
    const handleNotificationsSave = () => {
        onNotificationSettingsUpdate(localNotificationSettings);
    };
    const handlePrivacySave = () => showToast('Privacy settings saved!');
    
    const handlePasswordUpdate = () => {
        setPasswords({ current: '', new: '', confirm: '' });
        showToast('Password updated successfully!');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onProfileImageSelect(file);
        }
    };
    
    const toggleLinkedAccount = (account: keyof typeof linkedAccounts) => {
        const accountName = String(account);
        const isConnecting = !linkedAccounts[account];
        setLinkedAccounts(prev => ({ ...prev, [account]: isConnecting }));
        showToast(`${accountName.charAt(0).toUpperCase() + accountName.slice(1)} account ${isConnecting ? 'connected' : 'disconnected'}.`);
    };

    const handleAccountDelete = () => {
        setShowDeleteModal(false);
        setIsAccountDeleted(true);
    };

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'profile':
                return (
                    <Card title="Public Profile" >
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">This information may be displayed publicly. Be careful what you share.</p>
                        <div className="mt-6 divide-y divide-slate-200 dark:divide-slate-700">
                             <FormRow label="Profile Picture">
                                <div className="flex items-center gap-4">
                                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                                    {user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold text-3xl">
                                            {user.displayName?.charAt(0)}
                                        </div>
                                    )}
                                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                        <ArrowUpTrayIcon className="w-4 h-4" /> Change
                                    </button>
                                </div>
                            </FormRow>
                            <FormRow label="Full Name"><TextInput value={profile.displayName} onChange={e => setProfile({...profile, displayName: e.target.value})} /></FormRow>
                            <FormRow label="Username"><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-slate-500 dark:text-slate-400">loopwise.app/</span><TextInput value={profile.username} onChange={e => setProfile({...profile, username: e.target.value})} className="pl-[100px]" /></div></FormRow>
                            <FormRow label="Bio" description="Write a few sentences about yourself."><TextAreaInput rows={3} value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} /></FormRow>
                        </div>
                        <div className="mt-6 flex justify-end"><button onClick={handleProfileSave} className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors shadow-sm">Save Changes</button></div>
                    </Card>
                );
            case 'security':
                return (
                    <div className="space-y-6">
                        <Card title="Password">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Update your password and manage account security.</p>
                            <div className="mt-6 divide-y divide-slate-200 dark:divide-slate-700">
                                <FormRow label="Change Password">
                                    <div className="space-y-3">
                                        <TextInput type="password" placeholder="Current password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} />
                                        <TextInput type="password" placeholder="New password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} />
                                        <TextInput type="password" placeholder="Confirm new password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} />
                                    </div>
                                </FormRow>
                            </div>
                            <div className="mt-6 flex justify-end"><button onClick={handlePasswordUpdate} className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors shadow-sm">Update Password</button></div>
                        </Card>
                         <Card title="Active Sessions">
                             <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">This is a list of devices that have logged into your account. Revoke any sessions that you do not recognize.</p>
                            <div className="mt-6 space-y-4">
                                {sessions.map(session => (
                                    <div key={session.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <DesktopComputerIcon className="w-8 h-8 text-slate-500"/>
                                            <div>
                                                <p className="font-semibold text-slate-800 dark:text-slate-200">{session.device} {session.isCurrent && <span className="text-xs text-green-600 dark:text-green-400 ml-2">(This device)</span>}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{session.location} &middot; Last active {session.lastActive}</p>
                                            </div>
                                        </div>
                                        {!session.isCurrent && (
                                            <button onClick={() => onRevokeSession(session.id)} className="text-sm font-semibold text-red-600 dark:text-red-400 px-3 py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">Sign out</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                );
            case 'preferences':
                return (
                     <Card title="Preferences">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Customize the look and feel of your dashboard.</p>
                        <div className="mt-6 divide-y divide-slate-200 dark:divide-slate-700">
                            <FormRow label="Language">
                                <SelectInput value={localPreferences.language} onChange={e => setLocalPreferences({...localPreferences, language: e.target.value})}>
                                    {languages.map(lang => <option key={lang.value} value={lang.value}>{lang.label}</option>)}
                                </SelectInput>
                            </FormRow>
                            <FormRow label="Time Zone">
                                <SelectInput value={localPreferences.timeZone} onChange={e => setLocalPreferences({...localPreferences, timeZone: e.target.value})}>
                                    {timeZones.map(tz => <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>)}
                                </SelectInput>
                            </FormRow>
                            <FormRow label="Theme">
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="theme" value="light" checked={localPreferences.theme === 'light'} onChange={() => setLocalPreferences({...localPreferences, theme: 'light'})} className="form-radio text-primary-600 focus:ring-primary-500" /> Light</label>
                                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="theme" value="dark" checked={localPreferences.theme === 'dark'} onChange={() => setLocalPreferences({...localPreferences, theme: 'dark'})} className="form-radio text-primary-600 focus:ring-primary-500" /> Dark</label>
                                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="theme" value="system" checked={localPreferences.theme === 'system'} onChange={() => setLocalPreferences({...localPreferences, theme: 'system'})} className="form-radio text-primary-600 focus:ring-primary-500" /> System</label>
                                </div>
                            </FormRow>
                        </div>
                        <div className="mt-6 flex justify-end"><button onClick={handlePreferencesSave} className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors shadow-sm">Save Preferences</button></div>
                    </Card>
                );
            case 'notifications':
                return (
                    <Card title="Notifications">
                         <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">We'll always let you know about important changes, but you pick what else you want to hear about.</p>
                         <div className="mt-6 divide-y divide-slate-200 dark:divide-slate-700">
                            <FormRow label="Monthly Reports" description="Receive a summary of your subscription activity once a month."><ToggleSwitch enabled={localNotificationSettings.monthlyReports} setEnabled={(val) => setLocalNotificationSettings({...localNotificationSettings, monthlyReports: val })} /></FormRow>
                            <FormRow label="AI Suggestions" description="Get notified when our AI finds a way for you to save money."><ToggleSwitch enabled={localNotificationSettings.aiSuggestions} setEnabled={(val) => setLocalNotificationSettings({...localNotificationSettings, aiSuggestions: val })} /></FormRow>
                            <FormRow label="Security Alerts" description="Get notified about important security-related activity on your account."><ToggleSwitch enabled={localNotificationSettings.securityAlerts} setEnabled={(val) => setLocalNotificationSettings({...localNotificationSettings, securityAlerts: val })} /></FormRow>
                        </div>
                         <div className="mt-6 flex justify-end"><button onClick={handleNotificationsSave} className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors shadow-sm">Save Notifications</button></div>
                    </Card>
                );
            case 'linked-accounts':
                return (
                     <Card title="Linked Accounts">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Connect your Loopwise account to other services.</p>
                        <div className="mt-2 divide-y divide-slate-200 dark:divide-slate-700">
                            <div className="py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3"><GlobeAltIcon className="w-6 h-6 text-slate-400"/><div><p className="font-medium">Google</p><p className="text-sm text-slate-500">{linkedAccounts.google ? 'Connected' : 'Not connected'}</p></div></div>
                                <button onClick={() => toggleLinkedAccount('google')} className={`text-sm font-semibold px-3 py-1.5 rounded-md transition-colors ${linkedAccounts.google ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10' : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>{linkedAccounts.google ? 'Disconnect' : 'Connect'}</button>
                            </div>
                            <div className="py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3"><img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" className="w-6 h-6"/><div><p className="font-medium">MetaMask</p><p className="text-sm text-slate-500 font-mono">{linkedAccounts.metamask ? user.address : 'Not connected'}</p></div></div>
                                <button onClick={() => toggleLinkedAccount('metamask')} className={`text-sm font-semibold px-3 py-1.5 rounded-md transition-colors ${linkedAccounts.metamask ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10' : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>{linkedAccounts.metamask ? 'Disconnect' : 'Connect'}</button>
                            </div>
                        </div>
                    </Card>
                );
            case 'privacy':
                return (
                    <Card title="Privacy & Data">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your privacy settings and download your data.</p>
                        <div className="mt-6 divide-y divide-slate-200 dark:divide-slate-700">
                            <FormRow label="Public Profile" description="Allow other Loopwise users to see your profile."><ToggleSwitch enabled={privacy.publicProfile} setEnabled={(val) => setPrivacy({...privacy, publicProfile: val })} /></FormRow>
                            <FormRow label="Manage Your Data" description="Download a copy of all your data from Loopwise.">
                                <button onClick={() => showToast('Data export started!')} className="text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Export Data</button>
                            </FormRow>
                        </div>
                        <div className="mt-6 flex justify-end"><button onClick={handlePrivacySave} className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors shadow-sm">Save Privacy Settings</button></div>
                    </Card>
                );
            case 'danger-zone':
                return (
                     <Card title="Danger Zone" >
                        <div className="mt-4 border-t border-red-200 dark:border-red-500/30 pt-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                <div><p className="font-medium text-slate-800 dark:text-slate-200">Delete your account</p><p className="text-sm text-slate-500 dark:text-slate-400">Permanently delete your account and all of its content. This action is not reversible.</p></div>
                                <button onClick={() => setShowDeleteModal(true)} className="mt-4 sm:mt-0 flex-shrink-0 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors shadow-sm">Delete Account</button>
                            </div>
                        </div>
                    </Card>
                );
            default:
                return null;
        }
    }


    return (
        <Fragment>
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Settings</h2>
                    <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                        Manage your account settings and set e-mail preferences.
                    </p>
                </div>
                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="md:w-56 lg:w-64 flex-shrink-0">
                        <nav className="space-y-1 sticky top-24">
                            {settingsSections.map(section => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    onClick={(e) => { e.preventDefault(); setActiveSection(section.id as SettingsSection); }}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeSection === section.id
                                            ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {section.icon}
                                    {section.label}
                                </a>
                            ))}
                        </nav>
                    </aside>
                    <main className="flex-1 animate-fade-in-up" style={{ animationDelay: '100ms', animationDuration: '0.4s'}}>
                       {renderSectionContent()}
                    </main>
                </div>
            </div>
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in" aria-modal="true">
                    <Card className="max-w-md w-full animate-scale-in">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Delete Account</h3>
                            <button onClick={() => setShowDeleteModal(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><XIcon className="w-5 h-5 text-slate-500" /></button>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">This action cannot be undone. This will permanently delete your account, subscriptions, and all associated data.</p>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-4">To confirm, please type "<strong className="text-red-500">{user.username}</strong>" in the box below.</p>
                        <TextInput
                            value={deleteConfirmation}
                            onChange={e => setDeleteConfirmation(e.target.value)}
                            className="mt-2"
                        />
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-sm font-semibold bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600">Cancel</button>
                            <button
                                onClick={handleAccountDelete}
                                disabled={deleteConfirmation !== user.username}
                                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-300 dark:disabled:bg-red-800 disabled:cursor-not-allowed"
                            >
                                I understand, delete my account
                            </button>
                        </div>
                    </Card>
                </div>
            )}
        </Fragment>
    );
};

export default Settings;