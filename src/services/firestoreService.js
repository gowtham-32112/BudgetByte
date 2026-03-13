import { db, auth } from './firebase';
import { collection, doc, setDoc, getDocs, onSnapshot, query, writeBatch, deleteDoc } from 'firebase/firestore';

export const syncExpensesToFirestore = async (expenses) => {
    if (!auth?.currentUser || !db) return;

    const userId = auth.currentUser.uid;
    const expensesRef = collection(db, `users/${userId}/expenses`);

    const batch = writeBatch(db);
    expenses.forEach(exp => {
        const docRef = doc(expensesRef, exp.id);
        batch.set(docRef, exp);
    });

    await batch.commit();
};

export const syncBudgetsToFirestore = async (budgets) => {
    if (!auth?.currentUser || !db) return;

    const userId = auth.currentUser.uid;
    const budgetsRef = doc(db, `users/${userId}/settings/budgets`);

    await setDoc(budgetsRef, { data: budgets });
};

export const subscribeToUserData = (onExpensesChange, onBudgetsChange) => {
    if (!auth?.currentUser || !db) return () => { };

    const userId = auth.currentUser.uid;

    // Listen to expenses
    const expensesQuery = query(collection(db, `users/${userId}/expenses`));
    const unsubExpenses = onSnapshot(expensesQuery, (snapshot) => {
        const expenses = [];
        snapshot.forEach(doc => {
            expenses.push({ id: doc.id, ...doc.data() });
        });
        onExpensesChange(expenses);
    });

    // Listen to budgets
    const unsubBudgets = onSnapshot(doc(db, `users/${userId}/settings/budgets`), (docSnap) => {
        if (docSnap.exists()) {
            // Handle native Document array wraps safely
            const data = docSnap.data();
            onBudgetsChange(data.data || []);
        }
    });

    return () => {
        unsubExpenses();
        unsubBudgets();
    };
};
