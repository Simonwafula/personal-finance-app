import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
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
    <div className="max-w-7xl mx-auto p-4 space-y-6 pb-20">
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        {/* Main content column */}
        <section className="space-y-4">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            <HiArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>

          <article className="card p-5 md:p-6 space-y-6">
            {/* Article Header */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[var(--border-subtle)]">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-3xl flex-shrink-0`}>
                {emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-1">
                  {category}
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold text-[var(--text-main)]">
                  {title}
                </h1>
                <div className="text-sm text-[var(--text-muted)] mt-2">{readTime}</div>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-4 
              prose-headings:text-[var(--text-main)] 
              prose-p:text-[var(--text-main)]
              prose-li:text-[var(--text-main)]
              prose-strong:text-[var(--text-main)]
              prose-td:text-[var(--text-main)]
              prose-th:text-[var(--text-muted)]">
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
    </div>
  );
}
