import React, { useState } from 'react';

import { useNavigate, Navigate } from 'react-router-dom';
import { Wallet, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import Signup from './Signup';
import useUserStore from '../store/userStore';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, currentUser } = useUserStore();
    const navigate = useNavigate();

    // Redirect if already logged in
    if (currentUser) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) return;

        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to authenticate');
        } finally {
            setLoading(false);
        }
    };

    if (!isLogin) {
        return (
            <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -z-10" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -z-10" />
                <Signup switchToLogin={() => setIsLogin(true)} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-md glass p-8 rounded-3xl shadow-2xl border border-white/10 relative"
            >
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center custom-shadow mb-4">
                        <Wallet className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                        BudgetByte
                    </h1>
                    <p className="text-white/50 mt-2">Manage your student finances smartly.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 mb-6 text-sm font-medium">
                        <AlertCircle size={18} className="shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-white/70">Email Access</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                            placeholder="student@university.edu"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-white/70">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors flex items-center justify-center p-1"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : <><LogIn size={18} /> Sign In</>}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-white/50">
                    <p>New to BudgetByte? <button onClick={() => setIsLogin(false)} className="text-indigo-400 font-semibold hover:text-indigo-300 ml-1">Sign up</button></p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
