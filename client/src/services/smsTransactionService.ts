// SMS Transaction Detection Service
// Monitors incoming SMS from financial senders and extracts transaction data

export interface ParsedTransaction {
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  currency: string;
  sender: string;
  recipient?: string;
  reference?: string;
  balance?: number;
  timestamp: Date;
  rawMessage: string;
  source: string; // e.g., 'MPESA', 'KCB', 'EQUITY'
  confidence: number; // 0-1, how confident we are in the parsing
}

export interface SmsMessage {
  id: string;
  address: string; // sender
  body: string;
  date: number; // timestamp
  read: boolean;
}

// Known financial SMS senders - add more as needed
export const FINANCIAL_SENDERS: Record<string, { name: string; patterns: RegExp[] }> = {
  // Kenya
  'MPESA': {
    name: 'M-PESA',
    patterns: [
      /^M-?PESA$/i,
      /^MPESA$/i,
      /^Safaricom$/i,
    ],
  },
  'KCB': {
    name: 'KCB Bank',
    patterns: [/^KCB$/i, /^KCB-MPESA$/i, /^KCBGroup$/i],
  },
  'EQUITY': {
    name: 'Equity Bank',
    patterns: [/^EQUITY$/i, /^EquityBcdc$/i, /^EQUITYMobile$/i],
  },
  'COOP': {
    name: 'Co-operative Bank',
    patterns: [/^ABORSHA$/i, /^Co-opBank$/i, /^COOP$/i],
  },
  'ABSA': {
    name: 'ABSA Bank',
    patterns: [/^ABSA$/i, /^Barclays$/i],
  },
  'STANBIC': {
    name: 'Stanbic Bank',
    patterns: [/^STANBIC$/i, /^StanbicBank$/i],
  },
  'DTB': {
    name: 'Diamond Trust Bank',
    patterns: [/^DTB$/i, /^DTBKenya$/i],
  },
  'NCBA': {
    name: 'NCBA Bank',
    patterns: [/^NCBA$/i, /^NIC$/i, /^CBA$/i],
  },
  'FAMILY': {
    name: 'Family Bank',
    patterns: [/^FamilyBank$/i, /^FAMILYBANK$/i],
  },
  'IMBANK': {
    name: 'I&M Bank',
    patterns: [/^I&M$/i, /^IMBank$/i, /^IMBANK$/i],
  },
  // Nigeria
  'GTB': {
    name: 'GTBank',
    patterns: [/^GTBank$/i, /^GTBANK$/i, /^737$/i],
  },
  'FIRSTBANK': {
    name: 'First Bank',
    patterns: [/^FirstBank$/i, /^FIRSTBANK$/i],
  },
  'ACCESS': {
    name: 'Access Bank',
    patterns: [/^AccessBank$/i, /^ACCESS$/i],
  },
  'UBA': {
    name: 'UBA',
    patterns: [/^UBA$/i, /^UBAGroup$/i],
  },
  'ZENITH': {
    name: 'Zenith Bank',
    patterns: [/^ZENITH$/i, /^ZenithBank$/i],
  },
  // South Africa
  'FNB': {
    name: 'FNB',
    patterns: [/^FNB$/i, /^FirstNational$/i],
  },
  'STANDARDBANK': {
    name: 'Standard Bank',
    patterns: [/^StandardBank$/i, /^SBSA$/i],
  },
  'CAPITEC': {
    name: 'Capitec',
    patterns: [/^Capitec$/i, /^CAPITEC$/i],
  },
  'NEDBANK': {
    name: 'Nedbank',
    patterns: [/^Nedbank$/i, /^NEDBANK$/i],
  },
  // Generic patterns
  'BANK': {
    name: 'Bank',
    patterns: [/bank/i, /BANK/i],
  },
};

