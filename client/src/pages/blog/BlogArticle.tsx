import { useParams, Navigate } from 'react-router-dom';
import BudgetingRule503020 from './BudgetingRule503020';
import ZeroBasedBudgeting from './ZeroBasedBudgeting';
import MonthlyBudgetReview from './MonthlyBudgetReview';
import EmergencyFundGuide from './EmergencyFundGuide';
import DiversifyAssets from './DiversifyAssets';
import TrackNetWorth from './TrackNetWorth';
import ReduceLiabilities from './ReduceLiabilities';
import AppreciatingAssets from './AppreciatingAssets';
import SeparateAccounts from './SeparateAccounts';
import TrackOpeningBalance from './TrackOpeningBalance';
import MonitorAccountsRegularly from './MonitorAccountsRegularly';
import MobileMoneySecur from './MobileMoneySecur';
import AuditSubscriptions from './AuditSubscriptions';
import AnnualVsMonthlyBilling from './AnnualVsMonthlyBilling';
import SubscriptionRenewalReminders from './SubscriptionRenewalReminders';
import SharedSubscriptionPlans from './SharedSubscriptionPlans';
import CategorizationImportance from './CategorizationImportance';

// Import other blog components as we create them
const blogComponents: Record<string, React.ComponentType> = {
  'budgeting-50-30-20-rule': BudgetingRule503020,
  'zero-based-budgeting': ZeroBasedBudgeting,
  'monthly-budget-review': MonthlyBudgetReview,
  'emergency-fund-guide': EmergencyFundGuide,
  'diversify-assets': DiversifyAssets,
  'track-net-worth': TrackNetWorth,
  'reduce-liabilities': ReduceLiabilities,
  'appreciating-assets': AppreciatingAssets,
  'separate-accounts': SeparateAccounts,
  'track-opening-balance': TrackOpeningBalance,
  'monitor-accounts-regularly': MonitorAccountsRegularly,
  'mobile-money-security': MobileMoneySecur,
  'audit-subscriptions': AuditSubscriptions,
  'annual-vs-monthly-billing': AnnualVsMonthlyBilling,
  'subscription-renewal-reminders': SubscriptionRenewalReminders,
  'shared-subscription-plans': SharedSubscriptionPlans,
  'categorization-importance': CategorizationImportance,
};

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  
  if (!slug || !blogComponents[slug]) {
    return <Navigate to="/blog" replace />;
  }
  
  const ArticleComponent = blogComponents[slug];
  return <ArticleComponent />;
}
