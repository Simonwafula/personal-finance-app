import { useState } from 'react';

interface SavingsGoal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  account_hint?: string; // placeholder association display
}

// Mock placeholder data until backend module implemented
const mockGoals: SavingsGoal[] = [
  { id: 1, name: 'Emergency Fund', target_amount: 300000, current_amount: 125000, account_hint: 'Savings Account' },
  { id: 2, name: 'Car Purchase', target_amount: 1500000, current_amount: 400000, account_hint: 'Investment Account' },
  { id: 3, name: 'Education Fund', target_amount: 800000, current_amount: 120000, account_hint: 'Fixed Deposit' },
];

function formatMoney(v: number) {
  return v.toLocaleString(undefined, { minimumFractionDigits: 0 });
}

export default function SavingsPage() {
  const [goals] = useState<SavingsGoal[]>(mockGoals);

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎯 Savings Goals
          </h1>
          <p className="text-base text-[var(--text-muted)] mt-2 font-medium">
            Track progress toward your financial objectives and dreams
          </p>
        </div>
        <button className="btn-primary" disabled>
          ➕ New Goal (Coming Soon)
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map(g => {
          const pct = Math.min(100, Math.round((g.current_amount / g.target_amount) * 100));
          return (
            <div key={g.id} className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-xl text-[var(--text-main)]">{g.name}</h3>
                  <span className="inline-flex px-3 py-1.5 text-sm font-bold rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                    {pct}%
                  </span>
                </div>
                <div className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                  <span>🏦</span>
                  <span>Linked: {g.account_hint || '—'}</span>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full rounded-full bg-[var(--surface)] overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out rounded-full" 
                      style={{ width: pct + '%' }}
                    />
                  </div>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <div className="text-xs text-[var(--text-muted)] mb-0.5">Current</div>
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">KES {formatMoney(g.current_amount)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-[var(--text-muted)] mb-0.5">Target</div>
                      <div className="text-sm font-semibold text-[var(--text-muted)]">KES {formatMoney(g.target_amount)}</div>
                    </div>
                  </div>
                </div>
                <button className="btn-secondary w-full mt-4" disabled>
                  📈 View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800">
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-2xl">🚧</span>
            <div>
              <h2 className="text-xl font-bold mb-2 text-[var(--text-main)]">Feature In Development</h2>
              <p className="text-sm text-[var(--text-muted)] mb-3">
                The Savings Goals module is currently using mock data. The full backend implementation is planned with the following features:
              </p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-[var(--text-muted)] ml-11">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span><code className="px-1.5 py-0.5 rounded bg-[var(--surface)] text-xs font-mono">SavingsGoal</code> model: name, target_amount, target_date, linked accounts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span><code className="px-1.5 py-0.5 rounded bg-[var(--surface)] text-xs font-mono">GoalContribution</code> tracking: automatic and manual contributions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span>Real-time progress calculations and time-to-target forecasting</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span>Integration with Accounts and Net Worth modules</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span>Visual progress tracking and milestone celebrations</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
