import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

export default function MonitorAccountsRegularly() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
        <HiArrowLeft /> Back to Articles
      </Link>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-3xl">
            👁️
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Accounts</div>
            <h1 className="text-3xl font-bold mt-1">Why You Should Monitor Bank Accounts Regularly</h1>
          </div>
        </div>
        
        <div className="text-sm text-[var(--text-muted)] mb-6">5 min read</div>

        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-lg leading-relaxed">
            "Set it and forget it" might work for slow cookers, but it's financial suicide for bank accounts. Regular monitoring isn't paranoia—it's due diligence that saves you money, protects against fraud, and keeps you financially aware. Ignoring your accounts for weeks or months is like driving with your eyes closed and hoping nothing goes wrong. Let's explore why frequent account checks are non-negotiable and how to make monitoring effortless.
          </p>

          <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-6 border-l-4 border-red-500">
            <h3 className="font-bold text-lg mb-2 text-red-600 dark:text-red-400">The Cost of Neglect</h3>
            <p className="text-sm">
              Real story: A Nairobi professional discovered unauthorized M-Pesa withdrawals totaling KES 45,000—but only after 3 months when applying for a loan. The fraud window had closed, charges were irreversible, and the bank couldn't help because he never reported it promptly. Regular monitoring could have caught it within days and saved the full amount.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">What Regular Monitoring Prevents</h2>

          <div className="space-y-4">
            <div className="card bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border-2 border-red-200 dark:border-red-800">
              <h3 className="font-bold text-lg mb-3">🚨 Fraud & Identity Theft</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span>•</span>
                  <p><strong>Unauthorized Transactions:</strong> Stolen card details, SIM swaps, phishing scams</p>
                </div>
                <div className="flex items-start gap-2">
                  <span>•</span>
                  <p><strong>Account Takeovers:</strong> Changed passwords or contact info without your knowledge</p>
                </div>
                <div className="flex items-start gap-2">
                  <span>•</span>
                  <p><strong>Merchant Errors:</strong> Double charges, incorrect amounts, failed refunds</p>
                </div>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-3 italic">
                Most banks give 30-60 days to dispute fraud. Miss that window, you eat the loss.
              </p>
            </div>

            <div className="card bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 border-2 border-amber-200 dark:border-amber-800">
              <h3 className="font-bold text-lg mb-3">💸 Hidden Fees & Charges</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span>•</span>
                  <p><strong>Bank Fees:</strong> Monthly maintenance, overdraft, ATM fees silently draining balance</p>
                </div>
                <div className="flex items-start gap-2">
                  <span>•</span>
                  <p><strong>Subscription Creep:</strong> Forgotten trials converting to paid, services you no longer use</p>
                </div>
                <div className="flex items-start gap-2">
                  <span>•</span>
                  <p><strong>Interest Charges:</strong> Late loan payments, credit card interest compounding</p>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-2 border-blue-200 dark:border-blue-800">
              <h3 className="font-bold text-lg mb-3">⚠️ Overdrafts & Bounced Payments</h3>
              <p className="text-sm">
                Monitoring prevents embarrassment and fees from insufficient funds. You'll know your real balance before writing checks or setting up auto-payments that might bounce.
              </p>
            </div>

            <div className="card bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-2 border-green-200 dark:border-green-800">
              <h3 className="font-bold text-lg mb-3">📊 Budget Awareness</h3>
              <p className="text-sm">
                Regular checks keep spending patterns visible. You'll notice "Oh, I've spent KES 8K on eating out this week" before it becomes KES 20K by month-end.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">How Often Should You Check?</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="card bg-green-50 dark:bg-green-900/10 border-2 border-green-500 text-center">
              <h3 className="font-bold text-lg mb-2">✅ Daily</h3>
              <p className="text-sm mb-3"><strong>Best for:</strong></p>
              <ul className="text-sm space-y-1 text-left">
                <li>• Active spenders</li>
                <li>• Business owners</li>
                <li>• Recent fraud victims</li>
                <li>• Tight budgets</li>
              </ul>
              <p className="text-xs text-[var(--text-muted)] mt-3">2 min morning routine</p>
            </div>

            <div className="card bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-500 text-center">
              <h3 className="font-bold text-lg mb-2">✅ Weekly</h3>
              <p className="text-sm mb-3"><strong>Best for:</strong></p>
              <ul className="text-sm space-y-1 text-left">
                <li>• Most people</li>
                <li>• Stable income/expenses</li>
                <li>• Multiple accounts</li>
              </ul>
              <p className="text-xs text-[var(--text-muted)] mt-3">Sunday evening review</p>
            </div>

            <div className="card bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-500 text-center">
              <h3 className="font-bold text-lg mb-2">⚠️ Monthly (Minimum)</h3>
              <p className="text-sm mb-3"><strong>Acceptable for:</strong></p>
              <ul className="text-sm space-y-1 text-left">
                <li>• Low transaction volume</li>
                <li>• Savings-only accounts</li>
              </ul>
              <p className="text-xs text-red-600 dark:text-red-400 mt-3">Too infrequent for active accounts</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">The 5-Minute Daily Check Routine</h2>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-lg p-6 border-2 border-purple-200 dark:border-purple-800">
            <h3 className="font-bold text-lg mb-4">Morning Coffee Monitoring:</h3>
            <ol className="space-y-3 text-sm list-decimal list-inside">
              <li>
                <strong>Open mobile banking app</strong>
                <p className="ml-6 text-xs text-[var(--text-muted)]">KCB, Equity, Co-op, M-Pesa—whichever you use most</p>
              </li>
              <li>
                <strong>Check balances across all accounts</strong>
                <p className="ml-6 text-xs text-[var(--text-muted)]">Quick glance: Do numbers look right?</p>
              </li>
              <li>
                <strong>Review yesterday's transactions</strong>
                <p className="ml-6 text-xs text-[var(--text-muted)]">Recognize every charge? Any surprises?</p>
              </li>
              <li>
                <strong>Flag anything suspicious immediately</strong>
                <p className="ml-6 text-xs text-[var(--text-muted)]">Screenshot + call bank if fraud suspected</p>
              </li>
              <li>
                <strong>Update budget tracker if needed</strong>
                <p className="ml-6 text-xs text-[var(--text-muted)]">Log any missed transactions from yesterday</p>
              </li>
            </ol>
            <p className="text-xs text-[var(--text-muted)] mt-4 italic text-center">
              Total time: 3-5 minutes. Protection: Priceless.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Red Flags to Watch For</h2>

          <div className="space-y-3">
            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">🚩 Unrecognized Transactions</h3>
              <p className="text-sm">Even small amounts (KES 100-500) can be fraudsters testing if you're paying attention before hitting big.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">🚩 Duplicate Charges</h3>
              <p className="text-sm">Same merchant, same amount, minutes apart? Merchant error or system glitch—dispute within 7 days.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">🚩 Incorrect Amounts</h3>
              <p className="text-sm">Paid KES 2,000 but charged KES 20,000? Typos happen—catch them before merchant closes their books.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">🚩 Missing Deposits</h3>
              <p className="text-sm">Expected salary or refund didn't hit? Don't wait—contact sender/employer immediately.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">🚩 Unexpected Fees</h3>
              <p className="text-sm">KES 500 "maintenance fee" you've never seen before? Banks sneak in charges—question everything.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">🚩 Foreign Transactions</h3>
              <p className="text-sm">Charges from countries you've never visited = stolen card details. Report instantly.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Tools to Make Monitoring Effortless</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card bg-blue-50 dark:bg-blue-900/10">
              <h3 className="font-bold mb-3">📱 Mobile Banking Apps</h3>
              <p className="text-sm mb-2"><strong>Benefits:</strong></p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Real-time balance updates</li>
                <li>Transaction notifications</li>
                <li>Quick dispute reporting</li>
                <li>Fingerprint login (30 seconds)</li>
              </ul>
            </div>

            <div className="card bg-green-50 dark:bg-green-900/10">
              <h3 className="font-bold mb-3">🔔 SMS/Email Alerts</h3>
              <p className="text-sm mb-2"><strong>Set alerts for:</strong></p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Every transaction (any amount)</li>
                <li>Low balance warnings</li>
                <li>Large withdrawals ({'>'}KES 10K)</li>
                <li>Failed payment attempts</li>
              </ul>
            </div>

            <div className="card bg-purple-50 dark:bg-purple-900/10">
              <h3 className="font-bold mb-3">📊 Finance Apps/Spreadsheets</h3>
              <p className="text-sm mb-2"><strong>Use for:</strong></p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Aggregate multiple accounts</li>
                <li>Spending pattern analysis</li>
                <li>Budget vs actual comparison</li>
                <li>Historical trend tracking</li>
              </ul>
            </div>

            <div className="card bg-amber-50 dark:bg-amber-900/10">
              <h3 className="font-bold mb-3">📅 Calendar Reminders</h3>
              <p className="text-sm mb-2"><strong>Schedule weekly:</strong></p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Sunday 6 PM: Account review</li>
                <li>Recurring event, never skip</li>
                <li>5-10 min to check all accounts</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">What to Do When You Find a Problem</h2>

          <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-6 border-l-4 border-amber-500">
            <h3 className="font-bold text-lg mb-4">Immediate Action Steps:</h3>
            <div className="space-y-4 text-sm">
              <div>
                <strong className="block mb-1">1. Document Everything</strong>
                <p>Screenshot the transaction, note date/time/amount, save confirmation numbers.</p>
              </div>
              <div>
                <strong className="block mb-1">2. Contact Bank Immediately</strong>
                <p>Call customer service (not branch visit—phone is faster). Reference your documentation.</p>
              </div>
              <div>
                <strong className="block mb-1">3. File Official Dispute</strong>
                <p>Request dispute reference number. Follow up in writing via email for paper trail.</p>
              </div>
              <div>
                <strong className="block mb-1">4. Lock Card if Fraud Suspected</strong>
                <p>Most banking apps let you freeze/unfreeze cards instantly. Do it while investigating.</p>
              </div>
              <div>
                <strong className="block mb-1">5. Change Passwords & PINs</strong>
                <p>If account compromise suspected, change credentials across all accounts immediately.</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Monitoring Multiple Accounts</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-[var(--border-subtle)] rounded-lg text-sm">
              <thead className="bg-[var(--surface)]">
                <tr>
                  <th className="px-4 py-3 text-left">Account Type</th>
                  <th className="px-4 py-3 text-left">Check Frequency</th>
                  <th className="px-4 py-3 text-left">What to Monitor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Checking (Main)</td>
                  <td className="px-4 py-3">Daily</td>
                  <td className="px-4 py-3">All transactions, balance</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Savings</td>
                  <td className="px-4 py-3">Weekly</td>
                  <td className="px-4 py-3">Unauthorized withdrawals, interest credits</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Credit Card</td>
                  <td className="px-4 py-3">Daily</td>
                  <td className="px-4 py-3">Every charge, approaching limit</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">M-Pesa</td>
                  <td className="px-4 py-3">Daily</td>
                  <td className="px-4 py-3">All activity, SIM swap attempts</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Investment/Retirement</td>
                  <td className="px-4 py-3">Monthly</td>
                  <td className="px-4 py-3">Contributions, growth, fees</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Common Excuses (And Why They're Wrong)</h2>

          <div className="space-y-3">
            <div className="card">
              <p className="text-sm"><strong>❌ "I trust my bank"</strong></p>
              <p className="text-sm text-[var(--text-muted)] mt-1">Banks make mistakes. Systems glitch. Trusting doesn't mean not verifying.</p>
            </div>

            <div className="card">
              <p className="text-sm"><strong>❌ "I don't have time"</strong></p>
              <p className="text-sm text-[var(--text-muted)] mt-1">5 minutes daily vs hours fixing fraud/errors later. Time investment is minimal.</p>
            </div>

            <div className="card">
              <p className="text-sm"><strong>❌ "I'll notice if something major happens"</strong></p>
              <p className="text-sm text-[var(--text-muted)] mt-1">Fraudsters start small (KES 200) to test. By time you notice "major," it's too late.</p>
            </div>

            <div className="card">
              <p className="text-sm"><strong>❌ "My bank sends alerts"</strong></p>
              <p className="text-sm text-[var(--text-muted)] mt-1">Alerts miss things (fees, interest, merchant errors). Manual review is non-negotiable.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-6 my-8 border-2 border-green-200 dark:border-green-800">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span>🎯</span> The Bottom Line
            </h3>
            <p>
              Regular account monitoring isn't optional—it's financial self-defense. Five minutes daily prevents fraud losses, catches bank errors, stops subscription leaks, and keeps you aware of spending patterns. Set up mobile banking, enable transaction alerts, and check every morning with your coffee. The cost of not monitoring is far higher than the minimal time investment. Your money, your responsibility, your eyes on it—always.
            </p>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-6 mt-8">
            <h3 className="font-bold mb-3">Related Articles:</h3>
            <div className="space-y-2">
              <Link to="/blog/separate-accounts" className="text-blue-600 hover:text-blue-700 block">
                → Why You Need Multiple Bank Accounts
              </Link>
              <Link to="/blog/track-opening-balance" className="text-blue-600 hover:text-blue-700 block">
                → The Importance of Tracking Opening Balances
              </Link>
              <Link to="/blog/mobile-money-security" className="text-blue-600 hover:text-blue-700 block">
                → Keeping Your M-Pesa & Mobile Money Secure
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
