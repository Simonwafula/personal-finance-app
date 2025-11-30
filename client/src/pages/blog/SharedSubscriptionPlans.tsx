import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

export default function SharedSubscriptionPlans() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
        <HiArrowLeft /> Back to Articles
      </Link>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-3xl">
            👥
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Subscriptions</div>
            <h1 className="text-3xl font-bold mt-1">How to Split Subscription Costs with Family & Friends</h1>
          </div>
        </div>
        
        <div className="text-sm text-[var(--text-muted)] mb-6">6 min read</div>

        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-lg leading-relaxed">
            Netflix Family Plan: KES 1,700/month for 5 screens. Split 4 ways? KES 425 each. Spotify Family: KES 1,400 for 6 accounts = KES 233 per person instead of KES 900 solo. YouTube Premium Family: KES 1,550 for 5 members = KES 310 each vs KES 1,100 individual. Properly splitting subscriptions can save each person KES 30,000-50,000 annually. But money + relationships = potential drama. Here's how to share subscriptions smartly without destroying friendships or family harmony.
          </p>

          <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-6 border-l-4 border-green-500">
            <h3 className="font-bold text-lg mb-2 text-green-600 dark:text-green-400">The Math is Compelling</h3>
            <p className="text-sm">
              Average Kenyan paying for Netflix (KES 1,100), Spotify (KES 900), and Amazon Prime (KES 700) solo = KES 2,700/month = KES 32,400/year. Switch to family plans and split: Netflix (KES 425), Spotify (KES 233), Prime (KES 175) = KES 833/month = KES 9,996/year. <strong>Savings: KES 22,404 annually per person.</strong>
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Services That Allow Sharing (Legally)</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-[var(--border-subtle)] rounded-lg text-sm">
              <thead className="bg-[var(--surface)]">
                <tr>
                  <th className="px-4 py-3 text-left">Service</th>
                  <th className="px-4 py-3 text-left">Plan</th>
                  <th className="px-4 py-3 text-right">Total Cost</th>
                  <th className="px-4 py-3 text-center">Max Users</th>
                  <th className="px-4 py-3 text-right">Per Person</th>
                  <th className="px-4 py-3 text-right">Solo Cost</th>
                  <th className="px-4 py-3 text-right">Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Netflix</td>
                  <td className="px-4 py-3">Premium</td>
                  <td className="px-4 py-3 text-right">KES 1,700</td>
                  <td className="px-4 py-3 text-center">4</td>
                  <td className="px-4 py-3 text-right font-bold">KES 425</td>
                  <td className="px-4 py-3 text-right">KES 1,100</td>
                  <td className="px-4 py-3 text-right text-green-600">KES 675</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Spotify</td>
                  <td className="px-4 py-3">Family</td>
                  <td className="px-4 py-3 text-right">KES 1,400</td>
                  <td className="px-4 py-3 text-center">6</td>
                  <td className="px-4 py-3 text-right font-bold">KES 233</td>
                  <td className="px-4 py-3 text-right">KES 900</td>
                  <td className="px-4 py-3 text-right text-green-600">KES 667</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">YouTube Premium</td>
                  <td className="px-4 py-3">Family</td>
                  <td className="px-4 py-3 text-right">KES 1,550</td>
                  <td className="px-4 py-3 text-center">5</td>
                  <td className="px-4 py-3 text-right font-bold">KES 310</td>
                  <td className="px-4 py-3 text-right">KES 1,100</td>
                  <td className="px-4 py-3 text-right text-green-600">KES 790</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Amazon Prime</td>
                  <td className="px-4 py-3">Household</td>
                  <td className="px-4 py-3 text-right">KES 700</td>
                  <td className="px-4 py-3 text-center">4</td>
                  <td className="px-4 py-3 text-right font-bold">KES 175</td>
                  <td className="px-4 py-3 text-right">KES 700</td>
                  <td className="px-4 py-3 text-right text-green-600">KES 525</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Apple One</td>
                  <td className="px-4 py-3">Family</td>
                  <td className="px-4 py-3 text-right">KES 2,200</td>
                  <td className="px-4 py-3 text-center">6</td>
                  <td className="px-4 py-3 text-right font-bold">KES 367</td>
                  <td className="px-4 py-3 text-right">KES 1,500</td>
                  <td className="px-4 py-3 text-right text-green-600">KES 1,133</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Showmax</td>
                  <td className="px-4 py-3">Standard</td>
                  <td className="px-4 py-3 text-right">KES 1,200</td>
                  <td className="px-4 py-3 text-center">2</td>
                  <td className="px-4 py-3 text-right font-bold">KES 600</td>
                  <td className="px-4 py-3 text-right">KES 1,200</td>
                  <td className="px-4 py-3 text-right text-green-600">KES 600</td>
                </tr>
                <tr className="bg-green-50 dark:bg-green-900/20 font-bold">
                  <td className="px-4 py-4" colSpan={6}>Monthly Savings (All 6 Services):</td>
                  <td className="px-4 py-4 text-right text-green-600">KES 4,390</td>
                </tr>
                <tr className="bg-blue-50 dark:bg-blue-900/20 font-bold">
                  <td className="px-4 py-4" colSpan={6}>Annual Savings:</td>
                  <td className="px-4 py-4 text-right text-blue-600">KES 52,680</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">The Golden Rules of Subscription Sharing</h2>

          <div className="space-y-3">
            <div className="card bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500">
              <h3 className="font-bold mb-2">Rule 1: Choose Your Partners Wisely</h3>
              <p className="text-sm"><strong>Best:</strong> Immediate family, close friends you trust financially</p>
              <p className="text-sm"><strong>Risky:</strong> Acquaintances, coworkers, people who owe you money already</p>
              <p className="text-sm mt-2">Money creates tension. Share only with people where friendship/relationship can survive payment issues.</p>
            </div>

            <div className="card bg-purple-50 dark:bg-purple-900/10 border-l-4 border-purple-500">
              <h3 className="font-bold mb-2">Rule 2: One Person Owns the Account</h3>
              <p className="text-sm">Designate ONE "account owner" who pays the bill and collects from others. Rotating ownership causes confusion.</p>
              <p className="text-sm mt-2"><strong>Best choice:</strong> Most financially responsible person with stable income and good credit card.</p>
            </div>

            <div className="card bg-green-50 dark:bg-green-900/10 border-l-4 border-green-500">
              <h3 className="font-bold mb-2">Rule 3: Set Automatic Payments</h3>
              <p className="text-sm">Use M-Pesa paybill or standing orders so members pay automatically. Manual collection = awkward monthly reminders.</p>
              <p className="text-sm mt-2"><strong>Tech solution:</strong> Use Splitwise app or WhatsApp bot to send automated payment reminders.</p>
            </div>

            <div className="card bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500">
              <h3 className="font-bold mb-2">Rule 4: Clear Exit Policy</h3>
              <p className="text-sm">Agree upfront: "If someone wants out, give 30 days notice. Remaining members split cost or find replacement."</p>
              <p className="text-sm mt-2">Document this in shared WhatsApp group so everyone knows the rules.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Payment Collection Methods</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
              <h3 className="font-bold mb-3">✅ Recommended Methods</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>M-Pesa Standing Order:</strong>
                  <p className="text-xs text-[var(--text-muted)]">Account owner shares paybill/till number. Members set recurring M-Pesa payment.</p>
                </div>
                <div>
                  <strong>Bank Standing Order:</strong>
                  <p className="text-xs text-[var(--text-muted)]">Automatic monthly transfer from member's bank to owner's account.</p>
                </div>
                <div>
                  <strong>Splitwise App:</strong>
                  <p className="text-xs text-[var(--text-muted)]">Tracks who owes what, sends reminders, integrates with M-Pesa.</p>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10">
              <h3 className="font-bold mb-3">❌ Avoid These Methods</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Manual Reminders:</strong>
                  <p className="text-xs text-[var(--text-muted)]">"Hey, you owe me KES 425 for Netflix." Awkward and easily forgotten.</p>
                </div>
                <div>
                  <strong>Cash Handovers:</strong>
                  <p className="text-xs text-[var(--text-muted)]">No paper trail, "I paid you last week" arguments, messy.</p>
                </div>
                <div>
                  <strong>IOU System:</strong>
                  <p className="text-xs text-[var(--text-muted)]">"I'll pay you back next month." Debt accumulates, resentment builds.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Sample Sharing Agreement</h2>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
            <h3 className="font-bold mb-4">Netflix Family Plan Agreement</h3>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <p><strong>Account Owner:</strong> John Kamau</p>
                <p><strong>Total Cost:</strong> KES 1,700/month</p>
              </div>
              
              <div>
                <p className="font-bold mb-1">Members & Shares:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>John Kamau - KES 425 (Account owner)</li>
                  <li>Mary Wanjiku - KES 425</li>
                  <li>Peter Otieno - KES 425</li>
                  <li>Grace Akinyi - KES 425</li>
                </ul>
              </div>

              <div>
                <p className="font-bold mb-1">Payment Terms:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Due date: 1st of every month</li>
                  <li>Method: M-Pesa to John's number 0712345678</li>
                  <li>Late payment: Access removed after 3 days overdue</li>
                  <li>Standing orders encouraged (set via M-Pesa app)</li>
                </ul>
              </div>

              <div>
                <p className="font-bold mb-1">Rules:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Each member gets 1 profile (don't share login outside group)</li>
                  <li>No password sharing with non-members</li>
                  <li>To exit: Give 30 days notice, we'll find replacement or split cost</li>
                  <li>If John can't continue as owner, we'll transfer account or cancel</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3 mt-4">
                <p className="text-xs">
                  <strong>Agreed by:</strong> John, Mary, Peter, Grace
                  <br/><strong>Date:</strong> January 1, 2025
                  <br/><strong>Stored in:</strong> WhatsApp group pinned message
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Handling Common Problems</h2>

          <div className="space-y-3">
            <div className="card bg-red-50 dark:bg-red-900/10">
              <h3 className="font-bold mb-2">🚨 Problem: Someone Stops Paying</h3>
              <p className="text-sm"><strong>Solution:</strong> 3-strike rule. Reminder on day 3 overdue → Reminder on day 5 → Remove access on day 7. No exceptions (even family).</p>
            </div>

            <div className="card bg-amber-50 dark:bg-amber-900/10">
              <h3 className="font-bold mb-2">🚨 Problem: Price Increase</h3>
              <p className="text-sm"><strong>Solution:</strong> WhatsApp group message: "Netflix went from KES 1,700 to KES 2,000. New per-person cost: KES 500. Effective next month. Anyone want out?"</p>
            </div>

            <div className="card bg-blue-50 dark:bg-blue-900/10">
              <h3 className="font-bold mb-2">🚨 Problem: Someone Shares Login Externally</h3>
              <p className="text-sm"><strong>Solution:</strong> "Our 4-person plan now shows 7 active devices. Who shared the password? We'll need to remove them or charge them double share."</p>
            </div>

            <div className="card bg-purple-50 dark:bg-purple-900/10">
              <h3 className="font-bold mb-2">🚨 Problem: Account Owner Wants Out</h3>
              <p className="text-sm"><strong>Solution:</strong> Transfer account to new volunteer OR everyone cancels and re-subscribes individually. Don't guilt-trip owner into staying.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Finding Sharing Partners</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="card bg-green-50 dark:bg-green-900/10 text-center">
              <h3 className="font-bold mb-2">✅ Best: Family</h3>
              <p className="text-sm">Parents, siblings, cousins. Relationship survives money drama.</p>
            </div>

            <div className="card bg-blue-50 dark:bg-blue-900/10 text-center">
              <h3 className="font-bold mb-2">✅ Good: Close Friends</h3>
              <p className="text-sm">2+ year friendships with proven financial responsibility.</p>
            </div>

            <div className="card bg-amber-50 dark:bg-amber-900/10 text-center">
              <h3 className="font-bold mb-2">⚠️ Risky: Online Groups</h3>
              <p className="text-sm">Reddit/Facebook subscription sharing groups. High flake rate.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Services That DON'T Allow Sharing</h2>

          <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-6 border-l-4 border-red-500">
            <h3 className="font-bold mb-3 text-red-600 dark:text-red-400">Don't Risk Your Account</h3>
            <div className="space-y-2 text-sm">
              <p>These services explicitly ban sharing (violating = account termination):</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>LinkedIn Premium:</strong> Strictly one user per account</li>
                <li><strong>Dating Apps:</strong> Tinder Gold, Bumble Premium (obviously)</li>
                <li><strong>Educational Platforms:</strong> Coursera, Udemy (tied to certificates)</li>
                <li><strong>VPN Services:</strong> Most limit to 5 devices from same location</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Tax & Legal Considerations</h2>

          <div className="card bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-200 dark:border-blue-800">
            <h3 className="font-bold mb-3">💡 Is This Legal?</h3>
            <p className="text-sm mb-2"><strong>Yes, when done properly:</strong></p>
            <ul className="text-sm list-disc list-inside space-y-1">
              <li>Services offering "Family" or "Household" plans EXPECT sharing</li>
              <li>Splitting cost among approved members is legitimate</li>
              <li>Don't sell access to strangers (that violates ToS and could be fraud)</li>
              <li>Don't share beyond the seat limit (4-person plan = max 4 people)</li>
            </ul>
            <p className="text-sm mt-3"><strong>Tax implications:</strong> Negligible for personal use. If you're reselling access commercially, you need business permits.</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-6 my-8 border-2 border-green-200 dark:border-green-800">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span>🎯</span> The Bottom Line
            </h3>
            <p>
              Subscription sharing legally saves KES 30,000-50,000 per person annually when done right. The keys: choose reliable partners (family first), designate one account owner, automate payments via M-Pesa standing orders, document clear rules in shared group, and enforce payment deadlines without guilt. Money + relationships = drama only when expectations are unclear. Make agreements explicit from day one, use technology for reminders, and don't subsidize flaky friends. Share smart, save big, preserve friendships. The math is too good to ignore—but protect yourself with proper structure.
            </p>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-6 mt-8">
            <h3 className="font-bold mb-3">Related Articles:</h3>
            <div className="space-y-2">
              <Link to="/blog/audit-subscriptions" className="text-blue-600 hover:text-blue-700 block">
                → Quarterly Subscription Audit: Find Hidden Money Leaks
              </Link>
              <Link to="/blog/annual-vs-monthly-billing" className="text-blue-600 hover:text-blue-700 block">
                → Annual vs Monthly Subscription Billing: Which Saves More?
              </Link>
              <Link to="/blog/subscription-renewal-reminders" className="text-blue-600 hover:text-blue-700 block">
                → Setting Up Subscription Renewal Reminder Systems
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
