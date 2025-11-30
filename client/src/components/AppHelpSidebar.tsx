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
      <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
        <div className="flex items-center gap-2">
          <HiQuestionMarkCircle className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900">Quick Help</h3>
        </div>
        <p className="text-xs text-gray-600">
          Need assistance? Check out our guide below or visit the help center.
        </p>
        <Link
          to="/help"
          className="block w-full py-2 px-3 text-center text-xs font-semibold rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
        >
          View Help Center
        </Link>
      </div>

      {/* Related Tips Card */}
      <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
        <div className="flex items-center gap-2">
          <HiBookOpen className="w-5 h-5 text-purple-600" />
          <h3 className="text-sm font-semibold text-gray-900">Related Tips</h3>
        </div>
        <div className="space-y-2">
          {tips.map((tip) => (
            <Link
              key={tip.id}
              to={`/blog/${tip.id}`}
              className="block p-2 rounded-lg hover:bg-gray-50 transition-all group"
            >
              <div className="flex items-start gap-2">
                <span className="text-sm flex-shrink-0">{tip.emoji}</span>
                <span className="text-xs font-medium text-gray-700 leading-tight group-hover:text-blue-600 transition-colors">
                  {tip.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
        <Link
          to="/blog"
          className="block w-full py-2 px-3 text-center text-xs font-semibold rounded-md bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all"
        >
          View All Articles
        </Link>
      </div>
    </div>
  );
}
