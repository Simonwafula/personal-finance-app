import { useEffect, useState, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import Logo from "../components/Logo";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { fetchCurrentUser } from "../api/auth";
import "../styles/neumorphism.css";

// Small helper: Auth link to login page
const AuthLink = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => (
  <Link to="/login" className={className}>
    {children}
  </Link>
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <PublicHeader />

      {/* Subtle background accent */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-full blur-3xl opacity-40 dark:opacity-20 -z-10 pointer-events-none"></div>

      <main className="flex-1 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ============================================
              HERO SECTION - Modern Minimal
              ============================================ */}
          <section className="py-16 md:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Headline */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
                  <span className="block">Your money,</span>
                  <span className="block">clearly.</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                  Track M-Pesa, bank accounts, SACCO, investments and debts. See
                  the full picture. Make smarter decisions.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <AuthLink className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all">
                    <span>Get Started Free</span>
                  </AuthLink>
                  <button
                    onClick={() => {
                      const section = document.querySelector("[data-section='demo']");
                      section?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span>See Demo</span>
                  </button>
                </div>
              </div>

              {/* Right: Visual */}
              <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-block p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg backdrop-blur-md bg-opacity-80 dark:bg-opacity-50">
                      <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                        Total Balance
                      </div>
                      <div className="text-4xl font-bold text-gray-900 dark:text-white">
                        KES 125,430
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Across 4 accounts
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================
              DEMO SECTION - Interactive Preview
              ============================================ */}
          <section
            data-section="demo"
            className="py-16 md:py-24 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                See it in action
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Get a real-time view of all your finances
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Chart */}
              <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    30-Day Overview
                  </h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={[
                      {
                        date: "Nov 1",
                        income: 8000,
                        expenses: 5200,
                      },
                      {
                        date: "Nov 5",
                        income: 8000,
                        expenses: 7300,
                      },
                      {
                        date: "Nov 10",
                        income: 27000,
                        expenses: 12300,
                      },
                      {
                        date: "Nov 15",
                        income: 27000,
                        expenses: 8900,
                      },
                      {
                        date: "Nov 20",
                        income: 35000,
                        expenses: 15200,
                      },
                      {
                        date: "Nov 25",
                        income: 35000,
                        expenses: 9800,
                      },
                      {
                        date: "Nov 30",
                        income: 35000,
                        expenses: 6700,
                      },
                    ]}
                  >
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="rgb(37, 99, 235)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="rgb(37, 99, 235)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="rgb(239, 68, 68)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="rgb(239, 68, 68)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      stroke="rgb(156, 163, 175)"
                      style={{
                        fontSize: "12px",
                      }}
                    />
                    <YAxis
                      stroke="rgb(156, 163, 175)"
                      style={{
                        fontSize: "12px",
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        border: "1px solid rgb(75, 85, 99)",
                        borderRadius: "8px",
                      }}
                      labelStyle={{
                        color: "#fff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="rgb(37, 99, 235)"
                      fillOpacity={1}
                      fill="url(#colorIncome)"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="rgb(239, 68, 68)"
                      fillOpacity={1}
                      fill="url(#colorExpenses)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Accounts Sidebar */}
              <div className="space-y-4">
                <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
                    Accounts
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: "M-Pesa", balance: "KES 45,200", icon: "📱" },
                      { name: "KCB Salary", balance: "KES 62,100", icon: "🏦" },
                      { name: "SACCO", balance: "KES 18,130", icon: "🤝" },
                    ].map((acc) => (
                      <div
                        key={acc.name}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {acc.icon} {acc.name}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {acc.balance}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================
              CALCULATORS SECTION
              ============================================ */}
          <section className="py-16 md:py-24 border-t border-gray-200 dark:border-gray-800">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Plan your finances
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Use these tools to set goals and stay on track
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Budget Calculator */}
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 p-8 shadow-sm">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Budget Planner
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Allocate your income across categories and track spending goals.
                </p>
                <button className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors">
                  Try It
                </button>
              </div>

              {/* Debt Payoff Calculator */}
              <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800 p-8 shadow-sm">
                <div className="text-3xl mb-3">💳</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Debt Payoff
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Calculate how long to pay off debts with different payment
                  amounts.
                </p>
                <button className="w-full px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-colors">
                  Try It
                </button>
              </div>

              {/* Savings Calculator */}
              <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 p-8 shadow-sm">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Savings Goal
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Plan how much to save monthly to reach your financial goals.
                </p>
                <button className="w-full px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium text-sm transition-colors">
                  Try It
                </button>
              </div>
            </div>
          </section>

          {/* ============================================
              FEATURES SECTION
              ============================================ */}
          <section className="py-16 md:py-24 border-t border-gray-200 dark:border-gray-800">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Everything you need
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Powerful features to manage your complete financial life
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Multi-Account Sync",
                  desc: "Connect M-Pesa, bank accounts, SACCO and more",
                  icon: "🔗",
                },
                {
                  title: "Smart Insights",
                  desc: "Understand your spending patterns and trends",
                  icon: "💡",
                },
                {
                  title: "Budget Tracking",
                  desc: "Set limits and get alerts when you overspend",
                  icon: "⚠️",
                },
                {
                  title: "Debt Management",
                  desc: "Track loans, calculate payoff timelines",
                  icon: "📈",
                },
                {
                  title: "Savings Goals",
                  desc: "Plan and track progress on financial goals",
                  icon: "🎯",
                },
                {
                  title: "Wealth Tracking",
                  desc: "Monitor your net worth and investment growth",
                  icon: "💰",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================
              FAQ SECTION
              ============================================ */}
          <section className="py-16 md:py-24 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-2xl">
              <div className="mb-12">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Questions?
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Here's what people usually ask
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: "Is my data secure?",
                    a: "Yes. We use industry-standard encryption and never share your data with third parties.",
                  },
                  {
                    q: "Is this free to use?",
                    a: "Core features are always free. We may offer optional premium features in the future.",
                  },
                  {
                    q: "Can I export my data?",
                    a: "Yes. You can export your transactions and reports at any time.",
                  },
                  {
                    q: "How do you make money?",
                    a: "Currently we're bootstrapped. Future revenue may come from optional premium features.",
                  },
                ].map((faq, idx) => (
                  <details
                    key={idx}
                    className="group rounded-lg border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 cursor-pointer"
                  >
                    <summary className="flex items-center justify-between font-semibold text-gray-900 dark:text-white select-none">
                      {faq.q}
                      <span className="text-lg group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* ============================================
              FINAL CTA
              ============================================ */}
          <section className="py-16 md:py-24 border-t border-gray-200 dark:border-gray-800">
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 p-12 md:p-16 text-center">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to control your money?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of Kenyans who've taken control of their finances.
              </p>
              <AuthLink className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all">
                <span>Get Started Free</span>
              </AuthLink>
            </div>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
