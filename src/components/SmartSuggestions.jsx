import React, { useMemo } from 'react';
import useExpenseStore from '../store/expenseStore';
import useUserStore from '../store/userStore';
import { Lightbulb } from 'lucide-react';

export const SmartSuggestions = () => {
  const { expenses, budgets } = useExpenseStore();
  const currentUser = useUserStore(state => state.currentUser);

  const suggestions = useMemo(() => {
    if (expenses.length === 0) return ['Add some expenses to get smart suggestions!'];

    const tips = [];
    let weekendSpending = 0;
    let weekdaySpending = 0;
    let totalSpending = 0;

    const catTotals = {};

    expenses.forEach(exp => {
      const date = new Date(exp.date);
      const day = date.getDay();
      if (day === 0 || day === 6) {
        weekendSpending += exp.amount;
      } else {
        weekdaySpending += exp.amount;
      }

      totalSpending += exp.amount;
      catTotals[exp.category] = (catTotals[exp.category] || 0) + exp.amount;
    });

    // Rule 1: Weekend spending vs Weekday spending
    if (weekendSpending > weekdaySpending) {
      tips.push("You tend to spend more on weekends.\nPlanning weekend budgets may help control spending.");
    }

    // Rule 2: Food spending pattern (Optional but helpful)
    if (catTotals['Fun'] && totalSpending > 0) {
      const funPercentage = (catTotals['Fun'] / totalSpending) * 100;
      if (funPercentage > 30) {
        tips.push("You are spending a large portion of your budget on entertainment.\nConsider reducing fun expenses this month.");
      }
    }

    // Checking if near defined budget limits
    const userBudgets = budgets.filter(b => b.userId === currentUser?.uid || b.userId === 'system' || !b.userId);

    userBudgets.forEach(b => {
      const budgetAmount = b.amount;
      const spent = catTotals[b.category] || 0;
      if (budgetAmount > 0 && spent > budgetAmount * 0.9 && spent <= budgetAmount) {
        tips.push(`Careful! You are very close to hitting your ${b.category} budget limit.`);
      }
    });

    if (tips.length === 0) {
      tips.push("You're tracking your expenses well. Keep up the good budgeting habits!");
    }

    return tips;
  }, [expenses, budgets, currentUser]);

  if (expenses.length === 0) return null;

  return (
    <div className="w-full mt-6">
      <h2 className="text-lg font-semibold mb-4 px-2">Smart Suggestions</h2>
      <div className="flex flex-col gap-3">
        {suggestions.map((tip, idx) => (
          <div key={idx} className="glass rounded-xl p-4 flex gap-3 border border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 to-transparent">
            <Lightbulb className="text-yellow-400 shrink-0 mt-0.5" size={20} />
            <p className="text-sm font-medium text-white/90 leading-relaxed whitespace-pre-line">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
