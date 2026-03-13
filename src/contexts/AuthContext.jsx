import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // If Firebase config is missing, auth will be undefined. We can mock a guest user or stay null.

    const signup = (email, password) => {
        if (!auth) throw new Error("Firebase not configured");
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const login = (email, password) => {
        if (!auth) throw new Error("Firebase not configured");
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        if (!auth) throw new Error("Firebase not configured");
        return signOut(auth);
    };

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        login,
        signup,
        logout,
        isConfigured: !!auth
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
