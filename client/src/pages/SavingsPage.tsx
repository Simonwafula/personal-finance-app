import React, { useState, useEffect } from 'react';
import { 
  Target, 
  TrendingUp, 
  Calendar,
  Plus,
  X,
  Trash2,
  PiggyBank,
  Clock
} from 'lucide-react';
import {
  getSavingsGoals,
  createSavingsGoal,
  deleteSavingsGoal,
  addContribution,
  type SavingsGoal,
  type CreateGoalData,
  type CreateContributionData
} from '../api/savings';
import { getAccounts, type Account } from '../api/finance';
import '../styles/neumorphism.css';

const formatMoney = (amount: number | string) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(num);
};

const emojiOptions = ['🎯', '🏠', '🚗', '🎓', '✈️', '💍', '🏖️', '💰', '🏥', '🎉'];

export default function SavingsPage() {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [formData, setFormData] = useState<CreateGoalData>({
    name: '',
    target_amount: '',
    current_amount: '0',
    target_date: '',
    description: '',
    emoji: '🎯',
    linked_account: undefined
  });
  const [contributionData, setContributionData] = useState<CreateContributionData>({
    amount: '',
    contribution_type: 'MANUAL',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [goalsData, accountsData] = await Promise.all([
        getSavingsGoals(),
        getAccounts()
      ]);
      setSavingsGoals(goalsData);
      setAccounts(accountsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSavingsGoal(formData);
      setShowGoalModal(false);
      setFormData({
        name: '',
        target_amount: '',
        current_amount: '0',
        target_date: '',
        description: '',
        emoji: '🎯',
        linked_account: undefined
      });
      loadData();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleDeleteGoal = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await deleteSavingsGoal(id);
        loadData();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const handleAddContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;
    try {
      await addContribution(selectedGoal.id, contributionData);
      setShowContributionModal(false);
      setSelectedGoal(null);
      setContributionData({
        amount: '',
        contribution_type: 'MANUAL',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      loadData();
    } catch (error) {
      console.error('Error adding contribution:', error);
    }
  };

  const getMilestone = (percentage: number) => {
    if (percentage >= 100) return { text: 'Completed!', color: 'text-green-500', emoji: '🎉' };
    if (percentage >= 75) return { text: '75% Milestone', color: 'text-purple-500', emoji: '🚀' };
    if (percentage >= 50) return { text: 'Halfway There', color: 'text-blue-500', emoji: '💪' };
    if (percentage >= 25) return { text: '25% Progress', color: 'text-indigo-500', emoji: '📈' };
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎯 Savings Goals
          </h1>
          <p className="text-base text-[var(--text-muted)] mt-2 font-medium">
            Track progress toward your financial objectives
          </p>
        </div>
        <button 
          onClick={() => setShowGoalModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          New Goal
        </button>
      </div>

      {/* Goals Grid */}
      {savingsGoals.length === 0 ? (
        <div className="card p-12 text-center">
          <PiggyBank size={64} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold mb-2 text-[var(--text-main)]">No Savings Goals Yet</h3>
          <p className="text-[var(--text-muted)] mb-4">
            Start building your financial future by creating your first savings goal
          </p>
          <button 
            onClick={() => setShowGoalModal(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savingsGoals.map(goal => {
            const milestone = getMilestone(goal.progress_percentage);
            return (
              <div 
                key={goal.id} 
                className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{goal.emoji}</span>
                      <h3 className="font-bold text-xl text-[var(--text-main)]">{goal.name}</h3>
                    </div>
                    <div className="flex gap-2">
                      <span className="inline-flex px-3 py-1.5 text-sm font-bold rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                        {goal.progress_percentage.toFixed(1)}%
                      </span>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {milestone && (
                    <div className={`flex items-center gap-2 ${milestone.color} font-bold text-sm`}>
                      <span>{milestone.emoji}</span>
                      <span>{milestone.text}</span>
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[var(--text-main)] font-semibold">
                        {formatMoney(goal.current_amount)}
                      </span>
                      <span className="text-[var(--text-muted)]">
                        {formatMoney(goal.target_amount)}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 rounded-full"
                        style={{ width: `${Math.min(100, goal.progress_percentage)}%` }}
                      />
                    </div>
                  </div>

                  {/* Target Date & Forecast */}
                  {goal.target_date && (
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-[var(--text-muted)]">
                        <Calendar size={16} />
                        <span>{new Date(goal.target_date).toLocaleDateString()}</span>
                      </div>
                      {goal.days_remaining !== null && (
                        <div className="flex items-center gap-1 text-[var(--text-muted)]">
                          <Clock size={16} />
                          <span>{goal.days_remaining} days left</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Monthly Target */}
                  {goal.monthly_target && goal.progress_percentage < 100 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-xs text-[var(--text-muted)] mb-1">Monthly Target</p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {formatMoney(goal.monthly_target)}
                      </p>
                    </div>
                  )}

                  {/* Linked Account */}
                  {goal.linked_account_name && (
                    <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                      <Target size={16} />
                      <span>{goal.linked_account_name}</span>
                    </div>
                  )}

                  {/* Transaction-based Savings */}
                  {goal.total_from_transactions > 0 && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <p className="text-xs text-[var(--text-muted)] mb-1">From Transactions</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatMoney(goal.total_from_transactions)}
                      </p>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      setSelectedGoal(goal);
                      setShowContributionModal(true);
                    }}
                    className="w-full btn-secondary flex items-center justify-center gap-2"
                  >
                    <TrendingUp size={18} />
                    Add Contribution
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8">
          <div className="neu-card max-w-lg w-full mx-4">
            <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="p-6">
                <div className="neu-header">
                  <h2 className="neu-title">Create Savings Goal</h2>
                  <button 
                    onClick={() => setShowGoalModal(false)} 
                    style={{
                      position: 'absolute',
                      right: '20px',
                      top: '20px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)'
                    }}
                  >
                    <X size={24} />
                  </button>
                </div>
              
                <form onSubmit={handleCreateGoal} className="neu-form">
                {/* Emoji Picker */}
                <div>
                  <label className="block text-sm font-medium mb-2">Icon</label>
                  <div className="flex gap-2 flex-wrap">
                    {emojiOptions.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormData({...formData, emoji})}
                        className={`text-3xl p-2 rounded-lg transition-all ${
                          formData.emoji === emoji 
                            ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="neu-form-group">
                  <div className="neu-input">
                    <input
                      type="text"
                      id="goal_name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder=" "
                    />
                    <label htmlFor="goal_name">e.g., Emergency Fund</label>
                    <div className="neu-input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="neu-form-group">
                  <div className="neu-input">
                    <input
                      type="number"
                      id="target_amount"
                      required
                      value={formData.target_amount}
                      onChange={(e) => setFormData({...formData, target_amount: e.target.value})}
                      placeholder=" "
                    />
                    <label htmlFor="target_amount">Target Amount (KES)</label>
                    <div className="neu-input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="neu-form-group">
                  <div className="neu-input">
                    <input
                      type="number"
                      id="current_amount"
                      value={formData.current_amount}
                      onChange={(e) => setFormData({...formData, current_amount: e.target.value})}
                      placeholder=" "
                    />
                    <label htmlFor="current_amount">Already Saved (KES) - Optional</label>
                    <div className="neu-input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    💡 If you already have savings toward this goal, enter the amount here
                  </p>
                </div>

                <div className="neu-form-group">
                  <div className="neu-input">
                    <input
                      type="date"
                      id="target_date"
                      value={formData.target_date}
                      onChange={(e) => setFormData({...formData, target_date: e.target.value})}
                      placeholder=" "
                    />
                    <label htmlFor="target_date">Target Date (Optional)</label>
                    <div className="neu-input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="neu-form-group">
                  <label className="block text-sm font-medium mb-2">Linked Account (Optional)</label>
                  <select
                    value={formData.linked_account || ''}
                    onChange={(e) => setFormData({...formData, linked_account: e.target.value ? Number(e.target.value) : undefined})}
                    className="w-full p-2 border rounded-lg dark:bg-gray-800"
                  >
                    <option value="">No linked account</option>
                    {accounts.map(account => (
                      <option key={account.id} value={account.id}>
                        {account.name} ({formatMoney(account.opening_balance)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="neu-form-group">
                  <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-2 border rounded-lg dark:bg-gray-800"
                    rows={3}
                    placeholder="What is this goal for?"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="neu-button flex-1">
                    Create Goal
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowGoalModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contribution Modal */}
      {showContributionModal && selectedGoal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8">
          <div className="neu-card max-w-lg w-full mx-4">
            <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="p-6">
                <div className="neu-header">
                  <h2 className="neu-title">Add Contribution</h2>
                  <p className="neu-subtitle">
                    {selectedGoal.emoji} {selectedGoal.name}
                  </p>
                  <button 
                    onClick={() => {
                      setShowContributionModal(false);
                      setSelectedGoal(null);
                    }}
                    style={{
                      position: 'absolute',
                      right: '20px',
                      top: '20px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)'
                    }}
                  >
                    <X size={24} />
                  </button>
                </div>
              
              <form onSubmit={handleAddContribution} className="neu-form">
                <div className="neu-form-group">
                  <div className="neu-input">
                    <input
                      type="number"
                      id="contribution_amount"
                      required
                      value={contributionData.amount}
                      onChange={(e) => setContributionData({...contributionData, amount: e.target.value})}
                      placeholder=" "
                    />
                    <label htmlFor="contribution_amount">Amount (KES)</label>
                    <div className="neu-input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="neu-form-group">
                  <div className="neu-input">
                    <input
                      type="date"
                      id="contribution_date"
                      required
                      value={contributionData.date}
                      onChange={(e) => setContributionData({...contributionData, date: e.target.value})}
                      placeholder=" "
                    />
                    <label htmlFor="contribution_date">Date</label>
                    <div className="neu-input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setContributionData({...contributionData, contribution_type: 'MANUAL'})}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                        contributionData.contribution_type === 'MANUAL'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      <span className="font-medium">Manual</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setContributionData({...contributionData, contribution_type: 'AUTOMATIC'})}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                        contributionData.contribution_type === 'AUTOMATIC'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      <span className="font-medium">Automatic</span>
                    </button>
                  </div>
                </div>

                <div className="neu-form-group">
                  <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                  <textarea
                    value={contributionData.notes}
                    onChange={(e) => setContributionData({...contributionData, notes: e.target.value})}
                    className="w-full p-2 border rounded-lg dark:bg-gray-800"
                    rows={3}
                    placeholder="Add any notes about this contribution"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="neu-button flex-1">
                    Add Contribution
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowContributionModal(false);
                      setSelectedGoal(null);
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
