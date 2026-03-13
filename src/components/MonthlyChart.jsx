import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import useExpenseStore from '../store/expenseStore';
import useUserStore from '../store/userStore';
import { formatCurrency } from '../utils/converter';
import { format, parseISO, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export const MonthlyChart = () => {
    const { expenses, currentViewCurrency, getConversionRate } = useExpenseStore();
    const { campusCurrency, homeCurrency } = useUserStore();
    const activeCurrencyCode = currentViewCurrency === 'campus' ? campusCurrency : homeCurrency;

    const getDisplayAmount = (amount) => {
        if (currentViewCurrency === 'campus') return amount;
        return amount * getConversionRate();
    };

    const chartData = useMemo(() => {
        if (expenses.length === 0) return [];

        const today = new Date();
        const months = [];

        // Generate last 6 months intervals
        for (let i = 5; i >= 0; i--) {
            const targetMonth = subMonths(today, i);
            months.push({
                start: startOfMonth(targetMonth),
                end: endOfMonth(targetMonth),
                label: format(targetMonth, 'MMM'),
                amount: 0
            });
        }

        // Accumulate expenses into months
        expenses.forEach(exp => {
            const expDate = parseISO(exp.date);
            for (let i = 0; i < months.length; i++) {
                if (isWithinInterval(expDate, { start: months[i].start, end: months[i].end })) {
                    months[i].amount += getDisplayAmount(exp.amount);
                    break;
                }
            }
        });

        return months;
    }, [expenses, getConversionRate, currentViewCurrency]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass p-3 rounded-xl shadow-2xl border border-white/20">
                    <p className="font-bold text-white/80 text-xs mb-1">{label}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-white/50">Total Spent:</span>
                        <p className="font-bold text-emerald-400">
                            {formatCurrency(payload[0].value, activeCurrencyCode)}
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full mt-6">
            <h2 className="text-lg font-semibold mb-4 px-2">Monthly Spending Trend</h2>
            <div className="glass p-4 rounded-3xl h-64 w-full pt-6">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="label"
                            stroke="rgba(255,255,255,0.3)"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                            dy={10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
                        <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="#34D399"
                            strokeWidth={4}
                            dot={{ fill: '#0F0F0F', stroke: '#34D399', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: '#34D399', stroke: '#fff', strokeWidth: 2 }}
                            isAnimationActive={true}
                            animationDuration={1500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
