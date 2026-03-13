import React, { useMemo } from 'react';
import useExpenseStore from '../store/expenseStore';
import useUserStore from '../store/userStore';
import { formatCurrency } from '../utils/converter';
import { AlertCircle, AlertTriangle, Settings } from 'lucide-react';

export const BudgetOverview = ({ onOpenBudgetModal }) => {
  const { expenses, budgets, categories, currentViewCurrency, getConversionRate } = useExpenseStore();
  const { campusCurrency, homeCurrency } = useUserStore();
  const currentUser = useUserStore(state => state.currentUser);
  
  const getCategoryColor = (catName) => {
    const cat = categories.find(c => c.name === catName);
    return cat ? cat.color : '#CCC';
  };

  const activeCurrencyCode = currentViewCurrency === 'campus' ? campusCurrency : homeCurrency;

  const getDisplayAmount = (amount) => {
    if (currentViewCurrency === 'campus') return amount;
    return amount * getConversionRate();
  };

  const userBudgets = useMemo(() => {
    // Exact user scoping applied as requested
    if (!Array.isArray(budgets)) return [];
    return budgets.filter(budget => budget.userId === currentUser?.uid || budget.userId === 'system' || !budget.userId);
  }, [budgets, currentUser]);

  const categoryTotals = useMemo(() => {
    const totals = {};
    userBudgets.forEach(b => totals[b.category] = 0);

    expenses.forEach(exp => {
      if (totals[exp.category] !== undefined) {
        totals[exp.category] += exp.amount; // Base amounts in campus currency
      }
    });

    return totals;
  }, [expenses, userBudgets]);

  return (
    <div className="w-full mt-6">
      <div className="flex items-center justify-between mb-4 px-2">
         <h2 className="text-lg font-semibold">Budget Limits</h2>
         {onOpenBudgetModal && (
            <button 
              onClick={onOpenBudgetModal}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium border border-white/5 transition-colors flex items-center gap-1.5"
            >
              <Settings size={14} /> Set Limits
            </button>
         )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userBudgets.map(budget => {
          const cat = budget.category;
          const spentBase = categoryTotals[cat] || 0;
          const budgetBase = budget.amount;
          let percent = budgetBase > 0 ? (spentBase / budgetBase) * 100 : 0;

          const spentDisplay = getDisplayAmount(spentBase);
          const budgetDisplay = getDisplayAmount(budgetBase);

          let alertMsg = null;
          let AlertIcon = null;
          let alertColor = '';

          if (budgetBase === 0) {
            percent = 0;
            // No alerts when budget is 0
          } else if (percent >= 100) {
            alertMsg = `${cat} budget exceeded!`;
            AlertIcon = AlertTriangle;
            alertColor = 'text-red-400';
          } else if (percent >= 80) {
            alertMsg = `80% of ${cat} budget used`;
            AlertIcon = AlertCircle;
            alertColor = 'text-yellow-400';
          }

          return (
            <div key={budget.id || cat} className="glass rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-white/90">{cat}</span>
                <span className="text-sm font-medium">
                  <span className="text-white">{formatCurrency(spentDisplay, activeCurrencyCode)}</span>
                  <span className="text-white/40 ml-1">
                    / {budgetBase > 0 ? formatCurrency(budgetDisplay, activeCurrencyCode) : 'Not Set'}
                  </span>
                </span>
              </div>

              <div className="h-2 w-full bg-[#0F0F0F] border border-white/5 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full transition-all duration-700 ease-out" 
                  style={{ 
                    width: `${Math.min(percent, 100)}%`, 
                    backgroundColor: budgetBase === 0 ? '#3f3f46' : getCategoryColor(cat) 
                  }}
                />
              </div>

              <div className="flex justify-between items-center text-xs">
                {budgetBase > 0 ? (
                  <span className={percent >= 100 ? 'text-red-400 font-medium' : 'text-white/50'}>
                    {percent >= 100 
                      ? `${formatCurrency(spentDisplay - budgetDisplay, activeCurrencyCode)} over`
                      : `${formatCurrency(budgetDisplay - spentDisplay, activeCurrencyCode)} remaining`}
                  </span>
                ) : (
                  <span className="text-white/30 italic">No limit set</span>
                )}
                
                {budgetBase > 0 ? (
                  <span className="text-white/60 font-medium">{Math.round(percent)}%</span>
                ) : (
                  <span className="text-white/30 font-medium">-</span>
                )}
              </div>

              {alertMsg && (
                <div className={`flex items-center gap-1.5 text-xs font-medium mt-1 ${alertColor}`}>
                  <AlertIcon size={14} />
                  {alertMsg}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
