import React, { useState } from 'react';

import { useNavigate, Navigate } from 'react-router-dom';
import { Wallet, LogIn, UserPlus, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { BudgetSetupModal } from '../components/BudgetSetupModal';
import useUserStore from '../store/userStore';

const Signup = ({ switchToLogin }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        homeCurrency: 'USD',
        campusCurrency: 'EUR',
        country: '',
        university: '',
        monthlyBudget: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showBudgetSetup, setShowBudgetSetup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { signup, currentUser } = useUserStore();
    const navigate = useNavigate();

    if (currentUser) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const validateForm = () => {
        if (formData.password.length < 8) return 'Password must be at least 8 characters long.';
        if (formData.password !== formData.confirmPassword) return 'Passwords do not match.';
        // Basic email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return 'Please enter a valid email address.';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setError('');
            setLoading(true);

            // To be integrated completely with userStore.js in the next steps 
            // for now, we just invoke standard signup.
            await signup(formData.email, formData.password, {
                fullName: formData.fullName,
                homeCurrency: formData.homeCurrency,
                campusCurrency: formData.campusCurrency,
                country: formData.country,
                university: formData.university,
                monthlyBudget: formData.monthlyBudget
            });

            // Instead of instantly navigating away, we pop up the Budget Setup Modal
            setShowBudgetSetup(true);
        } catch (err) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const handleBudgetSetupComplete = () => {
        navigate('/dashboard'); // Only navigate to dashboard once the user Finishes or Skips Setup
    };

    return (
        <React.Fragment>
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-lg glass p-8 rounded-3xl shadow-2xl border border-white/10 mx-auto my-auto relative"
        >
            <div className="flex flex-col items-center justify-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center custom-shadow mb-4">
                    <UserPlus className="text-white" size={32} />
                </div>
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                    Create Account
                </h1>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 mb-6 text-sm font-medium">
                    <AlertCircle size={18} className="shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-white/70">Full Name *</label>
                        <input
                            type="text" name="fullName" value={formData.fullName} onChange={handleChange} required
                            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500/50"
                            placeholder="Alex Doe"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-white/70">Country *</label>
                        <input
                            type="text" name="country" value={formData.country} onChange={handleChange} required
                            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500/50"
                            placeholder="e.g. France"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-white/70">Email Address *</label>
                    <input
                        type="email" name="email" value={formData.email} onChange={handleChange} required
                        className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500/50"
                        placeholder="student@university.edu"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-white/70">Password *</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password" value={formData.password} onChange={handleChange} required
                                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 pr-10 text-white focus:ring-1 focus:ring-indigo-500/50"
                                placeholder="Min 8 characters"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors flex items-center justify-center p-1"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-white/70">Confirm Password *</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 pr-10 text-white focus:ring-1 focus:ring-indigo-500/50"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors flex items-center justify-center p-1"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-white/70">Home Currency *</label>
                        <select name="homeCurrency" value={formData.homeCurrency} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500/50">
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="INR">INR (₹)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="AUD">AUD ($)</option>
                            <option value="CAD">CAD ($)</option>
                            <option value="JPY">JPY (¥)</option>
                            <option value="CNY">CNY (¥)</option>
                            <option value="SGD">SGD ($)</option>
                            <option value="AED">AED (د.إ)</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-white/70">Campus Currency *</label>
                        <select name="campusCurrency" value={formData.campusCurrency} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500/50">
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="INR">INR (₹)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="AUD">AUD ($)</option>
                            <option value="CAD">CAD ($)</option>
                            <option value="JPY">JPY (¥)</option>
                            <option value="CNY">CNY (¥)</option>
                            <option value="SGD">SGD ($)</option>
                            <option value="AED">AED (د.إ)</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-white/70">University Name (Optional)</label>
                    <input
                        type="text" name="university" value={formData.university} onChange={handleChange}
                        className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500/50"
                        placeholder="e.g. Oxford"
                    />
                </div>

                <div className="flex flex-col gap-1.5 mb-2">
                    <label className="text-xs font-medium text-white/70">Total Monthly Budget (Optional)</label>
                    <input
                        type="number" name="monthlyBudget" value={formData.monthlyBudget} onChange={handleChange} min="0" step="10"
                        className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500/50"
                        placeholder="e.g. 1500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? 'Processing...' : <><UserPlus size={18} /> Create Account</>}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-white/50">
                <p>Already have an account? <button onClick={() => navigate('/login')} className="text-indigo-400 font-semibold hover:text-indigo-300 ml-1">Log in</button></p>
            </div>
        </motion.div>
        <BudgetSetupModal 
            isOpen={showBudgetSetup} 
            onClose={handleBudgetSetupComplete} 
        />
        </React.Fragment>
    );
};

export default Signup;
