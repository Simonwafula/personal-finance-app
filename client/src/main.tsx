import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import RequireAuth from "./components/RequireAuth";
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
import { TimeRangeProvider } from "./contexts/TimeRangeContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
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
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const SavingsPage = React.lazy(() => import("./pages/SavingsPage"));
const InvestmentsPage = React.lazy(() => import("./pages/InvestmentsPage"));
const CategoriesPage = React.lazy(() => import("./pages/CategoriesPage"));
const SubscriptionsPage = React.lazy(() => import("./pages/SubscriptionsPage"));
const NotificationsPage = React.lazy(() => import("./pages/NotificationsPage"));
const BlogPage = React.lazy(() => import("./pages/BlogPage"));
const BlogArticle = React.lazy(() => import("./pages/blog/BlogArticle"));
const ReportsPage = React.lazy(() => import("./pages/ReportsPage"));
const NotFoundPage = React.lazy(() => import("./pages/NotFoundPage"));

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
        <TimeRangeProvider>
          <Suspense fallback={<div className="app-container p-4">Loading…</div>}>
            <Routes>
              {/* Standalone landing page without layout */}
              <Route path="/" element={<ErrorBoundary><LandingPage /></ErrorBoundary>} />
              
              {/* Auth and app routes with layout */}
              <Route path="/" element={<ErrorBoundary><Layout /></ErrorBoundary>}>
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                <Route path="reset-password" element={<ResetPasswordPage />} />
                <Route path="oauth-callback" element={<OAuthCallback />} />

                {/* Protected application routes */}
                <Route path="dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
                <Route path="transactions" element={<RequireAuth><TransactionsPage /></RequireAuth>} />
                <Route path="budgets" element={<RequireAuth><BudgetsPage /></RequireAuth>} />
                <Route path="wealth" element={<RequireAuth><WealthPage /></RequireAuth>} />
                <Route path="debt" element={<RequireAuth><DebtPlannerPage /></RequireAuth>} />
                <Route path="accounts" element={<RequireAuth><AccountsPage /></RequireAuth>} />
                <Route path="profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
                <Route path="savings" element={<RequireAuth><SavingsPage /></RequireAuth>} />
                <Route path="investments" element={<RequireAuth><InvestmentsPage /></RequireAuth>} />
                <Route path="categories" element={<RequireAuth><CategoriesPage /></RequireAuth>} />
                <Route path="subscriptions" element={<RequireAuth><SubscriptionsPage /></RequireAuth>} />
                <Route path="notifications" element={<RequireAuth><NotificationsPage /></RequireAuth>} />
                <Route path="reports" element={<RequireAuth><ReportsPage /></RequireAuth>} />
                <Route path="blog" element={<RequireAuth><BlogPage /></RequireAuth>} />
                <Route path="blog/:slug" element={<RequireAuth><BlogArticle /></RequireAuth>} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Suspense>
        </TimeRangeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
