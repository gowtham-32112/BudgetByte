import React from 'react';
import Header from '../components/Header';
import { motion } from 'framer-motion';

import { ProfileCard } from '../components/ProfileCard';
import { PersonalInfoForm } from '../components/PersonalInfoForm';
import { FinancialSettings } from '../components/FinancialSettings';
import { CategoryManager } from '../components/CategoryManager';
import { SpendingSummary } from '../components/SpendingSummary';
import { AccountControls } from '../components/AccountControls';
import { BudgetSetupModal } from '../components/BudgetSetupModal';
import { Target } from 'lucide-react';

const Profile = () => {
    const [showBudgetSetup, setShowBudgetSetup] = React.useState(false);

    return (
        <div className="min-h-screen bg-[#0F0F0F] text-white">
            <Header />

            <main className="max-w-5xl mx-auto px-6 py-8 pb-32 relative min-h-[calc(100vh-80px)]">
                
                <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 mb-8">
                    Your Profile
                </h2>

                <motion.div 
                    className="flex flex-col gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                    }}
                >
                    {/* Top Hero Container */}
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}}>
                        <ProfileCard />
                    </motion.div>

                    {/* 2-Column Split Interface */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* Left Column: Form Settings and Destructive Controls */}
                        <motion.div className="lg:col-span-7 flex flex-col gap-6" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}}>
                            
                            {/* Budget Setup Quick Access */}
                            <div className="bg-[#1A1A1A] rounded-3xl p-6 border border-white/10 custom-shadow flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                                        <Target size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Monthly Budget Limits</h3>
                                        <p className="text-sm text-white/50">Configure your category spending targets</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowBudgetSetup(true)}
                                    className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
                                >
                                    Set Budgets
                                </button>
                            </div>

                            <PersonalInfoForm />
                            <FinancialSettings />
                            <AccountControls />
                        </motion.div>

                        {/* Right Column: Profile Level Analytics and Tracking logic */}
                        <motion.div className="lg:col-span-5 flex flex-col gap-6" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}}>
                            <SpendingSummary />
                            <CategoryManager />
                        </motion.div>

                    </div>

                </motion.div>
            </main>
            
            <BudgetSetupModal 
                isOpen={showBudgetSetup} 
                onClose={() => setShowBudgetSetup(false)} 
            />
        </div>
    );
};

export default Profile;
