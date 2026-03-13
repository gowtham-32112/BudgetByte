import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Transactions from './pages/Transactions';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import useExpenseStore from './store/expenseStore';
import useUserStore from './store/userStore';
import { subscribeToUserData } from './services/firestoreService';

function DataSyncer({ children }) {
  const currentUser = useUserStore(state => state.currentUser);
  const setExpensesFromCloud = useExpenseStore(state => state.setExpensesFromCloud);
  const setBudgetsFromCloud = useExpenseStore(state => state.setBudgetsFromCloud);
  const syncRates = useExpenseStore(state => state.syncRates);

  useEffect(() => {
    syncRates();
  }, [syncRates]);

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = subscribeToUserData(
        setExpensesFromCloud,
        setBudgetsFromCloud
      );
      return unsubscribe;
    }
  }, [currentUser, setExpensesFromCloud, setBudgetsFromCloud]);

  return <>{children}</>;
}

function App() {
  const syncRates = useExpenseStore(state => state.syncRates);

  useEffect(() => {
    // Initial fetch of exchange rates on app load
    syncRates();

    // Initialize userStore listener
    const unsubscribeUser = useUserStore.getState().initAuthListener();
    return () => {
        if (unsubscribeUser) unsubscribeUser();
    };
  }, [syncRates]);

  return (
    <div className="antialiased selection:bg-emerald-500/30">
      <AuthProvider>
        <DataSyncer>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions"
                element={
                  <ProtectedRoute>
                    <Transactions />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </DataSyncer>
      </AuthProvider>
    </div>
  );
}

export default App;
