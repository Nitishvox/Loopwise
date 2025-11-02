import { User, Subscription, AiSuggestion, Transaction, Message, TeamMember, Session, Plan, Referral, AiAction, View, SubscriptionStatus, ChangelogEntry } from '../types';
import Groq from 'groq-sdk';

// Use the provided API key directly to make the AI Assistant functional.
const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey, dangerouslyAllowBrowser: true }) : null;


export const generateId = (prefix: string) => `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
export const generateTxId = () => `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;


let mockUser: User = {
    id: "user_123",
    address: "0xAB...12",
    displayName: "Alex Rivera",
    username: "alex_rivera",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    bio: "DeFi enthusiast and lead developer at a startup. Focused on building the future of finance with decentralized applications.",
    balances: { "USDC": 10000.00 },
    avatarUrl: undefined,
    walletId: "c7b0f7a7-1d89-4a7b-8a8b-0a7c6f1d2e3f", // Example Circle Wallet ID
};

const existingUsernames = ['alex_rivera', 'jordan_lee', 'casey_smith', 'admin', 'root'];

const streamingPlans: Plan[] = [
    { id: 'plan_stream_basic', name: 'Basic HD', monthlyCost: 9.99, features: ['720p Streaming', '1 Screen'] },
    { id: 'plan_stream_pro', name: 'Pro 4K', monthlyCost: 15.99, features: ['4K Streaming', '4 Screens', 'Offline Downloads'] },
];
const devtoolsPlans: Plan[] = [
    { id: 'plan_devtools_basic', name: 'Basic', monthlyCost: 15.00, features: ['Core Tools', 'Community Support'] },
    { id: 'plan_devtools_pro', name: 'Pro', monthlyCost: 25.00, features: ['Advanced Tools', 'Priority Support', 'Team Collaboration'] },
];
const storagePlans: Plan[] = [
    { id: 'plan_storage_1tb', name: '1TB', monthlyCost: 12.50, features: ['1TB Storage', 'File Sharing'] },
    { id: 'plan_storage_5tb', name: '5TB', monthlyCost: 49.99, features: ['5TB Storage', 'Advanced Sharing', 'Encryption'] },
];
const netflixPlans: Plan[] = [
    { id: 'plan_netflix_basic', name: 'Basic', monthlyCost: 9.99, features: ['480p', '1 Screen'] },
    { id: 'plan_netflix_standard', name: 'Standard', monthlyCost: 15.49, features: ['1080p', '2 Screens'] },
    { id: 'plan_netflix_premium', name: 'Premium', monthlyCost: 19.99, features: ['4K+HDR', '4 Screens'] },
];
const spotifyPlans: Plan[] = [
    { id: 'plan_spotify_individual', name: 'Individual', monthlyCost: 9.99, features: ['Ad-free music', 'Offline listening'] },
    { id: 'plan_spotify_duo', name: 'Duo', monthlyCost: 12.99, features: ['2 Premium accounts'] },
    { id: 'plan_spotify_family', name: 'Family', monthlyCost: 15.99, features: ['6 Premium accounts'] },
];
const youtubePlans: Plan[] = [
    { id: 'plan_youtube_individual', name: 'Individual', monthlyCost: 11.99, features: ['Ad-free', 'Background play'] },
    { id: 'plan_youtube_family', name: 'Family', monthlyCost: 22.99, features: ['5 members'] },
];
const disneyPlans: Plan[] = [
    { id: 'plan_disney_basic', name: 'Basic (with ads)', monthlyCost: 7.99, features: ['Ad-supported'] },
    { id: 'plan_disney_premium', name: 'Premium', monthlyCost: 10.99, features: ['Ad-free', 'Downloads'] },
];
const primePlans: Plan[] = [
    { id: 'plan_prime_monthly', name: 'Monthly', monthlyCost: 14.99, features: ['Prime Video', 'Prime Music', 'Free Shipping'] },
    { id: 'plan_prime_annual', name: 'Annual', monthlyCost: 139.00 / 12, features: ['All Prime benefits'] },
];
const adobePlans: Plan[] = [
    { id: 'plan_adobe_photo', name: 'Photography', monthlyCost: 9.99, features: ['Photoshop', 'Lightroom'] },
    { id: 'plan_adobe_all', name: 'All Apps', monthlyCost: 54.99, features: ['20+ Creative Cloud apps'] },
];
const nikePlans: Plan[] = [
    { id: 'plan_nike_premium', name: 'Premium', monthlyCost: 14.99, features: ['Guided Workouts', 'Training Plans'] },
];
const facebookPlans: Plan[] = [
    { id: 'plan_facebook_blue', name: 'Blue', monthlyCost: 11.99, features: ['Verified Badge', 'Proactive Protection'] },
];
const hboPlans: Plan[] = [
    { id: 'plan_hbo_ads', name: 'With Ads', monthlyCost: 9.99, features: ['1080p', '2 Screens'] },
    { id: 'plan_hbo_adfree', name: 'Ad-Free', monthlyCost: 15.99, features: ['4K UHD', '4 Screens', 'Downloads'] },
];
const notionPlans: Plan[] = [
    { id: 'plan_notion_plus', name: 'Plus', monthlyCost: 8.00, features: ['Unlimited blocks', 'File uploads'] },
    { id: 'plan_notion_business', name: 'Business', monthlyCost: 15.00, features: ['SAML SSO', 'Private teamspaces'] },
];
const office365Plans: Plan[] = [
    { id: 'plan_office_personal', name: 'Personal', monthlyCost: 6.99, features: ['Word, Excel, PPT', '1TB OneDrive'] },
    { id: 'plan_office_family', name: 'Family', monthlyCost: 9.99, features: ['Up to 6 people', '6TB OneDrive'] },
];
const dropboxPlans: Plan[] = [
    { id: 'plan_dropbox_plus', name: 'Plus', monthlyCost: 9.99, features: ['2TB storage'] },
    { id: 'plan_dropbox_professional', name: 'Professional', monthlyCost: 16.58, features: ['3TB storage', 'Advanced sharing'] },
];
const PlayStationPlans: Plan[] = [
    { id: 'plan_ps_essential', name: 'Essential', monthlyCost: 9.99, features: ['Online multiplayer', 'Monthly games'] },
    { id: 'plan_ps_extra', name: 'Extra', monthlyCost: 14.99, features: ['Game Catalog'] },
    { id: 'plan_ps_premium', name: 'Premium', monthlyCost: 17.99, features: ['Cloud streaming', 'Classics'] },
];
const xboxPlans: Plan[] = [
    { id: 'plan_xbox_core', name: 'Core', monthlyCost: 9.99, features: ['Online multiplayer'] },
    { id: 'plan_xbox_ultimate', name: 'Ultimate', monthlyCost: 16.99, features: ['Game Pass', 'EA Play'] },
];
const wsjPlans: Plan[] = [
    { id: 'plan_wsj_digital', name: 'Digital', monthlyCost: 9.99, features: ['Unlimited digital access'] },
];
const slackPlans: Plan[] = [
    { id: 'plan_slack_pro', name: 'Pro', monthlyCost: 8.75, features: ['Unlimited message history', 'Huddles'] },
    { id: 'plan_slack_business', name: 'Business+', monthlyCost: 15.00, features: ['Advanced identity management', 'Data exports'] },
];
const zoomPlans: Plan[] = [
    { id: 'plan_zoom_pro', name: 'Pro', monthlyCost: 15.99, features: ['Up to 100 participants', 'Group meetings up to 30 hours'] },
    { id: 'plan_zoom_business', name: 'Business', monthlyCost: 19.99, features: ['Up to 300 participants', 'Company branding'] },
];
const githubPlans: Plan[] = [
    { id: 'plan_github_pro', name: 'Pro', monthlyCost: 4.00, features: ['Unlimited public/private repos', '3,000 CI/CD minutes'] },
    { id: 'plan_github_team', name: 'Team', monthlyCost: 21.00, features: ['Protected branches', 'Draft pull requests'] },
];
const figmaPlans: Plan[] = [
    { id: 'plan_figma_pro', name: 'Professional', monthlyCost: 12.00, features: ['Unlimited files', 'Sharing permissions'] },
    { id: 'plan_figma_org', name: 'Organization', monthlyCost: 45.00, features: ['Org-wide libraries', 'Centralized file management'] },
];
const canvaPlans: Plan[] = [
    { id: 'plan_canva_pro', name: 'Pro', monthlyCost: 12.99, features: ['Premium templates', 'Brand Kit'] },
    { id: 'plan_canva_teams', name: 'Teams', monthlyCost: 14.99, features: ['Real-time collaboration', 'Team reports'] },
];
const nytPlans: Plan[] = [
    { id: 'plan_nyt_access', name: 'All Access', monthlyCost: 25.00, features: ['News, Games, Cooking, Wirecutter'] },
];
const athleticPlans: Plan[] = [
    { id: 'plan_athletic_annual', name: 'Annual', monthlyCost: 72.00 / 12, features: ['Ad-free access', 'All sports coverage'] },
];
const appleMusicPlans: Plan[] = [
    { id: 'plan_apple_individual', name: 'Individual', monthlyCost: 10.99, features: ['100 million songs', 'Lossless audio'] },
    { id: 'plan_apple_family', name: 'Family', monthlyCost: 16.99, features: ['Up to 6 accounts', 'Personal libraries'] },
];
const audiblePlans: Plan[] = [
    { id: 'plan_audible_plus', name: 'Premium Plus', monthlyCost: 14.95, features: ['1 credit per month', 'Plus Catalog'] },
];
const pelotonPlans: Plan[] = [
    { id: 'plan_peloton_one', name: 'App One', monthlyCost: 12.99, features: ['Strength, Cardio, Yoga classes'] },
    { id: 'plan_peloton_plus', name: 'App+', monthlyCost: 24.00, features: ['Bike, Tread, and Row classes'] },
];
const stravaPlans: Plan[] = [
    { id: 'plan_strava_premium', name: 'Premium', monthlyCost: 11.99, features: ['Route planning', 'Segment competition'] },
];
const uberOnePlans: Plan[] = [
    { id: 'plan_uberone_monthly', name: 'Monthly', monthlyCost: 9.99, features: ['$0 delivery fee', '5% off rides'] },
];
const dashpassPlans: Plan[] = [
    { id: 'plan_dashpass_monthly', name: 'Monthly', monthlyCost: 9.99, features: ['$0 delivery fee on eligible orders'] },
];
const nintendoOnlinePlans: Plan[] = [
    { id: 'plan_nintendo_individual', name: 'Individual', monthlyCost: 19.99 / 12, features: ['Online play', 'NES/SNES games'] },
    { id: 'plan_nintendo_family', name: 'Family + Expansion', monthlyCost: 79.99 / 12, features: ['N64/Genesis games', 'DLC access'] },
];
const masterclassPlans: Plan[] = [
    { id: 'plan_masterclass_standard', name: 'Standard', monthlyCost: 120.00 / 12, features: ['1 device', 'Offline viewing'] },
];
const linkedinPlans: Plan[] = [
    { id: 'plan_linkedin_career', name: 'Premium Career', monthlyCost: 29.99, features: ['InMail credits', 'Who viewed your profile'] },
    { id: 'plan_linkedin_business', name: 'Premium Business', monthlyCost: 59.99, features: ['Unlimited people browsing', 'Business insights'] },
];
const headspacePlans: Plan[] = [
    { id: 'plan_headspace_monthly', name: 'Monthly', monthlyCost: 12.99, features: ['Guided meditations', 'Sleep sounds'] },
    { id: 'plan_headspace_annual', name: 'Annual', monthlyCost: 69.99 / 12, features: ['Full library access'] },
];
const courseraPlans: Plan[] = [
    { id: 'plan_coursera_plus', name: 'Coursera Plus', monthlyCost: 59.00, features: ['7,000+ courses', 'Professional Certificates'] },
];
const skillsharePlans: Plan[] = [
    { id: 'plan_skillshare_premium', name: 'Premium', monthlyCost: 29.00, features: ['Unlimited classes', 'Offline access'] },
];
const huluPlans: Plan[] = [
    { id: 'plan_hulu_ads', name: 'With Ads', monthlyCost: 7.99, features: ['Streaming library with ads'] },
    { id: 'plan_hulu_noads', name: 'No Ads', monthlyCost: 17.99, features: ['Ad-free streaming library', 'Downloads'] },
];
const vpnPlans: Plan[] = [
    { id: 'plan_vpn_monthly', name: 'Monthly', monthlyCost: 12.95, features: ['High-speed VPN', 'All platforms'] },
];
const tidalPlans: Plan[] = [
    { id: 'plan_tidal_hifi', name: 'HiFi', monthlyCost: 10.99, features: ['10 million+ songs', 'CD Quality Audio'] },
    { id: 'plan_tidal_hifiplus', name: 'HiFi Plus', monthlyCost: 19.99, features: ['HiRes FLAC & Dolby Atmos'] },
];
const economistPlans: Plan[] = [
    { id: 'plan_economist_digital', name: 'Digital', monthlyCost: 21.50, features: ['Full digital access', 'The Economist app'] },
];
const grammarlyPlans: Plan[] = [
    { id: 'plan_grammarly_premium', name: 'Premium', monthlyCost: 30.00, features: ['Clarity & tone adjustments', 'Plagiarism detection'] },
];
const blinkistPlans: Plan[] = [
    { id: 'plan_blinkist_premium', name: 'Premium', monthlyCost: 15.99, features: ['Unlimited access to all Blinks', 'Offline access'] },
];

