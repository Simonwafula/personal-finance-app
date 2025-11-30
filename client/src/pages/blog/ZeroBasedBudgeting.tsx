import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

export default function ZeroBasedBudgeting() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
        <HiArrowLeft /> Back to Articles
      </Link>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl">
            🎯
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Budgeting</div>
            <h1 className="text-3xl font-bold mt-1">Zero-Based Budgeting: Give Every Shilling a Job</h1>
          </div>
        </div>
        
        <div className="text-sm text-[var(--text-muted)] mb-6">6 min read</div>

        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-lg leading-relaxed">
            Zero-based budgeting (ZBB) is a powerful money management method where you allocate every single shilling of your income to a specific purpose—whether it's spending, saving, or debt repayment. The goal is to have your income minus expenses equal zero at the end of each month.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="font-bold text-lg mb-2">The Core Principle</h3>
            <p className="text-2xl font-mono text-center my-4">Income - Expenses = 0</p>
            <p className="text-[var(--text-muted)]">
              This doesn't mean you spend all your money! It means every shilling has a designated purpose, including savings and investments.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">How Zero-Based Budgeting Works</h2>
          
          <div className="space-y-6">
            <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <span className="text-2xl">1️⃣</span> Start with Your Income
              </h3>
              <p>Calculate your total monthly take-home pay after taxes. Include:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Salary/wages</li>
                <li>Side hustle income</li>
                <li>Rental income</li>
                <li>Any other regular income</li>
              </ul>
            </div>

            <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <span className="text-2xl">2️⃣</span> List All Expenses
              </h3>
              <p>Write down everything you need to spend money on:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Fixed expenses (rent, loan payments, insurance)</li>
                <li>Variable expenses (groceries, utilities, fuel)</li>
                <li>Savings goals</li>
                <li>Debt payments</li>
                <li>Fun money</li>
              </ul>
            </div>

            <div className="card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <span className="text-2xl">3️⃣</span> Assign Every Shilling
              </h3>
              <p>Allocate your income to each category until you reach zero. If you have KES 10,000 left, decide where it goes—don't leave it unassigned!</p>
            </div>

            <div className="card bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <span className="text-2xl">4️⃣</span> Track and Adjust
              </h3>
              <p>During the month, track actual spending. If you overspend in one category, adjust another to maintain zero balance.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Real Example: KES 80,000 Monthly Income</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-[var(--border-subtle)] rounded-lg overflow-hidden text-sm">
              <thead className="bg-[var(--surface)]">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Category</th>
                  <th className="px-4 py-3 text-right font-semibold">Amount (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr><td className="px-4 py-3 font-medium" colSpan={2}>💰 INCOME</td></tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3 pl-8">Monthly Salary</td>
                  <td className="px-4 py-3 text-right font-semibold text-green-600">80,000</td>
                </tr>
                
                <tr><td className="px-4 py-3 font-medium pt-6" colSpan={2}>🏠 HOUSING</td></tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3 pl-8">Rent</td>
                  <td className="px-4 py-3 text-right">25,000</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3 pl-8">Utilities (Electricity, Water)</td>
                  <td className="px-4 py-3 text-right">3,000</td>
                </tr>
                
                <tr><td className="px-4 py-3 font-medium pt-6" colSpan={2}>🚗 TRANSPORTATION</td></tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3 pl-8">Matatu/Fuel</td>
                  <td className="px-4 py-3 text-right">8,000</td>
                </tr>
                
                <tr><td className="px-4 py-3 font-medium pt-6" colSpan={2}>🍽️ FOOD</td></tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3 pl-8">Groceries</td>
                  <td className="px-4 py-3 text-right">12,000</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3 pl-8">Eating Out</td>
                  <td className="px-4 py-3 text-right">4,000</td>
                </tr>
                
                <tr><td className="px-4 py-3 font-medium pt-6" colSpan={2}>💳 DEBT</td></tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3 pl-8">Loan Payment</td>
                  <td className="px-4 py-3 text-right">10,000</td>
                </tr>
                
                <tr><td className="px-4 py-3 font-medium pt-6" colSpan={2}>💰 SAVINGS & INVESTING</td></tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3 pl-8">Emergency Fund</td>
                  <td className="px-4 py-3 text-right">5,000</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3 pl-8">Investment/Sacco</td>
                  <td className="px-4 py-3 text-right">5,000</td>
                </tr>
                
                <tr><td className="px-4 py-3 font-medium pt-6" colSpan={2}>📱 SUBSCRIPTIONS</td></tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3 pl-8">Phone/Internet</td>
                  <td className="px-4 py-3 text-right">2,000</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3 pl-8">Netflix/Spotify</td>
                  <td className="px-4 py-3 text-right">1,000</td>
                </tr>
                
                <tr><td className="px-4 py-3 font-medium pt-6" colSpan={2}>🎉 LIFESTYLE</td></tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3 pl-8">Entertainment</td>
                  <td className="px-4 py-3 text-right">3,000</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3 pl-8">Personal Care</td>
                  <td className="px-4 py-3 text-right">2,000</td>
                </tr>
                
                <tr className="bg-[var(--surface)] font-bold">
                  <td className="px-4 py-4">TOTAL ALLOCATED</td>
                  <td className="px-4 py-4 text-right text-red-600">80,000</td>
                </tr>
                <tr className="bg-green-50 dark:bg-green-900/20 font-bold">
                  <td className="px-4 py-4">REMAINING (Should be 0!)</td>
                  <td className="px-4 py-4 text-right text-green-600">0</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Key Benefits of Zero-Based Budgeting</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card bg-green-50 dark:bg-green-900/10">
              <h3 className="font-bold mb-2">✅ Complete Control</h3>
              <p className="text-sm">You know exactly where every shilling goes, eliminating mystery spending.</p>
            </div>
            <div className="card bg-blue-50 dark:bg-blue-900/10">
              <h3 className="font-bold mb-2">✅ Intentional Spending</h3>
              <p className="text-sm">Every expense is a conscious decision, not an afterthought.</p>
            </div>
            <div className="card bg-purple-50 dark:bg-purple-900/10">
              <h3 className="font-bold mb-2">✅ Prevents Overspending</h3>
              <p className="text-sm">When you assign money beforehand, impulse purchases decrease dramatically.</p>
            </div>
            <div className="card bg-amber-50 dark:bg-amber-900/10">
              <h3 className="font-bold mb-2">✅ Prioritizes Goals</h3>
              <p className="text-sm">Savings and debt repayment become non-negotiable line items.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Common Challenges & Solutions</h2>
          
          <div className="space-y-4">
            <div className="card border-l-4 border-orange-500">
              <h3 className="font-bold text-orange-600 dark:text-orange-400 mb-2">Challenge: Irregular Income</h3>
              <p className="text-sm mb-2">Solution: Budget based on your lowest expected monthly income. Any extra goes to savings or debt.</p>
            </div>

            <div className="card border-l-4 border-red-500">
              <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">Challenge: Unexpected Expenses</h3>
              <p className="text-sm mb-2">Solution: Include a "miscellaneous" category (5-10% of income) for surprises.</p>
            </div>

            <div className="card border-l-4 border-blue-500">
              <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-2">Challenge: Takes Too Much Time</h3>
              <p className="text-sm mb-2">Solution: Use budgeting apps or tools. First month is hardest; it gets easier!</p>
            </div>

            <div className="card border-l-4 border-purple-500">
              <h3 className="font-bold text-purple-600 dark:text-purple-400 mb-2">Challenge: Partner Not On Board</h3>
              <p className="text-sm mb-2">Solution: Start with your personal spending, then invite them to a budget meeting to set shared goals.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Getting Started with Zero-Based Budgeting</h2>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
            <h3 className="font-bold text-lg mb-4">Your First Zero-Based Budget in 7 Steps:</h3>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">1.</span>
                <span>List all income sources for the month</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">2.</span>
                <span>List all fixed expenses (rent, loans, insurance)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">3.</span>
                <span>Estimate variable expenses (food, transport, utilities)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">4.</span>
                <span>Assign money to savings and debt payoff</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">5.</span>
                <span>Allocate remaining funds to discretionary categories</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">6.</span>
                <span>Adjust amounts until Income - Expenses = 0</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">7.</span>
                <span>Track spending throughout the month and adjust as needed</span>
              </li>
            </ol>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-6 my-8 border-2 border-green-200 dark:border-green-800">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span>🎯</span> The Bottom Line
            </h3>
            <p>
              Zero-based budgeting transforms your relationship with money by making every shilling intentional. It's not about restriction—it's about empowerment. When you tell your money where to go instead of wondering where it went, you take control of your financial future. Start simple, be patient with yourself, and watch your financial confidence soar.
            </p>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-6 mt-8">
            <h3 className="font-bold mb-3">Related Articles:</h3>
            <div className="space-y-2">
              <Link to="/blog/budgeting-50-30-20-rule" className="text-blue-600 hover:text-blue-700 block">
                → The 50/30/20 Budgeting Rule Explained
              </Link>
              <Link to="/blog/monthly-budget-review" className="text-blue-600 hover:text-blue-700 block">
                → Why Monthly Budget Reviews Are Critical
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
