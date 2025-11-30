import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

export default function TrackOpeningBalance() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
        <HiArrowLeft /> Back to Articles
      </Link>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-3xl">
            📊
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Accounts</div>
            <h1 className="text-3xl font-bold mt-1">The Importance of Tracking Opening Balances</h1>
          </div>
        </div>
        
        <div className="text-sm text-[var(--text-muted)] mb-6">4 min read</div>

        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-lg leading-relaxed">
            Opening balance tracking seems mundane—just write down what you have at the start of the month, right? But this simple practice is the cornerstone of financial accountability. Without accurate opening balances, you can't measure progress, reconcile transactions, or catch errors. It's the difference between "I think I'm doing okay" and "I know exactly where every shilling went." Let's explore why this matters and how to do it properly.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="font-bold text-lg mb-2">What is an Opening Balance?</h3>
            <p className="text-sm">
              Your opening balance is the amount of money in an account at the beginning of a tracking period (usually monthly). It serves as your financial starting line—the reference point against which all income and expenses are measured. Last month's closing balance becomes this month's opening balance, creating an unbreakable chain of accountability.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Why Opening Balances Matter</h2>

          <div className="space-y-4">
            <div className="card bg-green-50 dark:bg-green-900/10 border-l-4 border-green-500">
              <h3 className="font-bold mb-2">1. 🔍 Catch Errors and Fraud</h3>
              <p className="text-sm mb-3">
                If your opening balance + income - expenses ≠ current balance, something's wrong. Either you forgot to record a transaction, the bank made an error, or worse—unauthorized charges occurred.
              </p>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-3 text-sm">
                <strong>Example:</strong> Opening KES 50K + Income KES 100K - Expenses KES 80K = Expected KES 70K.
                <br/>But actual balance is KES 65K? Missing KES 5K needs investigation!
              </div>
            </div>

            <div className="card bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500">
              <h3 className="font-bold mb-2">2. 📈 Measure Real Progress</h3>
              <p className="text-sm">
                Without opening balances, you can't tell if you're actually building wealth or just treading water. Tracking month-over-month growth (or decline) reveals your true financial trajectory.
              </p>
            </div>

            <div className="card bg-purple-50 dark:bg-purple-900/10 border-l-4 border-purple-500">
              <h3 className="font-bold mb-2">3. 🧮 Accurate Budgeting</h3>
              <p className="text-sm">
                Budgets work only when grounded in reality. If you think you have KES 30K but actually have KES 20K, your entire spending plan collapses. Opening balances keep you honest.
              </p>
            </div>

            <div className="card bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500">
              <h3 className="font-bold mb-2">4. ⚖️ Bank Reconciliation</h3>
              <p className="text-sm">
                Banks make mistakes. Duplicate charges, incorrect interest, failed reversals—opening balances let you spot discrepancies quickly and dispute them while still fresh.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">The Reconciliation Formula</h2>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-lg p-6 border-2 border-indigo-200 dark:border-indigo-800">
            <h3 className="font-bold text-lg mb-4 text-center">The Golden Equation</h3>
            <div className="text-center space-y-2">
              <p className="text-lg font-mono">Opening Balance</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">+ Income</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">- Expenses</p>
              <p className="text-lg">= Expected Closing Balance</p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 mt-4">
              <p className="text-sm text-center"><strong>If Expected ≠ Actual:</strong> Investigate the difference immediately</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">How to Track Opening Balances Properly</h2>

          <div className="space-y-3">
            <div className="card bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10">
              <h3 className="font-bold mb-2">Step 1: Record at Fixed Interval</h3>
              <p className="text-sm">Choose a consistent day each month (e.g., 1st or payday). Check all accounts and record balances before any new transactions.</p>
            </div>

            <div className="card bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
              <h3 className="font-bold mb-2">Step 2: Include All Accounts</h3>
              <p className="text-sm">Don't cherry-pick. Track every checking, savings, M-Pesa, investment account. Partial tracking defeats the purpose.</p>
            </div>

            <div className="card bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
              <h3 className="font-bold mb-2">Step 3: Verify Against Bank Statements</h3>
              <p className="text-sm">Don't trust memory or estimates. Log into mobile banking or check ATM receipt. Record the exact balance shown.</p>
            </div>

            <div className="card bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10">
              <h3 className="font-bold mb-2">Step 4: Store in Spreadsheet/App</h3>
              <p className="text-sm">Use Excel, Google Sheets, or finance apps like this one. Manual tracking works but digital is searchable and calculable.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Sample Tracking Template</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-[var(--border-subtle)] rounded-lg text-sm">
              <thead className="bg-[var(--surface)]">
                <tr>
                  <th className="px-4 py-3 text-left">Account</th>
                  <th className="px-4 py-3 text-right">Opening (1st Jan)</th>
                  <th className="px-4 py-3 text-right">+ Income</th>
                  <th className="px-4 py-3 text-right">- Expenses</th>
                  <th className="px-4 py-3 text-right">Expected Closing</th>
                  <th className="px-4 py-3 text-right">Actual Closing</th>
                  <th className="px-4 py-3 text-right">Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">KCB Checking</td>
                  <td className="px-4 py-3 text-right">15,000</td>
                  <td className="px-4 py-3 text-right text-green-600">100,000</td>
                  <td className="px-4 py-3 text-right text-red-600">85,000</td>
                  <td className="px-4 py-3 text-right font-semibold">30,000</td>
                  <td className="px-4 py-3 text-right font-semibold">30,000</td>
                  <td className="px-4 py-3 text-right text-green-600">✓ 0</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">CIC Savings</td>
                  <td className="px-4 py-3 text-right">50,000</td>
                  <td className="px-4 py-3 text-right text-green-600">10,000</td>
                  <td className="px-4 py-3 text-right text-red-600">0</td>
                  <td className="px-4 py-3 text-right font-semibold">60,000</td>
                  <td className="px-4 py-3 text-right font-semibold">60,450</td>
                  <td className="px-4 py-3 text-right text-green-600">+450</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">M-Pesa</td>
                  <td className="px-4 py-3 text-right">5,000</td>
                  <td className="px-4 py-3 text-right text-green-600">20,000</td>
                  <td className="px-4 py-3 text-right text-red-600">18,000</td>
                  <td className="px-4 py-3 text-right font-semibold">7,000</td>
                  <td className="px-4 py-3 text-right font-semibold">6,800</td>
                  <td className="px-4 py-3 text-right text-red-600">-200</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="text-sm text-[var(--text-muted)] space-y-1 mt-2">
            <p>✓ <strong>KCB:</strong> Perfect match—all transactions recorded</p>
            <p>✓ <strong>CIC:</strong> +KES 450 = Interest earned (expected)</p>
            <p>⚠️ <strong>M-Pesa:</strong> -KES 200 = Investigate! Forgot transaction or incorrect charge?</p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Common Opening Balance Mistakes</h2>

          <div className="space-y-3">
            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <strong className="text-red-600 dark:text-red-400">❌ Recording After Transactions Start</strong>
              <p className="text-sm mt-1">If you record opening balance on the 3rd but already spent KES 5K on the 1st and 2nd, your math won't work. Snapshot before activity begins.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <strong className="text-red-600 dark:text-red-400">❌ Rounding or Estimating</strong>
              <p className="text-sm mt-1">"About KES 50,000" isn't useful. Record exact amounts: KES 49,823.47. Precision matters for reconciliation.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <strong className="text-red-600 dark:text-red-400">❌ Ignoring Pending Transactions</strong>
              <p className="text-sm mt-1">If you wrote a check or initiated transfer that hasn't cleared, adjust for it. Record the "available balance," not just statement balance.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <strong className="text-red-600 dark:text-red-400">❌ Forgetting to Update Monthly</strong>
              <p className="text-sm mt-1">This month's closing becomes next month's opening. Missing even one month breaks the chain and makes past data useless.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">When Opening ≠ Expected: Investigation Checklist</h2>

          <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-6 border-l-4 border-amber-500">
            <h3 className="font-bold mb-3">Found a Discrepancy? Check These:</h3>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li><strong>Forgotten Transactions:</strong> Review bank statement for missed entries (ATM withdrawals, auto-debits, fees)</li>
              <li><strong>Duplicate Entries:</strong> Did you record the same transaction twice in your tracker?</li>
              <li><strong>Pending Transactions:</strong> Payments that cleared earlier/later than expected</li>
              <li><strong>Bank Fees:</strong> Monthly maintenance, transfer charges, SMS fees</li>
              <li><strong>Interest/Dividends:</strong> Automatic earnings you didn't manually add</li>
              <li><strong>Reversals:</strong> Refunds or chargebacks that adjusted balance</li>
              <li><strong>Incorrect Categorization:</strong> Logged expense as income or vice versa</li>
              <li><strong>Math Errors:</strong> Simple addition/subtraction mistake in spreadsheet</li>
            </ol>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Tools for Tracking</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card bg-blue-50 dark:bg-blue-900/10">
              <h3 className="font-bold mb-2">📱 Mobile Apps</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>This Personal Finance App</li>
                <li>Excel Mobile / Google Sheets</li>
                <li>Banking apps (screenshot balances)</li>
              </ul>
            </div>

            <div className="card bg-green-50 dark:bg-green-900/10">
              <h3 className="font-bold mb-2">💻 Desktop Solutions</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Excel with monthly tabs</li>
                <li>Google Sheets (cloud sync)</li>
                <li>Accounting software (QuickBooks, Wave)</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-6 my-8 border-2 border-green-200 dark:border-green-800">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span>🎯</span> The Bottom Line
            </h3>
            <p>
              Opening balance tracking is financial hygiene—basic but essential. It's the only way to know if your money management is actually working or just feels like it's working. Five minutes on the 1st of every month to record exact balances saves hours of detective work later and prevents financial blind spots that cost you money. Make it a non-negotiable habit: new month, new opening balances, recorded before you touch a single shilling. Your accountant (and future wealthy self) will thank you.
            </p>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-6 mt-8">
            <h3 className="font-bold mb-3">Related Articles:</h3>
            <div className="space-y-2">
              <Link to="/blog/separate-accounts" className="text-blue-600 hover:text-blue-700 block">
                → Why You Need Multiple Bank Accounts
              </Link>
              <Link to="/blog/monitor-accounts-regularly" className="text-blue-600 hover:text-blue-700 block">
                → Why You Should Monitor Bank Accounts Regularly
              </Link>
              <Link to="/blog/track-net-worth" className="text-blue-600 hover:text-blue-700 block">
                → How to Track Your Net Worth Effectively
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
