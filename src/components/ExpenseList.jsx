import React from 'react';
import useExpenseStore from '../store/expenseStore';
import useUserStore from '../store/userStore';
import { formatCurrency } from '../utils/converter';
import { Coffee, Home, BookOpen, Gamepad2, TrendingDown, X } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const ExpenseList = () => {
  const { expenses, categories, currentViewCurrency, getConversionRate, selectedCategory, setSelectedCategory } = useExpenseStore();
  const { campusCurrency, homeCurrency } = useUserStore();
  
  const getCategoryTheme = (catName) => {
    const cat = categories.find(c => c.name === catName);
    return cat ? { color: cat.color, icon: cat.icon } : { color: '#ffffff', icon: '❓' };
  };

  const activeCurrencyCode = currentViewCurrency === 'campus' ? campusCurrency : homeCurrency;

  const getDisplayAmount = (amount) => {
    if (currentViewCurrency === 'campus') return amount;
    return amount * getConversionRate();
  };

  const filteredExpenses = selectedCategory
    ? expenses.filter(exp => exp.category === selectedCategory)
    : expenses;

  const sortedExpenses = [...filteredExpenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (expenses.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-6">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <TrendingDown size={20} className="text-indigo-400" />
          Recent Transactions
        </h2>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded-full transition-colors"
          >
            <span>{selectedCategory}</span>
            <X size={12} />
          </button>
        )}
      </div>
      <motion.div
        className="flex flex-col gap-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
      >
        <AnimatePresence>
          {sortedExpenses.map((expense) => {
            const displayAmount = getDisplayAmount(expense.amount);
            const theme = getCategoryTheme(expense.category);
            
            return (
              <motion.div 
                key={expense.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                layout
                className="glass rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-default"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center pointer-events-none"
                    style={{ backgroundColor: `${theme.color}20`, color: theme.color }}
                  >
                    <span className="text-xl" role="img" aria-label={expense.category}>{theme.icon}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white/90">
                      {expense.description || expense.category}
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {format(new Date(expense.date), 'MMM dd, yyyy')} • {expense.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg tracking-tight">
                    {formatCurrency(displayAmount, activeCurrencyCode)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ExpenseList;
