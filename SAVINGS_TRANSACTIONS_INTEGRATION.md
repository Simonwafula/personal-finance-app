# Savings-Transactions Integration

## Overview
This feature links the savings goals module with the transactions system, allowing users to:
1. Tag transactions as contributing to specific savings goals
2. Automatically track savings contributions from transactions
3. View total savings from transactions vs manual contributions
4. Manage savings through both dedicated forms and regular transactions

## Database Changes

### 1. Transaction Model (`finance/models.py`)
**New Field:**
```python
savings_goal = models.ForeignKey(
    'savings.SavingsGoal',
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="transactions"
)
```
- Links transactions to savings goals
- Allows tracking which expenses contribute to savings
- Optional field (can be null)

### 2. GoalContribution Model (`savings/models.py`)
**New Field:**
```python
transaction = models.OneToOneField(
    Transaction,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="savings_contribution"
)
```
- Links contributions back to source transactions
- One-to-one relationship (each transaction can only contribute to one goal contribution)
- Optional for manual contributions

## API Changes

### Transaction Serializer
**New Fields:**
- `savings_goal` (number | null) - ID of linked savings goal
- `savings_goal_name` (string | null) - Name of the goal
- `savings_goal_emoji` (string | null) - Emoji icon of the goal

**Example Response:**
```json
{
  "id": 123,
  "account": 1,
  "date": "2025-11-29",
  "amount": "5000.00",
  "kind": "EXPENSE",
  "category": 5,
  "description": "Transfer to savings",
  "savings_goal": 3,
  "savings_goal_name": "Emergency Fund",
  "savings_goal_emoji": "🏥"
}
```

### Savings Goal Serializer
**New Field:**
- `total_from_transactions` (number) - Total amount from linked transactions

**Example Response:**
```json
{
  "id": 3,
  "name": "Emergency Fund",
  "emoji": "🏥",
  "target_amount": "500000.00",
  "current_amount": "125000.00",
  "progress_percentage": 25.0,
  "total_from_transactions": 75000.00,
  ...
}
```

## Frontend Changes

### 1. TransactionsPage (`client/src/pages/TransactionsPage.tsx`)

**New Features:**
- ✅ Savings goal selector in transaction form
- ✅ Display savings goal badge in transaction list (both mobile & desktop)
- ✅ Loads savings goals alongside accounts and categories
- ✅ Auto-links transactions to goals when created

**Form Changes:**
Added new field after Category:
```tsx
<label>💰 Savings Goal (Optional)</label>
<select value={savingsGoalId} onChange={...}>
  <option value="">— No savings goal —</option>
  {savingsGoals.map(goal => (
    <option value={goal.id}>
      {goal.emoji} {goal.name} ({goal.progress_percentage}% complete)
    </option>
  ))}
</select>
```

**Transaction List Display:**
- Desktop: New "Savings Goal" column between Category and Amount
- Mobile: Shows savings goal below category with emoji and name
- Styled with gradient badge: `from-blue-500/10 to-purple-500/10`

### 2. SavingsPage (`client/src/pages/SavingsPage.tsx`)

**New Display:**
Shows transaction-based savings in goal cards:
```tsx
{goal.total_from_transactions > 0 && (
  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
    <p className="text-xs">From Transactions</p>
    <p className="text-lg font-bold text-green-600">
      {formatMoney(goal.total_from_transactions)}
    </p>
  </div>
)}
```

### 3. TypeScript Types

**Updated `Transaction` interface:**
```typescript
export interface Transaction {
  // ... existing fields
  savings_goal: number | null;
  savings_goal_name: string | null;
  savings_goal_emoji: string | null;
}
```

**Updated `SavingsGoal` interface:**
```typescript
export interface SavingsGoal {
  // ... existing fields
  total_from_transactions: number;
}
```

**Updated `CreateTransactionPayload`:**
```typescript
export interface CreateTransactionPayload {
  // ... existing fields
  savings_goal?: number | null;
}
```

## User Workflows

### Workflow 1: Link Transaction to Savings Goal
1. User goes to Transactions page
2. Clicks "Add" to create new transaction
3. Fills in account, date, amount, type
4. Selects a savings goal from dropdown (optional)
5. Submits transaction
6. Transaction is created and linked to goal
7. Goal's `total_from_transactions` updates automatically

### Workflow 2: View Savings from Transactions
1. User goes to Savings page
2. Each goal card shows:
   - Total current amount (from all sources)
   - "From Transactions" section (if > 0)
   - Progress bar reflects all contributions
