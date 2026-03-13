import React from 'react';
import { Wallet } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="border-t border-white/5 bg-[#0F0F0F] pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center custom-shadow">
                            <Wallet className="text-white" size={18} />
                        </div>
                        <h2 className="text-lg font-bold text-white tracking-tight">BudgetByte</h2>
                    </div>
                    <p className="text-white/40 text-sm max-w-sm">
                        A smart financial dashboard built exclusively for students handling complex campus currencies and tight monthly budgets.
                    </p>
                </div>

                <div>
                    <h3 className="text-white font-semibold mb-4">Links</h3>
                    <ul className="flex flex-col gap-3">
                        <li><a href="#features" className="text-white/40 hover:text-white transition-colors text-sm">Features</a></li>
                        <li><a href="#about" className="text-white/40 hover:text-white transition-colors text-sm">About</a></li>
                        <li><a href="#" className="text-white/40 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-white font-semibold mb-4">Connect</h3>
                    <ul className="flex flex-col gap-3">
                        <li><a href="https://github.com" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors text-sm">GitHub Repository</a></li>

                    </ul>
                </div>

            </div>

            <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-white/30 text-xs">
                    &copy; {new Date().getFullYear()} BudgetByte. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
