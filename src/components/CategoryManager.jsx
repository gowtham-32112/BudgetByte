import React, { useState } from 'react';
import { Settings, Plus, Edit2, Trash2 } from 'lucide-react';
import useExpenseStore from '../store/expenseStore';
import useUserStore from '../store/userStore';
import { CategoryModal } from './CategoryModal';

export const CategoryManager = () => {
  const { categories, deleteCategory } = useExpenseStore();
  const currentUser = useUserStore(state => state.currentUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const userCategories = categories.filter(cat => cat.userId === currentUser?.uid || cat.userId === 'system' || !cat.userId);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this category? Related expenses will be reassigned to your default fallback category.")) {
      deleteCategory(id, userCategories[0].id);
    }
  };

  const openEditModal = (cat) => {
    setCategoryToEdit(cat);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setCategoryToEdit(null), 300); // clear after animation
  };

  return (
    <div className="glass rounded-3xl p-6 border border-white/10 custom-shadow w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
            <Settings size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Expense Categories</h3>
            <p className="text-xs text-white/50">Manage your tracking categories</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all flex items-center justify-center"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar flex-1 max-h-80">
        {userCategories.map(cat => (
          <div key={cat.id} className="bg-black/20 border border-white/5 rounded-2xl p-3 flex items-center justify-between hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                <span role="img" aria-label={cat.name}>{cat.icon}</span>
              </div>
              <span className="font-semibold text-white/90">{cat.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => openEditModal(cat)}
                className="p-1.5 text-white/40 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors"
                title="Edit Category"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => handleDelete(cat.id)}
                className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                title="Delete Category"
                disabled={userCategories.length <= 1} // Prevent zero-categories
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <CategoryModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        categoryToEdit={categoryToEdit}
      />
    </div>
  );
};
