import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

export default function MonthlyBudgetReview() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
        <HiArrowLeft /> Back to Articles
      </Link>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl">
            📊
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Budgeting</div>
            <h1 className="text-3xl font-bold mt-1">Why Monthly Budget Reviews Are Critical</h1>
          </div>
        </div>
        
        <div className="text-sm text-[var(--text-muted)] mb-6">4 min read</div>

        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-lg leading-relaxed">
            Creating a budget is just the first step. The real power comes from regular reviews that help you adapt to life's changes, catch overspending early, and continuously improve your financial decision-making. Monthly budget reviews transform budgeting from a static plan into a dynamic financial management system.
          </p>

          <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-6 border-l-4 border-purple-500">
            <h3 className="font-bold text-lg mb-2">The Review Cycle</h3>
            <p className="text-[var(--text-muted)]">
              Budget → Track → Review → Adjust → Repeat. This continuous cycle keeps your finances aligned with reality and goals.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Why Monthly Reviews Matter</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card bg-green-50 dark:bg-green-900/10">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span>✅</span> Catch Problems Early
              </h3>
              <p className="text-sm">Spot overspending before it becomes a crisis. Notice that you've spent 80% of your food budget by mid-month? Adjust immediately.</p>
            </div>
            
            <div className="card bg-blue-50 dark:bg-blue-900/10">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span>📈</span> Track Progress
              </h3>
              <p className="text-sm">Celebrate wins! See your savings grow, debt shrink, and financial goals getting closer each month.</p>
            </div>
            
            <div className="card bg-purple-50 dark:bg-purple-900/10">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span>🎯</span> Improve Accuracy
              </h3>
              <p className="text-sm">Each review teaches you about your actual spending patterns, making future budgets more realistic.</p>
            </div>
            
            <div className="card bg-amber-50 dark:bg-amber-900/10">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span>💡</span> Adapt to Change
              </h3>
              <p className="text-sm">Life changes constantly. Reviews let you adjust for new expenses, income changes, or shifting priorities.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">What to Review Each Month</h2>

          <div className="space-y-4">
            <div className="card border-l-4 border-blue-500">
              <h3 className="font-bold text-lg mb-2">1. Income vs Expenses</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Did you stay within budget overall?</li>
                <li>Were there any unexpected income sources?</li>
                <li>Did your income match expectations?</li>
              </ul>
            </div>

            <div className="card border-l-4 border-green-500">
              <h3 className="font-bold text-lg mb-2">2. Category Performance</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Which categories came in under budget? (Great job!)</li>
                <li>Which categories went over? (Why?)</li>
                <li>Were the overages one-time events or trends?</li>
              </ul>
            </div>

            <div className="card border-l-4 border-purple-500">
              <h3 className="font-bold text-lg mb-2">3. Savings Progress</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Did you meet your savings target?</li>
                <li>How much closer are you to your goals?</li>
                <li>Can you increase savings next month?</li>
              </ul>
            </div>

            <div className="card border-l-4 border-red-500">
              <h3 className="font-bold text-lg mb-2">4. Debt Reduction</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>How much debt did you pay off?</li>
                <li>Are you on track with your payoff plan?</li>
                <li>Can you make extra payments?</li>
              </ul>
            </div>

            <div className="card border-l-4 border-amber-500">
              <h3 className="font-bold text-lg mb-2">5. Irregular Expenses</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Were there any surprise expenses?</li>
                <li>Should you budget for them going forward?</li>
                <li>Do you need to adjust your emergency fund?</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">The 15-Minute Monthly Review Process</h2>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg p-6">
            <ol className="space-y-4">
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 min-w-[30px]">1.</span>
                <div>
                  <strong>Gather Data (2 min)</strong>
                  <p className="text-sm text-[var(--text-muted)] mt-1">Pull up your bank statements, credit card statements, and budget tracker.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 min-w-[30px]">2.</span>
                <div>
                  <strong>Compare Planned vs Actual (5 min)</strong>
                  <p className="text-sm text-[var(--text-muted)] mt-1">Go through each budget category and compare what you planned to spend vs what you actually spent.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 min-w-[30px]">3.</span>
                <div>
                  <strong>Identify Variances (3 min)</strong>
                  <p className="text-sm text-[var(--text-muted)] mt-1">Note categories with significant differences (over/under by 20% or more). Ask why.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 min-w-[30px]">4.</span>
                <div>
                  <strong>Celebrate Wins (2 min)</strong>
                  <p className="text-sm text-[var(--text-muted)] mt-1">Acknowledge categories where you did well. Note what worked.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 min-w-[30px]">5.</span>
                <div>
                  <strong>Adjust Next Month's Budget (3 min)</strong>
                  <p className="text-sm text-[var(--text-muted)] mt-1">Update category amounts based on what you learned. Add new categories if needed.</p>
                </div>
              </li>
            </ol>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Key Questions to Ask</h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-[var(--surface)] rounded-lg">
              <span className="text-2xl">🤔</span>
              <div>
                <strong>Where did my money actually go?</strong>
                <p className="text-sm text-[var(--text-muted)] mt-1">Be honest. Track down mystery spending.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-[var(--surface)] rounded-lg">
              <span className="text-2xl">🎯</span>
              <div>
                <strong>Am I closer to my financial goals?</strong>
                <p className="text-sm text-[var(--text-muted)] mt-1">Measure progress on savings, debt payoff, and investment targets.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-[var(--surface)] rounded-lg">
              <span className="text-2xl">⚠️</span>
              <div>
                <strong>What surprised me this month?</strong>
                <p className="text-sm text-[var(--text-muted)] mt-1">Unexpected expenses teach valuable lessons.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-[var(--surface)] rounded-lg">
              <span className="text-2xl">💪</span>
              <div>
                <strong>What can I do better next month?</strong>
                <p className="text-sm text-[var(--text-muted)] mt-1">Focus on one or two improvements, not perfection.</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Common Review Mistakes to Avoid</h2>

          <div className="space-y-3">
            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <strong className="text-red-600 dark:text-red-400">❌ Skipping Reviews</strong>
              <p className="text-sm mt-1">Missing reviews breaks the improvement cycle. Set a recurring calendar reminder.</p>
            </div>
            
            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <strong className="text-red-600 dark:text-red-400">❌ Beating Yourself Up</strong>
              <p className="text-sm mt-1">Budget overages happen. Use them as learning opportunities, not reasons for shame.</p>
            </div>
            
            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <strong className="text-red-600 dark:text-red-400">❌ Not Adjusting</strong>
              <p className="text-sm mt-1">Reviews are pointless if you don't update your budget based on learnings.</p>
            </div>
            
            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <strong className="text-red-600 dark:text-red-400">❌ Making It Too Complicated</strong>
              <p className="text-sm mt-1">Keep it simple. You need insights, not perfection.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Sample Review Template</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-[var(--border-subtle)] rounded-lg text-sm">
              <thead className="bg-[var(--surface)]">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Category</th>
                  <th className="px-4 py-3 text-right font-semibold">Budgeted</th>
                  <th className="px-4 py-3 text-right font-semibold">Actual</th>
                  <th className="px-4 py-3 text-right font-semibold">Difference</th>
                  <th className="px-4 py-3 text-left font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Groceries</td>
                  <td className="px-4 py-3 text-right">12,000</td>
                  <td className="px-4 py-3 text-right">13,500</td>
                  <td className="px-4 py-3 text-right text-red-600">+1,500</td>
                  <td className="px-4 py-3 text-xs">Had guests, budget +1k next month</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Transport</td>
                  <td className="px-4 py-3 text-right">8,000</td>
                  <td className="px-4 py-3 text-right">6,500</td>
                  <td className="px-4 py-3 text-right text-green-600">-1,500</td>
                  <td className="px-4 py-3 text-xs">Worked from home 2 weeks</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Entertainment</td>
                  <td className="px-4 py-3 text-right">4,000</td>
                  <td className="px-4 py-3 text-right">4,200</td>
                  <td className="px-4 py-3 text-right text-red-600">+200</td>
                  <td className="px-4 py-3 text-xs">Within tolerance</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Savings</td>
                  <td className="px-4 py-3 text-right">10,000</td>
                  <td className="px-4 py-3 text-right">10,000</td>
                  <td className="px-4 py-3 text-right text-green-600">0</td>
                  <td className="px-4 py-3 text-xs">✅ Hit target!</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-6 my-8 border-2 border-green-200 dark:border-green-800">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span>🎯</span> The Bottom Line
            </h3>
            <p>
              Monthly budget reviews are where the magic happens. They transform budgeting from guesswork into a data-driven system that gets better every month. Spend just 15 minutes reviewing, learn from your patterns, adjust your plan, and watch your financial confidence grow. Remember: budgets that aren't reviewed are just wishful thinking.
            </p>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-6 mt-8">
            <h3 className="font-bold mb-3">Related Articles:</h3>
            <div className="space-y-2">
              <Link to="/blog/budgeting-50-30-20-rule" className="text-blue-600 hover:text-blue-700 block">
                → The 50/30/20 Budgeting Rule Explained
              </Link>
              <Link to="/blog/zero-based-budgeting" className="text-blue-600 hover:text-blue-700 block">
                → Zero-Based Budgeting: Give Every Shilling a Job
              </Link>
              <Link to="/blog/track-opening-balance" className="text-blue-600 hover:text-blue-700 block">
                → Why Opening Balances Matter for Financial Tracking
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
