import React, { useMemo } from 'react';
import useExpenseStore from '../store/expenseStore';
import useUserStore from '../store/userStore';
import { formatCurrency } from '../utils/converter';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { subMonths, isSameMonth, parseISO, getDaysInMonth, getDate } from 'date-fns';

export const SpendingInsights = () => {
  const { expenses, currentViewCurrency, getConversionRate } = useExpenseStore();
  const { campusCurrency, homeCurrency } = useUserStore();
  const activeCurrencyCode = currentViewCurrency === 'campus' ? campusCurrency : homeCurrency;

  const getDisplayAmount = (amount) => {
    if (currentViewCurrency === 'campus') return amount;
    return amount * getConversionRate();
  };

  const categoryTrends = useMemo(() => {
    if (expenses.length === 0) return [];

    const today = new Date();
    const lastMonth = subMonths(today, 1);

    const currentMonthTotals = {};
    const previousMonthTotals = {};

    expenses.forEach(exp => {
      const expDate = parseISO(exp.date);
      const amount = getDisplayAmount(exp.amount);

      if (isSameMonth(expDate, today)) {
        currentMonthTotals[exp.category] = (currentMonthTotals[exp.category] || 0) + amount;
      } else if (isSameMonth(expDate, lastMonth)) {
        previousMonthTotals[exp.category] = (previousMonthTotals[exp.category] || 0) + amount;
      }
    });

    // Calculate percentage changes
    // ((current_month - previous_month) / previous_month) * 100
    const trends = [];
    Object.keys(currentMonthTotals).forEach(category => {
      const current = currentMonthTotals[category];
      const previous = previousMonthTotals[category] || 0;

      if (previous > 0) {
        const percentageChange = ((current - previous) / previous) * 100;
        trends.push({
          category,
          change: percentageChange,
          currentAmount: current
        });
      }
    });

    // Sort by largest absolute change
    return trends.sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 3);
  }, [expenses, getConversionRate, currentViewCurrency]);

  const expensePrediction = useMemo(() => {
    if (expenses.length === 0) return null;

    const today = new Date();
    const daysInMonth = getDaysInMonth(today);
    const currentDay = getDate(today);

    let currentMonthSpent = 0;

    expenses.forEach(exp => {
      const expDate = parseISO(exp.date);
      if (isSameMonth(expDate, today)) {
        currentMonthSpent += getDisplayAmount(exp.amount);
      }
    });

    if (currentMonthSpent === 0 || currentDay === 0) return null;

    const dailyAverage = currentMonthSpent / currentDay;
    const projectedTotal = dailyAverage * daysInMonth;

    return {
      current: currentMonthSpent,
      projected: projectedTotal,
      dailyAverage
    };
  }, [expenses, getConversionRate, currentViewCurrency]);

  if (categoryTrends.length === 0 && !expensePrediction) return null;

  return (
    <div className="w-full mt-6">
      <h2 className="text-lg font-semibold mb-4 px-2">Category Trends (vs Last Month)</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Prediction Card */}
        {expensePrediction && (
          <div className="glass rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden ring-1 ring-indigo-500/30">
            <Activity className="absolute top-4 right-4 text-indigo-500/20" size={48} />
            <p className="text-xs text-white/50 font-medium">End of Month Projection</p>
            <div>
              <p className="text-sm font-bold mt-1 text-indigo-400">
                {formatCurrency(expensePrediction.projected, activeCurrencyCode)}
              </p>
              <p className="text-xs text-white/40 mt-1">
                Based on {formatCurrency(expensePrediction.dailyAverage, activeCurrencyCode)} / day
              </p>
            </div>
            {/* Progress Bar for Projection */}
            <div className="w-full h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${Math.min((expensePrediction.current / expensePrediction.projected) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {categoryTrends.map((trend, idx) => {
          const isIncrease = trend.change > 0;
          const isDecrease = trend.change < 0;

          return (
            <div key={idx} className="glass rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden">
              {isIncrease && <TrendingUp className="absolute top-4 right-4 text-red-500/20" size={48} />}
              {isDecrease && <TrendingDown className="absolute top-4 right-4 text-emerald-500/20" size={48} />}
              {!isIncrease && !isDecrease && <Minus className="absolute top-4 right-4 text-gray-500/20" size={48} />}

              <p className="text-xs text-white/50 font-medium">Trend: {trend.category}</p>
              <div>
                <p className="text-sm font-bold mt-1">
                  {isIncrease && `📈 ${trend.category} spending increased by ${Math.abs(trend.change).toFixed(0)}%`}
                  {isDecrease && `📉 ${trend.category} spending decreased by ${Math.abs(trend.change).toFixed(0)}%`}
                  {!isIncrease && !isDecrease && `⚖️ ${trend.category} spending remained unchanged`}
                </p>
                <p className="text-xs text-white/40 mt-1">
                  Current: {formatCurrency(trend.currentAmount, activeCurrencyCode)}
                </p>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};