// Transaction parsing patterns
const MPESA_PATTERNS = {
  // M-PESA received: "QK7ABCDEF Confirmed. You have received Ksh1,000.00 from JOHN DOE 0712345678 on 1/1/26 at 10:30 AM. New M-PESA balance is Ksh5,000.00."
  received: /([A-Z0-9]+)\s+Confirmed\.?\s*You have received\s+Ksh?([\d,]+\.?\d*)\s+from\s+(.+?)\s+(?:\d{10}|\d{12})?\s*on\s+(\d{1,2}\/\d{1,2}\/\d{2,4})\s+at\s+(\d{1,2}:\d{2}\s*[AP]M).*?(?:balance\s+is\s+Ksh?([\d,]+\.?\d*))?/i,
  
  // M-PESA sent: "QK7ABCDEF Confirmed. Ksh1,000.00 sent to JANE DOE 0712345678 on 1/1/26 at 10:30 AM. New M-PESA balance is Ksh4,000.00."
  sent: /([A-Z0-9]+)\s+Confirmed\.?\s*Ksh?([\d,]+\.?\d*)\s+sent\s+to\s+(.+?)\s+(?:\d{10}|\d{12})?\s*on\s+(\d{1,2}\/\d{1,2}\/\d{2,4})\s+at\s+(\d{1,2}:\d{2}\s*[AP]M).*?(?:balance\s+is\s+Ksh?([\d,]+\.?\d*))?/i,
  
  // M-PESA paid (merchant): "QK7ABCDEF Confirmed. Ksh500.00 paid to SUPERMARKET. on 1/1/26 at 10:30 AM. New M-PESA balance is Ksh4,500.00."
  paid: /([A-Z0-9]+)\s+Confirmed\.?\s*Ksh?([\d,]+\.?\d*)\s+paid\s+to\s+(.+?)\.?\s*on\s+(\d{1,2}\/\d{1,2}\/\d{2,4})\s+at\s+(\d{1,2}:\d{2}\s*[AP]M).*?(?:balance\s+is\s+Ksh?([\d,]+\.?\d*))?/i,
  
  // M-PESA withdraw: "QK7ABCDEF Confirmed.on 1/1/26 at 10:30 AM Withdraw Ksh1,000.00 from 12345 - AGENT NAME. New M-PESA balance is Ksh3,000.00."
  withdraw: /([A-Z0-9]+)\s+Confirmed\.?\s*on\s+(\d{1,2}\/\d{1,2}\/\d{2,4})\s+at\s+(\d{1,2}:\d{2}\s*[AP]M)\s*Withdraw\s+Ksh?([\d,]+\.?\d*)\s+from\s+(.+?)\.?\s*(?:New\s+)?(?:M-?PESA\s+)?balance\s+is\s+Ksh?([\d,]+\.?\d*)/i,
  
  // M-PESA buy airtime: "QK7ABCDEF confirmed. You bought Ksh100.00 of airtime on 1/1/26 at 10:30 AM. New M-PESA balance is Ksh4,900.00."
  airtime: /([A-Z0-9]+)\s+[Cc]onfirmed\.?\s*You bought\s+Ksh?([\d,]+\.?\d*)\s+of\s+airtime\s+on\s+(\d{1,2}\/\d{1,2}\/\d{2,4})\s+at\s+(\d{1,2}:\d{2}\s*[AP]M).*?(?:balance\s+is\s+Ksh?([\d,]+\.?\d*))?/i,
  
  // Paybill: "QK7ABCDEF Confirmed. Ksh1,000.00 sent to COMPANY NAME for account 12345 on 1/1/26 at 10:30 AM. New M-PESA balance is Ksh3,000.00."
  paybill: /([A-Z0-9]+)\s+Confirmed\.?\s*Ksh?([\d,]+\.?\d*)\s+sent\s+to\s+(.+?)\s+for\s+account\s+(.+?)\s+on\s+(\d{1,2}\/\d{1,2}\/\d{2,4})\s+at\s+(\d{1,2}:\d{2}\s*[AP]M).*?(?:balance\s+is\s+Ksh?([\d,]+\.?\d*))?/i,
};

