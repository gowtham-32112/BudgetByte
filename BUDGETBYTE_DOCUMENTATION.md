# BudgetByte - Complete Project Documentation

## Project Overview
BudgetByte is a modern, comprehensive financial tracking application specifically tailored for university students. It addresses the unique challenges of student finances—such as managing tight budgets, understanding cross-border currency conversions (home vs. campus currency), and getting actionable insights through data visualization without the clutter of enterprise banking apps.

## Tech Stack
* **Frontend Framework**: React (Vite)
* **Styling & UI**: Tailwind CSS, Framer Motion (Animations), custom Glassmorphism designs
* **Icons**: `lucide-react`
* **State Management**: Zustand
* **Routing**: React Router (`react-router-dom`)
* **Backend/BaaS**: Firebase (Authentication & Cloud Firestore)
* **API Integrations**: ExchangeRate-API (live currency tracking)
* **Data Visualization**: Recharts, `react-calendar-heatmap`
* **Utilities**: `tesseract.js` (Receipt OCR), `jspdf` (Export to PDF), `date-fns` (Date formatting)

---

## Directory Architecture

### 1. `src/pages/`
The main top-level views of the application.
* **`LandingPage.jsx`**: The beautiful, unauthenticated marketing page. Showcases the app's features, visual abstracts, and a Contact Us section.
* **`Login.jsx` & `Signup.jsx`**: Authentication flows. Signup triggers an initial mandatory budget limits setup.
* **`Dashboard.jsx`**: The core authenticated view. Contains high-level spending summaries, insights, the charts, and recent expenses. Includes an Empty State for brand-new users.
* **`Transactions.jsx`**: A dedicated, paginated view for managing, filtering, and deleting past expenses.
* **`Profile.jsx`**: User settings. Houses the Profile Card, Personal Info, Financial Settings (currencies/budgets), Custom Categories, and Account Security controls.

### 2. `src/components/`
Modular, reusable UI blocks used across pages.
* **Core Layout**: `Header.jsx`, `Navbar.jsx`, `Footer.jsx`
* **Landing Page Elements**: `HeroSection.jsx`, `FeatureSection.jsx`, `ProblemSection.jsx`, `ProductPreview.jsx`, `CTASection.jsx`, `ContactSection.jsx`
* **Dashboard Widgets**: 
  * `BudgetOverview.jsx`: Visual progress bars of category limits.
  * `ExpenseChart.jsx`: Recharts Donut chart showing categorical breakdown.
  * `WeeklyChart.jsx` / `MonthlyChart.jsx`: Bar charts for temporal trend analysis.
  * `SpendingHeatmap.jsx`: GitHub-style calendar heatmap of spending activity.
  * `SpendingInsights.jsx` & `SmartSuggestions.jsx`: AI-like rule-based financial advice dynamically generated from user habits.
  * `CategoryDetailPanel.jsx`: Drills down into specific categories.
* **Modals & Forms**:
  * `ExpenseModal.jsx`: Core form to add/edit expenses, featuring OCR receipt scanning functionality.
  * `BudgetSetupModal.jsx`: Interface for setting spending limits.
  * `CategoryModal.jsx`: Interface for creating custom visual categories.
* **Lists/Action**: `ExpenseList.jsx`, `AddExpenseButton.jsx`, `CurrencyToggle.jsx`, `ReceiptScanner.jsx`.
* **Profile Grids**: `ProfileCard.jsx`, `PersonalInfoForm.jsx`, `FinancialSettings.jsx`, `CategoryManager.jsx`, `SpendingSummary.jsx`, `AccountControls.jsx`.

### 3. `src/store/`
Zustand global state controllers.
* **`userStore.js`**: Handles Firebase Auth state, fetching real-time user documents from Firestore (name, uni, currencies), and orchestrating login/logout/signup logic.
* **`expenseStore.js`**: Houses array of expenses, custom categories, budget limits, current active display currency, and handles real-time fetching logic from ExchangeRate-API. Provides stable cross-rate calculations based on USD anchoring.

### 4. `src/services/`
External integrations.
* **`firebase.js`**: Firebase app initialization.
* **`authService.js`**: Dedicated logic for complex Firebase Auth calls (used extensively by userStore).
* **`firestoreService.js`**: Dedicated functions for CRUD operations on Firebase Collections (saving/syncing expenses to the cloud).
* **`currencyService.js`**: Axios wrappers for pinging external ExchangeRate endpoints.

### 5. `src/utils/`
Helper functions.
* **`converter.js`**: Shared logic for currency number formatting logic.
* **`export.js`**: Routines utilizing `jspdf` to export financial data to local PDFs, and standard CSV compilation.

---

## Core Lifecycles & Flows

### Authentication & Synchronization (`App.jsx`)
When a user logs in, `userStore` authenticates via Firebase. The `DataSyncer` wrapper component universally detects the newly logged-in user and calls `subscribeToUserData()` from the Firestore Service. This listens for real-time remote updates, hydrating `expenseStore` with the correct expenses, categories, and budgets instantly.

### Currency Conversion Matrix
Instead of direct A-to-B conversion which is limited by standard free APIs, BudgetByte uses a **USD-Anchored Cross-Rate Calculator**.
1. `expenseStore.syncRates()` fetches all global rates relative to USD.
2. If a user's Campus Currency is EUR, and Home Currency is INR, the app calculates the relative weight: `EUR to USD` and `USD to INR`, ensuring mathematically accurate multi-currency support visually across the UI on the fly via `CurrencyToggle.jsx`.

### Receipt OCR Flow
Inside `ExpenseModal`, a user can upload a photo of a receipt. `ReceiptScanner.jsx` uses Tesseract.js (WebAssembly text recognition) to scan the image for dates, merchant names (capitalized words near the top), and the largest numerical value (Amount). It automatically populates the form inputs for a zero-friction experience.
