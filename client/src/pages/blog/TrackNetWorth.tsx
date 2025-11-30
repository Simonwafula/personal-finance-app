import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

export default function TrackNetWorth() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
        <HiArrowLeft /> Back to Articles
      </Link>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-3xl">
            📈
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Wealth</div>
            <h1 className="text-3xl font-bold mt-1">How to Track Your Net Worth Effectively</h1>
          </div>
        </div>
        
        <div className="text-sm text-[var(--text-muted)] mb-6">5 min read</div>

        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-lg leading-relaxed">
            Your net worth is the ultimate scorecard of your financial health. It's a simple but powerful number that tells you if you're building wealth or just treading water. Unlike income (which only shows what you earn) or bank balance (which fluctuates daily), net worth reveals your true financial position and progress over time.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="font-bold text-lg mb-2">The Net Worth Formula</h3>
            <p className="text-2xl font-mono text-center my-4">Assets - Liabilities = Net Worth</p>
            <p className="text-sm text-[var(--text-muted)]">
              Everything you own (assets) minus everything you owe (liabilities) equals your net worth. It's that simple.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Why Net Worth Matters More Than Income</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card bg-green-50 dark:bg-green-900/10">
              <h3 className="font-bold mb-2">Person A: High Income, Low Net Worth</h3>
              <p className="text-sm mb-3">Earns KES 200,000/month but:</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Lives paycheck to paycheck</li>
                <li>Has KES 2M in car loans</li>
                <li>Rents expensive apartment</li>
                <li>No savings or investments</li>
              </ul>
              <p className="text-sm font-semibold mt-3 text-red-600">Net Worth: -KES 1.5M</p>
            </div>

            <div className="card bg-blue-50 dark:bg-blue-900/10">
              <h3 className="font-bold mb-2">Person B: Moderate Income, High Net Worth</h3>
              <p className="text-sm mb-3">Earns KES 80,000/month but:</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Saves 30% consistently</li>
                <li>Owns land worth KES 1.5M</li>
                <li>Has KES 800K in investments</li>
                <li>No debt</li>
              </ul>
              <p className="text-sm font-semibold mt-3 text-green-600">Net Worth: +KES 2.3M</p>
            </div>
          </div>

          <p className="text-center text-sm text-[var(--text-muted)] italic">
            Person B is wealthier despite earning less than half of Person A's income!
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">What to Include in Your Calculation</h2>

          <div className="space-y-4">
            <div className="card bg-green-50 dark:bg-green-900/10">
              <h3 className="font-bold text-lg mb-3 text-green-600 dark:text-green-400">✅ ASSETS (What You Own)</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong className="block mb-1">Liquid Assets:</strong>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Cash in banks</li>
                    <li>Money market funds</li>
                    <li>Savings accounts</li>
                    <li>Emergency fund</li>
                  </ul>
                </div>
                <div>
                  <strong className="block mb-1">Investments:</strong>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Stocks/shares</li>
                    <li>Bonds</li>
                    <li>Mutual funds</li>
                    <li>SACCO shares</li>
                    <li>Retirement accounts (NSSF, pension)</li>
                  </ul>
                </div>
                <div>
                  <strong className="block mb-1">Property:</strong>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Real estate (current market value)</li>
                    <li>Land</li>
                    <li>Rental properties</li>
                  </ul>
                </div>
                <div>
                  <strong className="block mb-1">Personal Property:</strong>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Vehicles (current value)</li>
                    <li>Valuable jewelry</li>
                    <li>Business ownership</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10">
              <h3 className="font-bold text-lg mb-3 text-red-600 dark:text-red-400">❌ LIABILITIES (What You Owe)</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong className="block mb-1">Loans:</strong>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Mortgage balance</li>
                    <li>Car loans</li>
                    <li>Personal loans</li>
                    <li>Student loans</li>
                    <li>Mobile loans (M-Shwari, etc.)</li>
                  </ul>
                </div>
                <div>
                  <strong className="block mb-1">Credit:</strong>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Credit card balances</li>
                    <li>Store credit</li>
                    <li>Buy-now-pay-later balances</li>
                    <li>Money owed to friends/family</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Sample Net Worth Calculation</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-[var(--border-subtle)] rounded-lg text-sm">
              <thead className="bg-green-50 dark:bg-green-900/20">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold" colSpan={2}>ASSETS</th>
                  <th className="px-4 py-3 text-right font-semibold">Amount (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3" colSpan={2}>Bank Accounts</td>
                  <td className="px-4 py-3 text-right">150,000</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3" colSpan={2}>Money Market Fund</td>
                  <td className="px-4 py-3 text-right">300,000</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3" colSpan={2}>SACCO Savings</td>
                  <td className="px-4 py-3 text-right">500,000</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3" colSpan={2}>NSE Stocks</td>
                  <td className="px-4 py-3 text-right">250,000</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3" colSpan={2}>Land (Market Value)</td>
                  <td className="px-4 py-3 text-right">2,000,000</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3" colSpan={2}>Vehicle</td>
                  <td className="px-4 py-3 text-right">800,000</td>
                </tr>
                <tr className="bg-green-50 dark:bg-green-900/20 font-bold">
                  <td className="px-4 py-4" colSpan={2}>TOTAL ASSETS</td>
                  <td className="px-4 py-4 text-right text-green-600">4,000,000</td>
                </tr>
              </tbody>
            </table>

            <table className="min-w-full border border-[var(--border-subtle)] rounded-lg mt-4 text-sm">
              <thead className="bg-red-50 dark:bg-red-900/20">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold" colSpan={2}>LIABILITIES</th>
                  <th className="px-4 py-3 text-right font-semibold">Amount (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3" colSpan={2}>Car Loan Balance</td>
                  <td className="px-4 py-3 text-right">400,000</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3" colSpan={2}>Personal Loan</td>
                  <td className="px-4 py-3 text-right">150,000</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3" colSpan={2}>Credit Card</td>
                  <td className="px-4 py-3 text-right">50,000</td>
                </tr>
                <tr className="bg-red-50 dark:bg-red-900/20 font-bold">
                  <td className="px-4 py-4" colSpan={2}>TOTAL LIABILITIES</td>
                  <td className="px-4 py-4 text-right text-red-600">600,000</td>
                </tr>
              </tbody>
            </table>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg p-6 mt-4 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">NET WORTH:</span>
                <span className="text-3xl font-bold text-green-600">KES 3,400,000</span>
              </div>
              <p className="text-sm text-[var(--text-muted)] mt-2">Assets (4M) - Liabilities (600K) = Net Worth (3.4M)</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">How Often to Track</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="card bg-green-50 dark:bg-green-900/10 text-center">
              <h3 className="font-bold mb-2">✅ Monthly</h3>
              <p className="text-sm">Best for high engagement and catching trends early. Ideal if you're actively paying off debt.</p>
            </div>

            <div className="card bg-blue-50 dark:bg-blue-900/10 text-center">
              <h3 className="font-bold mb-2">✅ Quarterly</h3>
              <p className="text-sm">Good balance—frequent enough to stay on track without obsessing over small fluctuations.</p>
            </div>

            <div className="card bg-purple-50 dark:bg-purple-900/10 text-center">
              <h3 className="font-bold mb-2">⚠️ Annually</h3>
              <p className="text-sm">Minimum frequency. Risk missing problems for too long. Good for busy professionals.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Using Net Worth to Set Goals</h2>

          <div className="space-y-4">
            <div className="card border-l-4 border-green-500">
              <h3 className="font-bold mb-2">Goal: Reach KES 1 Million Net Worth in 2 Years</h3>
              <p className="text-sm mb-2"><strong>Current:</strong> KES 400,000</p>
              <p className="text-sm mb-2"><strong>Target:</strong> KES 1,000,000</p>
              <p className="text-sm mb-2"><strong>Gap:</strong> KES 600,000</p>
              <p className="text-sm"><strong>Required Monthly Increase:</strong> KES 25,000 (save or pay off debt)</p>
            </div>

            <div className="card border-l-4 border-blue-500">
              <h3 className="font-bold mb-2">Goal: Increase Net Worth by 20% This Year</h3>
              <p className="text-sm mb-2"><strong>Current:</strong> KES 2,500,000</p>
              <p className="text-sm mb-2"><strong>Target:</strong> KES 3,000,000</p>
              <p className="text-sm"><strong>Strategy:</strong> Save KES 300K + Invest KES 200K growth = +KES 500K</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Common Net Worth Mistakes</h2>

          <div className="space-y-3">
            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <strong className="text-red-600 dark:text-red-400">❌ Overvaluing Assets</strong>
              <p className="text-sm mt-1">Use realistic market values, not what you paid or hope to sell for. Your car is worth what someone will pay TODAY.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <strong className="text-red-600 dark:text-red-400">❌ Forgetting Hidden Debts</strong>
              <p className="text-sm mt-1">Include ALL debts: family loans, mobile loans, chamas you owe, everything.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <strong className="text-red-600 dark:text-red-400">❌ Including Non-Liquid Items</strong>
              <p className="text-sm mt-1">Don't count furniture, clothes, or electronics unless truly valuable. They're worth almost nothing if you need to sell.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <strong className="text-red-600 dark:text-red-400">❌ Comparing to Others</strong>
              <p className="text-sm mt-1">Net worth varies by age, location, and life stage. Compare yourself to YOUR past self only.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Net Worth by Age Benchmarks (Kenya)</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-[var(--border-subtle)] rounded-lg text-sm">
              <thead className="bg-[var(--surface)]">
                <tr>
                  <th className="px-4 py-3 text-left">Age Range</th>
                  <th className="px-4 py-3 text-right">Starter Goal</th>
                  <th className="px-4 py-3 text-right">Good Target</th>
                  <th className="px-4 py-3 text-right">Excellent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">25-30 years</td>
                  <td className="px-4 py-3 text-right">KES 200K</td>
                  <td className="px-4 py-3 text-right">KES 500K</td>
                  <td className="px-4 py-3 text-right">KES 1M+</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">30-35 years</td>
                  <td className="px-4 py-3 text-right">KES 500K</td>
                  <td className="px-4 py-3 text-right">KES 1.5M</td>
                  <td className="px-4 py-3 text-right">KES 3M+</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">35-40 years</td>
                  <td className="px-4 py-3 text-right">KES 1M</td>
                  <td className="px-4 py-3 text-right">KES 3M</td>
                  <td className="px-4 py-3 text-right">KES 6M+</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">40-50 years</td>
                  <td className="px-4 py-3 text-right">KES 2M</td>
                  <td className="px-4 py-3 text-right">KES 5M</td>
                  <td className="px-4 py-3 text-right">KES 10M+</td>
                </tr>
                <tr className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">50-60 years</td>
                  <td className="px-4 py-3 text-right">KES 4M</td>
                  <td className="px-4 py-3 text-right">KES 10M</td>
                  <td className="px-4 py-3 text-right">KES 20M+</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[var(--text-muted)] italic mt-2">*These are rough guidelines. Your personal goals matter more than benchmarks!</p>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-6 my-8 border-2 border-green-200 dark:border-green-800">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span>🎯</span> The Bottom Line
            </h3>
            <p>
              Tracking your net worth transforms vague financial anxieties into concrete numbers you can improve. It shows whether you're truly building wealth or just earning and spending. Calculate yours today, set a target for next year, and check progress quarterly. Remember: Net worth growth comes from two levers—increase assets or decrease liabilities. Pull both levers consistently, and watch your wealth compound over time.
            </p>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-6 mt-8">
            <h3 className="font-bold mb-3">Related Articles:</h3>
            <div className="space-y-2">
              <Link to="/blog/diversify-assets" className="text-blue-600 hover:text-blue-700 block">
                → Asset Diversification: Reducing Investment Risk
              </Link>
              <Link to="/blog/reduce-liabilities" className="text-blue-600 hover:text-blue-700 block">
                → Smart Strategies to Reduce Debt and Liabilities
              </Link>
              <Link to="/blog/appreciating-assets" className="text-blue-600 hover:text-blue-700 block">
                → Appreciating vs Depreciating Assets: Know the Difference
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
