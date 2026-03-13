import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import useExpenseStore from '../store/expenseStore';
import useUserStore from '../store/userStore';
import { formatCurrency } from '../utils/converter';
import { startOfWeek, endOfWeek, format, subWeeks, isWithinInterval, parseISO } from 'date-fns';

export const WeeklyChart = () => {
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
        const weeks = [];

        // Generate last 4 weeks intervals
        for (let i = 3; i >= 0; i--) {
            const targetDate = subWeeks(today, i);
            weeks.push({
                start: startOfWeek(targetDate, { weekStartsOn: 1 }),
                end: endOfWeek(targetDate, { weekStartsOn: 1 }),
                label: i === 0 ? 'This Week' : `Week ${4 - i}`,
                amount: 0
            });
        }

        // Accumulate expenses into weeks
        expenses.forEach(exp => {
            const expDate = parseISO(exp.date);
            for (let i = 0; i < weeks.length; i++) {
                if (isWithinInterval(expDate, { start: weeks[i].start, end: weeks[i].end })) {
                    weeks[i].amount += getDisplayAmount(exp.amount);
                    break;
                }
            }
        });

        return weeks;
    }, [expenses, getConversionRate, currentViewCurrency]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass p-3 rounded-xl shadow-2xl border border-white/20">
                    <p className="font-bold text-white/80 text-xs mb-1">{label}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-white/50">Total Spent:</span>
                        <p className="font-bold text-blue-400">
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
            <h2 className="text-lg font-semibold mb-4 px-2">Weekly Spending Trend</h2>
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
                            stroke="#60A5FA"
                            strokeWidth={4}
                            dot={{ fill: '#0F0F0F', stroke: '#60A5FA', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: '#60A5FA', stroke: '#fff', strokeWidth: 2 }}
                            isAnimationActive={true}
                            animationDuration={1500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