const mockSubscriptions: Subscription[] = [
    { id: "sub_001", name: "Streaming Plus", provider: "stream.plus", status: "active", category: "Entertainment", usageScore: 0.32, lastPayment: "2025-10-12T08:30:00Z", nextPayment: "2025-11-12T08:30:00Z", currentPlanId: 'plan_stream_basic', availablePlans: streamingPlans },
    { id: "sub_002", name: "DevTools Pro", provider: "devtools.pro", status: "active", category: "Productivity", usageScore: 0.95, lastPayment: "2025-10-15T12:00:00Z", nextPayment: "2025-11-15T12:00:00Z", currentPlanId: 'plan_devtools_pro', availablePlans: devtoolsPlans, imageUrl: 'https://placehold.co/40x40/000000/FFFFFF?text=DTP' },
    { id: "sub_003", name: "Cloud Storage 1TB", provider: "cloud.io", status: "paused", category: "Utilities", usageScore: 0.10, lastPayment: "2025-09-20T10:00:00Z", nextPayment: "N/A", currentPlanId: 'plan_storage_1tb', availablePlans: storagePlans },
    { id: "sub_004", name: "Gym Membership", provider: "fitclub.com", status: "active", category: "Health", usageScore: 0.88, lastPayment: "2025-10-01T06:00:00Z", nextPayment: "2025-11-01T06:00:00Z", currentPlanId: 'plan_gym_01', availablePlans: [{ id: 'plan_gym_01', name: 'Standard', monthlyCost: 45.00, features: ['Full Access'] }], imageUrl: 'https://placehold.co/40x40/FF6347/FFFFFF?text=G' },
    { id: "sub_005", name: "Gourmet Coffee Box", provider: "roasters.inc", status: "cancelled", category: "Lifestyle", usageScore: 0, lastPayment: "2025-8-05T09:00:00Z", nextPayment: "N/A", currentPlanId: 'plan_coffee_01', availablePlans: [{ id: 'plan_coffee_01', name: 'Standard Box', monthlyCost: 19.99, features: ['Monthly Delivery'] }] },
    { id: "sub_006", name: "Music Unlimited", provider: "soundwave.io", status: "active", category: "Entertainment", usageScore: 0.75, lastPayment: "2025-10-22T11:00:00Z", nextPayment: "2025-11-22T11:00:00Z", currentPlanId: 'plan_music_01', availablePlans: [{ id: 'plan_music_01', name: 'Premium', monthlyCost: 14.99, features: ['Ad-free', 'Offline Listening'] }] },
    { id: "sub_007", name: "Netflix", provider: "netflix.com", status: "active", category: "Entertainment", usageScore: 0.90, lastPayment: "2025-10-20T00:00:00Z", nextPayment: "2025-11-20T00:00:00Z", currentPlanId: 'plan_netflix_premium', availablePlans: netflixPlans, imageUrl: 'https://placehold.co/40x40/E50914/FFFFFF?text=N' },
    { id: "sub_008", name: "Spotify", provider: "spotify.com", status: "active", category: "Entertainment", usageScore: 0.85, lastPayment: "2025-10-18T00:00:00Z", nextPayment: "2025-11-18T00:00:00Z", currentPlanId: 'plan_spotify_individual', availablePlans: spotifyPlans, imageUrl: 'https://placehold.co/40x40/1DB954/FFFFFF?text=S' },
    { id: "sub_009", name: "YouTube Premium", provider: "youtube.com", status: "paused", category: "Entertainment", usageScore: 0.40, lastPayment: "2025-09-25T00:00:00Z", nextPayment: "N/A", currentPlanId: 'plan_youtube_individual', availablePlans: youtubePlans, imageUrl: 'https://placehold.co/40x40/FF0000/FFFFFF?text=YT' },
    { id: "sub_010", name: "Disney+", provider: "disneyplus.com", status: "active", category: "Entertainment", usageScore: 0.65, lastPayment: "2025-10-14T00:00:00Z", nextPayment: "2025-11-14T00:00:00Z", currentPlanId: 'plan_disney_premium', availablePlans: disneyPlans, imageUrl: 'https://placehold.co/40x40/113CC2/FFFFFF?text=D%2B' },
    { id: "sub_011", name: "Amazon Prime", provider: "amazon.com", status: "active", category: "Lifestyle", usageScore: 0.98, lastPayment: "2025-10-03T00:00:00Z", nextPayment: "2025-11-03T00:00:00Z", currentPlanId: 'plan_prime_monthly', availablePlans: primePlans, imageUrl: 'https://placehold.co/40x40/00A8E1/FFFFFF?text=P' },
    { id: "sub_012", name: "Adobe Creative Cloud", provider: "adobe.com", status: "active", category: "Productivity", usageScore: 0.78, lastPayment: "2025-10-19T00:00:00Z", nextPayment: "2025-11-19T00:00:00Z", currentPlanId: 'plan_adobe_all', availablePlans: adobePlans, imageUrl: 'https://placehold.co/40x40/FF0000/FFFFFF?text=A' },
    { id: "sub_013", name: "Nike Training Club", provider: "nike.com", status: "cancelled", category: "Health", usageScore: 0, lastPayment: "2025-08-11T00:00:00Z", nextPayment: "N/A", currentPlanId: 'plan_nike_premium', availablePlans: nikePlans, imageUrl: 'https://placehold.co/40x40/000000/FFFFFF?text=NTC' },
    { id: "sub_014", name: "Facebook Blue", provider: "facebook.com", status: "active", category: "Social", usageScore: 0.20, lastPayment: "2025-10-21T00:00:00Z", nextPayment: "2025-11-21T00:00:00Z", currentPlanId: 'plan_facebook_blue', availablePlans: facebookPlans, imageUrl: 'https://placehold.co/40x40/1877F2/FFFFFF?text=F' },
    { id: "sub_015", name: "HBO Max", provider: "hbo.com", status: "active", category: "Entertainment", usageScore: 0.72, lastPayment: "2025-10-23T00:00:00Z", nextPayment: "2025-11-23T00:00:00Z", currentPlanId: 'plan_hbo_adfree', availablePlans: hboPlans, imageUrl: 'https://placehold.co/40x40/7E22CE/FFFFFF?text=HBO' },
    { id: "sub_016", name: "Notion", provider: "notion.so", status: "active", category: "Productivity", usageScore: 0.99, lastPayment: "2025-10-17T00:00:00Z", nextPayment: "2025-11-17T00:00:00Z", currentPlanId: 'plan_notion_plus', availablePlans: notionPlans, imageUrl: 'https://placehold.co/40x40/000000/FFFFFF?text=N' },
    { id: "sub_017", name: "Microsoft 365", provider: "microsoft.com", status: "active", category: "Productivity", usageScore: 0.60, lastPayment: "2025-10-08T00:00:00Z", nextPayment: "2025-11-08T00:00:00Z", currentPlanId: 'plan_office_family', availablePlans: office365Plans, imageUrl: 'https://placehold.co/40x40/DC3E1A/FFFFFF?text=O' },
    { id: "sub_018", name: "Dropbox", provider: "dropbox.com", status: "cancelled", category: "Productivity", usageScore: 0, lastPayment: "2025-07-30T00:00:00Z", nextPayment: "N/A", currentPlanId: 'plan_dropbox_plus', availablePlans: dropboxPlans, imageUrl: 'https://placehold.co/40x40/0061FF/FFFFFF?text=Db' },
    { id: "sub_019", name: "PlayStation Plus", provider: "playstation.com", status: "active", category: "Gaming", usageScore: 0.88, lastPayment: "2025-10-09T00:00:00Z", nextPayment: "2025-11-09T00:00:00Z", currentPlanId: 'plan_ps_premium', availablePlans: PlayStationPlans, imageUrl: 'https://placehold.co/40x40/0070D1/FFFFFF?text=PS' },
    { id: "sub_020", name: "Xbox Game Pass", provider: "xbox.com", status: "active", category: "Gaming", usageScore: 0.91, lastPayment: "2025-10-10T00:00:00Z", nextPayment: "2025-11-10T00:00:00Z", currentPlanId: 'plan_xbox_ultimate', availablePlans: xboxPlans, imageUrl: 'https://placehold.co/40x40/107C10/FFFFFF?text=X' },
    { id: "sub_021", name: "Wall Street Journal", provider: "wsj.com", status: "paused", category: "News", usageScore: 0.15, lastPayment: "2025-09-01T00:00:00Z", nextPayment: "N/A", currentPlanId: 'plan_wsj_digital', availablePlans: wsjPlans, imageUrl: 'https://placehold.co/40x40/000000/FFFFFF?text=WSJ' },
    { id: "sub_022", name: "Slack", provider: "slack.com", status: "active", category: "Productivity", usageScore: 0.95, lastPayment: "2025-10-20T00:00:00Z", nextPayment: "2025-11-20T00:00:00Z", currentPlanId: 'plan_slack_pro', availablePlans: slackPlans, imageUrl: 'https://placehold.co/40x40/4A154B/FFFFFF?text=S' },
    { id: "sub_023", name: "Zoom", provider: "zoom.us", status: "active", category: "Productivity", usageScore: 0.55, lastPayment: "2025-10-18T00:00:00Z", nextPayment: "2025-11-18T00:00:00Z", currentPlanId: 'plan_zoom_pro', availablePlans: zoomPlans, imageUrl: 'https://placehold.co/40x40/2D8CFF/FFFFFF?text=Z' },
    { id: "sub_024", name: "GitHub", provider: "github.com", status: "active", category: "Productivity", usageScore: 0.99, lastPayment: "2025-10-25T00:00:00Z", nextPayment: "2025-11-25T00:00:00Z", currentPlanId: 'plan_github_pro', availablePlans: githubPlans, imageUrl: 'https://placehold.co/40x40/181717/FFFFFF?text=GH' },
    { id: "sub_025", name: "Figma", provider: "figma.com", status: "active", category: "Productivity", usageScore: 0.80, lastPayment: "2025-10-14T00:00:00Z", nextPayment: "2025-11-14T00:00:00Z", currentPlanId: 'plan_figma_pro', availablePlans: figmaPlans, imageUrl: 'https://placehold.co/40x40/F24E1E/FFFFFF?text=F' },
    { id: "sub_026", name: "Canva", provider: "canva.com", status: "cancelled", category: "Productivity", usageScore: 0, lastPayment: "2025-08-01T00:00:00Z", nextPayment: "N/A", currentPlanId: 'plan_canva_pro', availablePlans: canvaPlans, imageUrl: 'https://placehold.co/40x40/00C4CC/FFFFFF?text=C' },
    { id: "sub_027", name: "The New York Times", provider: "nytimes.com", status: "active", category: "News", usageScore: 0.70, lastPayment: "2025-10-05T00:00:00Z", nextPayment: "2025-11-05T00:00:00Z", currentPlanId: 'plan_nyt_access', availablePlans: nytPlans, imageUrl: 'https://placehold.co/40x40/000000/FFFFFF?text=NYT' },
    { id: "sub_028", name: "The Athletic", provider: "theathletic.com", status: "active", category: "News", usageScore: 0.65, lastPayment: "2025-10-06T00:00:00Z", nextPayment: "2025-11-06T00:00:00Z", currentPlanId: 'plan_athletic_annual', availablePlans: athleticPlans, imageUrl: 'https://placehold.co/40x40/0096FF/FFFFFF?text=A' },
    { id: "sub_029", name: "Apple Music", provider: "apple.com", status: "active", category: "Entertainment", usageScore: 0.75, lastPayment: "2025-10-11T00:00:00Z", nextPayment: "2025-11-11T00:00:00Z", currentPlanId: 'plan_apple_individual', availablePlans: appleMusicPlans, imageUrl: 'https://placehold.co/40x40/FA5864/FFFFFF?text=A' },
    { id: "sub_030", name: "Audible", provider: "audible.com", status: "paused", category: "Entertainment", usageScore: 0.25, lastPayment: "2025-09-13T00:00:00Z", nextPayment: "N/A", currentPlanId: 'plan_audible_plus', availablePlans: audiblePlans, imageUrl: 'https://placehold.co/40x40/F8991D/FFFFFF?text=A' },
    { id: "sub_031", name: "Peloton", provider: "onepeloton.com", status: "active", category: "Health", usageScore: 0.85, lastPayment: "2025-10-16T00:00:00Z", nextPayment: "2025-11-16T00:00:00Z", currentPlanId: 'plan_peloton_one', availablePlans: pelotonPlans, imageUrl: 'https://placehold.co/40x40/000000/FFFFFF?text=P' },
    { id: "sub_032", name: "Strava", provider: "strava.com", status: "active", category: "Health", usageScore: 0.90, lastPayment: "2025-10-17T00:00:00Z", nextPayment: "2025-11-17T00:00:00Z", currentPlanId: 'plan_strava_premium', availablePlans: stravaPlans, imageUrl: 'https://placehold.co/40x40/FC4C02/FFFFFF?text=S' },
    { id: "sub_033", name: "Uber One", provider: "uber.com", status: "active", category: "Lifestyle", usageScore: 0.60, lastPayment: "2025-10-24T00:00:00Z", nextPayment: "2025-11-24T00:00:00Z", currentPlanId: 'plan_uberone_monthly', availablePlans: uberOnePlans, imageUrl: 'https://placehold.co/40x40/000000/FFFFFF?text=U' },
    { id: "sub_034", name: "DashPass", provider: "doordash.com", status: "cancelled", category: "Lifestyle", usageScore: 0, lastPayment: "2025-08-26T00:00:00Z", nextPayment: "N/A", currentPlanId: 'plan_dashpass_monthly', availablePlans: dashpassPlans, imageUrl: 'https://placehold.co/40x40/FF3008/FFFFFF?text=D' },
    { id: "sub_035", name: "Nintendo Switch Online", provider: "nintendo.com", status: "active", category: "Gaming", usageScore: 0.50, lastPayment: "2025-10-27T00:00:00Z", nextPayment: "2025-11-27T00:00:00Z", currentPlanId: 'plan_nintendo_family', availablePlans: nintendoOnlinePlans, imageUrl: 'https://placehold.co/40x40/E60012/FFFFFF?text=N' },
    { id: "sub_036", name: "MasterClass", provider: "masterclass.com", status: "cancelled", category: "Education", usageScore: 0, lastPayment: "2025-07-15T00:00:00Z", nextPayment: "N/A", currentPlanId: 'plan_masterclass_standard', availablePlans: masterclassPlans, imageUrl: 'https://placehold.co/40x40/000000/FFFFFF?text=MC' },
    { id: "sub_037", name: "LinkedIn Premium", provider: "linkedin.com", status: "active", category: "Productivity", usageScore: 0.8, lastPayment: "2025-10-28T00:00:00Z", nextPayment: "2025-11-28T00:00:00Z", currentPlanId: 'plan_linkedin_career', availablePlans: linkedinPlans, imageUrl: 'https://placehold.co/40x40/0A66C2/FFFFFF?text=In' },
    { id: "sub_038", name: "Headspace", provider: "headspace.com", status: "active", category: "Health", usageScore: 0.7, lastPayment: "2025-10-29T00:00:00Z", nextPayment: "2025-11-29T00:00:00Z", currentPlanId: 'plan_headspace_monthly', availablePlans: headspacePlans, imageUrl: 'https://placehold.co/40x40/F47D31/FFFFFF?text=H' },
    { id: "sub_039", name: "Coursera Plus", provider: "coursera.org", status: "paused", category: "Education", usageScore: 0.3, lastPayment: "2025-09-10T00:00:00Z", nextPayment: "N/A", currentPlanId: 'plan_coursera_plus', availablePlans: courseraPlans, imageUrl: 'https://placehold.co/40x40/0056D2/FFFFFF?text=C' },
    { id: "sub_040", name: "Skillshare", provider: "skillshare.com", status: "active", category: "Education", usageScore: 0.6, lastPayment: "2025-10-15T00:00:00Z", nextPayment: "2025-11-15T00:00:00Z", currentPlanId: 'plan_skillshare_premium', availablePlans: skillsharePlans, imageUrl: 'https://placehold.co/40x40/00FF7F/FFFFFF?text=S' },
    { id: "sub_041", name: "Hulu", provider: "hulu.com", status: "active", category: "Entertainment", usageScore: 0.85, lastPayment: "2025-10-18T00:00:00Z", nextPayment: "2025-11-18T00:00:00Z", currentPlanId: 'plan_hulu_noads', availablePlans: huluPlans, imageUrl: 'https://placehold.co/40x40/1CE783/FFFFFF?text=h' },
    { id: "sub_042", name: "ExpressVPN", provider: "expressvpn.com", status: "active", category: "Utilities", usageScore: 0.95, lastPayment: "2025-10-20T00:00:00Z", nextPayment: "2025-11-20T00:00:00Z", currentPlanId: 'plan_vpn_monthly', availablePlans: vpnPlans, imageUrl: 'https://placehold.co/40x40/DA292C/FFFFFF?text=EV' },
    { id: "sub_043", name: "Tidal", provider: "tidal.com", status: "cancelled", category: "Entertainment", usageScore: 0, lastPayment: "2025-08-22T00:00:00Z", nextPayment: "N/A", currentPlanId: 'plan_tidal_hifi', availablePlans: tidalPlans, imageUrl: 'https://placehold.co/40x40/000000/FFFFFF?text=T' },
    { id: "sub_044", name: "The Economist", provider: "economist.com", status: "active", category: "News", usageScore: 0.5, lastPayment: "2025-10-01T00:00:00Z", nextPayment: "2025-11-01T00:00:00Z", currentPlanId: 'plan_economist_digital', availablePlans: economistPlans, imageUrl: 'https://placehold.co/40x40/E3120B/FFFFFF?text=E' },
    { id: "sub_045", name: "Grammarly", provider: "grammarly.com", status: "active", category: "Productivity", usageScore: 0.9, lastPayment: "2025-10-05T00:00:00Z", nextPayment: "2025-11-05T00:00:00Z", currentPlanId: 'plan_grammarly_premium', availablePlans: grammarlyPlans, imageUrl: 'https://placehold.co/40x40/15C39A/FFFFFF?text=G' },
    { id: "sub_046", name: "Blinkist", provider: "blinkist.com", status: "active", category: "Education", usageScore: 0.4, lastPayment: "2025-10-08T00:00:00Z", nextPayment: "2025-11-08T00:00:00Z", currentPlanId: 'plan_blinkist_premium', availablePlans: blinkistPlans, imageUrl: 'https://placehold.co/40x40/04E590/FFFFFF?text=B' },
];

