import React, { useState } from 'react';
import { ChevronDownIcon } from './icons';

const faqItems = [
    {
        question: "How do I connect my wallet?",
        answer: "To connect your wallet, click on the 'Connect Wallet' button in the top right corner. You'll be prompted to choose from supported wallets like MetaMask or Coinbase Wallet. Follow the on-screen instructions to authorize the connection securely."
    },
    {
        question: "How does the AI subscription suggestion work?",
        answer: "Our AI analyzes your subscription usage patterns (without accessing personal data) to identify opportunities for savings. It looks for low-usage subscriptions you might want to cancel, or plans that could be downgraded to a cheaper tier based on your feature usage."
    },
    {
        question: "Are my funds safe? Is this non-custodial?",
        answer: "Yes, your funds are safe. Loopwise is a non-custodial platform, meaning we never take control of your private keys or your funds. All transactions are authorized by you directly from your wallet via signed messages."
    },
    {
        question: "How are recurring payments automated?",
        answer: "When you schedule a payment, you grant a specific, limited approval to our smart contract to execute payments for that subscription. The contract can only transfer the approved amount to the approved vendor on the schedule you set. You can revoke this permission at any time."
    },
];

const FaqItem: React.FC<{ question: string; answer: string; isOpen: boolean; onClick: () => void }> = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border-b border-slate-200 dark:border-slate-800">
            <h3>
                <button
                    onClick={onClick}
                    className="flex w-full items-center justify-between py-5 text-left font-medium text-slate-800 dark:text-slate-200"
                    aria-expanded={isOpen}
                >
                    <span>{question}</span>
                    <ChevronDownIcon className={`h-6 w-6 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            </h3>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                 <div className="overflow-hidden">
                    <div className="pb-5 pr-4 text-base text-slate-600 dark:text-slate-400">
                        <p>{answer}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Help: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl text-center">Help & Frequently Asked Questions</h2>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400 text-center">
                    Find answers to common questions about Loopwise.
                </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/50 rounded-lg shadow-sm p-4 sm:p-8">
                {faqItems.map((item, index) => (
                    <FaqItem
                        key={index}
                        question={item.question}
                        answer={item.answer}
                        isOpen={openIndex === index}
                        onClick={() => handleToggle(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Help;