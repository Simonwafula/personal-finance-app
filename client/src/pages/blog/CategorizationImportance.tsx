import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

export default function CategorizationImportance() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
        <HiArrowLeft /> Back to Articles
      </Link>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl">
            🏷️
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Money Management</div>
            <h1 className="text-3xl font-bold mt-1">Why Categorization & Tagging Transform Your Financial Life</h1>
          </div>
        </div>
        
        <div className="text-sm text-[var(--text-muted)] mb-6">8 min read</div>

        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-lg leading-relaxed">
            "Where did my money go?" If you've asked this question while staring at a near-empty bank account, you're experiencing the chaos of uncategorized spending. KES 80,000 salary deposited on the 1st, KES 3,000 remaining by the 25th—but you can't pinpoint where KES 77,000 disappeared. This financial fog destroys budgets, enables overspending, and keeps you perpetually broke. The solution? Rigorous categorization and tagging. Here's why it's the difference between financial confusion and crystal-clear money mastery.
          </p>

          <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-6 border-l-4 border-red-500">
            <h3 className="font-bold text-lg mb-2 text-red-600 dark:text-red-400">The Uncategorized Money Problem</h3>
            <p className="text-sm">
              Without categories, your bank statement is just a meaningless list: "KES 500 here, KES 1,200 there, KES 8,000 somewhere." You can't answer basic questions: "How much do I spend on food?" "Is my transport cost increasing?" "Where can I cut back?" Every financial decision becomes a guess. Categorization converts chaos into clarity.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">What Is Financial Categorization?</h2>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
            <p className="mb-4">Categorization groups transactions by purpose. Instead of seeing:</p>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded p-4 font-mono text-sm space-y-1">
              <p>KES 500 - Carrefour</p>
              <p>KES 1,200 - Naivas</p>
              <p>KES 800 - Quick Mart</p>
              <p>KES 2,000 - Zucchini</p>
            </div>
            <p className="my-4">You see:</p>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded p-4 space-y-1">
              <p className="font-bold text-green-600">Groceries: KES 2,500</p>
              <p className="font-bold text-blue-600">Restaurants: KES 2,000</p>
            </div>
            <p className="mt-4 text-sm text-[var(--text-muted)] italic">
              Suddenly patterns emerge. You're spending more eating out than on groceries. That's actionable intelligence.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">The 7 Life-Changing Benefits</h2>

          <div className="space-y-4">
            <div className="card bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-l-4 border-green-500">
              <h3 className="font-bold text-lg mb-2">1. Answer "Where Did My Money Go?"</h3>
              <p className="text-sm mb-3">Without categories: Mystery. With categories: Precision.</p>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-4 text-sm">
                <p className="font-bold mb-2">Example: KES 80K Monthly Salary Breakdown</p>
                <ul className="space-y-1">
                  <li>🏠 Rent: KES 25,000 (31%)</li>
                  <li>🍔 Food: KES 18,000 (23%)</li>
                  <li>🚗 Transport: KES 12,000 (15%)</li>
                  <li>📱 Utilities/Phone: KES 8,000 (10%)</li>
                  <li>🎉 Entertainment: KES 9,000 (11%)</li>
                  <li>🛒 Shopping: KES 6,000 (8%)</li>
                  <li>💰 Savings: KES 2,000 (2%)</li>
                </ul>
              </div>
              <p className="text-sm mt-3 text-[var(--text-muted)]">
                Instant insight: Entertainment spending (11%) exceeds savings (2%). That's your problem.
              </p>
            </div>

            <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-l-4 border-blue-500">
              <h3 className="font-bold text-lg mb-2">2. Spot Overspending Before It's Too Late</h3>
              <p className="text-sm">Categories reveal spending patterns mid-month, not after you're broke.</p>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-4 text-sm mt-3">
                <p className="font-bold mb-2">Alert Example:</p>
                <p className="text-red-600 font-bold">"🚨 Restaurant spending: KES 8,000 (80% of KES 10K budget)"</p>
                <p className="text-xs text-[var(--text-muted)] mt-2">It's only the 15th. You see this alert, skip tonight's dinner out, save KES 2,000. Without categories? You'd hit KES 12K by month-end and wonder why you're broke.</p>
              </div>
            </div>

            <div className="card bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-l-4 border-purple-500">
              <h3 className="font-bold text-lg mb-2">3. Build Realistic Budgets (Not Fantasy Plans)</h3>
              <p className="text-sm mb-3">Most budgets fail because they're guesses. Categories use real data.</p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-red-50 dark:bg-red-900/20 rounded p-3">
                  <p className="font-bold mb-2">❌ Without Categories (Fantasy Budget):</p>
                  <ul className="space-y-1 text-xs">
                    <li>Food: KES 10,000 (You spend KES 18K)</li>
                    <li>Transport: KES 5,000 (You spend KES 12K)</li>
                    <li>Entertainment: KES 3,000 (You spend KES 9K)</li>
                  </ul>
                  <p className="text-xs mt-2 text-red-600">Budget failure by day 10. Give up budgeting.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded p-3">
                  <p className="font-bold mb-2">✅ With Categories (Reality-Based Budget):</p>
                  <ul className="space-y-1 text-xs">
                    <li>Food: KES 18,000 (Historical average)</li>
                    <li>Transport: KES 12,000 (Actual need)</li>
                    <li>Entertainment: KES 9,000 (Current habit)</li>
                  </ul>
                  <p className="text-xs mt-2 text-green-600">Budget reflects reality. Now gradually reduce.</p>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-l-4 border-amber-500">
              <h3 className="font-bold text-lg mb-2">4. Identify Hidden Money Leaks</h3>
              <p className="text-sm">Small recurring charges hide in uncategorized noise. Categories expose them.</p>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-4 text-sm mt-3">
                <p className="font-bold mb-2">Real Example:</p>
                <p className="mb-2">You categorize 3 months of spending. "Subscriptions" category shows:</p>
                <ul className="space-y-1 text-xs list-disc list-inside">
                  <li>Netflix: KES 1,100/month ✅ (using it)</li>
                  <li>Spotify: KES 900/month ✅ (using it)</li>
                  <li>Gym: KES 3,500/month ❌ (went twice in 3 months)</li>
                  <li>LinkedIn Premium: KES 3,000/month ❌ (forgot about free trial)</li>
                  <li>Adobe Cloud: KES 5,000/month ⚠️ (only need Photography plan KES 1,200)</li>
                </ul>
                <p className="text-green-600 font-bold mt-3">Total leak found: KES 10,300/month = KES 123,600/year</p>
              </div>
            </div>

            <div className="card bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/10 dark:to-cyan-900/10 border-l-4 border-teal-500">
              <h3 className="font-bold text-lg mb-2">5. Make Smarter Financial Decisions</h3>
              <p className="text-sm">Every major decision requires category data.</p>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-4 text-sm mt-3 space-y-3">
                <div>
                  <p className="font-bold">Should I buy a car?</p>
                  <p className="text-xs text-[var(--text-muted)]">Check "Transport" category: Spending KES 12K on Uber monthly = KES 144K yearly. Car loan KES 2M @ 12% over 5 years = KES 44K/month (loan + fuel + insurance). NOT worth it. Keep using Uber and save KES 32K monthly difference.</p>
                </div>
                <div>
                  <p className="font-bold">Should I move closer to work?</p>
                  <p className="text-xs text-[var(--text-muted)]">Transport: KES 12K. Closer apartment costs KES 8K more in rent but saves KES 10K transport and 2 hours daily. Math says: Move.</p>
                </div>
                <div>
                  <p className="font-bold">Can I afford a side hustle?</p>
                  <p className="text-xs text-[var(--text-muted)]">Entertainment: KES 9K. Cut to KES 4K, redirect KES 5K to business capital. Build side income without loan.</p>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/10 dark:to-pink-900/10 border-l-4 border-rose-500">
              <h3 className="font-bold text-lg mb-2">6. Track Financial Goals with Precision</h3>
              <p className="text-sm mb-3">Goal: "Save more" fails. Goal: "Reduce restaurants from KES 10K to KES 6K" succeeds.</p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border border-[var(--border-subtle)] rounded-lg">
                  <thead className="bg-[var(--surface)]">
                    <tr>
                      <th className="px-3 py-2 text-left">Month</th>
                      <th className="px-3 py-2 text-right">Restaurant Spend</th>
                      <th className="px-3 py-2 text-right">Target</th>
                      <th className="px-3 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    <tr>
                      <td className="px-3 py-2">January</td>
                      <td className="px-3 py-2 text-right">KES 10,200</td>
                      <td className="px-3 py-2 text-right">KES 10,000</td>
                      <td className="px-3 py-2 text-amber-600">Baseline</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">February</td>
                      <td className="px-3 py-2 text-right">KES 8,500</td>
                      <td className="px-3 py-2 text-right">KES 9,000</td>
                      <td className="px-3 py-2 text-green-600">✅ Beat target</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">March</td>
                      <td className="px-3 py-2 text-right">KES 7,200</td>
                      <td className="px-3 py-2 text-right">KES 8,000</td>
                      <td className="px-3 py-2 text-green-600">✅ Beat target</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">April</td>
                      <td className="px-3 py-2 text-right">KES 6,100</td>
                      <td className="px-3 py-2 text-right">KES 7,000</td>
                      <td className="px-3 py-2 text-green-600">✅ Beat target</td>
                    </tr>
                    <tr className="bg-green-50 dark:bg-green-900/20 font-bold">
                      <td className="px-3 py-3">Savings (vs Jan):</td>
                      <td className="px-3 py-3 text-right text-green-600" colSpan={3}>KES 4,100/month = KES 49,200/year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 border-l-4 border-indigo-500">
              <h3 className="font-bold text-lg mb-2">7. Tax Deductions & Business Expense Tracking</h3>
              <p className="text-sm mb-3">For freelancers/business owners: Categories = legal tax savings.</p>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-4 text-sm">
                <p className="font-bold mb-2">Tax-Deductible Categories (Kenya):</p>
                <ul className="space-y-1 text-xs list-disc list-inside">
                  <li><strong>Home Office:</strong> 20% of rent if working from home (KES 5K on KES 25K rent)</li>
                  <li><strong>Internet/Phone:</strong> Business portion deductible (50% = KES 1,500/month)</li>
                  <li><strong>Transport:</strong> Client meetings, business travel (KES 8K/month)</li>
                  <li><strong>Equipment:</strong> Computer, software, tools (KES 5K/month depreciation)</li>
                  <li><strong>Professional Development:</strong> Courses, books, conferences (KES 3K/month)</li>
                </ul>
                <p className="text-green-600 font-bold mt-3">Monthly deductions: KES 22,500 = KES 270K yearly × 30% tax rate = KES 81,000 tax savings</p>
                <p className="text-xs text-red-600 mt-2">Without categories? You can't prove these expenses. KRA rejects, you pay full tax.</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Tags vs Categories: What's the Difference?</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-200 dark:border-blue-800">
              <h3 className="font-bold mb-3">📁 Categories (Broad Groups)</h3>
              <p className="text-sm mb-3">Primary classification. Every transaction has ONE category.</p>
              <div className="text-xs space-y-1">
                <p>✅ Food</p>
                <p>✅ Transport</p>
                <p>✅ Entertainment</p>
                <p>✅ Utilities</p>
                <p>✅ Healthcare</p>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-3 italic">Think: "What type of expense is this?"</p>
            </div>

            <div className="card bg-purple-50 dark:bg-purple-900/10 border-2 border-purple-200 dark:border-purple-800">
              <h3 className="font-bold mb-3">🏷️ Tags (Specific Attributes)</h3>
              <p className="text-sm mb-3">Additional labels. Transactions can have MULTIPLE tags.</p>
              <div className="text-xs space-y-1">
                <p>✅ #work-related</p>
                <p>✅ #tax-deductible</p>
                <p>✅ #urgent</p>
                <p>✅ #recurring</p>
                <p>✅ #shared-expense</p>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-3 italic">Think: "What special properties does this have?"</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-6 border-2 border-green-200 dark:border-green-800 mt-6">
            <h3 className="font-bold text-lg mb-3">Combined Power Example:</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-3">
                <p className="font-bold">Transaction: KES 2,500 - Uber to client meeting</p>
                <p className="text-xs mt-1"><strong>Category:</strong> Transport</p>
                <p className="text-xs"><strong>Tags:</strong> #work-related, #tax-deductible, #project-alpha</p>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Now you can answer: "How much do I spend on transport?" (category) AND "How much did Project Alpha cost?" (tag) AND "What can I deduct for taxes?" (tag). Multi-dimensional insights.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Essential Categories for Kenyans</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold mb-3 text-green-600">💰 Fixed Expenses</h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-bold">🏠</span>
                  <div>
                    <strong>Rent/Mortgage</strong>
                    <p className="text-xs text-[var(--text-muted)]">Housing costs</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">⚡</span>
                  <div>
                    <strong>Utilities</strong>
                    <p className="text-xs text-[var(--text-muted)]">KPLC, water, gas</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">📱</span>
                  <div>
                    <strong>Phone/Internet</strong>
                    <p className="text-xs text-[var(--text-muted)]">Safaricom, Airtel bundles</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">🔄</span>
                  <div>
                    <strong>Subscriptions</strong>
                    <p className="text-xs text-[var(--text-muted)]">Netflix, Spotify, gym</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">🏥</span>
                  <div>
                    <strong>Insurance</strong>
                    <p className="text-xs text-[var(--text-muted)]">Health, life, vehicle</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-3 text-blue-600">📊 Variable Expenses</h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-bold">🍔</span>
                  <div>
                    <strong>Food & Groceries</strong>
                    <p className="text-xs text-[var(--text-muted)]">Supermarkets, markets</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">🚗</span>
                  <div>
                    <strong>Transport</strong>
                    <p className="text-xs text-[var(--text-muted)]">Matatu, Uber, fuel</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">🎉</span>
                  <div>
                    <strong>Entertainment</strong>
                    <p className="text-xs text-[var(--text-muted)]">Movies, events, hobbies</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">🛒</span>
                  <div>
                    <strong>Shopping</strong>
                    <p className="text-xs text-[var(--text-muted)]">Clothes, gadgets, misc</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">💊</span>
                  <div>
                    <strong>Healthcare</strong>
                    <p className="text-xs text-[var(--text-muted)]">Doctor, pharmacy</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Powerful Tag Ideas</h2>

          <div className="grid md:grid-cols-3 gap-3 text-sm">
            <div className="card bg-purple-50 dark:bg-purple-900/10">
              <h3 className="font-bold mb-2">🏢 Business Tags</h3>
              <ul className="text-xs space-y-1 list-disc list-inside">
                <li>#work-related</li>
                <li>#tax-deductible</li>
                <li>#client-reimbursable</li>
                <li>#business-expense</li>
                <li>#professional-development</li>
              </ul>
            </div>

            <div className="card bg-blue-50 dark:bg-blue-900/10">
              <h3 className="font-bold mb-2">📅 Time Tags</h3>
              <ul className="text-xs space-y-1 list-disc list-inside">
                <li>#recurring</li>
                <li>#one-time</li>
                <li>#urgent</li>
                <li>#planned</li>
                <li>#unexpected</li>
              </ul>
            </div>

            <div className="card bg-green-50 dark:bg-green-900/10">
              <h3 className="font-bold mb-2">👥 Relationship Tags</h3>
              <ul className="text-xs space-y-1 list-disc list-inside">
                <li>#shared-expense</li>
                <li>#family</li>
                <li>#personal</li>
                <li>#gift</li>
                <li>#loan</li>
              </ul>
            </div>

            <div className="card bg-amber-50 dark:bg-amber-900/10">
              <h3 className="font-bold mb-2">🎯 Goal Tags</h3>
              <ul className="text-xs space-y-1 list-disc list-inside">
                <li>#savings-goal</li>
                <li>#debt-payment</li>
                <li>#emergency-fund</li>
                <li>#investment</li>
                <li>#vacation-fund</li>
              </ul>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10">
              <h3 className="font-bold mb-2">⚠️ Problem Tags</h3>
              <ul className="text-xs space-y-1 list-disc list-inside">
                <li>#impulse-buy</li>
                <li>#regret</li>
                <li>#wasteful</li>
                <li>#need-to-reduce</li>
                <li>#unnecessary</li>
              </ul>
            </div>

            <div className="card bg-teal-50 dark:bg-teal-900/10">
              <h3 className="font-bold mb-2">📍 Location Tags</h3>
              <ul className="text-xs space-y-1 list-disc list-inside">
                <li>#nairobi</li>
                <li>#mombasa</li>
                <li>#travel</li>
                <li>#home</li>
                <li>#office</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">How to Start (Even If You Have Years of Uncategorized Data)</h2>

          <div className="space-y-3">
            <div className="card bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border-l-4 border-blue-500">
              <h3 className="font-bold mb-2">Week 1: Set Up Core Categories</h3>
              <p className="text-sm">Create 8-12 essential categories. Don't overthink—start broad.</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Example: Food, Transport, Rent, Utilities, Entertainment, Shopping, Healthcare, Savings</p>
            </div>

            <div className="card bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-l-4 border-purple-500">
              <h3 className="font-bold mb-2">Week 2: Categorize Last 30 Days</h3>
              <p className="text-sm">Pull bank statements, M-Pesa messages. Spend 1 hour categorizing last month.</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Use "Uncategorized" for unclear items—you'll figure them out later.</p>
            </div>

            <div className="card bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-l-4 border-green-500">
              <h3 className="font-bold mb-2">Week 3-4: Categorize as You Spend</h3>
              <p className="text-sm">Every transaction gets categorized within 24 hours. Make it a habit.</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Set daily 5-minute reminder: "Categorize today's spending."</p>
            </div>

            <div className="card bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-l-4 border-amber-500">
              <h3 className="font-bold mb-2">Month 2: Add Tags</h3>
              <p className="text-sm">Once categories feel natural, introduce 5-10 key tags for deeper insights.</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Focus on tags that answer questions you have: "How much is work-related?" "What's tax-deductible?"</p>
            </div>

            <div className="card bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10 border-l-4 border-red-500">
              <h3 className="font-bold mb-2">Month 3+: Analyze & Optimize</h3>
              <p className="text-sm">Run monthly reports. Compare category spending month-over-month. Adjust budgets based on reality.</p>
              <p className="text-xs text-green-600 mt-1">Most people save 15-25% of income by Month 3 just from visibility.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Common Mistakes to Avoid</h2>

          <div className="space-y-3">
            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">❌ Too Many Categories</h3>
              <p className="text-sm">50 categories = analysis paralysis. You'll quit in week 2.</p>
              <p className="text-xs text-[var(--text-muted)] mt-1"><strong>Fix:</strong> Start with 8-12. Add more only when you consistently need them.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">❌ Vague Category Names</h3>
              <p className="text-sm">"Misc" or "Other" categories grow to 30% of spending. Useless.</p>
              <p className="text-xs text-[var(--text-muted)] mt-1"><strong>Fix:</strong> If "Misc" exceeds 10%, analyze and create specific categories.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">❌ Inconsistent Categorization</h3>
              <p className="text-sm">Sometimes "Carrefour" is Groceries, sometimes Shopping. Data becomes meaningless.</p>
              <p className="text-xs text-[var(--text-muted)] mt-1"><strong>Fix:</strong> Create categorization rules. "Carrefour food items = Groceries. Carrefour electronics = Shopping."</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">❌ Forgetting to Categorize</h3>
              <p className="text-sm">Batch-categorizing 100 transactions at month-end = you'll quit.</p>
              <p className="text-xs text-[var(--text-muted)] mt-1"><strong>Fix:</strong> Daily 5-minute habit. Categorize as you spend or next morning.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-6 my-8 border-2 border-green-200 dark:border-green-800">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span>🎯</span> The Bottom Line
            </h3>
            <p className="mb-3">
              Categorization and tagging transform financial chaos into clarity. Without them, you're flying blind—wondering where money goes, guessing at budgets, missing hidden leaks, and making uninformed decisions. With them, you have a financial dashboard showing exactly where every shilling flows, what's working, what's wasteful, and where to optimize.
            </p>
            <p className="mb-3">
              Start simple: 8-12 categories covering 90% of spending. Categorize transactions daily (5 minutes). After one month, patterns emerge. After three months, you're saving 15-25% just from awareness. Add tags when you need deeper insights. Make it a habit, not a project.
            </p>
            <p className="font-bold text-green-600 dark:text-green-400">
              The difference between broke and building wealth often isn't income—it's knowing where your money goes and having the power to redirect it intentionally. Categorization gives you that power.
            </p>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-6 mt-8">
            <h3 className="font-bold mb-3">Related Articles:</h3>
            <div className="space-y-2">
              <Link to="/blog/budgeting-50-30-20-rule" className="text-blue-600 hover:text-blue-700 block">
                → The 50/30/20 Budgeting Rule: A Simple Framework for Kenyans
              </Link>
              <Link to="/blog/zero-based-budgeting" className="text-blue-600 hover:text-blue-700 block">
                → Zero-Based Budgeting: Give Every Shilling a Job
              </Link>
              <Link to="/blog/monthly-budget-review" className="text-blue-600 hover:text-blue-700 block">
                → Why Monthly Budget Reviews Are Non-Negotiable
              </Link>
              <Link to="/blog/track-net-worth" className="text-blue-600 hover:text-blue-700 block">
                → How to Track Your Net Worth (And Why It Matters)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
