
import React, { useState, useEffect, useCallback } from 'react';
import { mockApi } from '../services/mockApi';
import { User } from '../types';
import { CheckIcon, XIcon } from './icons';

interface ProfileSetupPageProps {
    user: User;
    onSetupComplete: (updatedUser: User) => void;
}

const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;

const Spinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const ProfileSetupPage: React.FC<ProfileSetupPageProps> = ({ user, onSetupComplete }) => {
    const [displayName, setDisplayName] = useState('');
    const [username, setUsername] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    
    const [usernameError, setUsernameError] = useState('');
    const [isUsernameValid, setIsUsernameValid] = useState(false);

    // Debounce function
    const useDebounce = (value: string, delay: number) => {
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(() => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);
            return () => {
                clearTimeout(handler);
            };
        }, [value, delay]);
        return debouncedValue;
    };
    
    const debouncedUsername = useDebounce(username, 500);

    const checkUsernameAvailability = useCallback(async (name: string) => {
        if (!usernameRegex.test(name)) {
            setUsernameError('Must be 3-15 characters, letters, numbers, or underscores only.');
            setIsUsernameValid(false);
            return;
        }
        
        setIsCheckingUsername(true);
        setUsernameError('');
        try {
            const isAvailable = await mockApi.checkUsername(name);
            if (isAvailable) {
                setIsUsernameValid(true);
                setUsernameError('');
            } else {
                setIsUsernameValid(false);
                setUsernameError('This username is already taken.');
            }
        } catch (error) {
            setUsernameError('Could not verify username. Please try again.');
            setIsUsernameValid(false);
        } finally {
            setIsCheckingUsername(false);
        }
    }, []);

    useEffect(() => {
        if (debouncedUsername) {
            checkUsernameAvailability(debouncedUsername);
        } else {
            setUsernameError('');
            setIsUsernameValid(false);
            setIsCheckingUsername(false);
        }
    }, [debouncedUsername, checkUsernameAvailability]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isUsernameValid || !displayName.trim()) {
            return;
        }

        setIsLoading(true);
        try {
            const updatedUser = await mockApi.updateUserProfile(user.id, {
                displayName: displayName.trim(),
                username: username.trim(),
            });
            onSetupComplete(updatedUser);
        } catch (err: any) {
            setUsernameError(err.message || 'An error occurred during setup.');
            setIsLoading(false);
        }
    };
    
    const getUsernameStatusIcon = () => {
        if (isCheckingUsername) return <Spinner />;
        if (usernameError && username) return <XIcon className="h-5 w-5 text-red-400" />;
        if (isUsernameValid) return <CheckIcon className="h-5 w-5 text-green-400" />;
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="relative w-full max-w-md">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg blur opacity-25"></div>
                <div className="relative bg-slate-900 border border-slate-800 rounded-lg p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white">Set up your profile</h2>
                        <p className="text-slate-400 mt-1">This information will be visible to your team.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="displayName" className="block text-sm font-medium text-slate-400">Display Name</label>
                            <div className="mt-1">
                                <input id="displayName" name="displayName" type="text" required value={displayName} onChange={e => setDisplayName(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-white" 
                                    placeholder="e.g., Alex Rivera"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-400">Username</label>
                            <div className="mt-1 relative">
                                <input id="username" name="username" type="text" required value={username} onChange={e => setUsername(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-white pr-10" 
                                    placeholder="e.g., alex_rivera"
                                    aria-invalid={!!usernameError}
                                    aria-describedby="username-error"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    {getUsernameStatusIcon()}
                                </div>
                            </div>
                            {usernameError && <p id="username-error" className="text-sm text-red-400 mt-1">{usernameError}</p>}
                        </div>
                        
                        <div>
                            <button type="submit" disabled={isLoading || !isUsernameValid || !displayName.trim()}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-800 disabled:cursor-not-allowed">
                                {isLoading ? 'Saving...' : 'Complete Setup'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSetupPage;