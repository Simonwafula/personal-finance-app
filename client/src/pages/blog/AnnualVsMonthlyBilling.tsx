import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

export default function AnnualVsMonthlyBilling() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
        <HiArrowLeft /> Back to Articles
      </Link>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl">
            💰
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Subscriptions</div>
            <h1 className="text-3xl font-bold mt-1">Annual vs Monthly Subscription Billing: Which Saves More?</h1>
          </div>
        </div>
        
        <div className="text-sm text-[var(--text-muted)] mb-6">6 min read</div>

        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-lg leading-relaxed">
            Should you pay KES 12,000 upfront annually or KES 1,200 monthly? The math seems obvious—annual usually offers 15-30% discount. But real life complicates the equation. Cash flow, usage uncertainty, and opportunity cost make this decision more nuanced than simple multiplication. Let's break down when each billing cycle makes financial sense and when the "savings" are actually traps.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="font-bold text-lg mb-2">The General Rule</h3>
            <p className="text-sm">
              Annual billing typically saves 15-25% compared to monthly. For a KES 1,000/month service, annual might cost KES 10,000 (2 months free). Real savings: KES 2,000. But is tying up KES 10,000 upfront worth KES 2,000 savings? Depends on your situation.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Annual Billing Pros & Cons</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card bg-green-50 dark:bg-green-900/10">
              <h3 className="font-bold text-green-600 dark:text-green-400 mb-3">✅ Advantages</h3>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li><strong>15-30% Discount:</strong> Real money saved vs monthly</li>
                <li><strong>Mental Simplicity:</strong> Pay once, forget for 12 months</li>
                <li><strong>No Renewal Hassle:</strong> One decision per year</li>
                <li><strong>Budget Predictability:</strong> Locked-in rate for full year</li>
                <li><strong>Commitment Signal:</strong> Forces you to use service (sunk cost psychology)</li>
              </ul>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10">
              <h3 className="font-bold text-red-600 dark:text-red-400 mb-3">❌ Disadvantages</h3>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li><strong>Large Upfront Cost:</strong> KES 10-50K+ all at once strains budget</li>
                <li><strong>Trapped If You Stop Using:</strong> Can't recover unused months</li>
                <li><strong>Opportunity Cost:</strong> That cash could earn interest elsewhere</li>
                <li><strong>Risk of Better Deals:</strong> New competitor offers better service mid-year</li>
                <li><strong>Company Risk:</strong> Service shuts down or degrades quality</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Real Savings Calculation</h2>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-lg p-6 border-2 border-purple-200 dark:border-purple-800">
            <h3 className="font-bold text-lg mb-4">Example: Spotify Premium</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  <tr>
                    <td className="py-2"><strong>Monthly Plan:</strong></td>
                    <td className="py-2 text-right">KES 900 × 12 = KES 10,800</td>
                  </tr>
                  <tr>
                    <td className="py-2"><strong>Annual Plan:</strong></td>
                    <td className="py-2 text-right">KES 9,000 (upfront)</td>
                  </tr>
                  <tr className="bg-green-50 dark:bg-green-900/20 font-bold">
                    <td className="py-3"><strong>Direct Savings:</strong></td>
                    <td className="py-3 text-right text-green-600">KES 1,800 (17%)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 bg-white/50 dark:bg-gray-800/50 rounded p-4">
              <p className="text-sm mb-2"><strong>But consider opportunity cost:</strong></p>
              <p className="text-sm">If you invest that KES 9,000 in money market fund (8% annually):</p>
              <p className="text-sm mt-1">Interest earned: KES 720</p>
              <p className="text-sm font-bold mt-2 text-green-600">Net savings after opportunity cost: KES 1,080</p>
              <p className="text-xs text-[var(--text-muted)] mt-2">Still saves money, but 40% less than it appears!</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">When to Choose Annual Billing</h2>

          <div className="space-y-3">
            <div className="card bg-green-50 dark:bg-green-900/10 border-l-4 border-green-500">
              <h3 className="font-bold mb-2">✅ Certainty of Use</h3>
              <p className="text-sm">You've used this service daily for 2+ years and can't imagine stopping. Netflix if you watch nightly, Spotify if you stream daily.</p>
            </div>

            <div className="card bg-green-50 dark:bg-green-900/10 border-l-4 border-green-500">
              <h3 className="font-bold mb-2">✅ Significant Discount ({'>'}20%)</h3>
              <p className="text-sm">If annual saves more than 20%, the math strongly favors it—assuming you'll use it.</p>
            </div>

            <div className="card bg-green-50 dark:bg-green-900/10 border-l-4 border-green-500">
              <h3 className="font-bold mb-2">✅ Business Essential</h3>
              <p className="text-sm">Tools required for income generation (Adobe for designers, Zoom for consultants). Write off as business expense.</p>
            </div>

            <div className="card bg-green-50 dark:bg-green-900/10 border-l-4 border-green-500">
              <h3 className="font-bold mb-2">✅ Strong Cash Flow</h3>
              <p className="text-sm">The annual payment doesn't strain your budget. You have emergency fund intact and can afford lump sum comfortably.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">When to Choose Monthly Billing</h2>

          <div className="space-y-3">
            <div className="card bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500">
              <h3 className="font-bold mb-2">💡 Trying New Service</h3>
              <p className="text-sm">First 3-6 months with any service should be monthly. Confirm value before committing annually.</p>
            </div>

            <div className="card bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500">
              <h3 className="font-bold mb-2">💡 Seasonal Use</h3>
              <p className="text-sm">Gym membership you only use Jan-Mar? Pay monthly, cancel when hot season starts. Don't pre-pay for unused months.</p>
            </div>

            <div className="card bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500">
              <h3 className="font-bold mb-2">💡 Cash Flow Constraints</h3>
              <p className="text-sm">If annual payment strains budget or depletes emergency fund, monthly is safer even with higher total cost.</p>
            </div>

            <div className="card bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500">
              <h3 className="font-bold mb-2">💡 Competitive Market</h3>
              <p className="text-sm">Rapidly evolving space (streaming, cloud storage). Better alternatives may emerge—stay flexible.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Hybrid Strategy: Best of Both</h2>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-lg p-6 border-2 border-amber-200 dark:border-amber-800">
            <h3 className="font-bold text-lg mb-4">The Smart Subscription Portfolio:</h3>
            <div className="space-y-3 text-sm">
              <div>
                <strong className="block mb-1">🟢 Annual Tier (Core Services):</strong>
                <p>Services you're 100% certain you'll use all year. 2-3 maximum.</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Example: Netflix, Spotify, Microsoft 365 for work</p>
              </div>
              <div>
                <strong className="block mb-1">🔵 Monthly Tier (Regular But Flexible):</strong>
                <p>Services you use often but might cancel. 3-5 services.</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Example: Gym, Adobe apps, meal delivery</p>
              </div>
              <div>
                <strong className="block mb-1">🟡 Rotational Tier (Temporary):</strong>
                <p>Subscribe month-to-month, binge content, cancel. Rotate through services.</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Example: Disney+ (watch everything in 1 month), cancel until new shows</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Common Subscription Scenarios</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-[var(--border-subtle)] rounded-lg text-sm">
              <thead className="bg-[var(--surface)]">
                <tr>
                  <th className="px-4 py-3 text-left">Service Type</th>
                  <th className="px-4 py-3 text-left">Monthly Cost</th>
                  <th className="px-4 py-3 text-left">Annual Cost</th>
                  <th className="px-4 py-3 text-left">Savings</th>
                  <th className="px-4 py-3 text-left">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Netflix Standard</td>
                  <td className="px-4 py-3">KES 1,100</td>
                  <td className="px-4 py-3">KES 12,000</td>
                  <td className="px-4 py-3">KES 1,200 (9%)</td>
                  <td className="px-4 py-3 text-green-600">Annual if daily user</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Gym Membership</td>
                  <td className="px-4 py-3">KES 3,500</td>
                  <td className="px-4 py-3">KES 36,000</td>
                  <td className="px-4 py-3">KES 6,000 (14%)</td>
                  <td className="px-4 py-3 text-blue-600">Monthly (high quit rate)</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Adobe Creative Cloud</td>
                  <td className="px-4 py-3">KES 5,000</td>
                  <td className="px-4 py-3">KES 50,000</td>
                  <td className="px-4 py-3">KES 10,000 (17%)</td>
                  <td className="px-4 py-3 text-green-600">Annual if professional</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">LinkedIn Premium</td>
                  <td className="px-4 py-3">KES 3,000</td>
                  <td className="px-4 py-3">KES 30,000</td>
                  <td className="px-4 py-3">KES 6,000 (17%)</td>
                  <td className="px-4 py-3 text-blue-600">Monthly (job hunting tool)</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Cloud Storage (1TB)</td>
                  <td className="px-4 py-3">KES 800</td>
                  <td className="px-4 py-3">KES 8,000</td>
                  <td className="px-4 py-3">KES 1,600 (17%)</td>
                  <td className="px-4 py-3 text-green-600">Annual (stable need)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Decision Framework</h2>

          <div className="card bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 border-2 border-indigo-200 dark:border-indigo-800">
            <h3 className="font-bold text-lg mb-4">Ask These Questions Before Choosing Annual:</h3>
            <div className="space-y-3 text-sm">
              <label className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" disabled />
                <span>Have I used this service consistently for 6+ months?</span>
              </label>
              <label className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" disabled />
                <span>Will I definitely use it for the next 12 months?</span>
              </label>
              <label className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" disabled />
                <span>Does annual billing save at least 15%?</span>
              </label>
              <label className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" disabled />
                <span>Can I afford the lump sum without straining budget?</span>
              </label>
              <label className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" disabled />
                <span>Is this service essential (not nice-to-have)?</span>
              </label>
            </div>
            <p className="text-sm mt-4 text-[var(--text-muted)] italic">
              If you answered "yes" to 4-5 questions → Go annual. 
              <br/>If 2-3 → Stay monthly.
              <br/>If 0-1 → Cancel entirely.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Advanced Tactics</h2>

          <div className="space-y-3">
            <div className="card border-l-4 border-purple-500">
              <h3 className="font-bold mb-2">🎯 Negotiate Custom Deals</h3>
              <p className="text-sm">Email sales: "I'd commit annually if you give me 30% off." Works surprisingly often, especially for B2B services.</p>
            </div>

            <div className="card border-l-4 border-blue-500">
              <h3 className="font-bold mb-2">🎯 Time Annual Purchases Strategically</h3>
              <p className="text-sm">Buy annual subscriptions in November-December when companies run Black Friday sales (30-50% off).</p>
            </div>

            <div className="card border-l-4 border-green-500">
              <h3 className="font-bold mb-2">🎯 Use Virtual Cards for Trials</h3>
              <p className="text-sm">Sign up for "monthly" trial with virtual card (KCB or Equity offers this). If you forget to cancel, limited impact.</p>
            </div>

            <div className="card border-l-4 border-amber-500">
              <h3 className="font-bold mb-2">🎯 Review at 6-Month Mark</h3>
              <p className="text-sm">If you went annual, set reminder at month 6. Still using it? Great. Not using it? Don't renew next year.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-6 my-8 border-2 border-green-200 dark:border-green-800">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span>🎯</span> The Bottom Line
            </h3>
            <p>
              Annual billing saves money IF you're certain you'll use the service all year. For core subscriptions you've used 6+ months, annual makes sense. For new services, experiments, or seasonal needs, monthly preserves flexibility. Don't let the "discount" pressure you into commitment—companies profit when you pre-pay then stop using services. A hybrid approach works best: 2-3 annual core services, 3-5 monthly flexibles, and rotate through entertainment. The real win isn't annual vs monthly—it's canceling services you don't need at all.
            </p>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-6 mt-8">
            <h3 className="font-bold mb-3">Related Articles:</h3>
            <div className="space-y-2">
              <Link to="/blog/audit-subscriptions" className="text-blue-600 hover:text-blue-700 block">
                → Quarterly Subscription Audit: Find Hidden Money Leaks
              </Link>
              <Link to="/blog/shared-subscription-plans" className="text-blue-600 hover:text-blue-700 block">
                → How to Split Subscription Costs with Family & Friends
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
