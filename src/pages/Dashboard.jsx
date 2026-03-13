import React, { useState } from 'react';
import Header from '../components/Header';
import ExpenseChart from '../components/ExpenseChart';
import ExpenseList from '../components/ExpenseList';
import AddExpenseButton from '../components/AddExpenseButton';
import ExpenseModal from '../components/ExpenseModal';
import { BudgetOverview } from '../components/BudgetOverview';
import { SpendingInsights } from '../components/SpendingInsights';
import { WeeklyChart } from '../components/WeeklyChart';
import { MonthlyChart } from '../components/MonthlyChart';
import { SmartSuggestions } from '../components/SmartSuggestions';
import { SpendingHeatmap } from '../components/SpendingHeatmap';
import { CategoryDetailPanel } from '../components/CategoryDetailPanel';
import useExpenseStore from '../store/expenseStore';
import useUserStore from '../store/userStore';
import { exportToCSV, exportToPDF } from '../utils/export';
import { Download, FileText, FileSpreadsheet, Wallet } from 'lucide-react';

import { BudgetSetupModal } from '../components/BudgetSetupModal';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const { expenses, currentViewCurrency, getConversionRate } = useExpenseStore();
  const { campusCurrency, homeCurrency } = useUserStore();

  const activeCurrencyCode = currentViewCurrency === 'campus' ? campusCurrency : homeCurrency;

  const totalSpent = expenses.reduce((acc, exp) => {
    const amount = currentViewCurrency === 'campus' ? exp.amount : exp.amount * getConversionRate();
    return acc + amount;
  }, 0);

  const handleExportCSV = () => exportToCSV(expenses, activeCurrencyCode);
  const handleExportPDF = () => exportToPDF(expenses, activeCurrencyCode, totalSpent);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8 pb-24 relative min-h-[calc(100vh-80px)]">

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Financial Dashboard
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all flex items-center gap-2"
            >
              <FileSpreadsheet size={16} className="text-emerald-400" /> CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all flex items-center gap-2"
            >
              <FileText size={16} className="text-rose-400" /> PDF
            </button>
          </div>
        </div>

        {expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 text-indigo-400 rounded-3xl flex items-center justify-center mb-8 custom-shadow shadow-indigo-500/20">
              <Wallet size={48} />
            </div>
            <h2 className="text-4xl font-bold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Welcome to BudgetByte!
            </h2>
            <p className="text-white/50 max-w-md mx-auto mb-10 text-lg leading-relaxed">
              Looks like you're new here. Your dashboard will dynamically populate with beautiful charts, insights, and tracking limits once you log your first expense.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
              >
                + Add First Expense
              </button>
              <button 
                onClick={() => setIsBudgetModalOpen(true)}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold rounded-2xl transition-all"
              >
                Set Budget Limits
              </button>
            </div>
          </div>
        ) : (
          <>
            <SpendingInsights />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
              <WeeklyChart />
              <MonthlyChart />
            </div>

            <SpendingHeatmap />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <div className="flex flex-col gap-6">
                <div className="glass p-6 rounded-3xl shadow-lg border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -z-10" />

                  <h2 className="text-xl font-semibold mb-6">Spending Overview</h2>
                  <ExpenseChart />
                </div>

                <CategoryDetailPanel />
                <BudgetOverview onOpenBudgetModal={() => setIsBudgetModalOpen(true)} />
              </div>

              <div className="flex flex-col gap-6">
                <SmartSuggestions />
                <ExpenseList />
              </div>
            </div>
          </>
        )}

        <AddExpenseButton onClick={() => setIsModalOpen(true)} />
      </main>

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <BudgetSetupModal 
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
