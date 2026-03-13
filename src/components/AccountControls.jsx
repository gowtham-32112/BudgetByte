import React, { useState } from 'react';
import { Shield, LogOut, Trash2, X, Check } from 'lucide-react';
import useUserStore from '../store/userStore';
import { updatePassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export const AccountControls = () => {
    const currentUser = useUserStore((state) => state.currentUser);
    const logout = useUserStore((state) => state.logout);
    const deleteAccount = useUserStore((state) => state.deleteAccount);
    const navigate = useNavigate();
    
    const [pwdError, setPwdError] = useState('');
    const [pwdMsg, setPwdMsg] = useState('');
    const [isChangingPwd, setIsChangingPwd] = useState(false);
    const [oldPwd, setOldPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');

    const handlePasswordChangeSubmit = async (e) => {
        e.preventDefault();
        if (newPwd.length < 8) {
            setPwdError('New password must be at least 8 characters long.');
            setPwdMsg('');
            return;
        }

        try {
            setPwdError('');
            setPwdMsg('');
            
            // Re-authenticate user with their old password
            const credential = EmailAuthProvider.credential(currentUser.email, oldPwd);
            await reauthenticateWithCredential(currentUser, credential);
            
            // Proceed to setup new password
            await updatePassword(currentUser, newPwd);
            
            setPwdMsg('Password updated successfully.');
            setIsChangingPwd(false);
            setOldPwd('');
            setNewPwd('');
        } catch (err) {
            console.error(err);
            setPwdError('Failed to change password. Please check your old password and try again.');
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            try {
                await deleteUser(currentUser);
                await logout(); 
                navigate('/');
            } catch (err) {
                alert("Failed to delete account. You may need to log out and log back in to perform this action because of Firebase security requirements.");
            }
        }
    };

    return (
        <div className="glass rounded-3xl p-6 border border-white/10 custom-shadow w-full">
            <h3 className="text-lg font-bold text-white mb-6">Account Controls</h3>
            
            {pwdError && <p className="text-xs text-red-500 bg-red-500/10 p-3 rounded-xl mb-4 border border-red-500/20">{pwdError}</p>}
            {pwdMsg && <p className="text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-xl mb-4 border border-emerald-500/20">{pwdMsg}</p>}

            <div className="flex flex-col gap-3">
                
                {!isChangingPwd ? (
                    <button 
                        onClick={() => setIsChangingPwd(true)}
                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center"><Shield size={16} /></div>
                            <span className="font-medium text-white/90">Change Password</span>
                        </div>
                    </button>
                ) : (
                    <form onSubmit={handlePasswordChangeSubmit} className="flex flex-col gap-3 p-4 rounded-2xl bg-black/40 border border-white/10 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-2">
                           <span className="text-sm font-semibold text-white/90">Verify Credentials</span>
                           <button type="button" onClick={() => setIsChangingPwd(false)} className="text-white/40 hover:text-white transition-colors">
                              <X size={16} />
                           </button>
                        </div>
                        <input
                            type="password"
                            required
                            placeholder="Current Password"
                            value={oldPwd}
                            onChange={(e) => setOldPwd(e.target.value)}
                            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
                        />
                        <input
                            type="password"
                            required
                            placeholder="New Password (min 8 chars)"
                            value={newPwd}
                            onChange={(e) => setNewPwd(e.target.value)}
                            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
                        />
                        <button type="submit" className="w-full mt-2 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                           <Check size={16} /> Update Password
                        </button>
                    </form>
                )}

                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center"><LogOut size={16} /></div>
                        <span className="font-medium text-white/90">Log Out</span>
                    </div>
                </button>

                <button 
                    onClick={handleDeleteAccount}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all group mt-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors"><Trash2 size={16} /></div>
                        <span className="font-medium text-red-500 group-hover:text-red-400">Delete Account</span>
                    </div>
                </button>
            </div>
        </div>
    );
};
