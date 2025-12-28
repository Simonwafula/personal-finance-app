import React, { useState, useEffect } from 'react';
import { 
  Target, 
  TrendingUp, 
  Calendar,
  Plus,
  X,
  Trash2,
  Edit2,
  PiggyBank,
  Clock,
  History,
  BarChart3
} from 'lucide-react';
import {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  addContribution,
  getSavingsSummary,
  type SavingsGoal,
  type CreateGoalData,
  type CreateContributionData,
  type SavingsSummary,
  type GoalContribution
} from '../api/savings';

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
  const [summary, setSummary] = useState<SavingsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [activeTab, setActiveTab] = useState<'goals' | 'tracker'>('goals');
  const [formData, setFormData] = useState<CreateGoalData>({
    name: '',
    target_amount: '',
    current_amount: '0',
    target_date: '',
    description: '',
    emoji: '🎯',
    interest_rate: '0'
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
      const [goalsData, summaryData] = await Promise.all([
        getSavingsGoals(),
        getSavingsSummary().catch(() => null)
      ]);
      setSavingsGoals(goalsData);
      if (summaryData) setSummary(summaryData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGoal) {
        await updateSavingsGoal(editingGoal.id, formData);
      } else {
        await createSavingsGoal(formData);
      }
      setShowGoalModal(false);
      setEditingGoal(null);
      setFormData({
        name: '',
        target_amount: '',
        current_amount: '0',
        target_date: '',
        description: '',
        emoji: '🎯',
        interest_rate: '0'
      });
      loadData();
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const handleEditGoal = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      target_amount: goal.target_amount,
      current_amount: goal.current_amount,
      target_date: goal.target_date || '',
      description: goal.description || '',
      emoji: goal.emoji,
      interest_rate: String(goal.interest_rate || 0)
    });
    setShowGoalModal(true);
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
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
            <PiggyBank className="text-green-600" size={28} />
            Savings Goals
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Track progress toward your financial objectives
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-sm font-semibold">
            {savingsGoals.length} {savingsGoals.length === 1 ? 'Goal' : 'Goals'}
          </span>
          <button 
            onClick={() => setShowGoalModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            New Goal
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-[var(--border-subtle)] pb-1">
        <button
          onClick={() => setActiveTab('goals')}
          className={`px-6 py-3 rounded-t-lg font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'goals'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : 'bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-muted)]'
          }`}
        >
          <Target size={18} />
          Goals
        </button>
        <button
          onClick={() => setActiveTab('tracker')}
          className={`px-6 py-3 rounded-t-lg font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'tracker'
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
              : 'bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-muted)]'
          }`}
        >
          <BarChart3 size={18} />
          Tracker
        </button>
      </div>

      {/* TRACKER TAB */}
      {activeTab === 'tracker' && (
        <>
          {/* Summary Cards */}
          {summary && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-2xl">💰</div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)] font-medium">Total Saved</p>
                    <p className="text-2xl font-bold text-green-500">{formatMoney(summary.total_saved)}</p>
                  </div>
                </div>
              </div>
              <div className="card bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">🎯</div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)] font-medium">Total Target</p>
                    <p className="text-2xl font-bold text-blue-500">{formatMoney(summary.total_target)}</p>
                  </div>
                </div>
              </div>
              <div className="card bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-2xl">📊</div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)] font-medium">Avg Progress</p>
                    <p className="text-2xl font-bold text-amber-500">{summary.average_progress.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
              <div className="card bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl">⏳</div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)] font-medium">Remaining</p>
                    <p className="text-2xl font-bold text-purple-500">{formatMoney(summary.total_remaining)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Goals Progress Overview */}
          <div className="card">
            <div className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>📈</span>
              Goals Progress Overview
            </div>
            {savingsGoals.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-muted)]">
                <PiggyBank size={48} className="mx-auto mb-3 opacity-50" />
                <p>No goals to track yet. Create a goal to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savingsGoals.map(goal => (
                  <div key={goal.id} className="p-4 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{goal.emoji}</span>
                        <span className="font-semibold">{goal.name}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        goal.progress_percentage >= 100 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        goal.progress_percentage >= 50 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {goal.progress_percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${
                          goal.progress_percentage >= 100 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                          goal.progress_percentage >= 50 ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
                          'bg-gradient-to-r from-amber-500 to-orange-500'
                        }`}
                        style={{ width: `${Math.min(100, goal.progress_percentage)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-[var(--text-muted)]">
                      <span>{formatMoney(goal.current_amount)} saved</span>
                      <span>{formatMoney(goal.remaining_amount)} to go</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Contributions History */}
          <div className="card">
            <div className="text-lg font-semibold mb-4 flex items-center gap-2">
              <History size={20} />
              Contribution History
            </div>
            {(() => {
              // Gather all contributions from all goals
              const allContributions: (GoalContribution & { goalName: string; goalEmoji: string })[] = [];
              savingsGoals.forEach(goal => {
                (goal.contributions || []).forEach(c => {
                  allContributions.push({
                    ...c,
                    goalName: goal.name,
                    goalEmoji: goal.emoji
                  });
                });
              });
              // Sort by date descending
              allContributions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

              if (allContributions.length === 0) {
                return (
                  <div className="text-center py-8 text-[var(--text-muted)]">
                    <TrendingUp size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No contributions yet. Start saving!</p>
                  </div>
                );
              }

              return (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-[var(--surface)]">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Date</th>
                        <th className="px-4 py-3 text-left font-semibold">Goal</th>
                        <th className="px-4 py-3 text-right font-semibold">Amount</th>
                        <th className="px-4 py-3 text-left font-semibold">Type</th>
                        <th className="px-4 py-3 text-left font-semibold">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)]">
                      {allContributions.slice(0, 20).map((c, idx) => (
                        <tr key={`${c.id}-${idx}`} className="hover:bg-[var(--surface)] transition-colors">
                          <td className="px-4 py-3">{new Date(c.date).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1">
                              <span>{c.goalEmoji}</span>
                              <span className="font-medium">{c.goalName}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-green-600 dark:text-green-400">
                            +{formatMoney(c.amount)}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              c.contribution_type === 'AUTOMATIC' 
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                              {c.contribution_type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[var(--text-muted)] truncate max-w-[200px]">
                            {c.notes || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>

          {/* Tip Card */}
          <div className="card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <p className="font-semibold mb-1">Savings Tips</p>
                <ul className="text-sm text-[var(--text-muted)] space-y-1">
                  <li>• Set up automatic contributions to build habits</li>
                  <li>• Aim to save at least 20% of your income</li>
                  <li>• Review and adjust goals quarterly</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* GOALS TAB */}
      {activeTab === 'goals' && (
        <>

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
                    <span className="inline-flex px-3 py-1.5 text-sm font-bold rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                      {goal.progress_percentage.toFixed(1)}%
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleEditGoal(goal)}
                      className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      title="Edit goal"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      title="Delete goal"
                    >
                      <Trash2 size={16} />
                    </button>
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
                  {goal.monthly_target !== undefined && goal.progress_percentage < 100 && goal.target_date && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-[var(--text-muted)] mb-1">
                            Monthly Target {goal.interest_rate > 0 ? `(with ${goal.interest_rate}% interest)` : ''}
                          </p>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {formatMoney(goal.monthly_target)}
                          </p>
                        </div>
                        {goal.interest_rate > 0 && goal.projected_value > 0 && (
                          <div className="text-right">
                            <p className="text-xs text-[var(--text-muted)] mb-1">Projected Growth</p>
                            <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                              +{formatMoney(goal.projected_value - parseFloat(goal.current_amount))}
                            </p>
                          </div>
                        )}
                      </div>
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
      </>
      )}

      {/* Create/Edit Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => { setShowGoalModal(false); setEditingGoal(null); }}>
          <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold">{editingGoal ? '✏️ Edit Savings Goal' : '🎯 Create Savings Goal'}</h4>
              <button
                onClick={() => { setShowGoalModal(false); setEditingGoal(null); }}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X size={20} />
              </button>
            </div>
              
            <form onSubmit={handleCreateGoal} className="space-y-4">
              {/* Emoji Picker */}
              <div>
                <label className="block text-sm font-medium mb-2">Choose an Icon</label>
                <div className="flex gap-2 flex-wrap">
                  {emojiOptions.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({...formData, emoji})}
                      className={`text-2xl p-2 rounded-lg transition-all ${
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

              <div>
                <label className="block text-sm font-medium mb-2">Goal Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  placeholder="e.g., Emergency Fund"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Target Amount *</label>
                  <input
                    type="number"
                    required
                    value={formData.target_amount}
                    onChange={(e) => setFormData({...formData, target_amount: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder="100,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Already Saved</label>
                  <input
                    type="number"
                    value={formData.current_amount}
                    onChange={(e) => setFormData({...formData, current_amount: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Target Date (Optional)</label>
                <input
                  type="date"
                  value={formData.target_date}
                  onChange={(e) => setFormData({...formData, target_date: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Expected Interest Rate (% per year)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={formData.interest_rate}
                  onChange={(e) => setFormData({...formData, interest_rate: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  placeholder="e.g., 10 for 10%"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  💡 If saving in an interest-bearing account, this reduces your monthly target
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  rows={2}
                  placeholder="What is this goal for?"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
                <button 
                  type="button" 
                  onClick={() => { setShowGoalModal(false); setEditingGoal(null); }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contribution Modal */}
      {showContributionModal && selectedGoal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => { setShowContributionModal(false); setSelectedGoal(null); }}>
          <div className="card max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-xl font-bold">💵 Add Contribution</h4>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  {selectedGoal.emoji} {selectedGoal.name}
                </p>
              </div>
              <button
                onClick={() => { setShowContributionModal(false); setSelectedGoal(null); }}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X size={20} />
              </button>
            </div>
              
            <form onSubmit={handleAddContribution} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (KES) *</label>
                  <input
                    type="number"
                    required
                    value={contributionData.amount}
                    onChange={(e) => setContributionData({...contributionData, amount: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder="5,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date *</label>
                  <input
                    type="date"
                    required
                    value={contributionData.date}
                    onChange={(e) => setContributionData({...contributionData, date: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Contribution Type</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setContributionData({...contributionData, contribution_type: 'MANUAL'})}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${
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
                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                      contributionData.contribution_type === 'AUTOMATIC'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    <span className="font-medium">Automatic</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                <textarea
                  value={contributionData.notes}
                  onChange={(e) => setContributionData({...contributionData, notes: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  rows={2}
                  placeholder="Add any notes about this contribution"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  Add Contribution
                </button>
                <button 
                  type="button" 
                  onClick={() => { setShowContributionModal(false); setSelectedGoal(null); }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
