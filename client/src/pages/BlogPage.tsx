import { Link } from 'react-router-dom';
import { useState } from 'react';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import BlogSidebar from '../components/BlogSidebar';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  emoji: string;
  gradient: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 'budgeting-50-30-20-rule',
    title: 'The 50/30/20 Budgeting Rule Explained',
    category: 'Budgeting',
    excerpt: 'Master the simple yet powerful budgeting framework that helps millions manage their money effectively.',
    readTime: '5 min read',
    emoji: '💡',
    gradient: 'from-amber-500 to-yellow-500',
  },
  {
    id: 'zero-based-budgeting',
    title: 'Zero-Based Budgeting: Give Every Shilling a Job',
    category: 'Budgeting',
    excerpt: 'Learn how to allocate every shilling of your income and take complete control of your finances.',
    readTime: '6 min read',
    emoji: '🎯',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'monthly-budget-review',
    title: 'Why Monthly Budget Reviews Are Critical',
    category: 'Budgeting',
    excerpt: 'Discover how regular budget reviews can transform your financial health and help you reach your goals faster.',
    readTime: '4 min read',
    emoji: '📊',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'emergency-fund-guide',
    title: 'Building Your Emergency Fund: A Complete Guide',
    category: 'Budgeting',
    excerpt: 'Learn why an emergency fund is essential and how to build 3-6 months of expenses systematically.',
    readTime: '7 min read',
    emoji: '🛡️',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 'diversify-assets',
    title: 'Asset Diversification: Reducing Investment Risk',
    category: 'Wealth',
    excerpt: 'Understand how spreading investments across asset classes protects and grows your wealth.',
    readTime: '8 min read',
    emoji: '🎯',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'track-net-worth',
    title: 'How to Track Your Net Worth Effectively',
    category: 'Wealth',
    excerpt: 'Learn the importance of net worth tracking and strategies to monitor your financial progress.',
    readTime: '5 min read',
    emoji: '📈',
    gradient: 'from-green-500 to-teal-500',
  },
  {
    id: 'reduce-liabilities',
    title: 'Smart Strategies to Reduce Debt and Liabilities',
    category: 'Wealth',
    excerpt: 'Discover proven methods to pay off high-interest debt and accelerate wealth building.',
    readTime: '6 min read',
    emoji: '💪',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    id: 'appreciating-assets',
    title: 'Appreciating vs Depreciating Assets: Know the Difference',
    category: 'Wealth',
    excerpt: 'Learn to identify assets that gain value over time and make smarter investment decisions.',
    readTime: '7 min read',
    emoji: '🚀',
    gradient: 'from-purple-500 to-indigo-500',
  },
  {
    id: 'separate-accounts',
    title: 'The Power of Multiple Bank Accounts',
    category: 'Accounts',
    excerpt: 'Organize your finances with separate accounts for savings, spending, and bills.',
    readTime: '4 min read',
    emoji: '🏦',
    gradient: 'from-cyan-500 to-teal-500',
  },
  {
    id: 'track-opening-balance',
    title: 'Why Opening Balances Matter for Financial Tracking',
    category: 'Accounts',
    excerpt: 'Set up accurate starting balances for precise financial monitoring and reporting.',
    readTime: '3 min read',
    emoji: '📝',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'monitor-accounts-regularly',
    title: 'Account Monitoring: Your First Line of Defense',
    category: 'Accounts',
    excerpt: 'Regular account checks help catch fraud early and keep your finances secure.',
    readTime: '5 min read',
    emoji: '🔍',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'mobile-money-security',
    title: 'Mobile Money Security: Protecting Your M-Pesa & Airtel Money',
    category: 'Accounts',
    excerpt: 'Essential security practices for keeping your mobile money accounts safe in Kenya.',
    readTime: '6 min read',
    emoji: '🔒',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 'audit-subscriptions',
    title: 'The Quarterly Subscription Audit: Save Money Fast',
    category: 'Subscriptions',
    excerpt: 'Learn how to identify and cancel unused subscriptions that drain your budget.',
    readTime: '4 min read',
    emoji: '🔄',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: 'annual-vs-monthly-billing',
    title: 'Annual vs Monthly Billing: Which Saves More?',
    category: 'Subscriptions',
    excerpt: 'Calculate the real savings of annual subscriptions and when they make sense.',
    readTime: '5 min read',
    emoji: '💰',
    gradient: 'from-yellow-500 to-amber-500',
  },
  {
    id: 'subscription-renewal-reminders',
    title: 'Never Miss a Subscription Renewal Again',
    category: 'Subscriptions',
    excerpt: 'Set up systems to review subscriptions before auto-renewal charges hit.',
    readTime: '3 min read',
    emoji: '⏰',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'shared-subscription-plans',
    title: 'Maximize Savings with Shared Subscription Plans',
    category: 'Subscriptions',
    excerpt: 'Learn how family plans can cut your entertainment costs by 50% or more.',
    readTime: '4 min read',
    emoji: '👨‍👩‍👧‍👦',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'categorization-importance',
    title: 'Why Categorization & Tagging Transform Your Financial Life',
    category: 'Money Management',
    excerpt: 'Discover how proper categorization reveals spending patterns, stops money leaks, and helps you save KES 50K+ annually.',
    readTime: '8 min read',
    emoji: '🏷️',
    gradient: 'from-indigo-500 to-purple-500',
  },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = Array.from(new Set(blogPosts.map(p => p.category)));
  
  const filteredPosts = selectedCategory 
    ? blogPosts.filter(post => post.category === selectedCategory)
    : blogPosts;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <PublicHeader />
      
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6 grid gap-6 lg:grid-cols-[2fr,1fr]">
          {/* Main content column */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  📚 Financial Wisdom
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Expert tips, guides, and insights to help you master your money
                </p>
              </div>
              <div className="inline-flex px-4 py-2 rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                {filteredPosts.length} Articles
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedCategory === null 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                All Articles
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    selectedCategory === category 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Blog Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="bg-white rounded-2xl shadow-sm p-4 md:p-5 hover:shadow-md transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${post.gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                    {post.emoji}
                  </div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    {post.category}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{post.readTime}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Right sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <BlogSidebar />
            </div>
          </aside>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
