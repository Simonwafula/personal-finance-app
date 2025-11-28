import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Layout from "./components/Layout";
import { TimeRangeProvider } from "./contexts/TimeRangeContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Suspense } from "react";

const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const TransactionsPage = React.lazy(() => import("./pages/TransactionsPage"));
const BudgetsPage = React.lazy(() => import("./pages/BudgetsPage"));
const WealthPage = React.lazy(() => import("./pages/WealthPage"));
const DebtPlannerPage = React.lazy(() => import("./pages/DebtPlannerPage"));
const AccountsPage = React.lazy(() => import("./pages/AccountsPage"));
const SignupPage = React.lazy(() => import("./pages/SignupPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const ForgotPasswordPage = React.lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = React.lazy(() => import("./pages/ResetPasswordPage"));
const OAuthCallback = React.lazy(() => import("./pages/OAuthCallback"));

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <TimeRangeProvider>
          <Suspense fallback={<div className="app-container p-4">Loading…</div>}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<DashboardPage />} />
                <Route path="transactions" element={<TransactionsPage />} />
                <Route path="budgets" element={<BudgetsPage />} />
                <Route path="wealth" element={<WealthPage />} />
                <Route path="debt" element={<DebtPlannerPage />} />
                <Route path="accounts" element={<AccountsPage />} />
                <Route path="signup" element={<SignupPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                <Route path="reset-password" element={<ResetPasswordPage />} />
                <Route path="oauth-callback" element={<OAuthCallback />} />
              </Route>
            </Routes>
          </Suspense>
        </TimeRangeProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
