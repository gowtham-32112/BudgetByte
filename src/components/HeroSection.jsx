import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-24 pb-12 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 blur-[120px] rounded-full -z-10 pointer-events-none" />
            
            <div className="max-w-4xl mx-auto text-center z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                        Take Control of Your <br className="hidden md:block"/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                            Student Budget
                        </span>
                    </h1>
                </motion.div>

                <motion.p 
                    className="text-lg md:text-xl text-white/60 mb-4 max-w-2xl mx-auto font-medium"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                >
                    A smart financial dashboard built for students.
                </motion.p>

                <motion.p 
                    className="text-base md:text-lg text-white/50 mb-10 max-w-xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
                    BudgetByte helps students track expenses, analyze spending habits, and stay within their monthly budget using powerful visual insights.
                </motion.p>

                <motion.div 
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                >
                    <Link to="/signup" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-lg transition-all hover:scale-105 active:scale-95 custom-shadow">
                        Get Started for Free
                    </Link>
                    <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-lg transition-all">
                        Login to Account
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
