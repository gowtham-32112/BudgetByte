import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Layers, Target } from 'lucide-react';

const ProblemSection = () => {
    return (
        <section id="about" className="py-24 px-6 relative">
            <div className="max-w-6xl mx-auto">
                
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <motion.h2 
                        className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Managing money <br/> as a student is difficult.
                    </motion.h2>
                    <motion.p 
                        className="text-lg text-white/60 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        Traditional banking apps are complex and do not provide clear insights into where your money is going. BudgetByte simplifies financial tracking with visual dashboards and intelligent analytics.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: <Target size={28} className="text-orange-400" />, title: "Budget Stress", desc: "Constant worry about running out of money before the month ends.", color: "bg-orange-500/10 border-orange-500/20" },
                        { icon: <Brain size={28} className="text-indigo-400" />, title: "Lack of Insights", desc: "No clear visibility into micro-spending habits and categorical waste.", color: "bg-indigo-500/10 border-indigo-500/20" },
                        { icon: <Layers size={28} className="text-rose-400" />, title: "Complex Apps", desc: "Banking apps are cluttered with enterprise features you dont need.", color: "bg-rose-500/10 border-rose-500/20" }
                    ].map((item, i) => (
                        <motion.div 
                            key={i}
                            className={`glass p-8 rounded-3xl border ${item.color} flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-2xl hover:shadow-${item.color.split('-')[1]}-500/20 transition-all duration-300 cursor-default`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 + 0.2 }}
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 custom-shadow">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                            <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default ProblemSection;
