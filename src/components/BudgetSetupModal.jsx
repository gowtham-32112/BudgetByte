import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, X } from 'lucide-react';
import useExpenseStore from '../store/expenseStore';
import useUserStore from '../store/userStore';

export const BudgetSetupModal = ({ isOpen, onClose }) => {
  const { setBudget } = useExpenseStore();
  const { campusCurrency } = useUserStore();
  
  // Default exact categories requested in the prompt
  const [budgets, setBudgets] = useState({
    Food: '',
    Rent: '',
    Fun: '',
    Books: ''
  });

  const handleSave = (e) => {
    e.preventDefault();
    
    // Save each budget iteratively using the existing setBudget function logic
    Object.entries(budgets).forEach(([category, amount]) => {
      // Empty string becomes 0 (no limit effectively visually) or we save exactly what they typed
      const parsedAmount = parseFloat(amount);
      if (!isNaN(parsedAmount) && parsedAmount > 0) {
        setBudget(category, parsedAmount);
      }
    });

    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  const handleChange = (category, value) => {
    setBudgets(prev => ({
      ...prev,
      [category]: value
    }));
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="budget-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }} // As requested: < 200ms
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
        >
          <motion.div
            key="budget-modal-content"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-[#1A1A1A] border border-white/10 w-full max-w-md rounded-3xl p-8 custom-shadow relative z-[10000]"
          >
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <Target size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Set Your Monthly Budget Limits</h2>
              <p className="text-white/60 text-sm leading-relaxed">
                Define how much you want to spend in each category. This helps BudgetByte track your spending and show remaining budget in the dashboard.
              </p>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              
              {Object.keys(budgets).map(category => (
                <div key={category} className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-white/80">{category} Budget</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold">{campusCurrency}</span>
                    <input 
                      type="number"
                      min="0"
                      step="10"
                      value={budgets[category]}
                      onChange={(e) => handleChange(category, e.target.value)}
                      className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                      placeholder="No limit"
                    />
                  </div>
                </div>
              ))}

              <div className="flex flex-col gap-3 mt-6">
                <button 
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/20"
                >
                  Save Budget
                </button>
                <button 
                  type="button"
                  onClick={handleSkip}
                  className="w-full py-3.5 rounded-xl bg-white/5 text-white/70 font-semibold hover:bg-white/10 hover:text-white transition-all"
                >
                  Skip for Now
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
