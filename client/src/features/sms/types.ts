/**
 * SMS Transaction Detection Types
 *
 * Type definitions for SMS transaction auto-detection feature.
 * Mobile-only feature for Android platform.
 */

/**
 * Parsed SMS transaction data
 */
export interface ParsedSmsTransaction {
  /** Unique identifier for this SMS */
  id: string;

  /** Raw SMS message (for debugging, not sent to backend) */
  rawMessage: string;

  /** SMS sender address/phone number */
  sender: string;

  /** When the SMS was received */
  receivedAt: Date;

  /** Parsed transaction details */
  transaction: {
    /** Transaction type */
    type: 'income' | 'expense' | 'transfer';

    /** Transaction amount */
    amount: number;

    /** Currency code (KES, UGX, NGN, ZAR, USD, etc.) */
    currency: string;

    /** Transaction date (parsed from SMS) */
    date: string;

    /** Transaction time (parsed from SMS) */
    time?: string;

    /** Transaction description */
    description: string;

    /** Sender/recipient name (if available) */
    counterparty?: string;

    /** Transaction reference number */
    reference?: string;

    /** Account balance after transaction (if available) */
    balance?: number;

    /** Suggested category ID */
    suggestedCategoryId?: number;

    /** Category suggestion confidence (0-1) */
    categoryConfidence?: number;

    /** Financial institution detected */
    institution?: string;

    /** Account number (last 4 digits or masked) */
    accountNumber?: string;
  };

  /** Whether this SMS has been processed */
  processed: boolean;

  /** When the transaction was created from this SMS */
  processedAt?: Date;

  /** Backend transaction ID (if saved) */
  transactionId?: number;
}

/**
 * SMS detection configuration
 */
export interface SmsDetectionConfig {
  /** Enable/disable SMS detection */
  enabled: boolean;

  /** List of SMS sender addresses to monitor */
  senderWhitelist: string[];

  /** Automatically save transactions without prompting */
  autoSave: boolean;

  /** Minimum confidence threshold for category suggestions (0-1) */
  categoryConfidenceThreshold: number;

  /** Show notification for each detected SMS */
  showNotifications: boolean;

  /** How many days of SMS history to scan on first run */
  initialScanDays: number;

  /** Enable real-time SMS monitoring */
  realtimeMonitoring: boolean;
}

/**
 * SMS parsing result
 */
export interface SmsParsingResult {
  /** Whether parsing was successful */
  success: boolean;

  /** Parsed transaction data (if successful) */
  data?: ParsedSmsTransaction;

  /** Error message (if failed) */
  error?: string;

  /** Institution detected (even if parsing failed) */
  institution?: string;

  /** Confidence score (0-1) */
  confidence: number;
}

/**
 * Financial institution pattern
 */
export interface InstitutionPattern {
  /** Institution name */
  name: string;

  /** Country code (KE, NG, ZA, etc.) */
  country: string;

  /** SMS sender addresses for this institution */
  senders: string[];

  /** Regex patterns for different transaction types */
  patterns: {
    received?: RegExp;
    sent?: RegExp;
    paid?: RegExp;
    withdrawn?: RegExp;
    deposited?: RegExp;
    transfer?: RegExp;
    purchase?: RegExp;
  };

  /** Currency used by this institution */
  currency: string;

  /** How to extract amount from SMS */
  amountExtractor: (message: string) => number | null;

  /** How to extract reference from SMS */
  referenceExtractor?: (message: string) => string | null;

  /** How to extract balance from SMS */
  balanceExtractor?: (message: string) => number | null;

  /** How to extract date from SMS */
  dateExtractor?: (message: string) => string | null;

  /** How to extract counterparty name from SMS */
  counterpartyExtractor?: (message: string) => string | null;
}

/**
 * Category suggestion based on keywords
 */
export interface CategorySuggestion {
  /** Category ID */
  categoryId: number;

  /** Category name */
  categoryName: string;

  /** Keywords that trigger this category */
  keywords: string[];

  /** Confidence multiplier (0-1) */
  confidence: number;
}

/**
 * SMS transaction review action
 */
export type SmsTransactionAction =
  | 'save' // Save transaction as-is
  | 'edit' // Edit before saving
  | 'dismiss' // Ignore this SMS
  | 'block_sender'; // Block this sender

/**
 * SMS permissions status
 */
export interface SmsPermissionsStatus {
  /** Whether SMS read permission is granted */
  granted: boolean;

  /** Whether permission was denied */
  denied: boolean;

  /** Whether we can request permission */
  canRequest: boolean;

  /** Whether we should show rationale */
  shouldShowRationale: boolean;
}

/**
 * SMS statistics
 */
export interface SmsStatistics {
  /** Total SMS scanned */
  totalScanned: number;

  /** Transactions detected */
  transactionsDetected: number;

  /** Transactions saved */
  transactionsSaved: number;

  /** Detection success rate (0-1) */
  successRate: number;

  /** Average category confidence */
  avgCategoryConfidence: number;

  /** Most common institution */
  topInstitution?: string;

  /** Date of last scan */
  lastScanDate?: Date;
}

/**
 * Default SMS detection configuration
 */
export const DEFAULT_SMS_CONFIG: SmsDetectionConfig = {
  enabled: true,
  senderWhitelist: [
    'MPESA', // Kenya M-PESA
    'KCB', // KCB Bank Kenya
    'EQUITY', // Equity Bank Kenya
    'COOP', // Co-operative Bank Kenya
    'ABSA', // ABSA Bank Kenya
    'STANBIC', // Stanbic Bank Kenya
    'DTB', // Diamond Trust Bank Kenya
    'NCBA', // NCBA Bank Kenya
    'FAMILY', // Family Bank Kenya
    'I&M', // I&M Bank Kenya
    'GTBANK', // GTBank Nigeria
    'FIRSTBANK', // First Bank Nigeria
    'ACCESS', // Access Bank Nigeria
    'UBA', // UBA Nigeria
    'ZENITH', // Zenith Bank Nigeria
    'FNB', // FNB South Africa
    'STANDARDBANK', // Standard Bank South Africa
    'CAPITEC', // Capitec South Africa
    'NEDBANK', // Nedbank South Africa
  ],
  autoSave: false, // Require user review by default
  categoryConfidenceThreshold: 0.7,
  showNotifications: true,
  initialScanDays: 30, // Scan last 30 days on first run
  realtimeMonitoring: true,
};
