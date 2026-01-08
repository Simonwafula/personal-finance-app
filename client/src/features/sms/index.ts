// SMS Transaction Detection Feature
// Export all SMS-related components and utilities

// Platform detection
export { Platform, PLATFORM_FEATURES } from '../../utils/platform';

// Components
export { SmsTransactionPrompt } from './SmsTransactionPrompt';
export { SmsSettings } from './SmsSettings';

// Hooks
export { useSmsTransactions } from './useSmsTransactions';
export type { PendingTransaction, UseSmsTransactionsOptions } from './useSmsTransactions';

// Services
export {
  parseTransactionSms,
  getSourceDisplayName,
  suggestCategory,
  FINANCIAL_SENDERS,
} from './smsTransactionService';
export type { ParsedTransaction } from './smsTransactionService';

// Plugin
export { default as SmsReader } from './smsReader';
export type {
  SmsMessage,
  PermissionStatus,
  SmsReaderPlugin,
} from './smsReaderTypes';

// Types
export type {
  ParsedSmsTransaction,
  SmsDetectionConfig,
  SmsTransactionAction,
} from './types';