const mockTransactions: Transaction[] = [
    { id: "txn_001", type: 'payment', status: 'completed', amount: 9.99, currency: 'USDC', description: 'Streaming Plus', timestamp: "2025-10-12T14:00:00Z", txId: generateTxId(), category: 'Entertainment' },
    { id: "txn_002", type: 'payment', status: 'completed', amount: 25.00, currency: 'USDC', description: 'DevTools Pro', timestamp: "2025-10-15T17:30:00Z", txId: generateTxId(), category: 'Productivity' },
    { id: "txn_003", type: 'refund', status: 'completed', amount: 12.50, currency: 'USDC', description: 'Cloud Storage 1TB', timestamp: "2025-09-21T15:30:00Z", txId: generateTxId(), category: 'Utilities' },
    { id: "txn_004", type: 'payment', status: 'completed', amount: 45.00, currency: 'USDC', description: 'Gym Membership', timestamp: "2025-10-01T11:30:00Z", txId: generateTxId(), category: 'Health' },
    { id: "txn_005", type: 'payment', status: 'completed', amount: 14.99, currency: 'USDC', description: 'Music Unlimited', timestamp: "2025-10-22T16:30:00Z", txId: generateTxId(), category: 'Entertainment' },
    { id: "txn_006", type: 'transfer', status: 'completed', amount: 50.00, currency: 'USDC', description: 'To Team Pool', timestamp: "2025-10-28T19:30:00Z", txId: generateTxId(), category: 'Transfers' },
    { id: "txn_007", type: 'payment', status: 'completed', amount: 29.99, currency: 'USDC', description: 'LinkedIn Premium', timestamp: "2025-10-28T08:00:00Z", txId: generateTxId(), category: 'Productivity' },
    { id: "txn_008", type: 'payment', status: 'completed', amount: 12.99, currency: 'USDC', description: 'Headspace', timestamp: "2025-10-29T09:00:00Z", txId: generateTxId(), category: 'Health' },
    { id: "txn_009", type: 'payment', status: 'completed', amount: 17.99, currency: 'USDC', description: 'Hulu', timestamp: "2025-10-18T10:00:00Z", txId: generateTxId(), category: 'Entertainment' },
    { id: "txn_010", type: 'payment', status: 'completed', amount: 12.95, currency: 'USDC', description: 'ExpressVPN', timestamp: "2025-10-20T11:00:00Z", txId: generateTxId(), category: 'Utilities' },
    { id: "txn_011", type: 'payment', status: 'completed', amount: 30.00, currency: 'USDC', description: 'Grammarly', timestamp: "2025-10-05T12:00:00Z", txId: generateTxId(), category: 'Productivity' },
];