// Generic bank patterns
const BANK_PATTERNS = {
  // Credit: "Your account XXX123 has been credited with KES 5,000.00. Balance: KES 10,000.00. Ref: TXN123456"
  credit: /(?:credited|deposited|received)\s+(?:with\s+)?(?:KES|Ksh|UGX|TZS|NGN|ZAR|USD)?\s*([\d,]+\.?\d*).*?(?:balance[:\s]+(?:KES|Ksh|UGX|TZS|NGN|ZAR|USD)?\s*([\d,]+\.?\d*))?.*?(?:ref[:\s]*([A-Z0-9]+))?/i,
  
  // Debit: "Your account XXX123 has been debited with KES 2,000.00. Balance: KES 8,000.00. Ref: TXN123456"
  debit: /(?:debited|withdrawn|paid)\s+(?:with\s+)?(?:KES|Ksh|UGX|TZS|NGN|ZAR|USD)?\s*([\d,]+\.?\d*).*?(?:balance[:\s]+(?:KES|Ksh|UGX|TZS|NGN|ZAR|USD)?\s*([\d,]+\.?\d*))?.*?(?:ref[:\s]*([A-Z0-9]+))?/i,
  
  // Transfer: "Transfer of KES 3,000.00 to ACC XXX456 successful. Balance: KES 5,000.00"
  transfer: /transfer\s+(?:of\s+)?(?:KES|Ksh|UGX|TZS|NGN|ZAR|USD)?\s*([\d,]+\.?\d*)\s+to\s+(.+?)\s+(?:successful|completed).*?(?:balance[:\s]+(?:KES|Ksh|UGX|TZS|NGN|ZAR|USD)?\s*([\d,]+\.?\d*))?/i,
};

/**
 * Identify the financial sender from SMS address
 */
export function identifyFinancialSender(address: string): string | null {
  const normalizedAddress = address.trim().toUpperCase();
  
  for (const [key, config] of Object.entries(FINANCIAL_SENDERS)) {
    for (const pattern of config.patterns) {
      if (pattern.test(normalizedAddress) || pattern.test(address)) {
        return key;
      }
    }
  }
  
  return null;
}

/**
 * Parse amount string to number
 */
function parseAmount(amountStr: string): number {
  if (!amountStr) return 0;
  return parseFloat(amountStr.replace(/,/g, ''));
}

/**
 * Parse M-PESA date string to Date object
 */
function parseMpesaDate(dateStr: string, timeStr: string): Date {
  try {
    const [day, month, year] = dateStr.split('/').map(Number);
    const fullYear = year < 100 ? 2000 + year : year;
    
    // Parse time like "10:30 AM"
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*([AP]M)/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const period = timeMatch[3].toUpperCase();
      
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      
      return new Date(fullYear, month - 1, day, hours, minutes);
    }
    
    return new Date(fullYear, month - 1, day);
  } catch {
    return new Date();
  }
}

/**
 * Parse M-PESA SMS message
 */
