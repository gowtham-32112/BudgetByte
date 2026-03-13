import React, { useState } from 'react';
import { Save, Loader2, User } from 'lucide-react';
import useUserStore from '../store/userStore';

const COUNTRIES = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'India', 'Japan', 'Brazil', 'Other'];

export const PersonalInfoForm = () => {
  const { userProfile, updateProfile } = useUserStore();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: userProfile?.fullName || '',
    university: userProfile?.university || '',
    country: userProfile?.country || ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;
    try {
      setSaving(true);
      await updateProfile({
        fullName: formData.fullName,
        university: formData.university,
        country: formData.country
      });
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
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
          <User size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Personal Information</h3>
          <p className="text-xs text-white/50">Update your basic profile details</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/70">Full Name *</label>
          <input
            type="text" name="fullName" value={formData.fullName} onChange={handleChange} required
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500/50"
          />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/70">University Name (Optional)</label>
          <input
            type="text" name="university" value={formData.university} onChange={handleChange}
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500/50"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/70">Country</label>
          <select 
            name="country" value={formData.country} onChange={handleChange}
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500/50"
          >
            <option value="">Select a country</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button
          type="submit" disabled={saving}
          className="w-full sm:w-auto px-6 py-3 mt-2 rounded-xl bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2 hover:bg-indigo-400 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Changes
        </button>
      </form>
    </div>
  );
};
