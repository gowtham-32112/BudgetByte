import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchExchangeRates, isCacheValid } from '../services/currencyService';
import { syncExpensesToFirestore, syncBudgetsToFirestore } from '../services/firestoreService';
import useUserStore from './userStore';

const useExpenseStore = create(
  persist(
    (set, get) => ({
      expenses: [],
      currentViewCurrency: 'home', // 'home' or 'campus'

      exchangeRates: null,
      lastRateFetch: null,

      selectedCategory: null,

      // Budgets now structured as arrays for strict User ID scoping
      budgets: [
        { id: 'b1', userId: 'system', category: 'Food', amount: 300 },
        { id: 'b2', userId: 'system', category: 'Rent', amount: 700 },
        { id: 'b3', userId: 'system', category: 'Books', amount: 100 },
        { id: 'b4', userId: 'system', category: 'Fun', amount: 150 }
      ],

      // Custom Categories scoped to user
      categories: [
        { id: 'cat-food', userId: 'system', name: 'Food', color: '#00ff00', icon: '🍔' },
        { id: 'cat-rent', userId: 'system', name: 'Rent', color: '#7DF9FF', icon: '🏠' },
        { id: 'cat-books', userId: 'system', name: 'Books', color: '#FFD700', icon: '📚' },
        { id: 'cat-fun', userId: 'system', name: 'Fun', color: '#FF1493', icon: '🎮' }
      ],

      // Actions
      addExpense: (expense) => set((state) => {
        const newExpenses = [...state.expenses, expense];
        syncExpensesToFirestore(newExpenses);
        return { expenses: newExpenses };
      }),

      addCategory: (category) => set((state) => {
        const userId = useUserStore.getState().currentUser?.uid || 'system';
        return {
          categories: [...state.categories, { ...category, userId }]
        };
      }),

      editCategory: (id, updatedCategory) => set((state) => ({
        categories: state.categories.map(cat => 
          cat.id === id ? { ...cat, ...updatedCategory } : cat
        )
      })),

      deleteCategory: (id, fallbackCategoryId) => set((state) => {
        const categoryToDelete = state.categories.find(c => c.id === id);
        if (!categoryToDelete) return state;
        
        const fallbackCategory = state.categories.find(c => c.id === fallbackCategoryId) || state.categories[0];
        const newExpenses = state.expenses.map(exp => 
          exp.category === categoryToDelete.name ? { ...exp, category: fallbackCategory.name } : exp
        );
        
        syncExpensesToFirestore(newExpenses);

        const newCategories = state.categories.filter(c => c.id !== id);
        return { 
          categories: newCategories,
          expenses: newExpenses
        };
      }),

      setBudget: (category, amount) => set((state) => {
        const userId = useUserStore.getState().currentUser?.uid || 'system';
        const exists = state.budgets.find(b => b.category === category && (b.userId === userId || b.userId === 'system' || !b.userId));
        
        let newBudgets;
        if (exists) {
          newBudgets = state.budgets.map(b => b.id === exists.id ? { ...b, amount } : b);
        } else {
          newBudgets = [...state.budgets, { id: Date.now().toString(), userId, category, amount }];
        }
        
        syncBudgetsToFirestore(newBudgets);
        return { budgets: newBudgets };
      }),

      setExpensesFromCloud: (expenses) => set({ expenses }),
      setBudgetsFromCloud: (budgets) => set({ budgets }),



      toggleCurrencyView: () => set((state) => ({
        currentViewCurrency: state.currentViewCurrency === 'home' ? 'campus' : 'home'
      })),

      setSelectedCategory: (category) => set({
        selectedCategory: category
      }),

      // Sync exchange rates to a stable base (USD) for cross-rate calc
      syncRates: async () => {
        const { lastRateFetch, exchangeRates } = get();
        
        // Force refresh if old API cache is present (missing USD base key)
        const isLegacyCache = exchangeRates && exchangeRates['USD'] === undefined;

        // If valid, skip
        if (isCacheValid(lastRateFetch) && !isLegacyCache) return;

        const rates = await fetchExchangeRates('USD');
        if (rates) {
          set({
            exchangeRates: rates,
            lastRateFetch: Date.now()
          });
        }
      },

      // Get current conversion rate from campus to home
      getConversionRate: () => {
        const homeCurrency = useUserStore.getState().homeCurrency || 'USD';
        const campusCurrency = useUserStore.getState().campusCurrency || 'EUR';
        const { exchangeRates } = get();
        
        if (homeCurrency === campusCurrency) return 1;

        if (!exchangeRates || !exchangeRates[homeCurrency] || !exchangeRates[campusCurrency]) {
          return 1; // Fallback if rates failed
        }

        // We convert FROM campus TO home using USD cross-rates
        // e.g. 1 USD = 84 INR, 1 USD = 1.5 AUD
        // 1 AUD = (84 / 1.5) INR
        return exchangeRates[homeCurrency] / exchangeRates[campusCurrency];
      }
    }),
    {
      name: 'budgetbyte-storage', // key in localStorage
    }
  )
);

export default useExpenseStore;
