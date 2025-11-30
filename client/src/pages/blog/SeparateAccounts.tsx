import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

export default function SeparateAccounts() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
        <HiArrowLeft /> Back to Articles
      </Link>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-3xl">
            🏦
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Accounts</div>
            <h1 className="text-3xl font-bold mt-1">Why You Need Multiple Bank Accounts (And How to Use Them)</h1>
          </div>
        </div>
        
        <div className="text-sm text-[var(--text-muted)] mb-6">6 min read</div>

        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-lg leading-relaxed">
            Using a single bank account for everything is like putting all your money in one pocket and hoping you remember what's for rent, what's for groceries, and what's for savings. Multiple bank accounts create psychological boundaries that make budgeting automatic and prevent you from accidentally spending money earmarked for bills. Let's explore the power of financial compartmentalization and how to set up an account structure that makes managing money effortless.
          </p>

          <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-6 border-l-4 border-red-500">
            <h3 className="font-bold text-lg mb-2 text-red-600 dark:text-red-400">The Single Account Problem</h3>
            <p className="text-sm">
              You check your balance: "KES 50,000? Great, I can buy that laptop!" But wait—rent is due in 3 days (KES 30K), you promised to save KES 10K this month, and you owe your friend KES 5K. Suddenly, you can't afford the laptop at all. Multiple accounts prevent this confusion by giving every shilling a clear home.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">The 5-Account System</h2>

          <div className="space-y-4">
            <div className="card bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-2 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">💰</span>
                <h3 className="font-bold text-lg">1. Income Account (Main Checking)</h3>
              </div>
              <p className="text-sm mb-3"><strong>Purpose:</strong> Receive salary and distribute to other accounts</p>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-4">
                <p className="text-sm mb-2"><strong>How it works:</strong></p>
                <ul className="text-sm list-disc list-inside space-y-1">
                  <li>All income lands here first (salary, side hustles, gifts)</li>
                  <li>Immediately transfer to designated accounts on payday</li>
                  <li>Keep minimal balance after distributions</li>
                  <li>Link to M-Pesa for easy transfers</li>
                </ul>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-3">
                <strong>Recommended:</strong> Any bank with free mobile banking (KCB, Equity, Co-op, NCBA)
              </p>
            </div>

            <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🏠</span>
                <h3 className="font-bold text-lg">2. Bills Account</h3>
              </div>
              <p className="text-sm mb-3"><strong>Purpose:</strong> Pay recurring monthly expenses</p>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-4">
                <p className="text-sm mb-2"><strong>What goes here:</strong></p>
                <ul className="text-sm list-disc list-inside space-y-1">
                  <li>Rent/mortgage</li>
                  <li>Utilities (water, electricity, internet)</li>
                  <li>Subscriptions (Netflix, Spotify, etc.)</li>
                  <li>Insurance premiums</li>
                  <li>Loan payments</li>
                </ul>
              </div>
              <p className="text-sm mt-3"><strong>Strategy:</strong> Calculate total monthly bills, transfer that amount on payday. Never touch this account for discretionary spending.</p>
            </div>

            <div className="card bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🛒</span>
                <h3 className="font-bold text-lg">3. Spending Account (Daily Expenses)</h3>
              </div>
              <p className="text-sm mb-3"><strong>Purpose:</strong> Guilt-free daily spending</p>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-4">
                <p className="text-sm mb-2"><strong>What goes here:</strong></p>
                <ul className="text-sm list-disc list-inside space-y-1">
                  <li>Groceries</li>
                  <li>Restaurants and entertainment</li>
                  <li>Transportation (matatu, fuel, Uber)</li>
                  <li>Personal care</li>
                  <li>Shopping and miscellaneous</li>
                </ul>
              </div>
              <p className="text-sm mt-3"><strong>Strategy:</strong> Allocate your discretionary budget here. When it runs out, you're done spending for the month. Link debit card to this account only.</p>
            </div>

            <div className="card bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-2 border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🚨</span>
                <h3 className="font-bold text-lg">4. Emergency Fund Account</h3>
              </div>
              <p className="text-sm mb-3"><strong>Purpose:</strong> Financial safety net for true emergencies</p>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-4">
                <p className="text-sm mb-2"><strong>Target:</strong> 3-6 months of living expenses (KES 100K-300K minimum)</p>
                <p className="text-sm mb-2"><strong>What qualifies as emergency:</strong></p>
                <ul className="text-sm list-disc list-inside space-y-1">
                  <li>Job loss</li>
                  <li>Medical emergency</li>
                  <li>Major car/home repair</li>
                  <li>Unexpected family crisis</li>
                </ul>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-3">
                <strong>Recommended:</strong> High-interest savings or money market fund (CIC, Zimele, Sanlam)
              </p>
            </div>

            <div className="card bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/10 dark:to-cyan-900/10 border-2 border-teal-200 dark:border-teal-800">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🎯</span>
                <h3 className="font-bold text-lg">5. Goals/Savings Account</h3>
              </div>
              <p className="text-sm mb-3"><strong>Purpose:</strong> Build wealth and save for specific goals</p>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-4">
                <p className="text-sm mb-2"><strong>What goes here:</strong></p>
                <ul className="text-sm list-disc list-inside space-y-1">
                  <li>House down payment</li>
                  <li>Car purchase fund</li>
                  <li>Vacation savings</li>
                  <li>Business startup capital</li>
                  <li>Investment contributions</li>
                </ul>
              </div>
              <p className="text-sm mt-3"><strong>Strategy:</strong> Auto-transfer a fixed percentage (10-30%) every payday. Treat savings like a bill you must pay.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Sample Money Flow (KES 100,000 Salary)</h2>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-blue-300 dark:border-blue-700">
                    <th className="px-4 py-3 text-left">Account</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-right">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  <tr className="hover:bg-white/50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3">💰 Income Account</td>
                    <td className="px-4 py-3 text-right">KES 100,000</td>
                    <td className="px-4 py-3 text-right text-[var(--text-muted)]">← Salary lands</td>
                  </tr>
                  <tr className="hover:bg-white/50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3">🏠 Bills Account</td>
                    <td className="px-4 py-3 text-right font-semibold">KES 50,000</td>
                    <td className="px-4 py-3 text-right">50%</td>
                  </tr>
                  <tr className="hover:bg-white/50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3">🛒 Spending Account</td>
                    <td className="px-4 py-3 text-right font-semibold">KES 20,000</td>
                    <td className="px-4 py-3 text-right">20%</td>
                  </tr>
                  <tr className="hover:bg-white/50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3">🚨 Emergency Fund</td>
                    <td className="px-4 py-3 text-right font-semibold">KES 10,000</td>
                    <td className="px-4 py-3 text-right">10%</td>
                  </tr>
                  <tr className="hover:bg-white/50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3">🎯 Goals/Savings</td>
                    <td className="px-4 py-3 text-right font-semibold">KES 20,000</td>
                    <td className="px-4 py-3 text-right">20%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-4">
              Adjust percentages based on your situation. The key is consistency and automation.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Choosing the Right Banks</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card bg-green-50 dark:bg-green-900/10">
              <h3 className="font-bold mb-3">✅ What to Look For:</h3>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li><strong>Low/No Fees:</strong> Monthly maintenance fees kill savings</li>
                <li><strong>Mobile Banking:</strong> Easy transfers between accounts</li>
                <li><strong>High Interest:</strong> Emergency and savings accounts should earn</li>
                <li><strong>ATM Access:</strong> Convenient withdrawals when needed</li>
                <li><strong>M-Pesa Integration:</strong> Seamless money movement</li>
              </ul>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10">
              <h3 className="font-bold mb-3 text-red-600 dark:text-red-400">❌ Red Flags to Avoid:</h3>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li><strong>High Minimum Balance:</strong> Ties up your cash unnecessarily</li>
                <li><strong>Withdrawal Limits:</strong> Can't access your own money easily</li>
                <li><strong>Hidden Charges:</strong> Surprise fees for transfers, statements, etc.</li>
                <li><strong>Poor Customer Service:</strong> Wastes your time with issues</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Best Bank Combinations in Kenya</h2>

          <div className="space-y-4">
            <div className="card border-l-4 border-blue-500">
              <h3 className="font-bold mb-2">Budget Option (2-3 Accounts)</h3>
              <ul className="text-sm space-y-1">
                <li>• <strong>Main + Spending:</strong> Equity Bank (free transfers, good mobile app)</li>
                <li>• <strong>Emergency + Savings:</strong> CIC Money Market Fund (8-10% returns)</li>
              </ul>
            </div>

            <div className="card border-l-4 border-green-500">
              <h3 className="font-bold mb-2">Recommended Setup (4-5 Accounts)</h3>
              <ul className="text-sm space-y-1">
                <li>• <strong>Income + Bills:</strong> KCB or Co-op Bank</li>
                <li>• <strong>Spending:</strong> Separate checking at same bank</li>
                <li>• <strong>Emergency:</strong> Money market fund (Zimele, Sanlam)</li>
                <li>• <strong>Goals:</strong> SACCO shares (12-15% dividends) or investment account</li>
              </ul>
            </div>

            <div className="card border-l-4 border-purple-500">
              <h3 className="font-bold mb-2">Advanced Setup (6+ Accounts)</h3>
              <ul className="text-sm space-y-1">
                <li>• Add dedicated accounts for: Business, Tax Savings, Kids' Education</li>
                <li>• Use multiple banks to spread risk</li>
                <li>• Diversify across banks, SACCOs, and investment platforms</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Automation: Make It Effortless</h2>

          <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-6 border-l-4 border-amber-500">
            <h3 className="font-bold text-lg mb-3">Set Up Standing Orders on Payday:</h3>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li><strong>Day 1 (Salary Day):</strong> Bills account transfer (auto)</li>
              <li><strong>Day 1:</strong> Emergency fund transfer (auto)</li>
              <li><strong>Day 1:</strong> Goals/savings transfer (auto)</li>
              <li><strong>Day 2:</strong> Whatever remains goes to spending account</li>
            </ol>
            <p className="text-sm mt-4 text-[var(--text-muted)] italic">
              "Automate your savings before you see the money. You can't spend what you don't see."
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Common Mistakes to Avoid</h2>

          <div className="space-y-3">
            <div className="card bg-red-50 dark:bg-red-900/10">
              <strong className="text-red-600 dark:text-red-400">❌ Too Many Accounts</strong>
              <p className="text-sm mt-1">10+ accounts become unmanageable. Start with 3-5 and add only if necessary.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10">
              <strong className="text-red-600 dark:text-red-400">❌ Raiding the Emergency Fund</strong>
              <p className="text-sm mt-1">"Emergency" doesn't mean new phone or vacation. Be strict about the definition.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10">
              <strong className="text-red-600 dark:text-red-400">❌ Not Tracking Balances</strong>
              <p className="text-sm mt-1">Check all accounts monthly. Multiple accounts don't replace budgeting awareness.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10">
              <strong className="text-red-600 dark:text-red-400">❌ Using Savings for Bills</strong>
              <p className="text-sm mt-1">If you constantly transfer from savings to bills, you're under-funding your bills account.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-6 my-8 border-2 border-green-200 dark:border-green-800">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span>🎯</span> The Bottom Line
            </h3>
            <p>
              Multiple bank accounts aren't complicated—they're clarity. Each account has one job, making it impossible to accidentally spend rent money on entertainment or raid savings for impulse purchases. Set up your structure once, automate the transfers, and your budgeting becomes effortless. You'll know exactly what money is for what purpose at a glance, reducing financial stress and building wealth through systematic saving. Start with 3 accounts minimum: bills, spending, and savings. Your future self will thank you.
            </p>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-6 mt-8">
            <h3 className="font-bold mb-3">Related Articles:</h3>
            <div className="space-y-2">
              <Link to="/blog/track-opening-balance" className="text-blue-600 hover:text-blue-700 block">
                → The Importance of Tracking Opening Balances
              </Link>
              <Link to="/blog/monitor-accounts-regularly" className="text-blue-600 hover:text-blue-700 block">
                → Why You Should Monitor Bank Accounts Regularly
              </Link>
              <Link to="/blog/budgeting-50-30-20-rule" className="text-blue-600 hover:text-blue-700 block">
                → The 50/30/20 Budgeting Rule Explained
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
