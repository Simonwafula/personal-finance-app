import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

export default function AuditSubscriptions() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
        <HiArrowLeft /> Back to Articles
      </Link>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-3xl">
            🔍
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Subscriptions</div>
            <h1 className="text-3xl font-bold mt-1">Quarterly Subscription Audit: Find Hidden Money Leaks</h1>
          </div>
        </div>
        
        <div className="text-sm text-[var(--text-muted)] mb-6">5 min read</div>

        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-lg leading-relaxed">
            Subscriptions are the silent budget killers. That KES 500 streaming service you forgot about? Multiply by 12 months—KES 6,000 gone. Add gym membership you haven't used in months, cloud storage at full capacity that you never clean, premium apps with free alternatives—suddenly you're hemorrhaging KES 30-50K annually on services providing zero value. A quarterly audit stops this bleeding and reclaims your money.
          </p>

          <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-6 border-l-4 border-red-500">
            <h3 className="font-bold text-lg mb-2 text-red-600 dark:text-red-400">The Average Kenyan Wastes KES 15,000+ Yearly</h3>
            <p className="text-sm">
              Research shows people underestimate subscription costs by 2-3x. You think "KES 5,000/month" but it's actually KES 12,000 when you count forgotten trials, duplicate services, and unused memberships. Quarterly audits catch these before they compound into massive waste.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Why Quarterly (Not Monthly or Yearly)</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="card bg-red-50 dark:bg-red-900/10 text-center">
              <h3 className="font-bold mb-2">❌ Monthly = Overkill</h3>
              <p className="text-sm">Most subscriptions are annual/unchanging. Monthly checks waste time.</p>
            </div>

            <div className="card bg-green-50 dark:bg-green-900/10 text-center border-2 border-green-500">
              <h3 className="font-bold mb-2">✅ Quarterly = Sweet Spot</h3>
              <p className="text-sm">Catches issues within 3 months. 4x yearly is manageable.</p>
            </div>

            <div className="card bg-amber-50 dark:bg-amber-900/10 text-center">
              <h3 className="font-bold mb-2">⚠️ Yearly = Too Late</h3>
              <p className="text-sm">12 months of waste before catching it. KES 6K-20K already gone.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">The 30-Minute Quarterly Audit Process</h2>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
            <h3 className="font-bold text-lg mb-4">Step-by-Step Audit Checklist:</h3>
            
            <div className="space-y-4">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-4">
                <h4 className="font-bold mb-2">Step 1: Gather All Subscriptions (10 min)</h4>
                <ul className="text-sm list-disc list-inside space-y-1">
                  <li>Check bank/M-Pesa statements for recurring charges</li>
                  <li>Review credit card transactions (filter by "subscription", "membership")</li>
                  <li>Check email for "renewal", "payment received", "subscription"</li>
                  <li>List app store subscriptions (Google Play, App Store)</li>
                </ul>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-4">
                <h4 className="font-bold mb-2">Step 2: Categorize & Calculate (5 min)</h4>
                <p className="text-sm mb-2">Create spreadsheet with columns:</p>
                <ul className="text-sm list-disc list-inside space-y-1">
                  <li>Service name</li>
                  <li>Cost per month</li>
                  <li>Last used (date)</li>
                  <li>Category (Entertainment, Productivity, Fitness, etc.)</li>
                  <li>Action (Keep/Cancel/Downgrade)</li>
                </ul>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-4">
                <h4 className="font-bold mb-2">Step 3: Apply the 90-Day Rule (10 min)</h4>
                <p className="text-sm mb-2">For each subscription, ask:</p>
                <ul className="text-sm list-disc list-inside space-y-1">
                  <li>Have I used this in the last 90 days?</li>
                  <li>Will I definitely use it in the next 90 days?</li>
                  <li>If no to both → Cancel immediately</li>
                </ul>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-4">
                <h4 className="font-bold mb-2">Step 4: Execute Cancellations (5 min)</h4>
                <p className="text-sm">Don't procrastinate—cancel on the spot. Most services let you finish the paid period.</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Common Subscription Traps</h2>

          <div className="space-y-3">
            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <strong className="text-red-600 dark:text-red-400">🪤 The Free Trial Trap</strong>
              <p className="text-sm mt-1">Sign up for "free 7 days", forget to cancel, auto-charged KES 2,000. Set phone reminders 2 days before trial ends.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <strong className="text-red-600 dark:text-red-400">🪤 The Duplicate Trap</strong>
              <p className="text-sm mt-1">Netflix + Showmax + Amazon Prime = paying 3x for similar content. Pick one, cancel the rest.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <strong className="text-red-600 dark:text-red-400">🪤 The Feature Creep Trap</strong>
              <p className="text-sm mt-1">YouTube Premium for no ads but you barely watch YouTube. Spotify Premium but free version works fine. Paying for unused features.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <strong className="text-red-600 dark:text-red-400">🪤 The Sunk Cost Trap</strong>
              <p className="text-sm mt-1">"I've paid for gym 6 months, I should keep it." Wrong. Stop throwing good money after bad—cancel NOW.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Sample Audit Results</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-[var(--border-subtle)] rounded-lg text-sm">
              <thead className="bg-[var(--surface)]">
                <tr>
                  <th className="px-4 py-3 text-left">Service</th>
                  <th className="px-4 py-3 text-right">Monthly Cost</th>
                  <th className="px-4 py-3 text-left">Last Used</th>
                  <th className="px-4 py-3 text-left">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Netflix</td>
                  <td className="px-4 py-3 text-right">KES 1,100</td>
                  <td className="px-4 py-3">Yesterday</td>
                  <td className="px-4 py-3 text-green-600">✅ Keep</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Showmax</td>
                  <td className="px-4 py-3 text-right">KES 1,200</td>
                  <td className="px-4 py-3">4 months ago</td>
                  <td className="px-4 py-3 text-red-600">❌ Cancel (duplicate)</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Gym Membership</td>
                  <td className="px-4 py-3 text-right">KES 3,500</td>
                  <td className="px-4 py-3">5 months ago</td>
                  <td className="px-4 py-3 text-red-600">❌ Cancel (unused)</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Spotify Premium</td>
                  <td className="px-4 py-3 text-right">KES 900</td>
                  <td className="px-4 py-3">Daily</td>
                  <td className="px-4 py-3 text-green-600">✅ Keep</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Adobe Creative Cloud</td>
                  <td className="px-4 py-3 text-right">KES 5,000</td>
                  <td className="px-4 py-3">2 weeks ago</td>
                  <td className="px-4 py-3 text-amber-600">⚠️ Downgrade to Photography plan (KES 1,200)</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">LinkedIn Premium</td>
                  <td className="px-4 py-3 text-right">KES 3,000</td>
                  <td className="px-4 py-3">Never (free trial)</td>
                  <td className="px-4 py-3 text-red-600">❌ Cancel immediately</td>
                </tr>
                <tr className="bg-green-50 dark:bg-green-900/20 font-bold">
                  <td className="px-4 py-4">Monthly Savings:</td>
                  <td className="px-4 py-4 text-right text-green-600" colSpan={3}>KES 11,500</td>
                </tr>
                <tr className="bg-blue-50 dark:bg-blue-900/20 font-bold">
                  <td className="px-4 py-4">Annual Savings:</td>
                  <td className="px-4 py-4 text-right text-blue-600" colSpan={3}>KES 138,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Questions to Ask Each Subscription</h2>

          <div className="space-y-3">
            <div className="card bg-blue-50 dark:bg-blue-900/10">
              <h3 className="font-bold mb-2">1. Usage Frequency</h3>
              <p className="text-sm">Used weekly = probably worth it. Used monthly = questionable. Used quarterly = cancel.</p>
            </div>

            <div className="card bg-purple-50 dark:bg-purple-900/10">
              <h3 className="font-bold mb-2">2. Free Alternative Exists?</h3>
              <p className="text-sm">YouTube instead of YouTube Premium? Free Spotify instead of Premium? Choose free if ads don't bother you.</p>
            </div>

            <div className="card bg-green-50 dark:bg-green-900/10">
              <h3 className="font-bold mb-2">3. Sharing Potential?</h3>
              <p className="text-sm">Split Netflix family plan 4 ways: KES 275 each instead of KES 1,100. Many services allow sharing legally.</p>
            </div>

            <div className="card bg-amber-50 dark:bg-amber-900/10">
              <h3 className="font-bold mb-2">4. Seasonal Need?</h3>
              <p className="text-sm">Cancel gym Dec-Feb (too hot), resubscribe when weather improves. Pay only when you'll use it.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Audit Calendar</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10">
              <h3 className="font-bold mb-3">📅 Recommended Schedule:</h3>
              <ul className="text-sm space-y-2">
                <li><strong>Q1 (Jan-Mar):</strong> January 15</li>
                <li><strong>Q2 (Apr-Jun):</strong> April 15</li>
                <li><strong>Q3 (Jul-Sep):</strong> July 15</li>
                <li><strong>Q4 (Oct-Dec):</strong> October 15</li>
              </ul>
            </div>

            <div className="card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
              <h3 className="font-bold mb-3">⏰ Set Recurring Reminders:</h3>
              <ul className="text-sm space-y-2">
                <li>Phone calendar reminder</li>
                <li>Email to yourself</li>
                <li>Task manager notification</li>
                <li>Make it non-negotiable</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-6 my-8 border-2 border-green-200 dark:border-green-800">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span>🎯</span> The Bottom Line
            </h3>
            <p>
              A 30-minute quarterly audit saves KES 50,000-150,000 annually for most people. That's a vacation, emergency fund contribution, or investment seed capital—all from cutting services you don't use. Set recurring calendar reminders for January, April, July, and October. Make it a ritual like paying bills. The companies counting on you forgetting are banking billions—don't let them bank YOUR billions. Audit today, reclaim your money, redirect to goals that matter.
            </p>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-6 mt-8">
            <h3 className="font-bold mb-3">Related Articles:</h3>
            <div className="space-y-2">
              <Link to="/blog/annual-vs-monthly-billing" className="text-blue-600 hover:text-blue-700 block">
                → Annual vs Monthly Subscription Billing: Which Saves More?
              </Link>
              <Link to="/blog/subscription-renewal-reminders" className="text-blue-600 hover:text-blue-700 block">
                → Setting Up Subscription Renewal Reminder Systems
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
