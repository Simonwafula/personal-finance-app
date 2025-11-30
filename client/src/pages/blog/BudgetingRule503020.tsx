import BlogArticleLayout from './BlogArticleLayout';

export default function BudgetingRule503020() {
  return (
    <BlogArticleLayout
      title="The 50/30/20 Budgeting Rule Explained"
      category="Budgeting"
      readTime="5 min read"
      emoji="💡"
      gradient="from-amber-500 to-yellow-500"
      featureKey="budgeting"
    >
      <p className="text-base leading-relaxed text-gray-700">
        The 50/30/20 rule is one of the simplest and most effective budgeting frameworks available. Created by Senator Elizabeth Warren in her book "All Your Worth: The Ultimate Lifetime Money Plan," this rule provides a straightforward way to allocate your after-tax income.
      </p>

      <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">How It Works</h2>
      <p className="text-sm text-gray-700">
        The rule divides your income into three main categories:
      </p>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4 rounded-r-lg">
        <h3 className="text-base font-semibold text-green-700 mb-2">50% - Needs</h3>
        <p className="text-sm text-gray-600">
          Essential expenses that you can't avoid: rent/mortgage, utilities, groceries, transportation, insurance, minimum loan payments, and healthcare.
        </p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4 rounded-r-lg">
        <h3 className="text-base font-semibold text-blue-700 mb-2">30% - Wants</h3>
        <p className="text-sm text-gray-600">
          Discretionary spending that makes life enjoyable: dining out, entertainment, hobbies, gym memberships, subscriptions (Netflix, Spotify), vacations, and shopping.
        </p>
      </div>

      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 my-4 rounded-r-lg">
        <h3 className="text-base font-semibold text-purple-700 mb-2">20% - Savings & Debt Repayment</h3>
        <p className="text-sm text-gray-600">
          Future-focused finances: emergency fund, retirement savings, investment accounts, extra debt payments beyond minimums, and saving for major purchases.
        </p>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Example: KES 100,000 Monthly Income</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Percentage</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount (KES)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-900">Needs (Rent, Food, Bills)</td>
              <td className="px-4 py-3 text-right text-gray-700">50%</td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">50,000</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-900">Wants (Entertainment, Hobbies)</td>
              <td className="px-4 py-3 text-right text-gray-700">30%</td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">30,000</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-900">Savings & Debt</td>
              <td className="px-4 py-3 text-right text-gray-700">20%</td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">20,000</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Why This Rule Works</h2>
      <ul className="space-y-2 list-disc list-inside text-sm text-gray-700">
        <li><strong>Simple to Remember:</strong> Three easy percentages make it accessible for everyone.</li>
        <li><strong>Balanced Approach:</strong> Covers essentials, enjoyment, and future security.</li>
        <li><strong>Flexible Framework:</strong> Adapts to different income levels and life stages.</li>
        <li><strong>Automatic Prioritization:</strong> Forces you to save before spending on wants.</li>
        <li><strong>Prevents Lifestyle Inflation:</strong> As income grows, savings grow proportionally.</li>
      </ul>

      <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Adapting the Rule to Your Situation</h2>
      <p className="text-sm text-gray-700">
        The 50/30/20 rule is a guideline, not a rigid law. You may need to adjust based on:
      </p>
      <ul className="space-y-2 list-disc list-inside text-sm text-gray-700">
        <li><strong>High cost of living:</strong> In expensive cities like Nairobi, needs might reach 60-70%</li>
        <li><strong>Aggressive savings goals:</strong> Increase savings to 30-40% if planning major purchases</li>
        <li><strong>Debt payoff:</strong> Temporarily reduce wants to 20% to clear high-interest debt faster</li>
            <li><strong>Lower income:</strong> Focus 70-80% on needs, 20-30% on savings, minimize wants temporarily</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Getting Started Today</h2>
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-6 my-6">
            <h3 className="font-bold text-lg mb-3">Quick Action Steps:</h3>
            <ol className="space-y-2 list-decimal list-inside">
              <li>Calculate your monthly after-tax income</li>
              <li>Track your expenses for one month to see current spending</li>
              <li>Categorize expenses into Needs, Wants, and Savings</li>
              <li>Compare your current split with the 50/30/20 target</li>
              <li>Adjust spending in each category to match the rule</li>
              <li>Set up automatic transfers for savings (pay yourself first!)</li>
              <li>Review monthly and adjust as needed</li>
            </ol>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Common Mistakes to Avoid</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4">
              <strong className="text-red-600 dark:text-red-400">Mistake:</strong> Categorizing wants as needs (e.g., "I need" a new phone)
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <strong className="text-red-600 dark:text-red-400">Mistake:</strong> Saving nothing because you can't reach 20%
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <strong className="text-red-600 dark:text-red-400">Mistake:</strong> Not adjusting for irregular expenses (annual insurance, car maintenance)
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <strong className="text-red-600 dark:text-red-400">Mistake:</strong> Forgetting to recalculate when income changes
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-6 my-8 border-2 border-green-200 dark:border-green-800">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span>🎯</span> The Bottom Line
            </h3>
            <p>
              The 50/30/20 rule provides a balanced framework for managing your money without complicated spreadsheets or restrictive budgets. It ensures you cover essentials, enjoy life today, and build wealth for tomorrow. Start with these percentages and adjust based on your unique circumstances and goals.
            </p>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-6 mt-8">
            <h3 className="font-bold mb-3">Related Articles:</h3>
            <div className="space-y-2">
              <Link to="/blog/zero-based-budgeting" className="text-blue-600 hover:text-blue-700 block">
                → Zero-Based Budgeting: Give Every Shilling a Job
              </Link>
              <Link to="/blog/emergency-fund-guide" className="text-blue-600 hover:text-blue-700 block">
                → Building Your Emergency Fund: A Complete Guide
              </Link>
              <Link to="/blog/monthly-budget-review" className="text-blue-600 hover:text-blue-700 block">
                → Why Monthly Budget Reviews Are Critical
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
