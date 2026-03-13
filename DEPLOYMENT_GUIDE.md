# Guide: Pushing to GitHub & Deploying BudgetByte

Congratulations on finishing the development of **BudgetByte**! Follow this guide to securely push your code to GitHub, manage your Firebase database, and deploy the app for the world to see via Vercel or Netlify.

---

## Part 1: Preparing & Pushing to GitHub

### 1. Protect Your Secrets (Already Done!)
I just updated your `.gitignore` file to ensure that `.env` and `.env.local` files are ignored. **This is critical.** Your Firebase API keys should NEVER be pushed to a public GitHub repository.

### 2. Initialize Git (If you haven't already)
Open your terminal in the `d:\BudgetByte` directory and run:
```bash
git init
git add .
git commit -m "Initial commit: BudgetByte MVP completed"
```

### 3. Create a GitHub Repository
1. Go to [GitHub](https://github.com/) and create a **New Repository**.
2. Name it `budgetbyte` (or similar). You can make it Public or Private.
3. Do **not** initialize with a README, .gitignore, or license (since you already have them locally).

### 4. Push Your Code
Copy the commands GitHub gives you under *"…or push an existing repository from the command line"*. It will look like this:
```bash
git remote add origin https://github.com/YOUR_USERNAME/budgetbyte.git
git branch -M main
git push -u origin main
```

---

## Part 2: Finalizing Your Firebase Database

Right now, your Firebase is set up, but you must make sure the **Firestore Database** rules are secure before deploying.

### 1. Update Firestore Security Rules
Go to the [Firebase Console](https://console.firebase.google.com/) -> Select your BudgetByte project -> Click **Firestore Database** -> Go to the **Rules** tab.

Replace the existing rules with these to ensure users can only read/write their *own* data:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read and write their own profile document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Users can only read and write their own expenses
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      // Allow creation if the user is assigning it to themselves
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```
Click **Publish**.

### 2. Enable Authentication Domains
If you deploy to a custom domain (e.g., `budgetbyte.vercel.app`), Firebase will block logins from that domain by default. 
1. Go to Firebase Console -> **Authentication** -> **Settings** -> **Authorized domains**.
2. Add the URL of where you will host the app (e.g., `budgetbyte.vercel.app` or your custom domain).

---

## Part 3: Deploying the Application

The easiest and best ways to deploy a Vite React app are **Vercel** or **Netlify**. Both are 100% free.

### Option A: Deploying to Vercel (Recommended)
1. Go to [Vercel](https://vercel.com/) and log in with your GitHub account.
2. Click **Add New** -> **Project**.
3. Import the `budgetbyte` repository you just pushed to GitHub.
4. **Environment Variables**: This is the most important step! In the deployment settings, find the "Environment Variables" section. You must copy/paste all the variables from your local `.env` file into Vercel:
   * `VITE_FIREBASE_API_KEY`
   * `VITE_FIREBASE_AUTH_DOMAIN`
   * `VITE_FIREBASE_PROJECT_ID`
   * `VITE_FIREBASE_STORAGE_BUCKET`
   * `VITE_FIREBASE_MESSAGING_SENDER_ID`
   * `VITE_FIREBASE_APP_ID`
5. Click **Deploy**. Vercel will build the app and give you a live URL in about 2 minutes.

### Option B: Deploying to Netlify
1. Go to [Netlify](https://www.netlify.com/) and log in with GitHub.
2. Click **Add new site** -> **Import an existing project**.
3. Select GitHub and choose your `budgetbyte` repository.
4. Netlify usually auto-detects the build settings (`npm run build` and `dist` directory).
5. Click **Show advanced** and add your **Environment Variables** (just like in the Vercel steps above).
6. Click **Deploy site**.

### Post-Deployment Checklist
* [ ] Does the app load without a white screen?
* [ ] Can you log in / sign up?
* [ ] Can you add an expense and see it save after refreshing?

If everything answers yes, congratulations—you have successfully launched BudgetByte!
