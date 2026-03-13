import React, { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4 ${scrolled ? 'bg-[#0F0F0F]/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Brand */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center custom-shadow">
                        <Wallet className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                            BudgetByte
                        </h1>
                    </div>
                </div>

                {/* Links */}
                <div className="hidden md:flex items-center gap-8">
                    <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-white/70 hover:text-white transition-colors">Features</button>
                    <button onClick={() => scrollToSection('contact')} className="text-sm font-medium text-white/70 hover:text-white transition-colors">Contact</button>
                    <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Login</Link>
                    <Link to="/signup" className="text-sm font-semibold bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2.5 rounded-xl transition-all">Sign Up</Link>
                </div>
                
                {/* Mobile placeholder */}
                <div className="md:hidden flex items-center">
                   <Link to="/login" className="text-sm font-semibold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all">Login</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
