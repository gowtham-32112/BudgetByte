import React, { useMemo } from 'react';
import { PieChart, TrendingUp, CreditCard, Activity } from 'lucide-react';
import useExpenseStore from '../store/expenseStore';
import useUserStore from '../store/userStore';
import { formatCurrency } from '../utils/converter';

export const SpendingSummary = () => {
    const { expenses, currentViewCurrency, getConversionRate } = useExpenseStore();
    const { campusCurrency, homeCurrency } = useUserStore();
    const activeCurrencyCode = currentViewCurrency === 'campus' ? campusCurrency : homeCurrency;

    const getDisplayAmount = (amount) => {
        if (currentViewCurrency === 'campus') return amount;
        return amount * getConversionRate();
    };

    const stats = useMemo(() => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const monthExpenses = expenses.filter(exp => {
            const d = new Date(exp.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });

        let total = 0;
        const catMap = {};
        monthExpenses.forEach(exp => {
            const amount = getDisplayAmount(exp.amount);
            total += amount;
            catMap[exp.category] = (catMap[exp.category] || 0) + amount;
        });

        const topCat = Object.keys(catMap).sort((a,b) => catMap[b] - catMap[a])[0] || 'N/A';
        const numTransactions = monthExpenses.length;
        const daysPassed = today.getDate();
        const dailyAvg = daysPassed > 0 ? total / daysPassed : 0;

        return { total, topCat, numTransactions, dailyAvg };
    }, [expenses, getConversionRate, currentViewCurrency]);

    return (
        <div className="glass rounded-3xl p-6 border border-white/10 custom-shadow w-full h-full flex flex-col justify-center">
            <h3 className="text-lg font-bold text-white mb-6">Monthly Spending Summary</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-4 flex flex-col gap-1 border border-white/5">
                    <div className="flex items-center gap-2 text-white/50 text-xs font-semibold uppercase tracking-wider mb-1"><PieChart size={14} className="text-blue-400"/> Total Spent</div>
                    <span className="text-xl font-bold text-white">{formatCurrency(stats.total, activeCurrencyCode)}</span>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 flex flex-col gap-1 border border-white/5">
                    <div className="flex items-center gap-2 text-white/50 text-xs font-semibold uppercase tracking-wider mb-1"><TrendingUp size={14} className="text-rose-400"/> Top Category</div>
                    <span className="text-xl font-bold text-white truncate px-1">{stats.topCat}</span>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 flex flex-col gap-1 border border-white/5">
                    <div className="flex items-center gap-2 text-white/50 text-xs font-semibold uppercase tracking-wider mb-1"><CreditCard size={14} className="text-indigo-400"/> Transactions</div>
                    <span className="text-xl font-bold text-white">{stats.numTransactions}</span>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 flex flex-col gap-1 border border-white/5">
                    <div className="flex items-center gap-2 text-white/50 text-xs font-semibold uppercase tracking-wider mb-1"><Activity size={14} className="text-emerald-400"/> Daily Avg</div>
                    <span className="text-xl font-bold text-white">{formatCurrency(stats.dailyAvg, activeCurrencyCode)}</span>
                </div>
            </div>
        </div>
    );
};
