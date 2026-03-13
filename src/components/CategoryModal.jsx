import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import useExpenseStore from '../store/expenseStore';
import useUserStore from '../store/userStore';
import { v4 as uuidv4 } from 'uuid';

const PRESET_COLORS = [
  '#00ff00', '#7DF9FF', '#FFD700', '#FF1493', '#9333ea', '#ef4444', '#f97316', '#14b8a6', '#3b82f6', '#ec4899', '#ffffff', '#a8a29e'
];

export const CategoryModal = ({ isOpen, onClose, categoryToEdit }) => {
  const { addCategory, editCategory, setBudget, budgets } = useExpenseStore();
  const { campusCurrency } = useUserStore();
  
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📦');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [budgetAmount, setBudgetAmount] = useState('');

  React.useEffect(() => {
    if (categoryToEdit && isOpen) {
      setName(categoryToEdit.name);
      setIcon(categoryToEdit.icon || '📦');
      setColor(categoryToEdit.color || PRESET_COLORS[0]);
      
      const existingBudget = budgets.find(b => b.category === categoryToEdit.name);
      setBudgetAmount(existingBudget ? existingBudget.amount.toString() : '0');
    } else if (isOpen) {
      setName('');
      setIcon('📦');
      setColor(PRESET_COLORS[0]);
      setBudgetAmount('');
    }
  }, [categoryToEdit, isOpen, budgets]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (categoryToEdit) {
      editCategory(categoryToEdit.id, {
        name: name.trim(),
        color,
        icon
      });
      setBudget(name.trim(), parseFloat(budgetAmount) || 0);
    } else {
      const newCat = {
        id: uuidv4(),
        name: name.trim(),
        color,
        icon
      };

      addCategory(newCat);
      setBudget(newCat.name, parseFloat(budgetAmount) || 0);
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1A1A1A] border border-white/10 w-full max-w-sm rounded-3xl p-6 custom-shadow relative"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-6 text-white">{categoryToEdit ? 'Edit Category' : 'New Category'}</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white/70">Category Name</label>
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                  placeholder="e.g. Transport"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white/70">Emoji Icon</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl border border-white/10">
                    {icon}
                  </div>
                  <input 
                    type="text"
                    required
                    maxLength={2}
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="flex-1 bg-[#0F0F0F] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all text-center text-xl"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white/70">Color Theme</label>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${color === c ? 'ring-2 ring-white scale-110' : 'hover:scale-110'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white/70">Category Budget ({campusCurrency})</label>
                <div className="relative">
                  <input 
                    type="number"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                    placeholder="E.g. 500"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/20 mt-4"
              >
                {categoryToEdit ? 'Save Changes' : 'Create Category'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
