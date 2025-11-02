
import React, { useState } from 'react';
import { XIcon } from './icons';
import { TeamMember } from '../types';

interface InviteMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInvite: (email: string, role: TeamMember['role']) => void;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ isOpen, onClose, onInvite }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<TeamMember['role']>('Member');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        setError('');
        onInvite(email, role);
        setEmail('');
        setRole('Member');
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="relative bg-slate-900 border border-slate-800 w-full max-w-md m-4 rounded-xl shadow-2xl animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 id="modal-title" className="text-xl font-bold text-white">Invite a new member</h2>
                                <p className="text-slate-400 text-sm mt-1">They will receive an email to join your team.</p>
                            </div>
                            <button 
                                type="button"
                                onClick={onClose} 
                                className="p-1 rounded-full text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                                aria-label="Close modal"
                            >
                                <XIcon className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="mt-6 space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1">Email address</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                    placeholder="name@company.com"
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                                    required
                                />
                                {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Role</label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="radio" name="role" value="Member" checked={role === 'Member'} onChange={() => setRole('Member')} className="form-radio bg-slate-700 border-slate-600 text-primary-500 focus:ring-primary-500"/>
                                        <span className="text-slate-300">Member</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="radio" name="role" value="Admin" checked={role === 'Admin'} onChange={() => setRole('Admin')} className="form-radio bg-slate-700 border-slate-600 text-primary-500 focus:ring-primary-500"/>
                                        <span className="text-slate-300">Admin</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6 bg-slate-950/50 rounded-b-xl mt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!email}
                            className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-not-allowed transition-colors"
                        >
                            Send Invitation
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteMemberModal;
