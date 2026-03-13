import React from 'react';
import useExpenseStore from '../store/expenseStore';
import useUserStore from '../store/userStore';
import { ArrowLeftRight } from 'lucide-react';

const CurrencyToggle = () => {
  const { 
    currentViewCurrency, 
    toggleCurrencyView 
  } = useExpenseStore();
  const { campusCurrency, homeCurrency } = useUserStore();

  return (
    <button 
      onClick={toggleCurrencyView}
      className={`relative inline-flex items-center justify-between p-1 rounded-full w-48 transition-all duration-300 ${
        currentViewCurrency === 'campus' 
          ? 'bg-blue-600/30 border border-blue-500/50' 
          : 'bg-emerald-600/30 border border-emerald-500/50'
      }`}
    >
      <div 
        className={`absolute inset-y-1 w-[calc(50%-4px)] rounded-full transition-transform duration-300 ease-out ${
          currentViewCurrency === 'campus' 
            ? 'translate-x-[2px] bg-blue-500' 
            : 'translate-x-[calc(100%+2px)] bg-emerald-500'
        }`}
      />
      
      <span 
        className={`relative w-1/2 text-center text-xs font-semibold z-10 transition-colors ${
          currentViewCurrency === 'campus' ? 'text-white' : 'text-slate-400'
        }`}
      >
        {campusCurrency} (Campus)
      </span>
      
      <div className="absolute left-1/2 -translate-x-1/2 z-20 text-white/50 bg-[#141414] rounded-full p-0.5 border border-white/10">
        <ArrowLeftRight size={12} />
      </div>

      <span 
        className={`relative w-1/2 text-center text-xs font-semibold z-10 transition-colors ${
          currentViewCurrency === 'home' ? 'text-white' : 'text-slate-400'
        }`}
      >
        {homeCurrency} (Home)
      </span>
    </button>
  );
};

export default CurrencyToggle;