const mockAiSuggestions: AiSuggestion[] = [
    { id: 'sug_001', type: 'cancel_low_usage', title: 'Cancel Streaming Plus?', description: 'AI detected low usage for Streaming Plus. Cancelling could save you 9.99 USDC/month.', confidence: 0.85, estimatedSavings: 9.99, subscriptionId: 'sub_001' },
    { id: 'sug_002', type: 'change_plan', title: 'Downgrade DevTools Pro?', description: 'You are only using 60% of the features in your DevTools Pro plan. The "Basic" plan might be a better fit.', confidence: 0.72, estimatedSavings: 10.00, subscriptionId: 'sub_002' },
];

const mockInitialMessages: Message[] = [
    {
        id: 'msg_001',
        text: 'Hello! I am your Loopwise assistant. How can I help you manage your subscriptions today?',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        suggestions: ['Show my active subscriptions', `What's my monthly spending?`, 'Cancel my Netflix subscription'],
    },
];

const mockTeam: TeamMember[] = [
    { id: 'tm_001', name: 'Alex Rivera', email: 'alex@example.com', role: 'Admin', status: 'active' },
    { id: 'tm_002', name: 'Jordan Lee', email: 'jordan@example.com', role: 'Member', status: 'active' },
    { id: 'tm_003', name: 'Casey Smith', email: 'casey@example.com', role: 'Member', status: 'pending' },
];

