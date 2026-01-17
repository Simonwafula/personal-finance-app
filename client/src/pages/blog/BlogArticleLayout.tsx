import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import PublicHeader from '../../components/PublicHeader';
import PublicFooter from '../../components/PublicFooter';
import BlogSidebar from '../../components/BlogSidebar';

interface BlogArticleLayoutProps {
  children: ReactNode;
  title: string;
  category: string;
  readTime: string;
  emoji: string;
  gradient: string;
  featureKey?: string;
}

export default function BlogArticleLayout({
  children,
  title,
  category,
  readTime,
  emoji,
  gradient,
  featureKey = 'budgeting',
}: BlogArticleLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900 dark:bg-slate-950 dark:text-slate-100">
      <PublicHeader />
      
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6 grid gap-6 lg:grid-cols-[2fr,1fr]">
          {/* Main content column */}
          <section className="space-y-4">
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800 mb-4 dark:text-blue-300 dark:hover:text-blue-200"
            >
              <HiArrowLeft className="w-4 h-4" />
              Back to Articles
            </Link>

            <article className="bg-white rounded-2xl shadow-sm p-5 md:p-6 space-y-6 dark:bg-slate-900/70 dark:border dark:border-slate-800">
              {/* Article Header */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-slate-700">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-3xl flex-shrink-0`}>
                  {emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                    {category}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h1>
                  <div className="text-sm text-gray-500 dark:text-slate-400 mt-2">{readTime}</div>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-sm max-w-none space-y-4 prose-a:text-blue-700 hover:prose-a:text-blue-800 dark:prose-invert dark:prose-a:text-blue-300 dark:hover:prose-a:text-blue-200">
                {children}
              </div>
            </article>
          </section>

          {/* Right sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <BlogSidebar featureKey={featureKey} maxPosts={5} />
            </div>
          </aside>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
