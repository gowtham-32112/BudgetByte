# BudgetByte
![BudgetByte Preview](https://budget-byte.vercel.app/)

**BudgetByte** is a beautiful, modern financial tracking dashboard designed specifically for university students. It simplifies tracking micro-expenses across different currencies, provides powerful visual insights into categorical spending, and makes it easy to stick to monthly budgets—all housed in an aesthetically pleasing glassmorphic UI.

---

## Key Features

*   **Multi-Currency Tracking**: Tailored for international students. Log expenses in your 'Campus Currency' and instantly see the real-time equivalent in your 'Home Currency' using the USD-anchored cross-rate engine powered by ExchangeRate-API.
*   **Visual Dashboards**: See exactly where your money goes with interactive Donut Charts, Temporal Spending Bar Charts (Weekly & Monthly), and a GitHub-style Activity Heatmap.
*   **Budgeting System**: Set strict limits per category and track your progress throughout the month visually.
*   **Smart Suggestions & Insights**: Intelligent, rule-based analytics highlight bad spending habits automatically (e.g., spending too much on weekends or coffee).
*   **OCR Receipt Scanner**: Simply point your phone or upload a receipt, and BudgetByte extracts the Amount, Date, and Merchant natively using Tesseract.js WebAssembly.
*   **Data Portability**: Instantly export your tracked expenses to cleanly formatted CSV or beautiful PDF reports with one click.
*   **Real-time Cloud Sync**: Powered by Firebase Backend Auth and Firestore, all data is synced instantly across devices. 

---

## Getting Started (Local Development)

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm (or yarn)

### Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/YOUR_USERNAME/budgetbyte.git
    cd BudgetByte
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Firebase Configuration**:
    Create a new Firebase Project at the [Firebase Console](https://console.firebase.google.com/). Enable "Authentication" (Email/Password) and "Firestore Database". 
    
    Create an `.env` file in the root directory and populate it with your Firebase configuration:
    ```env
    VITE_FIREBASE_API_KEY="your_api_key_here"
    VITE_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
    VITE_FIREBASE_PROJECT_ID="your_project_id"
    VITE_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
    VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
    VITE_FIREBASE_APP_ID="your_app_id"
    ```

### Running the App
Start the Vite development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser. Live reloading is enabled automatically.

---

## Built With
*   **React + Vite**: Fast, modern frontend architecture.
*   **Tailwind CSS**: Utility-first atomic styling, responsible for the glassmorphic aesthetics.
*   **Framer Motion**: Smooth entry, exit, and hover animations.
*   **Lucide React**: Crisp, modern icon set.
*   **Zustand**: Lightweight global state management.
*   **Firebase**: Authentication & Firestore Database.
*   **Recharts**: Composable React charting library.

---

## Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---
**Created by**: BudgetByte Team
