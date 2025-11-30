import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

export default function DiversifyAssets() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
        <HiArrowLeft /> Back to Articles
      </Link>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-3xl">
            🎯
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Wealth</div>
            <h1 className="text-3xl font-bold mt-1">Asset Diversification: Reducing Investment Risk</h1>
          </div>
        </div>
        
        <div className="text-sm text-[var(--text-muted)] mb-6">8 min read</div>

        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-lg leading-relaxed">
            "Don't put all your eggs in one basket" isn't just old wisdom—it's the foundation of smart investing. Asset diversification means spreading your investments across different types of assets to reduce risk. When one investment underperforms, others can balance it out, protecting your wealth and helping it grow steadily over time.
          </p>

          <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-6 border-l-4 border-red-500">
            <h3 className="font-bold text-lg mb-2 text-red-600 dark:text-red-400">The Risk of Concentration:</h3>
            <p className="text-sm mb-3">
              Imagine investing all your money in one company's stock. If that company fails, you lose everything. Or putting all savings in real estate just before prices crash. Diversification protects against these scenarios.
            </p>
            <p className="text-xs text-[var(--text-muted)] italic">
              "The only free lunch in investing is diversification." — Harry Markowitz, Nobel Prize Winner
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Understanding Asset Classes</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card bg-green-50 dark:bg-green-900/10">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span>💰</span> Cash & Cash Equivalents
              </h3>
              <p className="text-sm mb-2"><strong>Examples:</strong> Savings accounts, money market funds, Treasury bills</p>
              <p className="text-sm mb-2"><strong>Risk:</strong> Very Low</p>
              <p className="text-sm mb-2"><strong>Return:</strong> 3-8% annually</p>
              <p className="text-sm"><strong>Best for:</strong> Emergency funds, short-term goals</p>
            </div>

            <div className="card bg-blue-50 dark:bg-blue-900/10">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span>📈</span> Stocks/Equities
              </h3>
              <p className="text-sm mb-2"><strong>Examples:</strong> NSE shares, foreign stocks, equity funds</p>
              <p className="text-sm mb-2"><strong>Risk:</strong> High</p>
              <p className="text-sm mb-2"><strong>Return:</strong> 8-15%+ annually (long-term)</p>
              <p className="text-sm"><strong>Best for:</strong> Long-term growth, retirement</p>
            </div>

            <div className="card bg-purple-50 dark:bg-purple-900/10">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span>🏢</span> Bonds/Fixed Income
              </h3>
              <p className="text-sm mb-2"><strong>Examples:</strong> Government bonds, corporate bonds</p>
              <p className="text-sm mb-2"><strong>Risk:</strong> Low to Medium</p>
              <p className="text-sm mb-2"><strong>Return:</strong> 6-12% annually</p>
              <p className="text-sm"><strong>Best for:</strong> Stable income, capital preservation</p>
            </div>

            <div className="card bg-amber-50 dark:bg-amber-900/10">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span>🏠</span> Real Estate
              </h3>
              <p className="text-sm mb-2"><strong>Examples:</strong> Rental property, REITs, land</p>
              <p className="text-sm mb-2"><strong>Risk:</strong> Medium</p>
              <p className="text-sm mb-2"><strong>Return:</strong> 5-12% + rental income</p>
              <p className="text-sm"><strong>Best for:</strong> Tangible assets, passive income</p>
            </div>

            <div className="card bg-indigo-50 dark:bg-indigo-900/10">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span>🌾</span> Commodities/Alternative Assets
              </h3>
              <p className="text-sm mb-2"><strong>Examples:</strong> Gold, agricultural products, crypto</p>
              <p className="text-sm mb-2"><strong>Risk:</strong> Varies (Medium to Very High)</p>
              <p className="text-sm mb-2"><strong>Return:</strong> Highly variable</p>
              <p className="text-sm"><strong>Best for:</strong> Inflation hedge, portfolio spice</p>
            </div>

            <div className="card bg-cyan-50 dark:bg-cyan-900/10">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span>💼</span> Business/Entrepreneurship
              </h3>
              <p className="text-sm mb-2"><strong>Examples:</strong> Your own business, side hustles</p>
              <p className="text-sm mb-2"><strong>Risk:</strong> Very High</p>
              <p className="text-sm mb-2"><strong>Return:</strong> Unlimited potential</p>
              <p className="text-sm"><strong>Best for:</strong> Active income, building value</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Sample Diversified Portfolios</h2>

          <div className="space-y-6">
            <div className="card bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-2 border-green-200 dark:border-green-800">
              <h3 className="font-bold text-lg mb-3">🛡️ Conservative Portfolio (Low Risk)</h3>
              <p className="text-sm mb-4 text-[var(--text-muted)]">For those nearing retirement or risk-averse investors</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Cash & Money Markets</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{width: '30%'}}></div>
                    </div>
                    <span className="font-semibold w-12 text-right">30%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Bonds/Fixed Income</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{width: '40%'}}></div>
                    </div>
                    <span className="font-semibold w-12 text-right">40%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Stocks/Equities</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{width: '20%'}}></div>
                    </div>
                    <span className="font-semibold w-12 text-right">20%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Real Estate/Other</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{width: '10%'}}></div>
                    </div>
                    <span className="font-semibold w-12 text-right">10%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-2 border-blue-200 dark:border-blue-800">
              <h3 className="font-bold text-lg mb-3">⚖️ Balanced Portfolio (Medium Risk)</h3>
              <p className="text-sm mb-4 text-[var(--text-muted)]">For mid-career professionals building wealth</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Cash & Money Markets</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{width: '15%'}}></div>
                    </div>
                    <span className="font-semibold w-12 text-right">15%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Bonds/Fixed Income</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{width: '25%'}}></div>
                    </div>
                    <span className="font-semibold w-12 text-right">25%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Stocks/Equities</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{width: '40%'}}></div>
                    </div>
                    <span className="font-semibold w-12 text-right">40%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Real Estate/Other</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{width: '20%'}}></div>
                    </div>
                    <span className="font-semibold w-12 text-right">20%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-2 border-purple-200 dark:border-purple-800">
              <h3 className="font-bold text-lg mb-3">🚀 Aggressive Portfolio (High Risk)</h3>
              <p className="text-sm mb-4 text-[var(--text-muted)]">For young investors with long time horizons</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Cash & Money Markets</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{width: '5%'}}></div>
                    </div>
                    <span className="font-semibold w-12 text-right">5%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Bonds/Fixed Income</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{width: '10%'}}></div>
                    </div>
                    <span className="font-semibold w-12 text-right">10%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Stocks/Equities</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{width: '65%'}}></div>
                    </div>
                    <span className="font-semibold w-12 text-right">65%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Real Estate/Alternative</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{width: '20%'}}></div>
                    </div>
                    <span className="font-semibold w-12 text-right">20%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Practical Diversification for Kenyans</h2>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
            <h3 className="font-bold text-lg mb-4">Building Your First Diversified Portfolio (KES 100,000)</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-blue-300 dark:border-blue-700">
                    <th className="px-4 py-3 text-left">Asset Class</th>
                    <th className="px-4 py-3 text-left">Investment Vehicle</th>
                    <th className="px-4 py-3 text-right">Amount (KES)</th>
                    <th className="px-4 py-3 text-right">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  <tr className="hover:bg-white/50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3">Cash</td>
                    <td className="px-4 py-3">Money Market Fund</td>
                    <td className="px-4 py-3 text-right font-semibold">20,000</td>
                    <td className="px-4 py-3 text-right">20%</td>
                  </tr>
                  <tr className="hover:bg-white/50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3">Bonds</td>
                    <td className="px-4 py-3">M-Akiba or Bond Fund</td>
                    <td className="px-4 py-3 text-right font-semibold">25,000</td>
                    <td className="px-4 py-3 text-right">25%</td>
                  </tr>
                  <tr className="hover:bg-white/50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3">Stocks</td>
                    <td className="px-4 py-3">NSE Shares or Equity Fund</td>
                    <td className="px-4 py-3 text-right font-semibold">35,000</td>
                    <td className="px-4 py-3 text-right">35%</td>
                  </tr>
                  <tr className="hover:bg-white/50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3">SACCO</td>
                    <td className="px-4 py-3">SACCO Savings/Shares</td>
                    <td className="px-4 py-3 text-right font-semibold">15,000</td>
                    <td className="px-4 py-3 text-right">15%</td>
                  </tr>
                  <tr className="hover:bg-white/50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3">Alternative</td>
                    <td className="px-4 py-3">Side Business Seed Capital</td>
                    <td className="px-4 py-3 text-right font-semibold">5,000</td>
                    <td className="px-4 py-3 text-right">5%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Diversification Strategies</h2>

          <div className="space-y-4">
            <div className="card border-l-4 border-blue-500">
              <h3 className="font-bold mb-2">🌍 Geographic Diversification</h3>
              <p className="text-sm">Don't invest only in Kenya. Consider international funds to protect against local economic downturns.</p>
            </div>

            <div className="card border-l-4 border-green-500">
              <h3 className="font-bold mb-2">🏭 Sector Diversification</h3>
              <p className="text-sm">Spread investments across industries: banking, telecom, manufacturing, agriculture, technology, etc.</p>
            </div>

            <div className="card border-l-4 border-purple-500">
              <h3 className="font-bold mb-2">⏰ Time Diversification</h3>
              <p className="text-sm">Use dollar-cost averaging: invest fixed amounts regularly rather than lump sums. Smooths out market volatility.</p>
            </div>

            <div className="card border-l-4 border-amber-500">
              <h3 className="font-bold mb-2">💼 Investment Vehicle Diversification</h3>
              <p className="text-sm">Mix individual stocks, mutual funds, ETFs, SACCOs, bonds, and real estate for different risk/return profiles.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Common Diversification Mistakes</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card bg-red-50 dark:bg-red-900/10">
              <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">❌ Over-Diversification</h3>
              <p className="text-sm">Owning 50+ different stocks dilutes returns and makes tracking impossible. Sweet spot: 15-25 holdings.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10">
              <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">❌ False Diversification</h3>
              <p className="text-sm">Owning 5 tech stocks isn't diversified—it's concentrated in one sector. Spread across industries.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10">
              <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">❌ Ignoring Correlation</h3>
              <p className="text-sm">Some assets move together. Banks and real estate both suffer in recessions. Choose uncorrelated assets.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10">
              <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">❌ Set and Forget</h3>
              <p className="text-sm">Diversification needs rebalancing. Review annually and adjust allocations back to target percentages.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">When to Rebalance</h2>

          <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-6 border-l-4 border-amber-500">
            <h3 className="font-bold mb-3">Rebalancing Triggers:</h3>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li><strong>Time-based:</strong> Review every 6-12 months regardless of performance</li>
              <li><strong>Threshold-based:</strong> When any asset class drifts 5-10% from target</li>
              <li><strong>Life events:</strong> Marriage, children, career change, nearing retirement</li>
              <li><strong>Market extremes:</strong> After major rallies or crashes that shift allocations</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-6 my-8 border-2 border-green-200 dark:border-green-800">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span>🎯</span> The Bottom Line
            </h3>
            <p>
              Diversification is your best defense against financial disasters and your strongest ally in building wealth. Don't chase the hottest stock or trend—build a balanced portfolio that can weather any storm. Start small, diversify gradually, and remember: it's not about avoiding all risk, it's about managing it intelligently. Your future self will thank you for spreading your investments wisely today.
            </p>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-6 mt-8">
            <h3 className="font-bold mb-3">Related Articles:</h3>
            <div className="space-y-2">
              <Link to="/blog/track-net-worth" className="text-blue-600 hover:text-blue-700 block">
                → How to Track Your Net Worth Effectively
              </Link>
              <Link to="/blog/appreciating-assets" className="text-blue-600 hover:text-blue-700 block">
                → Appreciating vs Depreciating Assets: Know the Difference
              </Link>
              <Link to="/blog/reduce-liabilities" className="text-blue-600 hover:text-blue-700 block">
                → Smart Strategies to Reduce Debt and Liabilities
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