const mockSessions: Session[] = [
    { id: 'ses_001', device: 'Chrome on macOS', location: 'New York, NY', lastActive: 'now', isCurrent: true },
    { id: 'ses_002', device: 'iPhone 15 Pro', location: 'New York, NY', lastActive: '2 hours ago', isCurrent: false },
    { id: 'ses_003', device: 'Firefox on Windows 11', location: 'Boston, MA', lastActive: '3 days ago', isCurrent: false },
];

const mockReferrals: Referral[] = [
    { id: 'ref_001', friendEmail: 'friend1@example.com', dateJoined: '2025-10-15', status: 'rewarded', rewardAmount: 10.00 },
    { id: 'ref_002', friendEmail: 'friend2@example.com', dateJoined: '2025-10-20', status: 'paid', rewardAmount: 10.00 },
    { id: 'ref_003', friendEmail: 'friend3@example.com', dateJoined: '2025-10-25', status: 'joined', rewardAmount: 10.00 },
];

const getChatResponse = async (text: string, subscriptions: Subscription[], history: Message[]): Promise<Message> => {
    if (!groq) {
        return {
            id: generateId('msg'),
            text: "The AI Assistant is currently offline. Please configure your API key.",
            sender: 'ai',
            timestamp: new Date().toISOString(),
        };
    }

    const systemPrompt = `You are a helpful AI assistant for Loopwise, a subscription management app.
Your goal is to help users manage their subscriptions by responding to their requests.
You can perform actions by responding with a specific JSON format.
The user's subscriptions are: ${subscriptions.map(s => `"${s.name}" (ID: ${s.id}, Status: ${s.status})`).join(', ')}.

Available Actions:
1. Navigate to a page: { "action": { "type": "navigate", "payload": { "view": "view_name" } } } where view_name is one of: dashboard, subscriptions, payments, audit, team, referrals, help, settings.
2. Change subscription status: { "action": { "type": "change_status", "payload": { "subscriptionId": "sub_id", "status": "new_status" } } } where new_status is one of: active, paused, cancelled.

Rules:
- ALWAYS respond in the following JSON format: { "message": "Your response here.", "suggestions": ["suggestion1", "suggestion2"], "action": { ... } or null }
- Before performing a destructive action like 'cancelled' or 'paused', YOU MUST ask for confirmation first. Your response should ask "Are you sure?" and provide "Yes, cancel it" and "No, don't cancel" as suggestions, but no action. If the user then confirms, perform the action.
- If the user's request is unclear, ask for clarification.
- Keep your 'message' concise and friendly.
- 'suggestions' should be relevant follow-up actions.
- 'action' should only be included if you are executing a command.

Formatting Rules:
- Use Markdown for formatting your 'message'. Specifically:
  - Use '**text**' for bold.
  - Use '* list item' for bullet points.
- If the user asks for a list of items (like subscriptions), and the list is long (more than 5 items), first provide a summary (e.g., "You have 15 active subscriptions.") and then offer to show the full list as a suggestion.
- When you show a full list, format it using Markdown bullet points for readability. DO NOT return it as a single block of text.
- Example of a good list response: "Here are your active subscriptions:\\n* Netflix\\n* Spotify\\n* DevTools Pro"
`;

    const chatHistory = history.map(h => ({
        role: h.sender === 'user' ? 'user' : 'assistant',
        content: h.text,
    }));

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                ...chatHistory,
            ],
            model: "openai/gpt-oss-120b",
            temperature: 1,
            max_tokens: 8192,
            top_p: 1,
            stop: null,
        });

        const responseContent = completion.choices[0]?.message?.content;
        if (responseContent) {
            try {
                // The response might be wrapped in ```json ... ```, so we extract it if present.
                const jsonMatch = responseContent.match(/```json\n([\s\S]*)\n```/);
                const jsonString = jsonMatch ? jsonMatch[1] : responseContent;
                const parsed = JSON.parse(jsonString);
                return {
                    id: generateId('msg'),
                    text: parsed.message || "I'm not sure how to respond to that.",
                    sender: 'ai',
                    timestamp: new Date().toISOString(),
                    suggestions: parsed.suggestions || [],
                    action: parsed.action || undefined,
                };
            } catch (e) {
                // If JSON parsing fails, or if it's not a JSON response, return the raw text.
                return {
                    id: generateId('msg'),
                    text: responseContent,
                    sender: 'ai',
                    timestamp: new Date().toISOString(),
                };
            }
        }
    } catch (error: any) {
        console.error("Groq API error:", error); // Log the actual error for debugging
        let errorMessage = "Sorry, I'm having trouble connecting to my brain right now.";
        if (error) {
            errorMessage = "The AI model is currently being updated. Please try again later.";
        }
        return {
            id: generateId('msg'),
            text: errorMessage,
            sender: 'ai',
            timestamp: new Date().toISOString(),
        };
    }

    // Fallback if no response content or other issues
    return {
        id: generateId('msg'),
        text: "I'm not sure how to help with that.",
        sender: 'ai',
        timestamp: new Date().toISOString(),
    };
};

