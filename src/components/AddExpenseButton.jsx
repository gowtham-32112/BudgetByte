import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const AddExpenseButton = ({ onClick }) => {
  return (
    <div className="fixed bottom-8 right-8 z-40">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="h-14 w-14 lg:h-16 lg:w-16 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 flex items-center justify-center custom-shadow text-white hover:shadow-emerald-500/50 hover:shadow-2xl transition-all duration-300"
      >
        <Plus size={32} />
      </motion.button>
    </div>
  );
};

export default AddExpenseButton;
