// SMS Transaction Detection UI Component
import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp,
  Bell,
  BellOff,
  RefreshCw,
  Smartphone,
  AlertCircle
} from 'lucide-react';
import useSmsTransactions, { type PendingTransaction } from '../hooks/useSmsTransactions';
import type { Category } from '../api/types';

interface SmsTransactionPromptProps {
  categories: Category[];
  accounts: { id: number; name: string }[];
  onSaveTransaction: (transaction: {
    amount: number;
    type: 'income' | 'expense';
    category: number;
    account: number;
    description: string;
    date: string;
    reference?: string;
  }) => Promise<void>;
  className?: string;
}

export function SmsTransactionPrompt({
  categories,
  accounts,
  onSaveTransaction,
  className = '',
}: SmsTransactionPromptProps) {
  const {
    hasPermission,
    isListening,
    isLoading,
    error,
    pendingTransactions,
    requestPermissions,
    loadRecentTransactions,
    startListening,
    stopListening,
    dismissTransaction,
    markAsSaved,
    getSourceDisplayName,
  } = useSmsTransactions({ autoStart: true });

  const [expanded, setExpanded] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    category: number;
    account: number;
    description: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  // Find category ID by name
  const findCategoryByName = (name: string): number | undefined => {
    const cat = categories.find(
      c => c.name.toLowerCase() === name.toLowerCase()
    );
    return cat?.id;
  };

  const handleEdit = (transaction: PendingTransaction) => {
    const suggestedCategoryId = findCategoryByName(transaction.suggestedCategory);
    setEditingId(transaction.id);
    setEditForm({
      category: suggestedCategoryId || (categories[0]?.id ?? 0),
      account: accounts[0]?.id ?? 0,
      description: transaction.recipient || transaction.sender || '',
    });
  };

  const handleSave = async (transaction: PendingTransaction) => {
    if (!editForm) return;

    try {
      setSaving(true);
      await onSaveTransaction({
        amount: transaction.amount,
        type: transaction.type === 'income' ? 'income' : 'expense',
        category: editForm.category,
        account: editForm.account,
        description: editForm.description,
        date: transaction.timestamp.toISOString().split('T')[0],
        reference: transaction.reference,
      });
      markAsSaved(transaction.id);
      setEditingId(null);
      setEditForm(null);
    } catch (err) {
      console.error('Error saving transaction:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleQuickSave = async (transaction: PendingTransaction) => {
    const suggestedCategoryId = findCategoryByName(transaction.suggestedCategory);
    
    try {
      setSaving(true);
      await onSaveTransaction({
        amount: transaction.amount,
        type: transaction.type === 'income' ? 'income' : 'expense',
        category: suggestedCategoryId || (categories[0]?.id ?? 0),
        account: accounts[0]?.id ?? 0,
        description: transaction.recipient || transaction.sender || '',
        date: transaction.timestamp.toISOString().split('T')[0],
        reference: transaction.reference,
      });
      markAsSaved(transaction.id);
    } catch (err) {
      console.error('Error saving transaction:', err);
    } finally {
      setSaving(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency || 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-KE', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Don't render on web or if no pending transactions and not loading
  if (hasPermission === false && !isLoading) {
    return (
      <div className={`card p-4 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <Smartphone className="w-5 h-5 text-primary" />
          <h3 className="font-medium">SMS Transaction Tracking</h3>
        </div>
        <p className="text-sm text-secondary mb-4">
          Enable SMS reading to automatically detect transactions from M-PESA and banks.
        </p>
        <button
          onClick={requestPermissions}
          className="btn btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Requesting...' : 'Enable SMS Tracking'}
        </button>
      </div>
    );
  }

  if (hasPermission === null) {
    return null; // Still checking
  }

  return (
    <div className={`card ${className}`}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="font-medium">SMS Transactions</h3>
          {pendingTransactions.length > 0 && (
            <span className="badge badge-primary">
              {pendingTransactions.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              isListening ? stopListening() : startListening();
            }}
            className={`p-2 rounded-lg ${
              isListening ? 'text-green-500' : 'text-secondary'
            }`}
            title={isListening ? 'Stop monitoring' : 'Start monitoring'}
          >
            {isListening ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              loadRecentTransactions();
            }}
            className="p-2 rounded-lg text-secondary"
            disabled={isLoading}
            title="Refresh messages"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-secondary" />
          ) : (
            <ChevronDown className="w-4 h-4 text-secondary" />
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        </div>
      )}

      {/* Content */}
      {expanded && (
        <div className="border-t border-border">
          {pendingTransactions.length === 0 ? (
            <div className="p-6 text-center text-secondary">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No pending transactions from SMS</p>
              <p className="text-xs mt-1">
                {isListening 
                  ? 'Monitoring for new messages...' 
                  : 'Start monitoring to detect transactions'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border max-h-96 overflow-y-auto">
              {pendingTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4">
                  {/* Transaction summary */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-semibold ${
                          transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatAmount(transaction.amount, transaction.currency)}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-surface-alt">
                          {getSourceDisplayName(transaction.source)}
                        </span>
                      </div>
                      <p className="text-sm text-secondary mt-1">
                        {transaction.type === 'income' 
                          ? `From: ${transaction.sender}` 
                          : `To: ${transaction.recipient}`}
                      </p>
                      <p className="text-xs text-secondary">
                        {formatDate(transaction.timestamp)}
                        {transaction.reference && ` • Ref: ${transaction.reference}`}
                      </p>
                    </div>
                    
                    {/* Quick actions */}
                    {editingId !== transaction.id && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleQuickSave(transaction)}
                          className="p-2 rounded-lg hover:bg-surface-alt text-green-500"
                          title="Quick save"
                          disabled={saving}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="p-2 rounded-lg hover:bg-surface-alt text-primary"
                          title="Edit & save"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => dismissTransaction(transaction.id)}
                          className="p-2 rounded-lg hover:bg-surface-alt text-secondary"
                          title="Dismiss"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Suggested category badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-secondary">Suggested:</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {transaction.suggestedCategory}
                    </span>
                    <span className="text-xs text-secondary">
                      ({Math.round(transaction.confidence * 100)}% confident)
                    </span>
                  </div>

                  {/* Edit form */}
                  {editingId === transaction.id && editForm && (
                    <div className="mt-3 p-3 bg-surface-alt rounded-lg space-y-3">
                      <div>
                        <label className="text-xs text-secondary">Category</label>
                        <select
                          value={editForm.category}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            category: parseInt(e.target.value),
                          })}
                          className="input w-full mt-1"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-secondary">Account</label>
                        <select
                          value={editForm.account}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            account: parseInt(e.target.value),
                          })}
                          className="input w-full mt-1"
                        >
                          {accounts.map((acc) => (
                            <option key={acc.id} value={acc.id}>
                              {acc.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-secondary">Description</label>
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })}
                          className="input w-full mt-1"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(transaction)}
                          className="btn btn-primary flex-1"
                          disabled={saving}
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditForm(null);
                          }}
                          className="btn btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Raw message (expandable) */}
                  <details className="mt-2">
                    <summary className="text-xs text-secondary cursor-pointer">
                      View original message
                    </summary>
                    <p className="text-xs text-secondary mt-1 p-2 bg-surface-alt rounded">
                      {transaction.rawMessage}
                    </p>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SmsTransactionPrompt;
