import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth, db } from '../services/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';

const useUserStore = create(
    persist(
        (set, get) => ({
            currentUser: null,
            userProfile: null,
            homeCurrency: 'USD',
            campusCurrency: 'EUR',
            loading: true,
            error: null,

            // Authentication Methods
            signup: async (email, password, profileData) => {
                try {
                    set({ loading: true, error: null });
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;

                    // Save extended profile to Firestore
                    const profileRef = doc(db, `users/${user.uid}`);
                    await setDoc(profileRef, profileData);

                    set({ 
                        currentUser: user, 
                        userProfile: profileData, 
                        homeCurrency: profileData.homeCurrency || 'USD',
                        campusCurrency: profileData.campusCurrency || 'EUR',
                        loading: false 
                    });
                    return user;
                } catch (error) {
                    set({ error: error.message, loading: false });
                    throw error;
                }
            },

            login: async (email, password) => {
                try {
                    set({ loading: true, error: null });
                    const userCredential = await signInWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;

                    // Fetch extended profile
                    const profileRef = doc(db, `users/${user.uid}`);
                    const profileSnap = await getDoc(profileRef);

                    let profileData = null;
                    if (profileSnap.exists()) {
                        profileData = profileSnap.data();
                    }

                    set({ 
                        currentUser: user, 
                        userProfile: profileData, 
                        homeCurrency: profileData?.homeCurrency || 'USD',
                        campusCurrency: profileData?.campusCurrency || 'EUR',
                        loading: false 
                    });
                    return user;
                } catch (error) {
                    set({ error: error.message, loading: false });
                    throw error;
                }
            },

            logout: async () => {
                try {
                    set({ loading: true, error: null });
                    await signOut(auth);
                    set({ currentUser: null, userProfile: null, loading: false });
                } catch (error) {
                    set({ error: error.message, loading: false });
                    throw error;
                }
            },

            updateProfile: async (updates) => {
                const { currentUser, userProfile } = get();
                if (!currentUser) return;

                try {
                    const profileRef = doc(db, `users/${currentUser.uid}`);
                    // Merge updates into firestore 
                    await setDoc(profileRef, updates, { merge: true });

                    // Update local state
                    set({ 
                        userProfile: { ...userProfile, ...updates },
                        homeCurrency: updates.homeCurrency || get().homeCurrency,
                        campusCurrency: updates.campusCurrency || get().campusCurrency
                    });
                } catch (error) {
                    set({ error: error.message });
                    throw error;
                }
            },

            // Listener init
            initAuthListener: () => {
                if (!auth) {
                    set({ loading: false });
                    return () => {};
                }
                const unsubscribe = onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        try {
                            const profileRef = doc(db, `users/${user.uid}`);
                            const profileSnap = await getDoc(profileRef);

                            set({
                                currentUser: user,
                                userProfile: profileSnap.exists() ? profileSnap.data() : null,
                                homeCurrency: profileSnap.exists() && profileSnap.data().homeCurrency ? profileSnap.data().homeCurrency : 'USD',
                                campusCurrency: profileSnap.exists() && profileSnap.data().campusCurrency ? profileSnap.data().campusCurrency : 'EUR',
                                loading: false
                            });
                        } catch (err) {
                            console.error("Error fetching profile", err);
                            set({ currentUser: user, userProfile: null, loading: false });
                        }
                    } else {
                        set({ currentUser: null, userProfile: null, loading: false });
                    }
                });
                return unsubscribe;
            }
        }),
        {
            name: 'budgetbyte-user-storage',
            partialize: (state) => ({ 
                userProfile: state.userProfile,
                homeCurrency: state.homeCurrency,
                campusCurrency: state.campusCurrency 
            }) // Persist profile details like currency selections safely
        }
    )
);

export default useUserStore;