function parseMpesaMessage(body: string, timestamp: number): ParsedTransaction | null {
  // Try received pattern
  let match = body.match(MPESA_PATTERNS.received);
  if (match) {
    return {
      type: 'income',
      amount: parseAmount(match[2]),
      currency: 'KES',
      sender: match[3].trim(),
      reference: match[1],
      balance: match[6] ? parseAmount(match[6]) : undefined,
      timestamp: parseMpesaDate(match[4], match[5]),
      rawMessage: body,
      source: 'MPESA',
      confidence: 0.95,
    };
  }
  
  // Try sent pattern
  match = body.match(MPESA_PATTERNS.sent);
  if (match) {
    return {
      type: 'expense',
      amount: parseAmount(match[2]),
      currency: 'KES',
      recipient: match[3].trim(),
      reference: match[1],
      balance: match[6] ? parseAmount(match[6]) : undefined,
      timestamp: parseMpesaDate(match[4], match[5]),
      rawMessage: body,
      source: 'MPESA',
      confidence: 0.95,
    };
  }
  
  // Try paid pattern (merchant)
  match = body.match(MPESA_PATTERNS.paid);
  if (match) {
    return {
      type: 'expense',
      amount: parseAmount(match[2]),
      currency: 'KES',
      recipient: match[3].trim(),
      reference: match[1],
      balance: match[6] ? parseAmount(match[6]) : undefined,
      timestamp: parseMpesaDate(match[4], match[5]),
      rawMessage: body,
      source: 'MPESA',
      confidence: 0.95,
    };
  }
  
  // Try withdraw pattern
  match = body.match(MPESA_PATTERNS.withdraw);
  if (match) {
    return {
      type: 'expense',
      amount: parseAmount(match[4]),
      currency: 'KES',
      recipient: match[5].trim(),
      reference: match[1],
      balance: parseAmount(match[6]),
      timestamp: parseMpesaDate(match[2], match[3]),
      rawMessage: body,
      source: 'MPESA',
      confidence: 0.90,
    };
  }
  
  // Try airtime pattern
  match = body.match(MPESA_PATTERNS.airtime);
  if (match) {
    return {
      type: 'expense',
      amount: parseAmount(match[2]),
      currency: 'KES',
      recipient: 'Airtime',
      reference: match[1],
      balance: match[5] ? parseAmount(match[5]) : undefined,
      timestamp: parseMpesaDate(match[3], match[4]),
      rawMessage: body,
      source: 'MPESA',
      confidence: 0.95,
    };
  }
  
  // Try paybill pattern
  match = body.match(MPESA_PATTERNS.paybill);
  if (match) {
    return {
      type: 'expense',
      amount: parseAmount(match[2]),
      currency: 'KES',
      recipient: `${match[3].trim()} (${match[4].trim()})`,
      reference: match[1],
      balance: match[7] ? parseAmount(match[7]) : undefined,
      timestamp: parseMpesaDate(match[5], match[6]),
      rawMessage: body,
      source: 'MPESA',
      confidence: 0.95,
    };
  }
  
  return null;
}

/**
 * Parse generic bank SMS message
 */
function parseBankMessage(body: string, source: string, timestamp: number): ParsedTransaction | null {
  // Try credit pattern
  let match = body.match(BANK_PATTERNS.credit);
  if (match) {
    return {
      type: 'income',
      amount: parseAmount(match[1]),
      currency: detectCurrency(body),
      sender: source,
      reference: match[3] || undefined,
      balance: match[2] ? parseAmount(match[2]) : undefined,
      timestamp: new Date(timestamp),
      rawMessage: body,
      source,
      confidence: 0.80,
    };
  }
  
  // Try debit pattern
  match = body.match(BANK_PATTERNS.debit);
  if (match) {
    return {
      type: 'expense',
      amount: parseAmount(match[1]),
      currency: detectCurrency(body),
      recipient: extractRecipient(body) || source,
      reference: match[3] || undefined,
      balance: match[2] ? parseAmount(match[2]) : undefined,
      timestamp: new Date(timestamp),
      rawMessage: body,
      source,
      confidence: 0.80,
    };
  }
  
  // Try transfer pattern
  match = body.match(BANK_PATTERNS.transfer);
  if (match) {
    return {
      type: 'transfer',
      amount: parseAmount(match[1]),
      currency: detectCurrency(body),
      recipient: match[2].trim(),
      balance: match[3] ? parseAmount(match[3]) : undefined,
      timestamp: new Date(timestamp),
      rawMessage: body,
      source,
      confidence: 0.80,
    };
  }
  
  return null;
}

/**
 * Detect currency from message body
 */
function detectCurrency(body: string): string {
  if (/KES|Ksh/i.test(body)) return 'KES';
  if (/UGX/i.test(body)) return 'UGX';
  if (/TZS/i.test(body)) return 'TZS';
  if (/NGN|₦/i.test(body)) return 'NGN';
  if (/ZAR|R\s?\d/i.test(body)) return 'ZAR';
  if (/USD|\$/i.test(body)) return 'USD';
  if (/GBP|£/i.test(body)) return 'GBP';
  if (/EUR|€/i.test(body)) return 'EUR';
  return 'KES'; // Default to KES
}

/**
 * Try to extract recipient from message
 */