const login = async (email: string, password: string): Promise<User> => {
    console.log('Logging in with', email, password);
    // In a real app, you'd validate credentials here.
    return new Promise(res => setTimeout(() => res(mockUser), 1000));
};

const signup = async (email: string, password: string): Promise<User> => {
    console.log('Signing up with', email, password);
    const newUser: User = {
        id: generateId('user'),
        address: "0xCD...34",
        displayName: "New User",
        username: "",
        email: email,
        phone: "",
        bio: "",
        balances: { "USDC": 0.00 },
        avatarUrl: undefined,
        walletId: generateId('wallet'),
    };
    // In a real app, you'd save this new user to the database.
    // For the mock, we'll just return it and assume it's the new current user.
    return new Promise(res => setTimeout(() => res(newUser), 1500));
};

const checkUsername = async (username: string): Promise<boolean> => {
    // Simulate checking if a username is taken
    const isTaken = existingUsernames.includes(username.toLowerCase());
    return new Promise(res => setTimeout(() => res(!isTaken), 500));
};

const updateUserProfile = async (userId: string, profile: { displayName: string; username: string }): Promise<User> => {
    // Simulate updating the user profile
    const updatedUser = { ...mockUser, ...profile };
    mockUser = updatedUser; // Update the global mock user for subsequent calls
    existingUsernames.push(profile.username.toLowerCase());
    return new Promise(res => setTimeout(() => res(updatedUser), 800));
};


export const mockApi = {
    getUser: (): Promise<User> => new Promise(res => setTimeout(() => res(mockUser), 500)),
    getSubscriptions: (): Promise<Subscription[]> => new Promise(res => setTimeout(() => res(mockSubscriptions), 800)),
    getAiSuggestions: (): Promise<AiSuggestion[]> => new Promise(res => setTimeout(() => res(mockAiSuggestions), 1200)),
    getTransactions: (): Promise<Transaction[]> => new Promise(res => setTimeout(() => res(mockTransactions), 300)),
    getInitialMessages: (): Promise<Message[]> => new Promise(res => setTimeout(() => res(mockInitialMessages), 100)),
    getTeam: (): Promise<TeamMember[]> => new Promise(res => setTimeout(() => res(mockTeam), 400)),
    getSessions: (): Promise<Session[]> => new Promise(res => setTimeout(() => res(mockSessions), 450)),
    getReferrals: (): Promise<Referral[]> => new Promise(res => setTimeout(() => res(mockReferrals), 600)),
    getChatResponse,
    generateId,
    generateTxId,
    login,
    signup,
    checkUsername,
    updateUserProfile,
};