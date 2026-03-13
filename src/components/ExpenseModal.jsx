import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import useExpenseStore from '../store/expenseStore';
import useUserStore from '../store/userStore';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import ReceiptScanner from './ReceiptScanner';
import { CategoryModal } from './CategoryModal';

const ExpenseModal = ({ isOpen, onClose }) => {
  const { addExpense, categories } = useExpenseStore();
  const { campusCurrency } = useUserStore();
  const currentUser = useUserStore(state => state.currentUser);

  const userCategories = useMemo(() => {
     return categories.filter(cat => cat.userId === currentUser?.uid || cat.userId === 'system' || !cat.userId);
  }, [categories, currentUser]);

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(userCategories[0]?.name || '');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  React.useEffect(() => {
    if (isOpen && !category && userCategories.length > 0) {
      setCategory(userCategories[0].name);
    }
  }, [isOpen, category, userCategories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return;

    const submittedDate = date ? new Date(date).toISOString() : new Date().toISOString();

    addExpense({
      id: uuidv4(),
      amount: parseFloat(amount),
      originalCurrency: campusCurrency,
      category,
      description,
      date: submittedDate
    });

    setAmount('');
    setDescription('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    if (userCategories.length > 0) setCategory(userCategories[0].name);
    onClose();
  };

  const handleScanComplete = (extractedData) => {
    if (extractedData.amount) setAmount(extractedData.amount);
    if (extractedData.description) setDescription(extractedData.description);
    if (extractedData.date) {
      try {
        const parts = extractedData.date.split('/');
        if (parts.length === 3) {
           let formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // assuming DD/MM/YYYY
           if (parts[0].length === 4) {
             formattedDate = `${parts[0]}-${parts[1]}-${parts[2]}`; // assuming YYYY/MM/DD
           }
           setDate(formattedDate);
        }
      } catch (e) {
        // fail silently for date bounds
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <React.Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1A1A1A] border border-white/10 w-full max-w-md rounded-3xl p-6 custom-shadow relative"
            >
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-white">Add Expense</h2>

              <ReceiptScanner onScanComplete={handleScanComplete} />

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {/* Amount */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-white/70">Amount ({campusCurrency})</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Category Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-white/70">Category</label>
                  <div className="grid grid-cols-2 gap-3">
                    {userCategories.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.name)}
                        className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${category === cat.name
                            ? 'border-white/50 bg-white/10 text-white'
                            : 'border-white/5 text-white/50 hover:bg-white/5'
                          }`}
                      >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-sm font-medium">{cat.name}</span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="py-2 px-3 rounded-xl border border-dashed border-white/20 text-white/50 hover:text-white hover:border-white/50 hover:bg-white/5 transition-all text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Plus size={14} /> Add Category
                    </button>
                  </div>
                </div>

                {/* Description and Date */}
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-white/70">Description</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                      placeholder="E.g. Coffee"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-white/70">Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/20 mt-2"
                >
                  Save Expense
                </button>
              </form>

            </motion.div>
          </motion.div>
        </React.Fragment>
        )}
      </AnimatePresence>

      <CategoryModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
      />
    </>
  );
};

export default ExpenseModal;
