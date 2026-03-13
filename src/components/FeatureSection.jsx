import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Receipt, TrendingUp, PieChart, Coins, CalendarDays } from 'lucide-react';

const FeatureSection = () => {
    const features = [
        {
            icon: <Receipt className="text-emerald-400" size={24} />,
            title: "Expense Tracking",
            desc: "Quickly log expenses in categories like Food, Rent, Books, and Fun.",
            color: "bg-emerald-500/10 border-emerald-500/20"
        },
        {
            icon: <PieChart className="text-indigo-400" size={24} />,
            title: "Visual Dashboard",
            desc: "Interactive charts show exactly where your money is going.",
            color: "bg-indigo-500/10 border-indigo-500/20"
        },
        {
            icon: <Coins className="text-yellow-400" size={24} />,
            title: "Currency Conversion",
            desc: "Track expenses in campus currency while understanding spending in your home currency.",
            color: "bg-yellow-500/10 border-yellow-500/20"
        },
        {
            icon: <CalendarDays className="text-rose-400" size={24} />,
            title: "Spending Heatmap",
            desc: "See which days you spend the most with a visual activity heatmap.",
            color: "bg-rose-500/10 border-rose-500/20"
        },
        {
            icon: <TrendingUp className="text-blue-400" size={24} />,
            title: "Budget Tracking",
            desc: "Set monthly budgets and track remaining spending limits.",
            color: "bg-blue-500/10 border-blue-500/20"
        },
        {
            icon: <LayoutDashboard className="text-purple-400" size={24} />,
            title: "Receipt Scanner",
            desc: "Scan receipts instantly and automatically extract expense data.",
            color: "bg-purple-500/10 border-purple-500/20"
        }
    ];

    return (
        <section id="features" className="py-24 px-6 relative bg-white/[0.02]">
            <div className="max-w-7xl mx-auto">
                
                <div className="text-center mb-16">
                    <motion.h2 
                        className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Everything you need <br/> to master your money.
                    </motion.h2>
                    <motion.p 
                        className="text-lg text-white/50 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        Designed from the ground up for university students dealing with campus currencies and tight budgets.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div 
                            key={i}
                            className={`glass p-8 rounded-3xl border ${feature.color} custom-shadow hover:-translate-y-1 transition-transform`}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FeatureSection;
