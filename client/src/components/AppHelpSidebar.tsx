import { Link } from 'react-router-dom';
import { HiQuestionMarkCircle, HiBookOpen } from 'react-icons/hi';

interface BlogPost {
  id: string;
  title: string;
  emoji: string;
}

const featureTips: Record<string, BlogPost[]> = {
  transactions: [
    { id: 'categorization-importance', title: 'Why Categorization Matters', emoji: '🏷️' },
    { id: 'track-opening-balance', title: 'Opening Balances Matter', emoji: '📝' },
    { id: 'monitor-accounts-regularly', title: 'Account Monitoring', emoji: '🔍' },
  ],
  budgeting: [
    { id: 'budgeting-50-30-20-rule', title: 'The 50/30/20 Rule', emoji: '💡' },
    { id: 'zero-based-budgeting', title: 'Zero-Based Budgeting', emoji: '🎯' },
    { id: 'monthly-budget-review', title: 'Monthly Budget Reviews', emoji: '📊' },
  ],
  wealth: [
    { id: 'track-net-worth', title: 'Track Your Net Worth', emoji: '📈' },
    { id: 'diversify-assets', title: 'Asset Diversification', emoji: '🎯' },
    { id: 'appreciating-assets', title: 'Appreciating Assets', emoji: '🚀' },
  ],
  debt: [
    { id: 'reduce-liabilities', title: 'Reduce Debt & Liabilities', emoji: '💪' },
    { id: 'emergency-fund-guide', title: 'Building Emergency Fund', emoji: '🛡️' },
  ],
  accounts: [
    { id: 'separate-accounts', title: 'Multiple Bank Accounts', emoji: '🏦' },
    { id: 'mobile-money-security', title: 'Mobile Money Security', emoji: '🔒' },
    { id: 'monitor-accounts-regularly', title: 'Account Monitoring', emoji: '🔍' },
  ],
  subscriptions: [
    { id: 'audit-subscriptions', title: 'Quarterly Subscription Audit', emoji: '🔄' },
    { id: 'annual-vs-monthly-billing', title: 'Annual vs Monthly Billing', emoji: '💰' },
    { id: 'subscription-renewal-reminders', title: 'Renewal Reminders', emoji: '⏰' },
  ],
};

interface AppHelpSidebarProps {
  featureKey?: keyof typeof featureTips;
}

export default function AppHelpSidebar({ featureKey = 'transactions' }: AppHelpSidebarProps) {
  const tips = featureTips[featureKey] || featureTips.transactions;

  return (
    <div className="space-y-4">
      {/* Quick Help Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 space-y-3">
        <div className="flex items-center gap-2">
          <HiQuestionMarkCircle className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Quick Help</h3>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Need assistance? Check out our financial tips and guides.
        </p>
        <Link
          to="/blog"
          className="block w-full py-2 px-3 text-center text-xs font-semibold rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all"
        >
          View Financial Tips
        </Link>
      </div>

      {/* Related Tips Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 space-y-3">
        <div className="flex items-center gap-2">
          <HiBookOpen className="w-5 h-5 text-purple-600" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Related Tips</h3>
        </div>
        <div className="space-y-2">
          {tips.map((tip) => (
            <Link
              key={tip.id}
              to={`/blog/${tip.id}`}
              className="block p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-all group"
            >
              <div className="flex items-start gap-2">
                <span className="text-sm flex-shrink-0">{tip.emoji}</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tip.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
        <Link
          to="/blog"
          className="block w-full py-2 px-3 text-center text-xs font-semibold rounded-md bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all"
        >
          View All Articles
        </Link>
      </div>
    </div>
  );
}
