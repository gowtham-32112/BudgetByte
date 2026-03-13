import React from 'react';
import ExpenseList from '../components/ExpenseList';
import Header from '../components/Header';
import { motion } from 'framer-motion';

const Transactions = () => {
    return (
        <div className="min-h-screen bg-[#0F0F0F] text-white">
            <Header />

            <main className="max-w-4xl mx-auto px-6 py-8 pb-24 relative min-h-[calc(100vh-80px)]">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                            All Transactions
                        </h1>
                        <p className="text-sm text-white/50 mt-1">
                            A comprehensive list of your spending history.
                        </p>
                    </div>

                    <div className="glass rounded-3xl p-6 border border-white/10 mt-6 min-h-[500px]">
                        <ExpenseList />
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Transactions;
