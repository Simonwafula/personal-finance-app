import { useEffect, useState, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import Logo from "../components/Logo";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { fetchCurrentUser } from "../api/auth";
import "../styles/neumorphism.css";

// Small helper: consolidated Google auth anchor (avoids duplicated SVG + markup)
const GoogleAuthLink = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => (
  <a href="/api/auth/google" className={className}>
    <svg
      className="w-5 h-5 flex-shrink-0"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      style={{ width: "20px", height: "20px" }}
    >
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
    {children}
  </a>
);

// Demo data structures
interface DemoTransaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  account: string;
}

interface DemoAccount {
  name: string;
  balance: number;
}

interface CategoryTotal {
  name: string;
  amount: number;
  color: string;
}

interface DailyTotal {
  date: string;
  income: number;
  expenses: number;
}

// Calculator state types
interface BudgetInputs {
  income: number;
  rent: number;
  transport: number;
  food: number;
  savingsTarget: number;
}

interface DebtInputs {
  totalDebt: number;
  interestRate: number;
  monthlyPayment: number;
}

interface SavingsInputs {
  targetAmount: number;
  monthlySavings: number;
  expectedReturn: number;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [demoDateRange, setDemoDateRange] = useState<"30days" | "thisMonth">(
    "30days",
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  // Calculator states
  const [budgetInputs, setBudgetInputs] = useState<BudgetInputs>({
    income: 80000,
    rent: 25000,
    transport: 8000,
    food: 15000,
    savingsTarget: 15000,
  });

  const [debtInputs, setDebtInputs] = useState<DebtInputs>({
    totalDebt: 500000,
    interestRate: 14,
    monthlyPayment: 15000,
  });

  const [savingsInputs, setSavingsInputs] = useState<SavingsInputs>({
    targetAmount: 1000000,
    monthlySavings: 20000,
    expectedReturn: 8,
  });

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    fetchCurrentUser()
      .then(() => navigate("/dashboard"))
      .catch(() => {});
  }, [navigate]);

  // Sticky CTA on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 800);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Demo accounts
  const demoAccounts: DemoAccount[] = [
    { name: "KCB Salary", balance: 45000 },
    { name: "M-Pesa", balance: 12500 },
  ];

  // Demo transactions (2 months of data)
  const allDemoTransactions: DemoTransaction[] = [
    // November 2025
    {
      id: 1,
      date: "2025-11-25",
      description: "Monthly Salary",
      amount: 95000,
      type: "INCOME",
      category: "Salary",
      account: "KCB Salary",
    },
    {
      id: 2,
      date: "2025-11-24",
      description: "Rent Payment",
      amount: -35000,
      type: "EXPENSE",
      category: "Rent",
      account: "KCB Salary",
    },
    {
      id: 3,
      date: "2025-11-23",
      description: "Naivas Supermarket",
      amount: -8500,
      type: "EXPENSE",
      category: "Groceries",
      account: "M-Pesa",
    },
    {
      id: 4,
      date: "2025-11-22",
      description: "Uber to Town",
      amount: -450,
      type: "EXPENSE",
      category: "Transport",
      account: "M-Pesa",
    },
    {
      id: 5,
      date: "2025-11-21",
      description: "Safaricom Airtime",
      amount: -500,
      type: "EXPENSE",
      category: "Data/Airtime",
      account: "M-Pesa",
    },
    {
      id: 6,
      date: "2025-11-20",
      description: "Carrefour Shopping",
      amount: -6200,
      type: "EXPENSE",
      category: "Groceries",
      account: "KCB Salary",
    },
    {
      id: 7,
      date: "2025-11-18",
      description: "Matatu CBD",
      amount: -200,
      type: "EXPENSE",
      category: "Transport",
      account: "M-Pesa",
    },
    {
      id: 8,
      date: "2025-11-15",
      description: "Freelance Payment",
      amount: 15000,
      type: "INCOME",
      category: "Salary",
      account: "M-Pesa",
    },
    {
      id: 9,
      date: "2025-11-14",
      description: "Zucchini Greengrocer",
      amount: -3200,
      type: "EXPENSE",
      category: "Groceries",
      account: "M-Pesa",
    },
    {
      id: 10,
      date: "2025-11-12",
      description: "Safaricom Data Bundle",
      amount: -1500,
      type: "EXPENSE",
      category: "Data/Airtime",
      account: "M-Pesa",
    },
    {
      id: 11,
      date: "2025-11-10",
      description: "Uber Home",
      amount: -650,
      type: "EXPENSE",
      category: "Transport",
      account: "M-Pesa",
    },
    {
      id: 12,
      date: "2025-11-08",
      description: "Quickmart Groceries",
      amount: -4800,
      type: "EXPENSE",
      category: "Groceries",
      account: "KCB Salary",
    },
    {
      id: 13,
      date: "2025-11-05",
      description: "Boda Boda",
      amount: -150,
      type: "EXPENSE",
      category: "Transport",
      account: "M-Pesa",
    },
    {
      id: 14,
      date: "2025-11-03",
      description: "Airtel Airtime",
      amount: -300,
      type: "EXPENSE",
      category: "Data/Airtime",
      account: "M-Pesa",
    },
    {
      id: 15,
      date: "2025-11-01",
      description: "Naivas Weekend Shop",
      amount: -5600,
      type: "EXPENSE",
      category: "Groceries",
      account: "M-Pesa",
    },

    // October 2025
    {
      id: 16,
      date: "2025-10-25",
      description: "Monthly Salary",
      amount: 95000,
      type: "INCOME",
      category: "Salary",
      account: "KCB Salary",
    },
    {
      id: 17,
      date: "2025-10-24",
      description: "Rent Payment",
      amount: -35000,
      type: "EXPENSE",
      category: "Rent",
      account: "KCB Salary",
    },
    {
      id: 18,
      date: "2025-10-22",
      description: "Carrefour Shopping",
      amount: -7300,
      type: "EXPENSE",
      category: "Groceries",
      account: "KCB Salary",
    },
    {
      id: 19,
      date: "2025-10-20",
      description: "Uber to Office",
      amount: -500,
      type: "EXPENSE",
      category: "Transport",
      account: "M-Pesa",
    },
    {
      id: 20,
      date: "2025-10-18",
      description: "Safaricom Bundle",
      amount: -1500,
      type: "EXPENSE",
      category: "Data/Airtime",
      account: "M-Pesa",
    },
    {
      id: 21,
      date: "2025-10-15",
      description: "Side Gig Payment",
      amount: 12000,
      type: "INCOME",
      category: "Salary",
      account: "M-Pesa",
    },
    {
      id: 22,
      date: "2025-10-14",
      description: "Naivas Groceries",
      amount: -6800,
      type: "EXPENSE",
      category: "Groceries",
      account: "M-Pesa",
    },
    {
      id: 23,
      date: "2025-10-12",
      description: "Matatu Transport",
      amount: -180,
      type: "EXPENSE",
      category: "Transport",
      account: "M-Pesa",
    },
    {
      id: 24,
      date: "2025-10-10",
      description: "Quickmart Shop",
      amount: -5200,
      type: "EXPENSE",
      category: "Groceries",
      account: "KCB Salary",
    },
    {
      id: 25,
      date: "2025-10-08",
      description: "Uber Ride",
      amount: -720,
      type: "EXPENSE",
      category: "Transport",
      account: "M-Pesa",
    },
    {
      id: 26,
      date: "2025-10-05",
      description: "Airtime Top-up",
      amount: -400,
      type: "EXPENSE",
      category: "Data/Airtime",
      account: "M-Pesa",
    },
    {
      id: 27,
      date: "2025-10-03",
      description: "Zucchini Veggies",
      amount: -2900,
      type: "EXPENSE",
      category: "Groceries",
      account: "M-Pesa",
    },
  ];

  // Filter transactions based on date range
  const getFilteredTransactions = () => {
    const now = new Date("2025-11-30"); // Current date in demo
    let startDate: Date;

    if (demoDateRange === "30days") {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 30);
    } else {
      // This month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return allDemoTransactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return txDate >= startDate && txDate <= now;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  // Calculate category totals
  const getCategoryTotals = (): CategoryTotal[] => {
    const categoryMap = new Map<string, number>();
    const categoryColors: Record<string, string> = {
      Salary: "#10b981",
      Rent: "#ef4444",
      Groceries: "#f59e0b",
      Transport: "#3b82f6",
      "Data/Airtime": "#8b5cf6",
    };

    filteredTransactions
      .filter((tx) => tx.type === "EXPENSE")
      .forEach((tx) => {
        const current = categoryMap.get(tx.category) || 0;
        categoryMap.set(tx.category, current + Math.abs(tx.amount));
      });

    return Array.from(categoryMap.entries())
      .map(([name, amount]) => ({
        name,
        amount,
        color: categoryColors[name] || "#6b7280",
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  };

  // Calculate daily totals for chart
  const getDailyTotals = (): DailyTotal[] => {
    const dailyMap = new Map<string, { income: number; expenses: number }>();

    filteredTransactions.forEach((tx) => {
      const current = dailyMap.get(tx.date) || { income: 0, expenses: 0 };
      if (tx.type === "INCOME") {
        current.income += tx.amount;
      } else {
        current.expenses += Math.abs(tx.amount);
      }
      dailyMap.set(tx.date, current);
    });

    return Array.from(dailyMap.entries())
      .map(([date, totals]) => ({
        date: new Date(date).toLocaleDateString("en", {
          month: "short",
          day: "numeric",
        }),
        ...totals,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const categoryTotals = getCategoryTotals();
  const dailyTotals = getDailyTotals();
  const recentTransactions = filteredTransactions.slice(0, 5);

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter((tx) => tx.type === "INCOME")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpenses = filteredTransactions
    .filter((tx) => tx.type === "EXPENSE")
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  // Budget Calculator Logic
  const calculateBudget = () => {
    const totalExpenses =
      budgetInputs.rent + budgetInputs.transport + budgetInputs.food;
    const remaining =
      budgetInputs.income - totalExpenses - budgetInputs.savingsTarget;
    const recommended = {
      needs: budgetInputs.income * 0.5, // 50% needs
      wants: budgetInputs.income * 0.3, // 30% wants
      savings: budgetInputs.income * 0.2, // 20% savings
    };
    return {
      totalExpenses,
      remaining,
      recommended,
      isHealthy:
        budgetInputs.savingsTarget >= recommended.savings && remaining >= 0,
    };
  };

  // Debt Payoff Calculator Logic
  const calculateDebtPayoff = () => {
    const monthlyRate = debtInputs.interestRate / 100 / 12;
    let balance = debtInputs.totalDebt;
    let months = 0;
    let totalInterest = 0;

    if (debtInputs.monthlyPayment <= balance * monthlyRate) {
      return { months: Infinity, totalInterest: Infinity, totalPaid: Infinity };
    }

    while (balance > 0 && months < 600) {
      const interest = balance * monthlyRate;
      const principal = Math.min(debtInputs.monthlyPayment - interest, balance);
      totalInterest += interest;
      balance -= principal;
      months++;
    }

    return {
      months,
      totalInterest: Math.round(totalInterest),
      totalPaid: Math.round(debtInputs.totalDebt + totalInterest),
    };
  };

  // Savings Goal Calculator Logic
  const calculateSavingsGoal = () => {
    const monthlyRate = savingsInputs.expectedReturn / 100 / 12;
    let balance = 0;
    let months = 0;

    if (monthlyRate === 0) {
      months = Math.ceil(
        savingsInputs.targetAmount / savingsInputs.monthlySavings,
      );
      return {
        months,
        totalContributions: savingsInputs.monthlySavings * months,
        totalReturns: 0,
      };
    }

    while (balance < savingsInputs.targetAmount && months < 600) {
      balance = balance * (1 + monthlyRate) + savingsInputs.monthlySavings;
      months++;
    }

    const totalContributions = savingsInputs.monthlySavings * months;
    const totalReturns = Math.round(
      savingsInputs.targetAmount - totalContributions,
    );

    return { months, totalContributions, totalReturns };
  };

  const budgetCalc = calculateBudget();
  const debtCalc = calculateDebtPayoff();
  const savingsCalc = calculateSavingsGoal();

  interface TrendPoint {
    month: string;
    income: number;
    expenses: number;
  }
  interface Transaction {
    id: number;
    desc: string;
    amount: number;
    type: string;
    date: string;
  }

  // Simple deterministic sample data (no randomness / side effects)
  const spendTrend: TrendPoint[] = Array.from({ length: 6 }).map((_, i) => ({
    month: new Date(2025, 5 + i, 1).toLocaleString("en", { month: "short" }),
    income: 80000 + i * 1500 + (i % 3) * 2200,
    expenses: 50000 + i * 1200 + (i % 4) * 1800,
  }));

  const sampleTransactions: Transaction[] = [
    {
      id: 1,
      desc: "Monthly Salary",
      amount: 95000,
      type: "INCOME",
      date: "Nov 25",
    },
    {
      id: 2,
      desc: "Rent Payment",
      amount: -35000,
      type: "EXPENSE",
      date: "Nov 24",
    },
    {
      id: 3,
      desc: "Grocery Shopping",
      amount: -8500,
      type: "EXPENSE",
      date: "Nov 23",
    },
    {
      id: 4,
      desc: "Transport - Uber",
      amount: -1200,
      type: "EXPENSE",
      date: "Nov 22",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <PublicHeader />

      {/* Sticky CTA Bar */}
      {showStickyCTA && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-lg animate-slide-down">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo className="h-8 w-auto" />
              <span className="font-bold text-gray-900 dark:text-white">
                Personal Finance
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Try Demo
              </button>
              <GoogleAuthLink className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all">
                Sign Up Free
              </GoogleAuthLink>
            </div>
          </div>
        </div>
      )}

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 -left-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* ============================================
            SECTION A: HERO + SIMPLE CTA
            ============================================ */}
        <section className="pt-8 pb-16 animate-fade-in">
          {/* Logo Header */}
          <div className="flex justify-center mb-12">
            <Logo width={60} height={60} />
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-12 items-start">
            {/* LEFT: Headline + CTA */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                  <span className="block text-gray-900 dark:text-white">
                    Get a clear picture of
                  </span>
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                    your money in one place.
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
                  Track M-Pesa, bank accounts, SACCO, investments and debts in a
                  single dashboard.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="/signup"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all w-auto"
                >
                  <svg
                    className="w-6 h-6 flex-shrink-0"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    style={{
                      minWidth: "24px",
                      maxWidth: "24px",
                      width: "24px",
                      height: "24px",
                    }}
                  >
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Sign Up</span>
                </a>

                <button
                  onClick={() => {
                    const demoSection = document.querySelector(
                      '[data-section="demo"]',
                    );
                    demoSection?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl border-2 border-gray-300 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all whitespace-nowrap w-auto"
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{
                      minWidth: "20px",
                      maxWidth: "20px",
                      width: "20px",
                      height: "20px",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span>Try a live demo</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 flex-shrink-0 text-green-500"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    style={{ width: "20px", height: "20px" }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">
                    No signup required for demo
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 flex-shrink-0 text-green-500"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    style={{ width: "20px", height: "20px" }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">Secure & private</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Mini Dashboard Preview */}
            <div className="relative">
              {/* Privacy blur overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 dark:to-gray-900/10 pointer-events-none z-10 rounded-3xl"></div>

              <div className="neu-card p-6 space-y-6 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
                {/* Net Worth Box */}
                <div className="neu-stat-card p-6 text-center">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Current Net Worth
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text">
                    KES 2,450,000
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-3 text-sm">
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ width: "16px", height: "16px" }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                      <span className="font-semibold">+12.5%</span>
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      vs last month
                    </span>
                  </div>
                </div>

                {/* Monthly Income vs Expense Chart */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 flex-shrink-0 text-blue-500"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ width: "20px", height: "20px" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                      />
                    </svg>
                    Income vs Expenses (6 months)
                  </h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={spendTrend}>
                      <defs>
                        <linearGradient
                          id="heroIncome"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="heroExpense"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#ef4444"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#ef4444"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{
                          background: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="income"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="url(#heroIncome)"
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="#ef4444"
                        strokeWidth={2}
                        fill="url(#heroExpense)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="flex items-center justify-center gap-6 mt-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Income
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Expenses
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sample Transactions */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 flex-shrink-0 text-purple-500"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ width: "20px", height: "20px" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Recent Transactions
                  </h3>
                  <div className="space-y-2">
                    {sampleTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        style={{ filter: "blur(0.3px)" }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              tx.type === "INCOME"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                            }`}
                          >
                            {tx.type === "INCOME" ? "↓" : "↑"}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                              {tx.desc}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {tx.date}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`font-bold text-sm ${
                            tx.amount > 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {tx.amount > 0 ? "+" : ""}
                          {tx.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-4">
                    <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                      Preview with sample data • Sign in to see your real
                      transactions
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            SECTION B: INTERACTIVE DEMO DASHBOARD
            ============================================ */}
        <section className="py-16 animate-fade-in" data-section="demo">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold mb-4">
                🎮 Interactive Demo • No Account Required
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Try it out with{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                  sample data
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Explore real features with demo transactions. Change date
                ranges, click on categories, and see how everything works.
              </p>
            </div>

            <div className="neu-card p-6 md:p-8 space-y-8">
              {/* Time Range Selector */}
              <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    📅 Change Date Range
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Watch the charts and totals update in real-time
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDemoDateRange("30days")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      demoDateRange === "30days"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    Last 30 Days
                  </button>
                  <button
                    onClick={() => setDemoDateRange("thisMonth")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      demoDateRange === "thisMonth"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    This Month
                  </button>
                </div>
              </div>

              {/* Demo Accounts */}
              <div className="grid sm:grid-cols-2 gap-4">
                {demoAccounts.map((account) => (
                  <div key={account.name} className="neu-stat-card p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {account.name}
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          KES {account.balance.toLocaleString()}
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl">
                        {account.name.includes("KCB") ? "🏦" : "📱"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Range Control */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Dashboard Overview
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDemoDateRange("30days")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      demoDateRange === "30days"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    Last 30 Days
                  </button>
                  <button
                    onClick={() => setDemoDateRange("thisMonth")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      demoDateRange === "thisMonth"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    This Month
                  </button>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="neu-stat-card p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 flex-shrink-0 text-green-600 dark:text-green-400"
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ width: "24px", height: "24px" }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Income
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    KES {totalIncome.toLocaleString()}
                  </div>
                </div>

                <div className="neu-stat-card p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 flex-shrink-0 text-red-600 dark:text-red-400"
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ width: "24px", height: "24px" }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                        />
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Expenses
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    KES {totalExpenses.toLocaleString()}
                  </div>
                </div>

                <div className="neu-stat-card p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 flex-shrink-0 text-blue-600 dark:text-blue-400"
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ width: "24px", height: "24px" }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Net Balance
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    KES {(totalIncome - totalExpenses).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Income vs Expenses Chart */}
                <div className="neu-stat-card p-5">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 flex-shrink-0 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                      />
                    </svg>
                    Income vs Expenses
                  </h4>
                  {dailyTotals.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={dailyTotals}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#e5e7eb"
                          opacity={0.5}
                        />
                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
                        <YAxis stroke="#9ca3af" fontSize={11} />
                        <Tooltip
                          contentStyle={{
                            background: "rgba(255, 255, 255, 0.95)",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                        />
                        <Bar
                          dataKey="income"
                          fill="#10b981"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="expenses"
                          fill="#ef4444"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-gray-500">
                      No data for selected period
                    </div>
                  )}
                </div>

                {/* Top Categories Chart */}
                <div className="neu-stat-card p-5">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 flex-shrink-0 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Top 5 Categories
                  </h4>
                  {categoryTotals.length > 0 ? (
                    <div className="space-y-3">
                      {categoryTotals.map((cat) => (
                        <div key={cat.name}>
                          <button
                            onClick={() => setSelectedCategory(cat.name)}
                            className="w-full text-left hover:scale-[1.02] transition-transform"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {cat.name}
                              </span>
                              <span className="text-sm font-bold text-gray-900 dark:text-white">
                                KES {cat.amount.toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full transition-all duration-500"
                                style={{
                                  width: `${(cat.amount / totalExpenses) * 100}%`,
                                  backgroundColor: cat.color,
                                }}
                              />
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-gray-500">
                      No expenses for selected period
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Transactions Table */}
              <div className="neu-stat-card p-5">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 flex-shrink-0 text-indigo-500"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ width: "20px", height: "20px" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Last 5 Transactions
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                          Date
                        </th>
                        <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                          Description
                        </th>
                        <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                          Category
                        </th>
                        <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                          Account
                        </th>
                        <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((tx) => (
                        <tr
                          key={tx.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-400">
                            {new Date(tx.date).toLocaleDateString("en", {
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="py-3 px-2 text-sm font-medium text-gray-900 dark:text-white">
                            {tx.description}
                          </td>
                          <td className="py-3 px-2">
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                              {tx.category}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-400">
                            {tx.account}
                          </td>
                          <td
                            className={`py-3 px-2 text-sm font-bold text-right ${
                              tx.type === "INCOME"
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {tx.type === "INCOME" ? "+" : "-"}
                            {Math.abs(tx.amount).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CTA at bottom */}
              <div className="text-center pt-6 pb-4">
                <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    Like this view? 🎉
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 max-w-md">
                    Sign in to connect your own accounts and start tracking your
                    real finances
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <GoogleAuthLink className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all">
                      I'm Convinced → Sign Up
                    </GoogleAuthLink>
                    <button
                      onClick={() => {
                        const calculatorSection = document.querySelector(
                          '[data-section="calculators"]',
                        );
                        calculatorSection?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }}
                      className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all"
                    >
                      Try Calculators First
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Flyout Modal */}
        {selectedCategory && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCategory(null)}
          >
            <div
              className="neu-card max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor:
                          categoryTotals.find(
                            (c) => c.name === selectedCategory,
                          )?.color + "20",
                        color: categoryTotals.find(
                          (c) => c.name === selectedCategory,
                        )?.color,
                      }}
                    >
                      {selectedCategory === "Groceries"
                        ? "🛒"
                        : selectedCategory === "Transport"
                          ? "🚗"
                          : selectedCategory === "Data/Airtime"
                            ? "📱"
                            : selectedCategory === "Rent"
                              ? "🏠"
                              : "💰"}
                    </span>
                    {selectedCategory} Transactions
                  </h3>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg
                      className="w-6 h-6 flex-shrink-0"
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ width: "24px", height: "24px" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-3">
                  {filteredTransactions
                    .filter((tx) => tx.category === selectedCategory)
                    .map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                      >
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {tx.description}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {new Date(tx.date).toLocaleDateString("en", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}{" "}
                            • {tx.account}
                          </div>
                        </div>
                        <div className="text-lg font-bold text-red-600 dark:text-red-400">
                          -{Math.abs(tx.amount).toLocaleString()}
                        </div>
                      </div>
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                      KES{" "}
                      {categoryTotals
                        .find((c) => c.name === selectedCategory)
                        ?.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================
            SECTION C: MICRO-CALCULATORS
            ============================================ */}
        <section
          className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
          data-section="calculators"
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-4">
                🧮 Free Tools • No Sign-up Required
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Try our{" "}
                <span className="bg-gradient-to-r from-green-600 to-blue-600 text-transparent bg-clip-text">
                  instant calculators
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Get quick insights into your finances. All calculations happen
                in your browser—nothing is saved or shared.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Budget Calculator */}
              <div className="neu-card p-6 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-2xl">
                    💰
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Monthly Budget
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      50/30/20 rule calculator
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Monthly Income (KES)
                    </label>
                    <input
                      type="number"
                      value={budgetInputs.income}
                      onChange={(e) =>
                        setBudgetInputs({
                          ...budgetInputs,
                          income: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400 focus:outline-none text-gray-900 dark:text-white transition-colors"
                      placeholder="80000"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rent
                      </label>
                      <input
                        type="number"
                        value={budgetInputs.rent}
                        onChange={(e) =>
                          setBudgetInputs({
                            ...budgetInputs,
                            rent: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400 focus:outline-none text-gray-900 dark:text-white transition-colors"
                        placeholder="25000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Transport
                      </label>
                      <input
                        type="number"
                        value={budgetInputs.transport}
                        onChange={(e) =>
                          setBudgetInputs({
                            ...budgetInputs,
                            transport: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400 focus:outline-none text-gray-900 dark:text-white transition-colors"
                        placeholder="8000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Food
                      </label>
                      <input
                        type="number"
                        value={budgetInputs.food}
                        onChange={(e) =>
                          setBudgetInputs({
                            ...budgetInputs,
                            food: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400 focus:outline-none text-gray-900 dark:text-white transition-colors"
                        placeholder="15000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Savings Target
                      </label>
                      <input
                        type="number"
                        value={budgetInputs.savingsTarget}
                        onChange={(e) =>
                          setBudgetInputs({
                            ...budgetInputs,
                            savingsTarget: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400 focus:outline-none text-gray-900 dark:text-white transition-colors"
                        placeholder="15000"
                      />
                    </div>
                  </div>
                </div>

                {/* Budget Results */}
                <div className="neu-stat-card p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Expenses
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      KES {budgetCalc.totalExpenses.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      After Savings
                    </span>
                    <span
                      className={`text-lg font-bold ${budgetCalc.remaining >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      KES {budgetCalc.remaining.toLocaleString()}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Recommended (50/30/20)
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Needs (50%)
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          KES {budgetCalc.recommended.needs.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Wants (30%)
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          KES {budgetCalc.recommended.wants.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Savings (20%)
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          KES {budgetCalc.recommended.savings.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {budgetCalc.isHealthy ? (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{ width: "20px", height: "20px" }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Healthy budget!
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{ width: "20px", height: "20px" }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Consider adjusting
                    </div>
                  )}
                </div>

                <Link
                  to="/signup"
                  className="block w-full text-center py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  💾 Save this as your first budget
                </Link>
              </div>

              {/* Debt Payoff Calculator */}
              <div className="neu-card p-6 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white text-2xl">
                    📉
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Debt Payoff
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Time to freedom calculator
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Total Debt (KES)
                    </label>
                    <input
                      type="number"
                      value={debtInputs.totalDebt}
                      onChange={(e) =>
                        setDebtInputs({
                          ...debtInputs,
                          totalDebt: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-red-500 dark:focus:border-red-400 focus:outline-none text-gray-900 dark:text-white transition-colors"
                      placeholder="500000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Interest Rate (% per year)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={debtInputs.interestRate}
                      onChange={(e) =>
                        setDebtInputs({
                          ...debtInputs,
                          interestRate: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-red-500 dark:focus:border-red-400 focus:outline-none text-gray-900 dark:text-white transition-colors"
                      placeholder="14"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Monthly Payment (KES)
                    </label>
                    <input
                      type="number"
                      value={debtInputs.monthlyPayment}
                      onChange={(e) =>
                        setDebtInputs({
                          ...debtInputs,
                          monthlyPayment: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-red-500 dark:focus:border-red-400 focus:outline-none text-gray-900 dark:text-white transition-colors"
                      placeholder="15000"
                    />
                  </div>
                </div>

                {/* Debt Results */}
                <div className="neu-stat-card p-4 space-y-3">
                  {debtCalc.months === Infinity ? (
                    <div className="text-center py-4">
                      <div className="text-red-600 dark:text-red-400 font-semibold mb-2">
                        ⚠️ Warning
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Monthly payment is too low to cover interest. Increase
                        payment to see results.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="text-center py-3">
                        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                          {debtCalc.months}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          months to debt freedom
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          ({Math.floor(debtCalc.months / 12)} years,{" "}
                          {debtCalc.months % 12} months)
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Total Interest
                          </span>
                          <span className="text-lg font-bold text-red-600 dark:text-red-400">
                            KES {debtCalc.totalInterest.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Total Paid
                          </span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            KES {debtCalc.totalPaid.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-sm text-gray-700 dark:text-gray-300">
                        <strong>💡 Tip:</strong> Increasing your payment by KES
                        5,000 could save months of payments!
                      </div>
                    </>
                  )}
                </div>

                <Link
                  to="/signup"
                  className="block w-full text-center py-3 px-6 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  📊 Plan all your debts
                </Link>
              </div>

              {/* Savings Goal Calculator */}
              <div className="neu-card p-6 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl">
                    🎯
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Savings Goal
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      When will you reach it?
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Amount (KES)
                    </label>
                    <input
                      type="number"
                      value={savingsInputs.targetAmount}
                      onChange={(e) =>
                        setSavingsInputs({
                          ...savingsInputs,
                          targetAmount: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none text-gray-900 dark:text-white transition-colors"
                      placeholder="1000000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Monthly Savings (KES)
                    </label>
                    <input
                      type="number"
                      value={savingsInputs.monthlySavings}
                      onChange={(e) =>
                        setSavingsInputs({
                          ...savingsInputs,
                          monthlySavings: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none text-gray-900 dark:text-white transition-colors"
                      placeholder="20000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Expected Return (% per year)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={savingsInputs.expectedReturn}
                      onChange={(e) =>
                        setSavingsInputs({
                          ...savingsInputs,
                          expectedReturn: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none text-gray-900 dark:text-white transition-colors"
                      placeholder="8"
                    />
                  </div>
                </div>

                {/* Savings Results */}
                <div className="neu-stat-card p-4 space-y-3">
                  <div className="text-center py-3">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                      {savingsCalc.months}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      months to reach your goal
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      ({Math.floor(savingsCalc.months / 12)} years,{" "}
                      {savingsCalc.months % 12} months)
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Your Contributions
                      </span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        KES {savingsCalc.totalContributions.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Investment Returns
                      </span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        KES {savingsCalc.totalReturns.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Total Goal
                      </span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        KES {savingsInputs.targetAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {savingsCalc.totalReturns > 0 && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-sm text-gray-700 dark:text-gray-300">
                      <strong>🌱 Growth:</strong> Investment returns will
                      contribute{" "}
                      {Math.round(
                        (savingsCalc.totalReturns /
                          savingsInputs.targetAmount) *
                          100,
                      )}
                      % of your goal!
                    </div>
                  )}
                </div>

                <Link
                  to="/signup"
                  className="block w-full text-center py-3 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  🚀 Track all your goals
                </Link>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-12">
              <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 max-w-2xl">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  Like what you see? 🎉
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Create an account to save your calculations, track real
                  transactions, and get personalized insights.
                </p>
                <GoogleAuthLink className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all">
                  Get Started Free
                </GoogleAuthLink>
              </div>
            </div>

            {/* Decision Point CTA */}
            <div className="text-center mt-16 mb-8">
              <div className="inline-flex flex-col items-center gap-6 p-10 rounded-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border-2 border-blue-200 dark:border-blue-800 max-w-3xl shadow-xl">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Ready to Get Started? 🚀
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl">
                  You've seen the demo, played with the calculators, and
                  explored the features. What's your next move?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <a
                    href="/api/auth/google"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
                  >
                    <svg
                      className="w-6 h-6 flex-shrink-0"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Yes, I'm Convinced!
                  </a>
                  <button
                    onClick={() => {
                      const featuresSection = document.querySelector(
                        '[data-section="features"]',
                      );
                      featuresSection?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-800 dark:text-white text-lg font-semibold rounded-xl border-2 border-gray-300 dark:border-gray-600 shadow-md hover:shadow-lg transition-all"
                  >
                    📖 Tell Me More First
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  No credit card required • Always free core features • Cancel
                  anytime
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            SECTION D: FEATURE TILES
            ============================================ */}
        <section
          className="relative z-10 mx-auto max-w-7xl px-6 py-20"
          data-section="features"
        >
          <div className="animate-fade-in">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                  What You'll Get
                </span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Everything you need to take control of your financial life,
                designed for the Kenyan context
              </p>
            </div>

            {/* Feature Tiles Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Unified Dashboard */}
              <div className="neu-card p-8 hover:scale-105 transition-all cursor-pointer group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                  📊
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  Unified Dashboard
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  See transactions, income, expenditures and investments in one
                  place. No more juggling multiple apps or spreadsheets.
                </p>
              </div>

              {/* Smart Budgeting */}
              <div className="neu-card p-8 hover:scale-105 transition-all cursor-pointer group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                  🎯
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  Smart Budgeting
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Budgets linked to real transactions, not a static spreadsheet.
                  Track spending against goals automatically.
                </p>
              </div>

              {/* Wealth & Net Worth Tracker */}
              <div className="neu-card p-8 hover:scale-105 transition-all cursor-pointer group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                  💰
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  Wealth & Net Worth Tracker
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Track assets, land, SACCO accounts and loans. See your
                  complete financial picture grow over time.
                </p>
              </div>

              {/* Debt Planner */}
              <div className="neu-card p-8 hover:scale-105 transition-all cursor-pointer group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                  📉
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  Debt Planner
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Visual payoff plans using avalanche or snowball methods. Clear
                  roadmap to becoming debt-free.
                </p>
              </div>

              {/* Data Safety */}
              <div className="neu-card p-8 hover:scale-105 transition-all cursor-pointer group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                  🔒
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  Data Safety
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  You control your data. No selling to third parties. Your
                  financial information stays private.
                </p>
              </div>

              {/* Kenyan Context */}
              <div className="neu-card p-8 hover:scale-105 transition-all cursor-pointer group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                  🇰🇪
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  Built for Kenya
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Track M-Pesa accounts, SACCO balances, and mobile money
                  transactions. Designed for how Kenyans actually manage money.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            SECTION E: FAQ / "IS THIS FOR ME?"
            ============================================ */}
        <section
          className="relative z-10 mx-auto max-w-4xl px-6 py-20"
          data-section="faq"
        >
          <div className="animate-fade-in">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                <span className="text-gray-900 dark:text-white">
                  Is This For Me?
                </span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
                Common questions answered
              </p>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4">
              {/* FAQ 1 */}
              <div className="neu-card p-6 hover:shadow-xl transition-all">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Can I use it without connecting my bank?
                    </h3>
                    <svg
                      className="w-6 h-6 flex-shrink-0 text-gray-600 dark:text-gray-400 group-open:rotate-180 transition-transform"
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ width: "24px", height: "24px" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      <strong>Yes, absolutely!</strong> You can manually add
                      accounts (bank, M-Pesa, SACCO, cash) and enter
                      transactions by hand. While we support M-Pesa statements
                      and bank imports, you're never forced to connect anything.
                      Your privacy and control come first.
                    </p>
                  </div>
                </details>
              </div>

              {/* FAQ 2 */}
              <div className="neu-card p-6 hover:shadow-xl transition-all">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Can I export my data?
                    </h3>
                    <svg
                      className="w-6 h-6 flex-shrink-0 text-gray-600 dark:text-gray-400 group-open:rotate-180 transition-transform"
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ width: "24px", height: "24px" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      <strong>Yes!</strong> You can export all your
                      transactions, accounts, and reports to CSV or Excel
                      format. Your data is yours—take it with you anytime, use
                      it in other tools, or keep offline backups. No lock-in, no
                      hidden fees for exports.
                    </p>
                  </div>
                </details>
              </div>

              {/* FAQ 3 */}
              <div className="neu-card p-6 hover:shadow-xl transition-all">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Does it work for Kenyan context (M-Pesa, SACCO, etc.)?
                    </h3>
                    <svg
                      className="w-6 h-6 flex-shrink-0 text-gray-600 dark:text-gray-400 group-open:rotate-180 transition-transform"
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ width: "24px", height: "24px" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      <strong>Absolutely!</strong> This app is built with Kenya
                      in mind. Track M-Pesa accounts, SACCO accounts and loans,
                      mobile money balances, and land assets. Examples include
                      typical Kenyan expenses like rent (KES 15,000),
                      electricity, water bills, and matatu fares. It speaks your
                      financial language.
                    </p>
                  </div>
                </details>
              </div>

              {/* FAQ 4 */}
              <div className="neu-card p-6 hover:shadow-xl transition-all">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Is it really free?
                    </h3>
                    <svg
                      className="w-6 h-6 flex-shrink-0 text-gray-600 dark:text-gray-400 group-open:rotate-180 transition-transform"
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ width: "24px", height: "24px" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      <strong>
                        Yes, the core features are completely free.
                      </strong>{" "}
                      Track unlimited transactions, create budgets, manage
                      debts, and monitor your net worth without paying anything.
                      We may introduce premium features in the future (advanced
                      analytics, automated reports), but the essentials will
                      always be free.
                    </p>
                  </div>
                </details>
              </div>

              {/* FAQ 5 */}
              <div className="neu-card p-6 hover:shadow-xl transition-all">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      How secure is my financial data?
                    </h3>
                    <svg
                      className="w-6 h-6 flex-shrink-0 text-gray-600 dark:text-gray-400 group-open:rotate-180 transition-transform"
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ width: "24px", height: "24px" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      <strong>Very secure.</strong> We use encrypted sessions,
                      secure authentication via Google OAuth, and role-based
                      access control. Your data is isolated—no one else can see
                      it. We don't sell your information to third parties, and
                      we include password recovery flows. Regular security
                      audits ensure your money data stays private.
                    </p>
                  </div>
                </details>
              </div>

              {/* FAQ 6 */}
              <div className="neu-card p-6 hover:shadow-xl transition-all">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Do I need to be tech-savvy to use this?
                    </h3>
                    <svg
                      className="w-6 h-6 flex-shrink-0 text-gray-600 dark:text-gray-400 group-open:rotate-180 transition-transform"
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ width: "24px", height: "24px" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      <strong>Not at all!</strong> The interface is designed to
                      be intuitive and user-friendly. If you can use WhatsApp or
                      M-Pesa, you can use this app. We provide clear visual
                      feedback, helpful tooltips, and a demo you can explore
                      without creating an account. Plus, the live calculators
                      show you results in real-time as you type.
                    </p>
                  </div>
                </details>
              </div>

              {/* FAQ 7 - Future Plans */}
              <div className="neu-card p-6 hover:shadow-xl transition-all">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      What features are you planning to add?
                    </h3>
                    <svg
                      className="w-6 h-6 flex-shrink-0 text-gray-600 dark:text-gray-400 group-open:rotate-180 transition-transform"
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ width: "24px", height: "24px" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                      <strong>We're constantly improving!</strong> Here's what's
                      on our roadmap:
                    </p>
                    <div className="space-y-3 text-gray-600 dark:text-gray-300">
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">
                          🚀
                        </span>
                        <div>
                          <strong>M-Pesa API Integration</strong> - Automatic
                          transaction imports from M-Pesa statements (Premium)
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-purple-600 dark:text-purple-400 font-bold mt-1">
                          👥
                        </span>
                        <div>
                          <strong>Chama Management</strong> - Group savings,
                          member contributions, loan rotation tracking (Premium)
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400 font-bold mt-1">
                          🏦
                        </span>
                        <div>
                          <strong>Bank Integrations</strong> - Direct
                          connections to Kenyan banks for automatic syncing
                          (Premium)
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-orange-600 dark:text-orange-400 font-bold mt-1">
                          📊
                        </span>
                        <div>
                          <strong>Advanced Analytics</strong> - AI-powered
                          spending insights, forecasting, and automated reports
                          (Premium)
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-pink-600 dark:text-pink-400 font-bold mt-1">
                          📈
                        </span>
                        <div>
                          <strong>Investment Tracking</strong> - Portfolio
                          performance, stock prices, dividend tracking (Premium)
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold mt-1">
                          🔔
                        </span>
                        <div>
                          <strong>Smart Notifications</strong> - Bill reminders,
                          budget alerts via SMS/WhatsApp (Premium)
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 italic">
                      Core features will always remain free. Premium features
                      help us maintain and improve the platform.
                    </p>
                  </div>
                </details>
              </div>
            </div>

            {/* CTA after FAQ */}
            <div className="text-center mt-16">
              <div className="inline-flex flex-col items-center gap-6 p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 max-w-2xl">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Ready to Take Control? 🚀
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Join thousands of Kenyans already managing their money smarter
                </p>
                <GoogleAuthLink className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <span>Get Started Free</span>
                </GoogleAuthLink>
              </div>
            </div>
          </div>
        </section>
      </div>

      <PublicFooter />
    </div>
  );
}
