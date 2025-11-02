import React, { useMemo } from 'react';
import { Referral, User, ReferralStatus } from '../types';
import Card from './Card';
import { GiftIcon, CheckCircleIcon, ClockIcon } from './icons';

interface ReferralsProps {
    referrals: Referral[];
    user: User | null;
    showToast: (message: string) => void;
}

const StatCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
    <Card className="text-center">
        <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h4>
        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{value}</p>
    </Card>
);

const StatusBadge: React.FC<{ status: ReferralStatus }> = ({ status }) => {
    const styles = {
        joined: { icon: <ClockIcon className="h-4 w-4" />, text: 'text-yellow-700 dark:text-yellow-300', bg: 'bg-yellow-100 dark:bg-yellow-500/20' },
        paid: { icon: <ClockIcon className="h-4 w-4" />, text: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-100 dark:bg-blue-500/20' },
        rewarded: { icon: <CheckCircleIcon className="h-4 w-4" />, text: 'text-green-700 dark:text-green-300', bg: 'bg-green-100 dark:bg-green-500/20' },
    };
    const { icon, text, bg } = styles[status];
    const statusText = status === 'paid' ? 'First Payment Made' : status;

    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
            {icon}
            <span className="capitalize">{statusText}</span>
        </div>
    );
};

const Referrals: React.FC<ReferralsProps> = ({ referrals, user, showToast }) => {

    const referralLink = `https://loopwise.app/join?ref=${user?.username || 'user123'}`;

    const stats = useMemo(() => {
        const friendsJoined = referrals.length;
        const rewardsEarned = referrals.filter(r => r.status === 'rewarded').reduce((acc, r) => acc + r.rewardAmount, 0);
        const pendingRewards = referrals.filter(r => r.status === 'paid').reduce((acc, r) => acc + r.rewardAmount, 0);
        return { friendsJoined, rewardsEarned, pendingRewards };
    }, [referrals]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        showToast('Referral link copied!');
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <GiftIcon className="w-12 h-12 mx-auto text-primary-500" />
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Refer a Friend, Earn Rewards</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                    Invite a friend to Loopwise, and you'll both receive <span className="font-bold text-primary-500">$10 in USDC</span> when they make their first payment.
                </p>
            </div>

            <Card>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Your Referral Link</h3>
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        readOnly
                        value={referralLink}
                        className="flex-grow px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md font-mono text-sm text-slate-600 dark:text-slate-400"
                    />
                    <button onClick={copyToClipboard} className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors">
                        Copy Link
                    </button>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Friends Joined" value={String(stats.friendsJoined)} />
                <StatCard title="Rewards Earned" value={`$${stats.rewardsEarned.toFixed(2)}`} />
                <StatCard title="Pending Rewards" value={`$${stats.pendingRewards.toFixed(2)}`} />
            </div>
            
            <Card title="Your Referrals" className="p-0 sm:p-0">
                 {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Friend</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date Joined</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Reward</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                            {referrals.map((referral) => (
                                <tr key={referral.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{referral.friendEmail}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(referral.dateJoined).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={referral.status} /></td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${referral.status === 'rewarded' ? 'text-green-500' : 'text-slate-500 dark:text-slate-400'}`}>
                                        ${referral.rewardAmount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Mobile Card View */}
                <div className="md:hidden">
                    <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                        {referrals.map((referral) => (
                            <li key={referral.id} className="p-4 space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">{referral.friendEmail}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Joined: {new Date(referral.dateJoined).toLocaleDateString()}</p>
                                    </div>
                                    <p className={`font-medium ${referral.status === 'rewarded' ? 'text-green-500' : 'text-slate-500 dark:text-slate-400'}`}>
                                        ${referral.rewardAmount.toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <StatusBadge status={referral.status} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </Card>

        </div>
    );
};

export default Referrals;