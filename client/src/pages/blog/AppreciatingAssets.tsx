import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

export default function AppreciatingAssets() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
        <HiArrowLeft /> Back to Articles
      </Link>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-3xl">
            📊
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Wealth</div>
            <h1 className="text-3xl font-bold mt-1">Appreciating vs Depreciating Assets: Know the Difference</h1>
          </div>
        </div>
        
        <div className="text-sm text-[var(--text-muted)] mb-6">6 min read</div>

        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-lg leading-relaxed">
            The difference between wealth and poverty often comes down to one simple principle: wealthy people accumulate assets that increase in value over time (appreciating assets), while struggling people accumulate things that lose value (depreciating assets). Understanding this distinction is foundational to building lasting wealth. Let's break down what makes an asset appreciate or depreciate, and how to structure your portfolio for maximum growth.
          </p>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 rounded-lg p-6 border-2 border-green-200 dark:border-green-800">
            <h3 className="font-bold text-lg mb-2">The Core Concept</h3>
            <div className="grid md:grid-cols-2 gap-4 mt-3">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-4">
                <h4 className="font-bold text-green-600 dark:text-green-400 mb-2">📈 Appreciating Asset</h4>
                <p className="text-sm">Increases in value over time, building your net worth while you own it.</p>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-4">
                <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">📉 Depreciating Asset</h4>
                <p className="text-sm">Decreases in value over time, costing you money from the moment you buy it.</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Common Appreciating Assets</h2>

          <div className="space-y-4">
            <div className="card bg-green-50 dark:bg-green-900/10 border-l-4 border-green-500">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <span>🏠</span> Real Estate
              </h3>
              <p className="text-sm mb-2"><strong>Why it appreciates:</strong> Limited land supply, population growth, inflation, development.</p>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Examples:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Land in growing areas</li>
                    <li>Residential property</li>
                    <li>Commercial buildings</li>
                    <li>Rental apartments</li>
                  </ul>
                </div>
                <div>
                  <strong>Typical appreciation:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>5-12% annually in Kenya</li>
                    <li>Prime locations: 10-20%+</li>
                    <li>Plus rental income: 5-8%</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <span>📈</span> Stocks & Equities
              </h3>
              <p className="text-sm mb-2"><strong>Why they appreciate:</strong> Company growth, profits, dividends, economic expansion.</p>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Examples:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>NSE listed companies</li>
                    <li>Foreign stocks (S&P 500)</li>
                    <li>Equity mutual funds</li>
                    <li>ETFs</li>
                  </ul>
                </div>
                <div>
                  <strong>Typical appreciation:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>8-12% annually (long-term)</li>
                    <li>Plus dividends: 2-5%</li>
                    <li>High volatility short-term</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card bg-purple-50 dark:bg-purple-900/10 border-l-4 border-purple-500">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <span>💼</span> Businesses
              </h3>
              <p className="text-sm mb-2"><strong>Why they appreciate:</strong> Revenue growth, brand value, customer base, market share.</p>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Examples:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Your own company</li>
                    <li>Franchise ownership</li>
                    <li>Partnership stakes</li>
                    <li>E-commerce sites</li>
                  </ul>
                </div>
                <div>
                  <strong>Typical appreciation:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Varies wildly (high risk)</li>
                    <li>Successful: 20-100%+</li>
                    <li>Failed: -100% (total loss)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <span>🌾</span> Commodities (Selective)
              </h3>
              <p className="text-sm mb-2"><strong>Why they appreciate:</strong> Inflation hedge, scarcity, industrial demand.</p>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Examples:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Gold and precious metals</li>
                    <li>Agricultural land</li>
                    <li>Oil (long-term)</li>
                    <li>Rare collectibles</li>
                  </ul>
                </div>
                <div>
                  <strong>Typical appreciation:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Gold: 3-7% annually</li>
                    <li>High volatility</li>
                    <li>Inflation-adjusted returns</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card bg-indigo-50 dark:bg-indigo-900/10 border-l-4 border-indigo-500">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <span>🎓</span> Skills & Education
              </h3>
              <p className="text-sm mb-2"><strong>Why they appreciate:</strong> Increased earning power, career advancement, expertise value.</p>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Examples:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Professional certifications</li>
                    <li>Technical skills (coding, etc.)</li>
                    <li>Advanced degrees</li>
                    <li>Business acumen</li>
                  </ul>
                </div>
                <div>
                  <strong>Typical appreciation:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>ROI: 10-100%+ on salary</li>
                    <li>Compounds over career</li>
                    <li>Can't be taken away</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Common Depreciating Assets</h2>

          <div className="space-y-4">
            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <span>🚗</span> Vehicles
              </h3>
              <p className="text-sm mb-2"><strong>Why they depreciate:</strong> Wear and tear, mileage, new models, mechanical issues.</p>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Examples:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Personal cars</li>
                    <li>Motorcycles (bodas)</li>
                    <li>Boats</li>
                    <li>RVs/Caravans</li>
                  </ul>
                </div>
                <div>
                  <strong>Typical depreciation:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>New car: 20-30% year 1</li>
                    <li>10-15% annually after</li>
                    <li>Worth 50% after 5 years</li>
                  </ul>
                </div>
              </div>
              <p className="text-xs text-red-600 dark:text-red-400 mt-2 italic">
                Exception: Classic/vintage cars can appreciate, but they're collectibles, not transportation.
              </p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <span>📱</span> Electronics & Gadgets
              </h3>
              <p className="text-sm mb-2"><strong>Why they depreciate:</strong> Technology advances, newer models, obsolescence.</p>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Examples:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Phones and tablets</li>
                    <li>Laptops and computers</li>
                    <li>TVs and audio equipment</li>
                    <li>Gaming consoles</li>
                  </ul>
                </div>
                <div>
                  <strong>Typical depreciation:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>50% in first year</li>
                    <li>Nearly worthless after 3-5 years</li>
                    <li>Resale value: 10-30% original</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <span>👗</span> Clothing & Accessories
              </h3>
              <p className="text-sm mb-2"><strong>Why they depreciate:</strong> Fashion changes, wear, trends fade, personal use.</p>
              <div className="text-sm">
                <strong>Typical depreciation:</strong> 70-90% immediately after purchase. Designer items may hold 20-40% value.
              </div>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <span>🛋️</span> Furniture & Appliances
              </h3>
              <p className="text-sm mb-2"><strong>Why they depreciate:</strong> Used condition, style changes, functional wear.</p>
              <div className="text-sm">
                <strong>Typical depreciation:</strong> 50-70% in first year, 80-90% after 5 years. Antiques are exceptions.
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">The Wealth Gap: A Real Example</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-[var(--border-subtle)] rounded-lg text-sm">
              <thead className="bg-[var(--surface)]">
                <tr>
                  <th className="px-4 py-3 text-left" colSpan={2}>Two People, KES 1M Each, 10 Years Later</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b-2 border-[var(--border-subtle)]">
                  <td className="px-4 py-4">
                    <div className="bg-red-50 dark:bg-red-900/10 rounded p-4">
                      <h4 className="font-bold text-red-600 dark:text-red-400 mb-3">Person A: Bought Depreciating Assets</h4>
                      <ul className="space-y-2 text-sm">
                        <li>🚗 KES 800K car → Now worth KES 200K (-KES 600K)</li>
                        <li>📱 KES 150K gadgets → Now worth KES 20K (-KES 130K)</li>
                        <li>👗 KES 50K clothes → Worth KES 5K (-KES 45K)</li>
                      </ul>
                      <p className="font-bold text-lg mt-4 text-red-600">Total Value: KES 225K</p>
                      <p className="text-xs text-[var(--text-muted)]">Lost 77.5% of capital</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="bg-green-50 dark:bg-green-900/10 rounded p-4">
                      <h4 className="font-bold text-green-600 dark:text-green-400 mb-3">Person B: Bought Appreciating Assets</h4>
                      <ul className="space-y-2 text-sm">
                        <li>🏠 KES 800K land → Now worth KES 1.6M (+KES 800K)</li>
                        <li>📈 KES 150K stocks → Now worth KES 370K (+KES 220K)</li>
                        <li>💼 KES 50K business → Now worth KES 150K (+KES 100K)</li>
                      </ul>
                      <p className="font-bold text-lg mt-4 text-green-600">Total Value: KES 2.12M</p>
                      <p className="text-xs text-[var(--text-muted)]">Gained 112% return</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-center text-sm font-semibold text-blue-600 dark:text-blue-400 mt-3">
            Net Wealth Difference: KES 1.895M from the same starting capital!
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Making Smart Asset Choices</h2>

          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="font-bold text-lg mb-3">The 80/20 Asset Allocation Rule</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 font-bold text-xl">80%</span>
                <div>
                  <strong className="block">Appreciating Assets</strong>
                  <p>Allocate the majority of capital to things that grow: real estate, stocks, businesses, skills.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-600 dark:text-amber-400 font-bold text-xl">20%</span>
                <div>
                  <strong className="block">Depreciating Assets (Necessary)</strong>
                  <p>Reserve for essential depreciating items: reliable car for work, functional laptop, basic furniture.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Decision Framework: Should I Buy This?</h2>

          <div className="card bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-2 border-purple-200 dark:border-purple-800">
            <h3 className="font-bold text-lg mb-4">Ask Yourself These Questions:</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✅</span>
                <div>
                  <strong>Will this asset increase in value over time?</strong>
                  <p className="text-xs text-[var(--text-muted)]">If yes, it's likely a good investment.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✅</span>
                <div>
                  <strong>Will this generate income or save me money?</strong>
                  <p className="text-xs text-[var(--text-muted)]">Rental property, dividend stocks, skills = yes.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">⚠️</span>
                <div>
                  <strong>Is this essential for my livelihood?</strong>
                  <p className="text-xs text-[var(--text-muted)]">Work vehicle, professional tools = justified despite depreciation.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-600 font-bold">❌</span>
                <div>
                  <strong>Am I buying this for status or emotion?</strong>
                  <p className="text-xs text-[var(--text-muted)]">Luxury car, designer clothes to impress = wealth destroyer.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Turning Depreciating into Appreciating</h2>

          <div className="space-y-3">
            <div className="card border-l-4 border-green-500">
              <h3 className="font-bold mb-2">🚕 Car → Uber/Bolt Business</h3>
              <p className="text-sm">Depreciation offset by income generation. Still depreciates, but earns while it does.</p>
            </div>

            <div className="card border-l-4 border-blue-500">
              <h3 className="font-bold mb-2">💻 Laptop → Freelance Tool</h3>
              <p className="text-sm">Depreciating gadget becomes income-generating asset through your skills.</p>
            </div>

            <div className="card border-l-4 border-purple-500">
              <h3 className="font-bold mb-2">📸 Camera → Photography Business</h3>
              <p className="text-sm">Equipment depreciates but business goodwill and client base appreciate.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-6 my-8 border-2 border-green-200 dark:border-green-800">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span>🎯</span> The Bottom Line
            </h3>
            <p>
              Wealth is built by accumulating assets that appreciate, not by acquiring things that lose value. Every purchasing decision is an investment decision—you're either building wealth or destroying it. Before buying, ask: "Will this be worth more or less in 5 years?" If the answer is less, buy only if absolutely necessary. If the answer is more, allocate as much capital as you can afford. The rich focus on appreciating assets; the poor focus on looking rich through depreciating purchases. Choose wisely.
            </p>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-6 mt-8">
            <h3 className="font-bold mb-3">Related Articles:</h3>
            <div className="space-y-2">
              <Link to="/blog/diversify-assets" className="text-blue-600 hover:text-blue-700 block">
                → Asset Diversification: Reducing Investment Risk
              </Link>
              <Link to="/blog/track-net-worth" className="text-blue-600 hover:text-blue-700 block">
                → How to Track Your Net Worth Effectively
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
