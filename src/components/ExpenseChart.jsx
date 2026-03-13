import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import useExpenseStore from '../store/expenseStore';
import useUserStore from '../store/userStore';
import { formatCurrency } from '../utils/converter';

const ExpenseChart = () => {
  const { expenses, categories, currentViewCurrency, getConversionRate, toggleCurrencyView, selectedCategory, setSelectedCategory } = useExpenseStore();
  const { campusCurrency, homeCurrency } = useUserStore();

  const getCategoryColor = (catName) => {
    const cat = categories.find(c => c.name === catName);
    return cat ? cat.color : '#CCC';
  };
  
  // Calculate display currency amount
  const activeCurrencyCode = currentViewCurrency === 'campus' ? campusCurrency : homeCurrency;
  
  const getDisplayAmount = (expense) => {
    // Expense was logged in campus currency
    if (currentViewCurrency === 'campus') {
      return expense.amount; // assume all expenses are logged in campus currency for MVP
    } else {
      // Home currency
      return expense.amount * getConversionRate();
    }
  };

  const { categoryData, transactionData, total } = useMemo(() => {
    let totalAccumulator = 0;
    const catMap = {};
    const tData = [];

    expenses.forEach((exp) => {
      const displayAmount = getDisplayAmount(exp);
      totalAccumulator += displayAmount;
      
      // Category aggregation
      if (!catMap[exp.category]) {
        catMap[exp.category] = { name: exp.category, value: 0, color: getCategoryColor(exp.category) };
      }
      catMap[exp.category].value += displayAmount;

      // Transaction list
      tData.push({
        name: exp.description || exp.category,
        category: exp.category,
        date: exp.date,
        value: displayAmount,
        color: getCategoryColor(exp.category)
      });
    });

    return {
      categoryData: Object.values(catMap),
      transactionData: tData,
      total: totalAccumulator
    };
  }, [expenses, currentViewCurrency, getConversionRate]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="glass p-3 rounded-xl shadow-2xl border border-white/20">
          <p className="font-bold text-white mb-1">{data.name}</p>
          {data.date && <p className="text-xs text-white/60 mb-1">{new Date(data.date).toLocaleDateString()}</p>}
          <p className="font-semibold text-emerald-400">
            {formatCurrency(data.value, activeCurrencyCode)}
          </p>
          <p className="text-xs text-emerald-200 mt-1">
            {percentage}% of Total
          </p>
          {data.category && data.category !== data.name && (
            <div className="flex items-center gap-1 mt-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getCategoryColor(data.category) }} />
              <span className="text-xs text-white/80">{data.category}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  if (expenses.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center glass rounded-3xl p-6">
        <p className="text-white/40">No expenses recorded yet.</p>
      </div>
    );
  }

  const handleSliceClick = (entry) => {
    // entry could be from category ring (name = category) or transaction ring (category)
    const cat = entry.category || entry.name;
    if (selectedCategory === cat) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(cat);
    }
  };

  return (
    <div className="w-full h-96 relative glass rounded-3xl p-4 flex flex-col items-center justify-center">
      {/* Center Label for Total */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto cursor-pointer z-10 rounded-full hover:bg-white/5 transition-colors max-w-[150px] max-h-[150px] m-auto"
        onClick={toggleCurrencyView}
        title="Click to toggle currency"
      >
        <span className="text-xs uppercase tracking-wider text-white/50 mb-1">Total Spent</span>
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          {formatCurrency(total, activeCurrencyCode)}
        </span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<CustomTooltip />} />
          
          {/* Inner Ring: Categories */}
          <Pie
            data={categoryData}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            stroke="rgba(0,0,0,0.2)"
            strokeWidth={2}
            onClick={handleSliceClick}
            style={{ cursor: 'pointer' }}
          >
            {categoryData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                opacity={selectedCategory && selectedCategory !== entry.name ? 0.3 : 1}
              />
            ))}
          </Pie>

          {/* Outer Ring: Transactions */}
          <Pie
            data={transactionData}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={110}
            outerRadius={130}
            stroke="rgba(0,0,0,0.2)"
            strokeWidth={2}
            onClick={handleSliceClick}
             style={{ cursor: 'pointer' }}
          >
            {transactionData.map((entry, index) => (
              <Cell 
                key={`transaction-${index}`} 
                fill={entry.color} 
                opacity={selectedCategory && selectedCategory !== entry.category ? 0.2 : 0.6} 
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
