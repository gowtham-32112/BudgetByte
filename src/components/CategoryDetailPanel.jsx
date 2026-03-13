import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { formatCurrency } from '../utils/converter';
import useExpenseStore from '../store/expenseStore';
import useUserStore from '../store/userStore';
import { X, Receipt } from 'lucide-react';

export const CategoryDetailPanel = () => {
  const { expenses, categories, currentViewCurrency, getConversionRate, selectedCategory, setSelectedCategory } = useExpenseStore();
  const { campusCurrency, homeCurrency } = useUserStore();

  const activeCurrencyCode = currentViewCurrency === 'campus' ? campusCurrency : homeCurrency;

  const getDisplayAmount = (amount) => {
    if (currentViewCurrency === 'campus') return amount;
    return amount * getConversionRate();
  };

  const getCategoryTheme = (catName) => {
    const cat = categories.find(c => c.name === catName);
    return cat ? { color: cat.color, icon: cat.icon } : { color: '#ffffff', icon: '❓' };
  };

  const { total, count, average, recentExpenses, theme } = useMemo(() => {
    if (!selectedCategory) return { total: 0, count: 0, average: 0, recentExpenses: [], theme: null };

    const filtered = expenses.filter(exp => exp.category === selectedCategory);
    
    let sum = 0;
    filtered.forEach(exp => sum += getDisplayAmount(exp.amount));

    const count = filtered.length;
    const avg = count > 0 ? sum / count : 0;

    // Sort by most recent
    const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      total: sum,
      count,
      average: avg,
      recentExpenses: sorted,
      theme: getCategoryTheme(selectedCategory)
    };
  }, [expenses, selectedCategory, currentViewCurrency, getConversionRate, categories]);

  return (
    <AnimatePresence>
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          className="glass rounded-3xl p-6 border border-white/10 relative overflow-hidden custom-shadow w-full"
        >
          {theme && (
            <div 
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -z-10 opacity-10"
              style={{ backgroundColor: theme.color }}
            />
          )}

          <button 
            onClick={() => setSelectedCategory(null)}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: `${theme?.color}20`, color: theme?.color }}
            >
               <span role="img" aria-label={selectedCategory}>{theme?.icon}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">{selectedCategory} Breakdown</h2>
              <p className="text-sm text-white/50 mt-1">Detailed statistics and history</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
              <p className="text-sm font-medium text-white/50 mb-1">Total Spent</p>
              <p className="text-2xl font-bold" style={{ color: theme?.color }}>
                {formatCurrency(total, activeCurrencyCode)}
              </p>
            </div>
            <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
              <p className="text-sm font-medium text-white/50 mb-1">Transactions</p>
              <p className="text-2xl font-bold text-white">
                {count}
              </p>
            </div>
            <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
              <p className="text-sm font-medium text-white/50 mb-1">Average / Transaction</p>
              <p className="text-2xl font-bold text-white/90">
                {formatCurrency(average, activeCurrencyCode)}
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Receipt size={18} className="text-white/50" />
            Related Transactions
          </h3>

          <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-3">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((expense) => (
                <div 
                  key={expense.id} 
                  className="bg-white/5 hover:bg-white/10 rounded-xl p-3 flex items-center justify-between transition-colors border border-white/5"
                >
                  <div>
                    <p className="font-semibold text-white/90 text-sm">
                      {expense.description || expense.category}
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {format(new Date(expense.date), 'MMM dd, yyyy h:mm a')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold tracking-tight text-sm">
                      {formatCurrency(getDisplayAmount(expense.amount), activeCurrencyCode)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/40 text-sm text-center py-4">No transactions found for this category.</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
