import React, { useState, useRef, useEffect } from 'react';
import { TeamMember } from '../types';
import Card from './Card';
import { PlusIcon, MoreHorizontalIcon } from './icons';

interface TeamProps {
    teamMembers: TeamMember[];
    onInviteClick: () => void;
    onRemoveMember: (memberId: string) => void;
    onResendInvite: (email: string) => void;
}

const RoleBadge: React.FC<{ role: TeamMember['role'] }> = ({ role }) => {
    const isOwner = role === 'Admin';
    const style = isOwner
        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300'
        : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${style}`}>
            {role}
        </span>
    );
};

const StatusBadge: React.FC<{ status: TeamMember['status'] }> = ({ status }) => {
    const isActive = status === 'active';
    const style = isActive
        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${style}`}>
            {status}
        </span>
    );
};

const ActionMenu: React.FC<{ member: TeamMember, onRemove: () => void, onResend: () => void, onClose: () => void }> = ({ member, onRemove, onResend, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div ref={menuRef} className="absolute right-0 top-full z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-slate-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-slate-700 focus:outline-none animate-scale-in">
            {member.status === 'pending' && (
                 <button onClick={() => { onResend(); onClose(); }} className="w-full text-left block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Resend Invite</button>
            )}
             <button onClick={() => { onRemove(); onClose(); }} className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">Remove Member</button>
        </div>
    );
};


const Team: React.FC<TeamProps> = ({ teamMembers, onInviteClick, onRemoveMember, onResendInvite }) => {
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Team Management</h2>
                    <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                        Invite and manage your family or team members.
                    </p>
                </div>
                <button onClick={onInviteClick} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors shadow-sm">
                    <PlusIcon className="w-5 h-5" />
                    <span>Invite Member</span>
                </button>
            </div>

            <Card title="Team Members" className="p-0 sm:p-0">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                            {teamMembers.map((member, index) => (
                                <tr key={member.id} className="animate-fade-in hover:bg-slate-50 dark:hover:bg-slate-800/50" style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-slate-900 dark:text-white">{member.name}</div>
                                                <div className="text-sm text-slate-500 dark:text-slate-400">{member.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={member.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <RoleBadge role={member.role} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                                        <button onClick={() => setActiveMenuId(activeMenuId === member.id ? null : member.id)} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 p-1 rounded-full transition-colors">
                                            <MoreHorizontalIcon className="w-5 h-5" />
                                        </button>
                                        {activeMenuId === member.id && (
                                            <ActionMenu 
                                                member={member}
                                                onRemove={() => onRemoveMember(member.id)}
                                                onResend={() => onResendInvite(member.email)}
                                                onClose={() => setActiveMenuId(null)}
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden">
                    <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                        {teamMembers.map((member) => (
                            <li key={member.id} className="p-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">{member.name}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{member.email}</p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <button onClick={() => setActiveMenuId(activeMenuId === member.id ? null : member.id)} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 p-1 rounded-full transition-colors">
                                            <MoreHorizontalIcon className="w-5 h-5" />
                                        </button>
                                        {activeMenuId === member.id && (
                                            <ActionMenu member={member} onRemove={() => onRemoveMember(member.id)} onResend={() => onResendInvite(member.email)} onClose={() => setActiveMenuId(null)} />
                                        )}
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    <StatusBadge status={member.status} />
                                    <RoleBadge role={member.role} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </Card>
        </div>
    );
};

export default Team;