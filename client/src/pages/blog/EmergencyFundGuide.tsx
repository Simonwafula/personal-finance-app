import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

export default function EmergencyFundGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
        <HiArrowLeft /> Back to Articles
      </Link>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-3xl">
            🛡️
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Budgeting</div>
            <h1 className="text-3xl font-bold mt-1">Building Your Emergency Fund: A Complete Guide</h1>
          </div>
        </div>
        
        <div className="text-sm text-[var(--text-muted)] mb-6">7 min read</div>

        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-lg leading-relaxed">
            An emergency fund is financial insurance you build yourself. It's money set aside specifically for unexpected expenses or income disruptions—protecting you from debt when life throws curveballs. Think of it as your financial safety net that lets you sleep peacefully at night.
          </p>

          <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-6 border-l-4 border-red-500">
            <h3 className="font-bold text-lg mb-2 text-red-600 dark:text-red-400">Without an Emergency Fund:</h3>
            <p className="text-[var(--text-muted)]">
              A car breakdown, medical emergency, or job loss can force you into high-interest debt, derail your budget, and set you back months or years financially.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-6 border-l-4 border-green-500">
            <h3 className="font-bold text-lg mb-2 text-green-600 dark:text-green-400">With an Emergency Fund:</h3>
            <p className="text-[var(--text-muted)]">
              The same emergency becomes an inconvenience, not a crisis. You handle it calmly with cash and continue pursuing your financial goals.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">How Much Should You Save?</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="card bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-200 dark:border-amber-800">
              <h3 className="font-bold text-lg mb-2">Phase 1: Starter Fund</h3>
              <div className="text-3xl font-bold text-amber-600 my-3">KES 50,000</div>
              <p className="text-sm">Covers basic emergencies like minor car repairs, medical visits, or appliance breakdowns.</p>
              <div className="mt-3 text-xs text-[var(--text-muted)]">Goal: Build this FIRST</div>
            </div>

            <div className="card bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-200 dark:border-blue-800">
              <h3 className="font-bold text-lg mb-2">Phase 2: Basic Security</h3>
              <div className="text-3xl font-bold text-blue-600 my-3">3 Months</div>
              <p className="text-sm">Three months of essential expenses. Protects against job loss or extended illness.</p>
              <div className="mt-3 text-xs text-[var(--text-muted)]">Recommended minimum</div>
            </div>

            <div className="card bg-green-50 dark:bg-green-900/10 border-2 border-green-200 dark:border-green-800">
              <h3 className="font-bold text-lg mb-2">Phase 3: Full Protection</h3>
              <div className="text-3xl font-bold text-green-600 my-3">6 Months</div>
              <p className="text-sm">Six months of expenses provides strong financial security and peace of mind.</p>
              <div className="mt-3 text-xs text-[var(--text-muted)]">Ideal target</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Calculating Your Target</h2>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg p-6">
            <h3 className="font-bold mb-4">Example: Calculating 6-Month Emergency Fund</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                <span>Rent</span>
                <span className="font-semibold">KES 25,000/month</span>
              </div>
              <div className="flex justify-between p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                <span>Groceries</span>
                <span className="font-semibold">KES 12,000/month</span>
              </div>
              <div className="flex justify-between p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                <span>Utilities</span>
                <span className="font-semibold">KES 3,000/month</span>
              </div>
              <div className="flex justify-between p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                <span>Transport</span>
                <span className="font-semibold">KES 8,000/month</span>
              </div>
              <div className="flex justify-between p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                <span>Insurance/Healthcare</span>
                <span className="font-semibold">KES 2,000/month</span>
              </div>
              <div className="border-t-2 border-blue-300 dark:border-blue-700 pt-2 mt-2">
                <div className="flex justify-between font-bold text-base">
                  <span>Monthly Essentials:</span>
                  <span>KES 50,000</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-green-600 mt-2">
                  <span>6-Month Emergency Fund:</span>
                  <span>KES 300,000</span>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Building Your Fund: Step-by-Step</h2>

          <div className="space-y-4">
            <div className="card border-l-4 border-blue-500">
              <div className="flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <h3 className="font-bold mb-2">Set a Realistic Monthly Target</h3>
                  <p className="text-sm">Start with 5-10% of your income. Even KES 2,000/month builds to KES 24,000 in a year!</p>
                </div>
              </div>
            </div>

            <div className="card border-l-4 border-green-500">
              <div className="flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <h3 className="font-bold mb-2">Open a Separate Account</h3>
                  <p className="text-sm">Don't mix emergency savings with daily spending. Use a high-yield savings account or money market fund.</p>
                </div>
              </div>
            </div>

            <div className="card border-l-4 border-purple-500">
              <div className="flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <h3 className="font-bold mb-2">Automate Contributions</h3>
                  <p className="text-sm">Set up automatic transfers on payday. "Pay yourself first" before other expenses.</p>
                </div>
              </div>
            </div>

            <div className="card border-l-4 border-amber-500">
              <div className="flex items-start gap-3">
                <span className="text-2xl">4️⃣</span>
                <div>
                  <h3 className="font-bold mb-2">Add Windfalls</h3>
                  <p className="text-sm">Put bonuses, tax refunds, gifts, or side hustle earnings directly into your emergency fund.</p>
                </div>
              </div>
            </div>

            <div className="card border-l-4 border-red-500">
              <div className="flex items-start gap-3">
                <span className="text-2xl">5️⃣</span>
                <div>
                  <h3 className="font-bold mb-2">Don't Touch It!</h3>
                  <p className="text-sm">Reserve for TRUE emergencies only. A sale at your favorite store is NOT an emergency.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Where to Keep Your Emergency Fund</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card bg-green-50 dark:bg-green-900/10">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span>✅</span> GOOD Options
              </h3>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li><strong>High-Yield Savings Account:</strong> Easy access, earns interest</li>
                <li><strong>Money Market Fund:</strong> Higher returns, still liquid</li>
                <li><strong>Separate Bank Account:</strong> Out of sight, out of mind</li>
              </ul>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span>❌</span> BAD Options
              </h3>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li><strong>Stocks/Crypto:</strong> Too volatile, might be down when needed</li>
                <li><strong>Locked Fixed Deposits:</strong> Can't access quickly</li>
                <li><strong>Under Your Mattress:</strong> Loses value to inflation, theft risk</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">What Qualifies as an Emergency?</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-bold text-green-600 dark:text-green-400">✅ Real Emergencies:</h3>
              <div className="card bg-green-50 dark:bg-green-900/10 text-sm">
                <ul className="space-y-1 list-disc list-inside">
                  <li>Job loss or reduced income</li>
                  <li>Medical emergencies</li>
                  <li>Essential car/home repairs</li>
                  <li>Unexpected travel for family crisis</li>
                  <li>Critical appliance replacement</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-red-600 dark:text-red-400">❌ NOT Emergencies:</h3>
              <div className="card bg-red-50 dark:bg-red-900/10 text-sm">
                <ul className="space-y-1 list-disc list-inside">
                  <li>Shopping sales or discounts</li>
                  <li>Vacation opportunities</li>
                  <li>New phone because yours is "old"</li>
                  <li>Helping friends with their non-emergencies</li>
                  <li>Impulse purchases</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Quick-Start Building Plan</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-[var(--border-subtle)] rounded-lg text-sm">
              <thead className="bg-[var(--surface)]">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Month</th>
                  <th className="px-4 py-3 text-right font-semibold">Monthly Save</th>
                  <th className="px-4 py-3 text-right font-semibold">Total Saved</th>
                  <th className="px-4 py-3 text-left font-semibold">Milestone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Month 1-3</td>
                  <td className="px-4 py-3 text-right">5,000</td>
                  <td className="px-4 py-3 text-right font-semibold">15,000</td>
                  <td className="px-4 py-3 text-xs">Building momentum</td>
                </tr>
                <tr className="hover:bg-[var(--surface)] bg-amber-50 dark:bg-amber-900/10">
                  <td className="px-4 py-3">Month 4-10</td>
                  <td className="px-4 py-3 text-right">5,000</td>
                  <td className="px-4 py-3 text-right font-semibold">50,000</td>
                  <td className="px-4 py-3 text-xs">🎉 Starter fund complete!</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Month 11-20</td>
                  <td className="px-4 py-3 text-right">7,500</td>
                  <td className="px-4 py-3 text-right font-semibold">125,000</td>
                  <td className="px-4 py-3 text-xs">2.5 months covered</td>
                </tr>
                <tr className="hover:bg-[var(--surface)] bg-blue-50 dark:bg-blue-900/10">
                  <td className="px-4 py-3">Month 21-24</td>
                  <td className="px-4 py-3 text-right">7,500</td>
                  <td className="px-4 py-3 text-right font-semibold">155,000</td>
                  <td className="px-4 py-3 text-xs">🎉 3 months complete!</td>
                </tr>
                <tr className="hover:bg-[var(--surface)] bg-green-50 dark:bg-green-900/10">
                  <td className="px-4 py-3">Month 25-36</td>
                  <td className="px-4 py-3 text-right">10,000</td>
                  <td className="px-4 py-3 text-right font-semibold">275,000</td>
                  <td className="px-4 py-3 text-xs">🎉 Full 6-month fund!</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-6 my-8 border-2 border-green-200 dark:border-green-800">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span>🎯</span> The Bottom Line
            </h3>
            <p>
              An emergency fund is THE foundation of financial security. Start small, stay consistent, and build systematically. That first KES 50,000 will give you more peace of mind than any purchase ever could. Remember: it's not about how fast you build it—it's about actually building it. Start today with whatever you can afford, and protect your financial future.
            </p>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-6 mt-8">
            <h3 className="font-bold mb-3">Related Articles:</h3>
            <div className="space-y-2">
              <Link to="/blog/budgeting-50-30-20-rule" className="text-blue-600 hover:text-blue-700 block">
                → The 50/30/20 Budgeting Rule Explained
              </Link>
              <Link to="/blog/separate-accounts" className="text-blue-600 hover:text-blue-700 block">
                → The Power of Multiple Bank Accounts
              </Link>
              <Link to="/blog/monthly-budget-review" className="text-blue-600 hover:text-blue-700 block">
                → Why Monthly Budget Reviews Are Critical
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
