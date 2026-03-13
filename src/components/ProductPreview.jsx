import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, CalendarDays, PieChart, Activity } from 'lucide-react';

const ProductPreview = () => {
    return (
        <section className="py-32 px-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full -z-10 pointer-events-none" />
            
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2 
                        className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        See it in action
                    </motion.h2>
                </div>

                {/* Conceptual Dashboard Abstract Visualization */}
                <motion.div 
                    className="glass rounded-[2.5rem] p-4 lg:p-8 border border-white/10 custom-shadow hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 cursor-pointer"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="w-full h-full bg-[#141414] rounded-2xl border border-white/5 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative overflow-hidden">
                        
                        {/* Fake Header */}
                        <div className="lg:col-span-12 flex items-center justify-between border-b border-white/5 pb-4 mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/20" />
                                <div className="w-32 h-5 rounded-md bg-white/10" />
                            </div>
                            <div className="w-24 h-8 rounded-lg bg-white/5" />
                        </div>

                        {/* Left Col abstractions */}
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            
                            {/* Trend Charts */}
                            <div className="h-48 rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col justify-between">
                                <div className="flex items-center gap-2 mb-4">
                                   <Activity className="text-indigo-400" size={16} />
                                   <div className="w-24 h-4 bg-white/10 rounded" />
                                </div>
                                {/* Fake Chart Spline */}
                                <div className="w-full flex-1 flex items-end gap-2 px-2">
                                     {[40, 60, 30, 80, 50, 90, 45, 75, 60].map((h, i) => (
                                         <div key={i} className="flex-1 bg-gradient-to-t from-indigo-500/40 to-indigo-400 rounded-t-sm" style={{ height: `${h}%` }} />
                                     ))}
                                </div>
                            </div>

                            {/* Heatmap Abstract */}
                            <div className="h-40 rounded-xl bg-white/5 border border-white/5 p-4">
                                <div className="flex items-center gap-2 mb-4">
                                   <CalendarDays className="text-emerald-400" size={16} />
                                   <div className="w-32 h-4 bg-white/10 rounded" />
                                </div>
                                <div className="grid grid-cols-12 gap-1.5 opacity-60">
                                    {Array.from({length: 48}).map((_, i) => (
                                        <div key={i} className={`h-4 rounded-sm ${Math.random() > 0.7 ? 'bg-emerald-500' : Math.random() > 0.4 ? 'bg-emerald-500/40' : 'bg-white/5'}`} />
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Right Col abstractions */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            
                            {/* Donut Chart Abstract */}
                            <div className="h-56 rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col items-center justify-center">
                                <div className="w-full flex items-center justify-start gap-2 mb-4 absolute top-6 left-6">
                                   <PieChart className="text-rose-400" size={16} />
                                </div>
                                <div className="w-32 h-32 rounded-full border-[16px] border-r-indigo-500 border-t-rose-500 border-l-yellow-500 border-b-emerald-500 opacity-80" />
                            </div>

                            {/* List Abstract */}
                            <div className="h-32 rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col justify-between gap-3">
                                {[1,2,3].map(i => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/10" />
                                            <div className="w-16 h-3 bg-white/10 rounded" />
                                        </div>
                                        <div className="w-12 h-3 bg-white/20 rounded" />
                                    </div>
                                ))}
                            </div>

                        </div>

                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ProductPreview;
