import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

export default function ReduceLiabilities() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
        <HiArrowLeft /> Back to Articles
      </Link>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-3xl">
            ⚖️
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Wealth</div>
            <h1 className="text-3xl font-bold mt-1">Smart Strategies to Reduce Debt and Liabilities</h1>
          </div>
        </div>
        
        <div className="text-sm text-[var(--text-muted)] mb-6">7 min read</div>

        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-lg leading-relaxed">
            Debt isn't inherently evil, but bad debt is financial poison that slowly drains your wealth. Every shilling you pay in interest is a shilling that can't work for you through savings or investments. The good news? With the right strategies, you can systematically eliminate debt, boost your net worth, and free up cash for wealth-building. Let's explore proven methods to reduce liabilities and break free from the debt trap.
          </p>

          <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-6 border-l-4 border-red-500">
            <h3 className="font-bold text-lg mb-2 text-red-600 dark:text-red-400">The True Cost of Debt</h3>
            <p className="text-sm mb-3">
              A KES 500,000 loan at 18% interest over 5 years costs you KES 254,760 in interest alone. That's more than half the principal! Imagine investing that quarter-million instead—it could grow to over KES 400,000 in the same timeframe.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Good Debt vs Bad Debt</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card bg-green-50 dark:bg-green-900/10">
              <h3 className="font-bold text-green-600 dark:text-green-400 mb-3">✅ Good Debt</h3>
              <p className="text-sm mb-3">Debt that builds assets or increases earning potential:</p>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li><strong>Mortgage:</strong> Builds home equity, appreciates over time</li>
                <li><strong>Business loan:</strong> Generates income, tax-deductible interest</li>
                <li><strong>Education loan:</strong> Increases career earnings (if strategic)</li>
                <li><strong>Investment property:</strong> Rental income covers payments</li>
              </ul>
              <p className="text-xs text-[var(--text-muted)] mt-3 italic">Key: The asset value exceeds the debt cost</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10">
              <h3 className="font-bold text-red-600 dark:text-red-400 mb-3">❌ Bad Debt</h3>
              <p className="text-sm mb-3">Debt for consumption or depreciating assets:</p>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li><strong>Car loans:</strong> Vehicle loses 20% value yearly</li>
                <li><strong>Credit cards:</strong> 20-30% interest on consumables</li>
                <li><strong>Mobile loans:</strong> Convenience fees compound quickly</li>
                <li><strong>Payday loans:</strong> Predatory rates trap borrowers</li>
                <li><strong>Lifestyle debt:</strong> Vacations, gadgets, clothes</li>
              </ul>
              <p className="text-xs text-[var(--text-muted)] mt-3 italic">Key: No asset, just monthly payments</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Debt Elimination Strategies</h2>

          <div className="space-y-4">
            <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-2 border-blue-200 dark:border-blue-800">
              <h3 className="font-bold text-lg mb-3">❄️ The Debt Snowball Method</h3>
              <p className="text-sm mb-3"><strong>Strategy:</strong> Pay off smallest debts first for psychological wins</p>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-4 text-sm">
                <p className="font-semibold mb-2">How it works:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>List all debts from smallest to largest balance</li>
                  <li>Pay minimum on everything except the smallest</li>
                  <li>Throw extra money at the smallest debt</li>
                  <li>When paid off, roll that payment to next smallest</li>
                  <li>Repeat until debt-free</li>
                </ol>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-3"><strong>Best for:</strong> People who need motivation and quick wins</p>
            </div>

            <div className="card bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-2 border-purple-200 dark:border-purple-800">
              <h3 className="font-bold text-lg mb-3">🏔️ The Debt Avalanche Method</h3>
              <p className="text-sm mb-3"><strong>Strategy:</strong> Target highest interest rates first to save maximum money</p>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-4 text-sm">
                <p className="font-semibold mb-2">How it works:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>List all debts from highest to lowest interest rate</li>
                  <li>Pay minimum on everything except highest rate</li>
                  <li>Attack the highest interest debt aggressively</li>
                  <li>When paid off, move to next highest rate</li>
                  <li>Continue until all debt eliminated</li>
                </ol>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-3"><strong>Best for:</strong> Mathematically optimal, saves most money long-term</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Debt Payoff Example: Both Methods</h2>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <p className="font-semibold mb-3">Your Debts:</p>
            <table className="min-w-full text-sm mb-4">
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-gray-700">
                  <th className="px-4 py-2 text-left">Debt</th>
                  <th className="px-4 py-2 text-right">Balance</th>
                  <th className="px-4 py-2 text-right">Interest</th>
                  <th className="px-4 py-2 text-right">Minimum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr>
                  <td className="px-4 py-2">Credit Card</td>
                  <td className="px-4 py-2 text-right">KES 80,000</td>
                  <td className="px-4 py-2 text-right">24%</td>
                  <td className="px-4 py-2 text-right">KES 3,000</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Personal Loan</td>
                  <td className="px-4 py-2 text-right">KES 200,000</td>
                  <td className="px-4 py-2 text-right">16%</td>
                  <td className="px-4 py-2 text-right">KES 6,000</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Car Loan</td>
                  <td className="px-4 py-2 text-right">KES 500,000</td>
                  <td className="px-4 py-2 text-right">14%</td>
                  <td className="px-4 py-2 text-right">KES 12,000</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">M-Shwari</td>
                  <td className="px-4 py-2 text-right">KES 20,000</td>
                  <td className="px-4 py-2 text-right">7.5%</td>
                  <td className="px-4 py-2 text-right">KES 1,500</td>
                </tr>
              </tbody>
            </table>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-4">
                <h4 className="font-bold mb-2">🌨️ Snowball Order:</h4>
                <ol className="text-sm list-decimal list-inside space-y-1">
                  <li>M-Shwari (KES 20K) ← Start</li>
                  <li>Credit Card (KES 80K)</li>
                  <li>Personal Loan (KES 200K)</li>
                  <li>Car Loan (KES 500K)</li>
                </ol>
                <p className="text-xs text-[var(--text-muted)] mt-2">Quick wins, more motivation</p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded p-4">
                <h4 className="font-bold mb-2">⛰️ Avalanche Order:</h4>
                <ol className="text-sm list-decimal list-inside space-y-1">
                  <li>Credit Card (24%) ← Start</li>
                  <li>Personal Loan (16%)</li>
                  <li>Car Loan (14%)</li>
                  <li>M-Shwari (7.5%)</li>
                </ol>
                <p className="text-xs text-[var(--text-muted)] mt-2">Saves most on interest</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">10 Tactical Ways to Accelerate Debt Payoff</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card border-l-4 border-blue-500">
              <h3 className="font-bold mb-2">1. 💰 Increase Income</h3>
              <p className="text-sm">Side hustle, freelancing, overtime—every extra shilling to debt accelerates freedom.</p>
            </div>

            <div className="card border-l-4 border-green-500">
              <h3 className="font-bold mb-2">2. ✂️ Cut Expenses</h3>
              <p className="text-sm">Cancel subscriptions, cook at home, delay upgrades. Redirect savings to debt.</p>
            </div>

            <div className="card border-l-4 border-purple-500">
              <h3 className="font-bold mb-2">3. 🔄 Debt Consolidation</h3>
              <p className="text-sm">Combine multiple debts into one lower-rate loan. Simplifies payments, reduces interest.</p>
            </div>

            <div className="card border-l-4 border-amber-500">
              <h3 className="font-bold mb-2">4. 📞 Negotiate Rates</h3>
              <p className="text-sm">Call lenders and request lower rates. You'd be surprised how often they agree.</p>
            </div>

            <div className="card border-l-4 border-red-500">
              <h3 className="font-bold mb-2">5. 🎁 Windfall Application</h3>
              <p className="text-sm">Bonuses, tax refunds, gifts—apply 100% to debt instead of splurging.</p>
            </div>

            <div className="card border-l-4 border-indigo-500">
              <h3 className="font-bold mb-2">6. 📆 Biweekly Payments</h3>
              <p className="text-sm">Pay half your monthly amount every 2 weeks. Makes 13 payments yearly instead of 12.</p>
            </div>

            <div className="card border-l-4 border-cyan-500">
              <h3 className="font-bold mb-2">7. 🏪 Sell Unused Items</h3>
              <p className="text-sm">Declutter and sell on OLX, Jiji, Facebook. Turn junk into debt payments.</p>
            </div>

            <div className="card border-l-4 border-pink-500">
              <h3 className="font-bold mb-2">8. ⏸️ Pause Investing Briefly</h3>
              <p className="text-sm">High-interest debt ({'>'}15%) should be paid before investing. Free up that cash.</p>
            </div>

            <div className="card border-l-4 border-teal-500">
              <h3 className="font-bold mb-2">9. 🚫 No New Debt</h3>
              <p className="text-sm">Cut up credit cards, delete loan apps, close store credit. Break the cycle.</p>
            </div>

            <div className="card border-l-4 border-orange-500">
              <h3 className="font-bold mb-2">10. 👥 Accountability Partner</h3>
              <p className="text-sm">Share goals with trusted friend. Regular check-ins keep you committed.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">When NOT to Pay Off Debt Aggressively</h2>

          <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-6 border-l-4 border-amber-500">
            <p className="text-sm mb-3">Sometimes, attacking debt isn't the best move:</p>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li><strong>No emergency fund:</strong> Build KES 50-100K buffer first to avoid new debt during crises</li>
              <li><strong>Employer 401k match:</strong> If your company matches pension contributions, contribute enough to get the match—it's free money</li>
              <li><strong>Very low interest rate:</strong> If mortgage is 8% but investments return 12%, invest extra money instead</li>
              <li><strong>Student loans with forgiveness:</strong> Some programs forgive debt after years of payments—don't overpay</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Sample Debt Payoff Timeline</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-[var(--border-subtle)] rounded-lg text-sm">
              <thead className="bg-[var(--surface)]">
                <tr>
                  <th className="px-4 py-3 text-left">Month</th>
                  <th className="px-4 py-3 text-left">Action</th>
                  <th className="px-4 py-3 text-right">Debt Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr>
                  <td className="px-4 py-3">Month 0</td>
                  <td className="px-4 py-3">Starting debt total</td>
                  <td className="px-4 py-3 text-right font-semibold text-red-600">KES 800,000</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Month 1-3</td>
                  <td className="px-4 py-3">Pay off M-Shwari (KES 20K)</td>
                  <td className="px-4 py-3 text-right">KES 780,000</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Month 4-9</td>
                  <td className="px-4 py-3">Pay off Credit Card (KES 80K)</td>
                  <td className="px-4 py-3 text-right">KES 700,000</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Month 10-18</td>
                  <td className="px-4 py-3">Pay off Personal Loan (KES 200K)</td>
                  <td className="px-4 py-3 text-right">KES 500,000</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">Month 19-36</td>
                  <td className="px-4 py-3">Pay off Car Loan (KES 500K)</td>
                  <td className="px-4 py-3 text-right font-semibold text-green-600">KES 0</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-[var(--text-muted)] mt-2">*Assumes KES 30,000/month extra payment after minimums</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Avoiding Future Debt</h2>

          <div className="space-y-3">
            <div className="card bg-green-50 dark:bg-green-900/10">
              <h3 className="font-bold mb-2">✅ Build Emergency Fund</h3>
              <p className="text-sm">KES 100-300K cushion prevents borrowing during car repairs, medical bills, job loss.</p>
            </div>

            <div className="card bg-blue-50 dark:bg-blue-900/10">
              <h3 className="font-bold mb-2">✅ Live Below Your Means</h3>
              <p className="text-sm">If you can't afford it in cash, you can't afford it. Budget wants vs needs ruthlessly.</p>
            </div>

            <div className="card bg-purple-50 dark:bg-purple-900/10">
              <h3 className="font-bold mb-2">✅ Delay Gratification</h3>
              <p className="text-sm">Save first, buy later. Avoid lifestyle inflation when income rises.</p>
            </div>

            <div className="card bg-amber-50 dark:bg-amber-900/10">
              <h3 className="font-bold mb-2">✅ Use Cash for Discretionary Spending</h3>
              <p className="text-sm">Physical cash makes spending real. Harder to overspend than swiping cards.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-6 my-8 border-2 border-green-200 dark:border-green-800">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span>🎯</span> The Bottom Line
            </h3>
            <p>
              Debt reduction is the fastest way to boost your net worth and free up cash for wealth-building. Choose snowball for motivation or avalanche for math optimization—either beats doing nothing. Attack high-interest debt aggressively, negotiate better rates, and channel windfalls to balances. Once debt-free, redirect those payments to investments and watch your wealth compound. Freedom from debt isn't just financial—it's psychological liberation that opens doors you didn't know existed.
            </p>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-6 mt-8">
            <h3 className="font-bold mb-3">Related Articles:</h3>
            <div className="space-y-2">
              <Link to="/blog/track-net-worth" className="text-blue-600 hover:text-blue-700 block">
                → How to Track Your Net Worth Effectively
              </Link>
              <Link to="/blog/diversify-assets" className="text-blue-600 hover:text-blue-700 block">
                → Asset Diversification: Reducing Investment Risk
              </Link>
              <Link to="/blog/emergency-fund-guide" className="text-blue-600 hover:text-blue-700 block">
                → Building Your Emergency Fund: A Complete Guide
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
