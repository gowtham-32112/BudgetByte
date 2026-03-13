import React, { useState } from 'react';
import { Save, Loader2, Wallet } from 'lucide-react';
import useUserStore from '../store/userStore';
import useExpenseStore from '../store/expenseStore';

export const FinancialSettings = () => {
  const { userProfile, updateProfile, homeCurrency, campusCurrency } = useUserStore();
  const { syncRates } = useExpenseStore();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    homeCurrency: homeCurrency || 'USD',
    campusCurrency: campusCurrency || 'EUR',
    monthlyBudget: userProfile?.monthlyBudget || ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile({
        homeCurrency: formData.homeCurrency,
        campusCurrency: formData.campusCurrency,
        monthlyBudget: formData.monthlyBudget
      });
      // Update expense store dependencies explicitly
      syncRates();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (!userProfile) return null;

  return (
    <div className="glass rounded-3xl p-6 border border-white/10 custom-shadow w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <Wallet size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Financial Settings</h3>
          <p className="text-xs text-white/50">Manage your currency and budget limits</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/70">Home Currency</label>
            <select name="homeCurrency" value={formData.homeCurrency} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-emerald-500/50">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="INR">INR (₹)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AUD">AUD ($)</option>
                <option value="CAD">CAD ($)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CNY">CNY (¥)</option>
                <option value="SGD">SGD ($)</option>
                <option value="AED">AED (د.إ)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/70">Campus Currency</label>
            <select name="campusCurrency" value={formData.campusCurrency} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-emerald-500/50">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="INR">INR (₹)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AUD">AUD ($)</option>
                <option value="CAD">CAD ($)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CNY">CNY (¥)</option>
                <option value="SGD">SGD ($)</option>
                <option value="AED">AED (د.إ)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/70">Overall Monthly Budget</label>
          <input
            type="number" name="monthlyBudget" value={formData.monthlyBudget} onChange={handleChange} min="0" step="10"
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-emerald-500/50"
            placeholder="e.g. 1500"
          />
        </div>

        <button
          type="submit" disabled={saving}
          className="w-full sm:w-auto px-6 py-3 mt-2 rounded-xl bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Settings
        </button>
      </form>
    </div>
  );
};
