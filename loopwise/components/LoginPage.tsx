import React, { useState } from 'react';
import { mockApi } from '../services/mockApi';
import { User } from '../types';

interface LoginPageProps {
    onLoginSuccess: () => void;
    onSignupSuccess: (newUser: User) => void;
    onNavigateToLanding: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onSignupSuccess, onNavigateToLanding }) => {
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (authMode === 'signup' && password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        try {
            if (authMode === 'signup') {
                const newUser = await mockApi.signup(email, password);
                onSignupSuccess(newUser);
            } else {
                await mockApi.login(email, password);
                onLoginSuccess();
            }
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleAuthMode = () => {
        setAuthMode(prev => prev === 'signin' ? 'signup' : 'signin');
        setError('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="relative w-full max-w-md">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg blur opacity-25"></div>
                <div className="relative bg-slate-900 border border-slate-800 rounded-lg p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <button onClick={onNavigateToLanding} className="flex items-center justify-center gap-2 mx-auto">
                            <svg className="h-10 w-10 text-primary-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            <h1 className="text-2xl font-bold text-white">Loopwise</h1>
                        </button>
                        <h2 className="mt-2 text-xl font-bold text-white">{authMode === 'signin' ? 'Sign in to your account' : 'Create an account'}</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-400">Email address</label>
                            <div className="mt-1">
                                <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-white" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-400">Password</label>
                            <div className="mt-1">
                                <input id="password" name="password" type="password" autoComplete={authMode === 'signin' ? 'current-password' : 'new-password'} required value={password} onChange={e => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-white" />
                            </div>
                        </div>
                        
                        {authMode === 'signup' && (
                             <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-400">Confirm Password</label>
                                <div className="mt-1">
                                    <input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-white" />
                                </div>
                            </div>
                        )}
                        
                        {error && <p className="text-sm text-red-400 text-center">{error}</p>}

                        <div>
                            <button type="submit" disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-800 disabled:cursor-wait">
                                {isLoading ? 'Processing...' : (authMode === 'signin' ? 'Sign In' : 'Create Account')}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <button onClick={toggleAuthMode} className="font-medium text-primary-500 hover:text-primary-400">
                            {authMode === 'signin' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;