import React from 'react';
import { MapPin, GraduationCap, Calendar } from 'lucide-react';
import useUserStore from '../store/userStore';
import { format } from 'date-fns';

export const ProfileCard = () => {
  const { currentUser, userProfile } = useUserStore();

  if (!currentUser || !userProfile) return null;

  const initials = userProfile.fullName
    ? userProfile.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  const memberSince = currentUser.metadata?.creationTime 
    ? format(new Date(currentUser.metadata.creationTime), 'MMMM yyyy')
    : 'Unknown';

  return (
    <div className="glass rounded-3xl p-6 border border-white/10 relative overflow-hidden custom-shadow w-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
      
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-indigo-500/20 shrink-0">
          {initials}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-white mb-1">{userProfile.fullName}</h2>
          <p className="text-white/50 mb-4">{currentUser.email}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-white/70 justify-center md:justify-start">
              <GraduationCap size={16} className="text-indigo-400" />
              <span>{userProfile.university || 'No University Set'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70 justify-center md:justify-start">
              <MapPin size={16} className="text-rose-400" />
              <span>{userProfile.country || 'No Country Set'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70 justify-center md:justify-start">
              <Calendar size={16} className="text-emerald-400" />
              <span>Member Since: {memberSince}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
