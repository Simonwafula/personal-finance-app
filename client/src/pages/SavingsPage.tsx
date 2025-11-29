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
    <div className="space-y-8 animate-fade-in">
      <div className="section-header">
        <div>
          <h1 className="section-title">Savings Goals</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Track progress toward targeted financial objectives. Integrates Accounts & Net Worth.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {goals.map(g => {
          const pct = Math.min(100, Math.round((g.current_amount / g.target_amount) * 100));
          return (
            <div key={g.id} className="card-elevated p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">{g.name}</h3>
                <span className="text-xs inline-flex px-2 py-1 rounded-full bg-[var(--surface-glass)] border border-[var(--glass-border)]">{pct}%</span>
              </div>
              <div className="text-xs text-[var(--text-muted)]">Linked: {g.account_hint || '—'}</div>
              <div className="h-2 w-full rounded-full bg-[var(--surface-glass)] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[var(--primary-400)] to-[var(--accent-500)]" style={{ width: pct + '%' }} />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="font-semibold">KES {formatMoney(g.current_amount)}</span>
                <span className="text-[var(--text-muted)]">Target: {formatMoney(g.target_amount)}</span>
              </div>
              <button className="btn-secondary w-full mt-2 text-sm" disabled>View Details (Coming Soon)</button>
            </div>
          );
        })}
      </div>

      <div className="glass p-6 rounded-xl">
        <h2 className="text-lg font-bold mb-3">Planned Backend Model</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm text-[var(--text-muted)]">
          <li><code>SavingsGoal</code>: name, target_amount, optional target_date.</li>
          <li><code>GoalContribution</code>: FK to goal, account reference, amount, date.</li>
          <li>Automatic aggregation from linked accounts + manual contributions.</li>
          <li>Net Worth integration: mark goal as portion of liquid assets.</li>
          <li>Progress calculations + forecast (time to target).</li>
        </ul>
      </div>
    </div>
  );
}
