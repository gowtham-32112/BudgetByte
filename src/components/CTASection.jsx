import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
    return (
        <section className="py-24 px-6 relative">
            <div className="max-w-4xl mx-auto">
                <motion.div 
                    className="glass rounded-3xl p-12 py-20 text-center border border-white/10 relative overflow-hidden custom-shadow"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/20 to-purple-600/20 blur-[80px] rounded-full -z-10" />

                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Ready to track your money?
                    </h2>
                    <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
                        Join BudgetByte today and start managing your finances smarter. Takes less than a minute to setup.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/signup" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                            Create Free Account <ArrowRight size={20} />
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-lg transition-all">
                            Log In
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
