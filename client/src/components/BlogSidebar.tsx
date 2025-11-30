import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  emoji: string;
  gradient: string;
}

const blogPosts: BlogPost[] = [
  // Budgeting
  { id: 'budgeting-50-30-20-rule', title: 'The 50/30/20 Rule', category: 'Budgeting', emoji: '💡', gradient: 'from-amber-500 to-yellow-500' },
  { id: 'zero-based-budgeting', title: 'Zero-Based Budgeting', category: 'Budgeting', emoji: '🎯', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'monthly-budget-review', title: 'Monthly Budget Reviews', category: 'Budgeting', emoji: '📊', gradient: 'from-purple-500 to-pink-500' },
  { id: 'emergency-fund-guide', title: 'Building Emergency Fund', category: 'Budgeting', emoji: '🛡️', gradient: 'from-green-500 to-emerald-500' },
  
  // Wealth
  { id: 'diversify-assets', title: 'Asset Diversification', category: 'Wealth', emoji: '🎯', gradient: 'from-indigo-500 to-blue-500' },
  { id: 'track-net-worth', title: 'Track Your Net Worth', category: 'Wealth', emoji: '📈', gradient: 'from-green-500 to-teal-500' },
  { id: 'reduce-liabilities', title: 'Reduce Debt & Liabilities', category: 'Wealth', emoji: '💪', gradient: 'from-red-500 to-orange-500' },
  { id: 'appreciating-assets', title: 'Appreciating vs Depreciating Assets', category: 'Wealth', emoji: '🚀', gradient: 'from-purple-500 to-indigo-500' },
  
  // Accounts
  { id: 'separate-accounts', title: 'Multiple Bank Accounts', category: 'Accounts', emoji: '🏦', gradient: 'from-cyan-500 to-teal-500' },
  { id: 'track-opening-balance', title: 'Opening Balances Matter', category: 'Accounts', emoji: '📝', gradient: 'from-blue-500 to-indigo-500' },
  { id: 'monitor-accounts-regularly', title: 'Account Monitoring', category: 'Accounts', emoji: '🔍', gradient: 'from-orange-500 to-red-500' },
  { id: 'mobile-money-security', title: 'Mobile Money Security', category: 'Accounts', emoji: '🔒', gradient: 'from-green-500 to-emerald-500' },
  
  // Subscriptions
  { id: 'audit-subscriptions', title: 'Quarterly Subscription Audit', category: 'Subscriptions', emoji: '🔄', gradient: 'from-pink-500 to-rose-500' },
  { id: 'annual-vs-monthly-billing', title: 'Annual vs Monthly Billing', category: 'Subscriptions', emoji: '💰', gradient: 'from-yellow-500 to-amber-500' },
  { id: 'subscription-renewal-reminders', title: 'Renewal Reminders', category: 'Subscriptions', emoji: '⏰', gradient: 'from-purple-500 to-pink-500' },
  { id: 'shared-subscription-plans', title: 'Shared Subscription Plans', category: 'Subscriptions', emoji: '👨‍👩‍👧‍👦', gradient: 'from-blue-500 to-cyan-500' },
  
  // Money Management
  { id: 'categorization-importance', title: 'Why Categorization Matters', category: 'Money Management', emoji: '🏷️', gradient: 'from-indigo-500 to-purple-500' },
];

const categorizedPosts = blogPosts.reduce((acc, post) => {
  if (!acc[post.category]) {
    acc[post.category] = [];
  }
  acc[post.category].push(post);
  return acc;
}, {} as Record<string, BlogPost[]>);

// Feature key mappings to blog categories
const featureKeyMap: Record<string, string> = {
  budgeting: 'Budgeting',
  wealth: 'Wealth',
  accounts: 'Accounts',
  subscriptions: 'Subscriptions',
  transactions: 'Money Management',
  debt: 'Wealth',
};

interface BlogSidebarProps {
  featureKey?: string;
  maxPosts?: number;
}

export default function BlogSidebar({ featureKey, maxPosts = 5 }: BlogSidebarProps) {
  // If featureKey provided, show related posts only
  const relatedPosts = featureKey
    ? blogPosts.filter(post => post.category === featureKeyMap[featureKey]).slice(0, maxPosts)
    : [];

  // Show all categories if no feature key
  const showAllCategories = !featureKey || relatedPosts.length === 0;

  return (
    <div className="space-y-4">
      {/* Wisdom Header */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl">
            📚
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900">Financial Wisdom</h3>
            <p className="text-xs text-gray-500">{blogPosts.length} Articles</p>
          </div>
        </div>
        <Link
          to="/blog"
          className="block w-full py-2 px-4 text-center text-sm font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all"
        >
          View All Articles
        </Link>
      </div>

      {/* Related Posts (if featureKey provided) */}
      {!showAllCategories && relatedPosts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h4 className="font-semibold text-sm mb-3 text-gray-900">Related Articles</h4>
          <div className="space-y-2">
            {relatedPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="block p-2 rounded-lg hover:bg-gray-50 transition-all group"
              >
                <div className="flex items-start gap-2">
                  <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${post.gradient} flex items-center justify-center text-xs flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    {post.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium leading-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{post.category}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* All Categories (default view) */}
      {showAllCategories &&
        Object.entries(categorizedPosts).slice(0, 3).map(([category, posts]) => (
          <div key={category} className="bg-white rounded-2xl shadow-sm p-4">
            <h4 className="font-semibold text-sm mb-3 text-gray-900">{category}</h4>
            <div className="space-y-2">
              {posts.slice(0, 3).map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="block p-2 rounded-lg hover:bg-gray-50 transition-all group"
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${post.gradient} flex items-center justify-center text-xs flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      {post.emoji}
                    </div>
                    <span className="text-xs font-medium leading-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
