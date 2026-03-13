import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children }) => {
    const { currentUser, isConfigured } = useAuth();

    // If Firebase isn't configured, we can either block them or let them use the app in offline/local MVP mode.
    // For Phase 4 demonstration, let's let them through locally if no Firebase config, but warn them, 
    // or just redirect to Login. Let's redirect to Login where they will see the "Missing Config" warning.
    if (!isConfigured) {
        // If not configured, we'll actually let them render the children so the MVP still works if they don't have .env!
        return <>{children}</>;
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