3. User can see breakdown of manual vs transaction-based savings

### Workflow 3: Track Savings Progress
1. User creates savings goal (e.g., "Emergency Fund")
2. User makes regular transactions tagged to that goal
3. Backend automatically calculates:
   - `current_amount` (from manual contributions)
   - `total_from_transactions` (from linked transactions)
4. Frontend displays both metrics
5. Progress bar shows overall completion

## Database Migrations

**Created Migrations:**
1. `finance/migrations/0003_transaction_savings_goal.py`
   - Adds `savings_goal` ForeignKey to Transaction model

2. `savings/migrations/0002_goalcontribution_transaction.py`
   - Adds `transaction` OneToOneField to GoalContribution model

**To Apply:**
```bash
python manage.py migrate
```

## Benefits

1. **Unified Tracking**: Track savings through both dedicated contributions and regular transactions
2. **Flexibility**: Users can save via manual goals OR by tagging expenses
3. **Transparency**: See exactly how much comes from transactions vs manual adds
4. **Automatic Updates**: Goal progress updates when linked transactions are created
5. **Better Insights**: Understand saving patterns through transaction history

## Example Use Cases

### Use Case 1: Emergency Fund
- User creates "Emergency Fund" goal (target: 500,000 KES)
- Every month, user transfers 10,000 to savings account
- User tags transaction as "Emergency Fund"
- Goal automatically updates with 10,000
- User sees "From Transactions: 10,000 KES" on goal card

### Use Case 2: Vacation Savings
- User creates "Vacation" goal with 🏖️ emoji
- User saves through:
  - Manual contribution: 50,000 (from bonus)
  - Tagged transaction: 15,000/month (from salary)
- Goal shows:
  - Current: 115,000 (after several months)
  - From Transactions: 45,000 (3 months × 15,000)
  - Manual: 50,000 (bonus)

### Use Case 3: Multiple Goals
- User has 3 goals: House, Car, Education
- User splits salary:
  - 20,000 → House (transaction tagged)
  - 10,000 → Car (transaction tagged)
  - 5,000 → Education (transaction tagged)
- Each goal updates automatically
- User sees breakdown in each goal card

## Technical Notes

### Performance
- `total_from_transactions` calculated via database aggregation
- Uses Django's `Sum` aggregate on related transactions
- Cached in serializer response
- No N+1 query issues

### Data Integrity
- Foreign keys use `SET_NULL` to preserve data if goal/transaction deleted
- OneToOne relationship prevents duplicate contribution records
- Optional fields maintain backward compatibility

### Future Enhancements
1. Auto-create contribution when transaction is tagged
2. Sync contribution amounts if transaction amount changes
3. Bulk-tag multiple transactions to a goal
4. Reports showing transaction vs manual contribution ratios
5. Goal templates with suggested transaction categories
6. Recurring transaction auto-linking to goals
7. Category-to-goal mapping (auto-tag transactions by category)

## Testing Checklist

- [ ] Create transaction with savings goal
- [ ] View transaction in list with goal badge
- [ ] Check goal card shows "From Transactions"
- [ ] Verify `total_from_transactions` calculation
- [ ] Delete transaction - goal updates correctly
- [ ] Delete goal - transaction savings_goal becomes null
- [ ] Create transaction without goal - works normally
- [ ] Multiple transactions to same goal - sum correct
- [ ] Mobile view displays goal correctly
- [ ] Desktop table shows goal column
- [ ] Form validation works with optional goal
- [ ] Progress percentage includes transaction amounts

## Files Modified

### Backend
- `finance/models.py` - Added `savings_goal` field
- `finance/serializers.py` - Added goal name/emoji to response
- `savings/models.py` - Added `transaction` field to contribution
- `savings/serializers.py` - Added `total_from_transactions` calculation
- Migrations created and applied

### Frontend
- `client/src/api/types.ts` - Updated Transaction interface
- `client/src/api/finance.ts` - Updated CreateTransactionPayload
- `client/src/api/savings.ts` - Updated SavingsGoal interface
- `client/src/pages/TransactionsPage.tsx` - Added goal selector and display
- `client/src/pages/SavingsPage.tsx` - Added transaction total display

## Summary

This integration creates a powerful two-way link between savings goals and transactions, allowing users to track their savings through multiple methods while maintaining a unified view of progress. The implementation maintains backward compatibility, preserves data integrity, and provides a seamless user experience across both modules.
