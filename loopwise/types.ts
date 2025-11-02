


export type Plan = {
    id: string;
    name: string;
    monthlyCost: number;
    features: string[];
};

export type User = {
  id: string;
  address: string;
  displayName: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  balances: { [key: string]: number };
  avatarUrl?: string;
  walletId: string;
};

export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';

export type Subscription = {
  id: string;
  name: string;
  provider: string;
  status: SubscriptionStatus;
  category: string;
  usageScore: number;
  lastPayment: string;
  nextPayment: string;
  currentPlanId: string;
  availablePlans: Plan[];
  imageUrl?: string;
};

export type Transaction = {
    id: string;
    type: 'payment' | 'refund' | 'transfer' | 'deposit';
    status: 'completed' | 'pending' | 'failed';
    amount: number;
    currency: 'USDC';
    description: string;
    timestamp: string;
    txId: string;
    notes?: string;
    category: string;
};

export type AiSuggestion = {
    id: string;
    type: 'cancel_low_usage' | 'merge_subscriptions' | 'change_plan';
    title: string;
    description: string;
    confidence: number;
    estimatedSavings: number;
    subscriptionId?: string;
};

export type View = 'dashboard' | 'subscriptions' | 'payments' | 'audit' | 'team' | 'referrals' | 'help' | 'settings';

export type AiAction = {
    type: 'navigate' | 'change_status';
    payload: {
        view?: View;
        subscriptionId?: string;
        status?: SubscriptionStatus;
    };
};

export type Message = {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
    suggestions?: string[];
    action?: AiAction;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Member';
  status: 'active' | 'pending';
};

export type Session = {
    id: string;
    device: string;
    location: string;
    lastActive: string;
    isCurrent: boolean;
};

export type ReferralStatus = 'joined' | 'paid' | 'rewarded';

export type Referral = {
    id: string;
    friendEmail: string;
    dateJoined: string;
    status: ReferralStatus;
    rewardAmount: number;
};

export type NotificationType = 'subscription' | 'payment' | 'transfer' | 'security' | 'suggestion' | 'team';

export type Notification = {
  id: string;
  message: string;
  timestamp: string;
  type: NotificationType;
  read: boolean;
};

export type NotificationSettings = {
    monthlyReports: boolean;
    aiSuggestions: boolean;
    securityAlerts: boolean;
};

export type Preferences = {
    language: string;
    timeZone: string;
    theme: 'light' | 'dark' | 'system';
};

export type ChangelogItem = {
    type: 'new' | 'improvement' | 'fix';
    description: string;
};

export type ChangelogEntry = {
    version: string;
    date: string;
    items: ChangelogItem[];
};