function extractRecipient(body: string): string | null {
  const patterns = [
    /(?:to|for)\s+([A-Z][A-Z\s]+?)(?:\s+on|\s+ref|\s+at|\.|$)/i,
    /(?:paid|sent)\s+(?:to\s+)?([A-Z][A-Z\s]+?)(?:\s+on|\s+ref|\s+at|\.|$)/i,
  ];
  
  for (const pattern of patterns) {
    const match = body.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return null;
}

/**
 * Main function to parse an SMS message
 */
export function parseTransactionSms(message: SmsMessage): ParsedTransaction | null {
  const source = identifyFinancialSender(message.address);
  
  if (!source) {
    return null; // Not from a known financial sender
  }
  
  // Try source-specific parsing first
  if (source === 'MPESA') {
    const result = parseMpesaMessage(message.body, message.date);
    if (result) return result;
  }
  
  // Fall back to generic bank parsing
  const result = parseBankMessage(message.body, source, message.date);
  if (result) return result;
  
  // If we recognized the sender but couldn't parse, return a low-confidence result
  // Try to at least extract an amount
  const amountMatch = message.body.match(/(?:KES|Ksh|UGX|TZS|NGN|ZAR|USD)?\s*([\d,]+\.?\d{2})/);
  if (amountMatch) {
    const isCredit = /credit|received|deposit/i.test(message.body);
    const isDebit = /debit|sent|paid|withdraw|bought/i.test(message.body);
    
    if (isCredit || isDebit) {
      return {
        type: isCredit ? 'income' : 'expense',
        amount: parseAmount(amountMatch[1]),
        currency: detectCurrency(message.body),
        sender: isCredit ? source : undefined,
        recipient: isDebit ? extractRecipient(message.body) || 'Unknown' : undefined,
        timestamp: new Date(message.date),
        rawMessage: message.body,
        source,
        confidence: 0.50, // Low confidence - needs user verification
      };
    }
  }
  
  return null;
}

/**
 * Get the display name for a financial source
 */
export function getSourceDisplayName(source: string): string {
  return FINANCIAL_SENDERS[source]?.name || source;
}

/**
 * Suggest a category based on transaction details
 */
export function suggestCategory(transaction: ParsedTransaction): string {
  const recipient = (transaction.recipient || '').toLowerCase();
  const rawMessage = transaction.rawMessage.toLowerCase();
  
  // Airtime
  if (recipient === 'airtime' || /airtime|bundles?|data/i.test(rawMessage)) {
    return 'Communication';
  }
  
  // Utilities
  if (/kplc|kenya\s*power|electricity|water|umeme/i.test(rawMessage)) {
    return 'Utilities';
  }
  
  // Transport
  if (/uber|bolt|taxi|bus|matatu|fare|fuel|petrol|shell|total/i.test(rawMessage)) {
    return 'Transport';
  }
  
  // Food & Dining
  if (/restaurant|cafe|hotel|food|kfc|java|chicken|pizza/i.test(rawMessage)) {
    return 'Food & Dining';
  }
  
  // Groceries
  if (/supermarket|naivas|carrefour|quickmart|tuskys|shoprite|spar/i.test(rawMessage)) {
    return 'Groceries';
  }
  
  // Healthcare
  if (/hospital|clinic|pharmacy|chemist|doctor|medical|health/i.test(rawMessage)) {
    return 'Healthcare';
  }
  
  // Entertainment
  if (/netflix|spotify|dstv|showmax|cinema|movie|game/i.test(rawMessage)) {
    return 'Entertainment';
  }
  
  // Education
  if (/school|university|college|tuition|fees|education/i.test(rawMessage)) {
    return 'Education';
  }
  
  // Insurance
  if (/insurance|jubilee|britam|aar|nhif/i.test(rawMessage)) {
    return 'Insurance';
  }
  
  // Rent
  if (/rent|landlord|housing/i.test(rawMessage)) {
    return 'Rent';
  }
  
  // Transfers
  if (transaction.type === 'transfer') {
    return 'Transfer';
  }
  
  // Default based on type
  return transaction.type === 'income' ? 'Income' : 'Other';
}
