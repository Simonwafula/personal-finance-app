import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

export default function SubscriptionRenewalReminders() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
        <HiArrowLeft /> Back to Articles
      </Link>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-3xl">
            ⏰
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Subscriptions</div>
            <h1 className="text-3xl font-bold mt-1">Setting Up Subscription Renewal Reminder Systems</h1>
          </div>
        </div>
        
        <div className="text-sm text-[var(--text-muted)] mb-6">5 min read</div>

        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-lg leading-relaxed">
            Free trials convert to paid subscriptions at 11:59 PM. Annual renewals auto-charge your card at midnight. Price increases go live silently. Without reminder systems, you're hemorrhaging money on autopilot—KES 20,000-50,000 annually on services you forgot about or no longer need. A proper reminder system stops this bleeding by giving you decision points BEFORE money leaves your account. Here's how to build a foolproof notification system that saves you thousands.
          </p>

          <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-6 border-l-4 border-red-500">
            <h3 className="font-bold text-lg mb-2 text-red-600 dark:text-red-400">The Silent Theft</h3>
            <p className="text-sm">
              63% of people forget about at least one subscription they're paying for. Companies count on this—recurring revenue is built on human forgetfulness. A KES 1,000/month subscription you don't use costs KES 12,000 yearly. Three forgotten subscriptions? KES 36,000 gone. Reminder systems expose this theft.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Why You Need Reminders</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card bg-blue-50 dark:bg-blue-900/10">
              <h3 className="font-bold mb-3">🎯 Free Trial Protection</h3>
              <p className="text-sm">Sign up for "free 7-day trial" on Monday. Friday night you're busy. Saturday it expires. Sunday you wake up charged KES 3,000. Reminder at Day 5 prevents this.</p>
            </div>

            <div className="card bg-purple-50 dark:bg-purple-900/10">
              <h3 className="font-bold mb-3">🎯 Annual Renewal Decisions</h3>
              <p className="text-sm">Adobe charges KES 50,000 annually. Do you still need it? Reminder 2 weeks before lets you evaluate usage and downgrade if needed.</p>
            </div>

            <div className="card bg-green-50 dark:bg-green-900/10">
              <h3 className="font-bold mb-3">🎯 Price Increase Alerts</h3>
              <p className="text-sm">Netflix goes from KES 1,100 to KES 1,500 next month. Without notification, you don't notice for 3-4 months. KES 1,200 extra gone.</p>
            </div>

            <div className="card bg-amber-50 dark:bg-amber-900/10">
              <h3 className="font-bold mb-3">🎯 Usage Audits</h3>
              <p className="text-sm">Reminders trigger questions: "Am I still using this? Is it worth the cost?" Most subscriptions survive on never being reconsidered.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">The Three-Layer Reminder System</h2>

          <div className="space-y-4">
            <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border-l-4 border-blue-500">
              <h3 className="font-bold text-lg mb-3">Layer 1: Google Calendar (Primary System)</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Why it works:</strong> Free, syncs everywhere, notification control, easy recurring setup</p>
                <div className="mt-3">
                  <p className="font-bold mb-2">Setup Steps:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Create calendar called "Subscriptions"</li>
                    <li>Add event for each subscription renewal date</li>
                    <li>Set TWO reminders: 7 days before + 2 days before</li>
                    <li>Set as recurring (monthly/annually)</li>
                    <li>Add cost in description field</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-l-4 border-purple-500">
              <h3 className="font-bold text-lg mb-3">Layer 2: Bank SMS Alerts (Backup)</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Why it works:</strong> Notifies AFTER charge but confirms transaction happened</p>
                <div className="mt-3">
                  <p className="font-bold mb-2">Setup Steps:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Enable transaction alerts in KCB/Equity/Co-op app</li>
                    <li>Set alert threshold to KES 0 (notify all transactions)</li>
                    <li>Check SMS daily for unexpected subscription charges</li>
                    <li>Dispute within 30 days if unauthorized</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-l-4 border-green-500">
              <h3 className="font-bold text-lg mb-3">Layer 3: Subscription Tracker Apps (Advanced)</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Why it works:</strong> Centralized dashboard, spending analytics, automatic detection</p>
                <div className="mt-3">
                  <p className="font-bold mb-2">Recommended Apps:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Bobby:</strong> iOS app, clean interface, free tier sufficient</li>
                    <li><strong>Truebill/Rocket Money:</strong> Auto-detects subscriptions from bank feed</li>
                    <li><strong>YNAB (You Need A Budget):</strong> Full budgeting + subscription tracking</li>
                    <li><strong>Spreadsheet:</strong> DIY option if you prefer control</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Google Calendar Setup (Step-by-Step)</h2>

          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 rounded-lg p-6 border-2 border-indigo-200 dark:border-indigo-800">
            <h3 className="font-bold text-lg mb-4">Example: Netflix Subscription</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-3">
                <p><strong>Event Title:</strong> Netflix Renewal - KES 1,100</p>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-3">
                <p><strong>Date:</strong> 15th of every month (your renewal date)</p>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-3">
                <p><strong>Reminders:</strong></p>
                <ul className="list-disc list-inside mt-1">
                  <li>7 days before (Dec 8 for Dec 15 renewal)</li>
                  <li>2 days before (Dec 13)</li>
                </ul>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-3">
                <p><strong>Description:</strong></p>
                <p className="mt-1 font-mono text-xs">
                  Plan: Standard (2 screens)<br/>
                  Cost: KES 1,100/month<br/>
                  Cancel: netflix.com/YourAccount<br/>
                  Usage: Check watch history before renewing<br/>
                  Alternative: Share family plan to split cost
                </p>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-3">
                <p><strong>Recurrence:</strong> Monthly, indefinitely</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Reminder Timing Strategy</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-[var(--border-subtle)] rounded-lg text-sm">
              <thead className="bg-[var(--surface)]">
                <tr>
                  <th className="px-4 py-3 text-left">Subscription Type</th>
                  <th className="px-4 py-3 text-left">Recommended Reminder</th>
                  <th className="px-4 py-3 text-left">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Free Trials</td>
                  <td className="px-4 py-3 font-bold text-red-600">2 days before expiry</td>
                  <td className="px-4 py-3">Must cancel before auto-charge</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Monthly ({'{<'}KES 2K)</td>
                  <td className="px-4 py-3">3 days before renewal</td>
                  <td className="px-4 py-3">Low cost, quick decision</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Monthly ({'{>'}KES 2K)</td>
                  <td className="px-4 py-3">7 days before renewal</td>
                  <td className="px-4 py-3">High cost needs evaluation time</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Annual</td>
                  <td className="px-4 py-3 font-bold">14 days before renewal</td>
                  <td className="px-4 py-3">Large payment, review usage patterns</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Annual (Expensive)</td>
                  <td className="px-4 py-3 font-bold text-blue-600">30 days before renewal</td>
                  <td className="px-4 py-3">KES 20K+ needs budget planning</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">What to Do When Reminder Triggers</h2>

          <div className="card bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-2 border-amber-200 dark:border-amber-800">
            <h3 className="font-bold text-lg mb-4">The 5-Minute Decision Protocol:</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-4">
                <p className="font-bold mb-2">❓ Question 1: Have I used this in the last 30 days?</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Yes →</strong> Proceed to Question 2</li>
                  <li><strong>No →</strong> CANCEL. Set calendar reminder to resubscribe if you miss it (you won't)</li>
                </ul>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-4">
                <p className="font-bold mb-2">❓ Question 2: Is the value worth the cost?</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Yes →</strong> Proceed to Question 3</li>
                  <li><strong>Unsure →</strong> Calculate cost per use. KES 1,100 Netflix ÷ 10 sessions = KES 110/session. Worth it?</li>
                  <li><strong>No →</strong> CANCEL or DOWNGRADE</li>
                </ul>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-4">
                <p className="font-bold mb-2">❓ Question 3: Is there a cheaper alternative?</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Yes →</strong> Switch providers</li>
                  <li><strong>No →</strong> Check if you can share/split cost</li>
                  <li><strong>Can't share →</strong> Keep and re-evaluate in 90 days</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Automation Tactics</h2>

          <div className="space-y-3">
            <div className="card border-l-4 border-blue-500">
              <h3 className="font-bold mb-2">🤖 IFTTT Integration</h3>
              <p className="text-sm">Create applet: "If charge from Netflix on credit card, then send me email reminder." Catches renewals you forgot to calendar.</p>
            </div>

            <div className="card border-l-4 border-purple-500">
              <h3 className="font-bold mb-2">🤖 Virtual Card Per Subscription</h3>
              <p className="text-sm">KCB/Equity virtual cards let you set spending limits. Assign one virtual card per subscription—easy to track and block if needed.</p>
            </div>

            <div className="card border-l-4 border-green-500">
              <h3 className="font-bold mb-2">🤖 Email Filters</h3>
              <p className="text-sm">Gmail filter: "Subject contains 'renewal' OR 'subscription'" → Label "Subscriptions" + Star. Check starred folder weekly.</p>
            </div>

            <div className="card border-l-4 border-amber-500">
              <h3 className="font-bold mb-2">🤖 Bank Category Alerts</h3>
              <p className="text-sm">Some banks (KCB) let you set alerts for spending categories. Enable "Subscriptions" category for instant notifications.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Spreadsheet Template</h2>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-[var(--border-subtle)]">
            <p className="text-sm mb-4">Copy this structure to Google Sheets or Excel:</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border border-[var(--border-subtle)]">
                <thead className="bg-[var(--surface)]">
                  <tr>
                    <th className="px-3 py-2 text-left border-r">Service</th>
                    <th className="px-3 py-2 text-right border-r">Monthly Cost</th>
                    <th className="px-3 py-2 text-left border-r">Renewal Date</th>
                    <th className="px-3 py-2 text-left border-r">Last Used</th>
                    <th className="px-3 py-2 text-left border-r">Cancel Link</th>
                    <th className="px-3 py-2 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-3 py-2 border-r">Netflix</td>
                    <td className="px-3 py-2 text-right border-r">KES 1,100</td>
                    <td className="px-3 py-2 border-r">15th monthly</td>
                    <td className="px-3 py-2 border-r">Yesterday</td>
                    <td className="px-3 py-2 border-r">netflix.com/cancel</td>
                    <td className="px-3 py-2">Share with roommate?</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-r">Spotify</td>
                    <td className="px-3 py-2 text-right border-r">KES 900</td>
                    <td className="px-3 py-2 border-r">22nd monthly</td>
                    <td className="px-3 py-2 border-r">Today</td>
                    <td className="px-3 py-2 border-r">spotify.com/account</td>
                    <td className="px-3 py-2">Family plan cheaper</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-r">Gym</td>
                    <td className="px-3 py-2 text-right border-r">KES 3,500</td>
                    <td className="px-3 py-2 border-r">1st monthly</td>
                    <td className="px-3 py-2 border-r text-red-600">3 months ago</td>
                    <td className="px-3 py-2 border-r">Call reception</td>
                    <td className="px-3 py-2 text-red-600 font-bold">CANCEL</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-3">Update "Last Used" column weekly during Sunday review.</p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Common Pitfalls to Avoid</h2>

          <div className="space-y-3">
            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">❌ Setting Only ONE Reminder</h3>
              <p className="text-sm">Life gets busy. One reminder can be ignored/forgotten. Always set TWO: 7 days + 2 days before. Redundancy prevents KES 3K charges.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">❌ Vague Event Titles</h3>
              <p className="text-sm">"Subscription" tells you nothing. Use "Netflix Renewal - KES 1,100 - Evaluate Usage" so you know what to do.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">❌ Ignoring Email Confirmations</h3>
              <p className="text-sm">When you subscribe, confirmation email shows exact renewal date. Add to calendar IMMEDIATELY before you forget.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">❌ Procrastinating Cancellations</h3>
              <p className="text-sm">"I'll cancel later" = you won't. Most services let you cancel but keep access until end of paid period. Cancel NOW.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-6 my-8 border-2 border-green-200 dark:border-green-800">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span>🎯</span> The Bottom Line
            </h3>
            <p>
              A reminder system is the difference between mindless spending and intentional money management. Set up Google Calendar subscriptions today—15 minutes now saves KES 20,000-50,000 annually in forgotten charges, unwanted renewals, and subscription creep. The companies betting on your forgetfulness make billions yearly. Don't contribute. Two-reminder rule (7 days + 2 days before), clear event titles with costs, and immediate calendar entry upon sign-up. Your future self—and your bank account—will thank you.
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
              <Link to="/blog/shared-subscription-plans" className="text-blue-600 hover:text-blue-700 block">
                → How to Split Subscription Costs with Family & Friends
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
