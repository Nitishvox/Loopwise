import React from 'react';
import { SparklesIcon, CreditCardIcon, UsersIcon } from './icons';

interface LandingPageProps {
    onNavigateToLogin: () => void;
    onNavigateToSignup: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 transform transition-transform hover:-translate-y-1">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-600/20 text-primary-400 mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="mt-2 text-slate-400">{children}</p>
    </div>
);

const TestimonialCard: React.FC<{ quote: string; name: string; title: string; }> = ({ quote, name, title }) => (
    <figure className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
        <blockquote className="text-slate-300">
            <p>“{quote}”</p>
        </blockquote>
        <figcaption className="mt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center font-bold text-white">
                {name.charAt(0)}
            </div>
            <div>
                <div className="font-semibold text-white">{name}</div>
                <div className="text-slate-400 text-sm">{title}</div>
            </div>
        </figcaption>
    </figure>
);

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin, onNavigateToSignup }) => {
    return (
        <div className="bg-slate-950 text-slate-200">
            <header className="fixed top-0 left-0 right-0 z-30 bg-slate-950/80 backdrop-blur-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                             <svg className="h-8 w-8 text-primary-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            <h1 className="text-xl font-bold text-white">Loopwise</h1>
                        </div>
                        <nav className="flex items-center gap-4">
                            <button onClick={onNavigateToLogin} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Log In</button>
                            <button onClick={onNavigateToSignup} className="px-4 py-2 text-sm font-semibold bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">Get Started</button>
                        </nav>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 text-center">
                    <div className="absolute inset-0 bg-grid-slate-800/40 [mask-image:linear-gradient(to_bottom,white_5%,transparent_80%)]"></div>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                            The Future of Subscription Management is Here.
                        </h1>
                        <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-400">
                            Loopwise is an AI-driven platform that automates your recurring payments with USDC and helps you save money by intelligently managing your subscriptions.
                        </p>
                        <div className="mt-8 flex justify-center gap-4">
                            <button onClick={onNavigateToSignup} className="px-8 py-3 font-semibold bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-transform hover:scale-105 shadow-lg">
                                Get Started for Free
                            </button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-slate-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white">Why Loopwise?</h2>
                            <p className="mt-4 text-slate-400 max-w-2xl mx-auto">Take control of your digital life. Manage everything in one place, pay with crypto, and let our AI find savings for you.</p>
                        </div>
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard icon={<SparklesIcon className="w-6 h-6" />} title="AI-Powered Savings">
                                Our intelligent assistant analyzes your usage and suggests downgrades or cancellations, putting money back in your wallet.
                            </FeatureCard>
                            <FeatureCard icon={<CreditCardIcon className="w-6 h-6" />} title="Automated USDC Payments">
                                Pay for all your subscriptions seamlessly with USDC. No more credit cards, no more bank transfers.
                            </FeatureCard>
                            <FeatureCard icon={<UsersIcon className="w-6 h-6" />} title="Team Ready">
                                Manage subscriptions for your whole team or family. Invite members, set roles, and keep track of shared expenses.
                            </FeatureCard>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-20">
                     <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white">Loved by developers and teams</h2>
                            <p className="mt-4 text-slate-400 max-w-2xl mx-auto">See how Loopwise is helping people streamline their financial lives.</p>
                        </div>
                        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <TestimonialCard 
                                quote="Loopwise finally let me consolidate all my dev tool subscriptions. Paying with USDC is a game-changer for my workflow."
                                name="Alex Rivera"
                                title="Lead Developer, Tech Startup"
                            />
                            <TestimonialCard 
                                quote="As a freelancer, managing subscriptions was a nightmare. The AI assistant found $50/month in savings for me in the first week!"
                                name="Jordan Lee"
                                title="Freelance Designer"
                            />
                             <TestimonialCard 
                                quote="We use Loopwise to manage our team's software licenses. It's simple, transparent, and the audit trail is perfect for our bookkeeping."
                                name="Casey Smith"
                                title="Operations Manager, Creative Agency"
                            />
                        </div>
                    </div>
                </section>

                 {/* Final CTA Section */}
                <section className="py-20 bg-slate-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                         <h2 className="text-3xl font-bold text-white">Ready to take control?</h2>
                         <p className="mt-4 text-slate-400 max-w-xl mx-auto">
                            Sign up today and experience the smartest way to manage your subscriptions.
                         </p>
                        <div className="mt-8">
                             <button onClick={onNavigateToSignup} className="px-8 py-3 font-semibold bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-transform hover:scale-105 shadow-lg">
                                Create your free account
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-slate-800/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-slate-500">
                   <p>&copy; {new Date().getFullYear()} Loopwise. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
