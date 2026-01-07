# SMS Transaction Detection Feature

This directory contains the SMS transaction auto-detection feature for the mobile app.

## 📱 Platform Availability

**Mobile Only (Android)** - This feature is only available on Android native platform.

## 🎯 Purpose

Automatically detect financial transactions from SMS messages sent by banks and mobile money providers, eliminating manual transaction entry for users.

## 🏗️ Architecture

### Components

1. **SmsTransactionPrompt.tsx** - UI component that prompts user to save detected SMS transactions
2. **SmsSettings.tsx** - Settings UI for configuring SMS detection (sender whitelist, auto-save, etc.)
3. **useSmsTransactions.ts** - React hook for managing SMS transaction state
4. **smsTransactionService.ts** - Core service for parsing SMS messages and creating transactions

### Native Plugin

- **SmsReaderPlugin.java** (Android) - Native Android plugin for reading SMS messages
- Located in: `client/android/app/src/main/java/com/mstatilitechnologies/finance/plugins/`

## 🔧 How It Works

### 1. SMS Detection Flow

```
Incoming SMS → Android BroadcastReceiver → SmsReaderPlugin.java →
Capacitor Bridge → smsTransactionService.ts → Parse SMS →
SmsTransactionPrompt.tsx → User Review → Create Transaction → Backend API
```

### 2. Supported Institutions

**Kenya (10 providers):**
- M-PESA (Safaricom)
- KCB Bank
- Equity Bank
- Co-operative Bank
- ABSA Bank
- Stanbic Bank
- DTB (Diamond Trust Bank)
- NCBA Bank
- Family Bank
- I&M Bank

**Nigeria (5 providers):**
- GTBank (Guaranty Trust Bank)
- First Bank of Nigeria
- Access Bank
- UBA (United Bank for Africa)
- Zenith Bank

**South Africa (4 providers):**
- FNB (First National Bank)
- Standard Bank
- Capitec Bank
- Nedbank

### 3. Transaction Types Detected

- **Income**: Received money, salary deposits, refunds
- **Expense**: Payments, withdrawals, purchases, bills
- **Transfer**: Account-to-account transfers

### 4. Parsed Data Points

From each SMS, the service extracts:
- Amount
- Currency (KES, UGX, TZS, NGN, ZAR, USD, GBP, EUR)
- Transaction date and time
- Sender/recipient name
- Reference number
- Account balance (if available)
- Transaction type
- Suggested category (with confidence score)

## 📂 File Structure

```
client/src/features/sms/
├── README.md                      # This file
├── SmsTransactionPrompt.tsx       # SMS transaction review UI
├── SmsSettings.tsx                # SMS configuration UI
├── useSmsTransactions.ts          # React hook
├── smsTransactionService.ts       # SMS parsing service
└── types.ts                       # TypeScript types
```

## 🚀 Usage

### In Components

```typescript
import { PLATFORM_FEATURES } from '@/utils/platform';
import SmsTransactionPrompt from '@/features/sms/SmsTransactionPrompt';

function TransactionsPage() {
  return (
    <>
      {/* Regular transaction form */}
      <TransactionForm />

      {/* SMS prompt (mobile-only) */}
      {PLATFORM_FEATURES.SMS_DETECTION && <SmsTransactionPrompt />}
    </>
  );
}
```

### In Settings

```typescript
import { PLATFORM_FEATURES } from '@/utils/platform';
import SmsSettings from '@/features/sms/SmsSettings';

function SettingsPage() {
  return (
    <>
      <GeneralSettings />

      {/* SMS settings (mobile-only) */}
      {PLATFORM_FEATURES.SMS_DETECTION && <SmsSettings />}
    </>
  );
}
```

## 🔐 Privacy & Security

### Privacy-First Design

1. **Local Processing**: All SMS parsing happens on device - no SMS content sent to backend
2. **Permission-Based**: Requires explicit SMS read permission from user
3. **Configurable**: User can disable, whitelist senders, or configure auto-save
4. **Transparent**: User reviews every transaction before saving

### What Gets Sent to Backend

Only the **parsed transaction data**, not the raw SMS:
- Amount, date, description, category
- Source: 'sms'
- SMS reference number (for deduplication)
- Detection timestamp

**Never sent:**
- Raw SMS message content
- SMS sender phone number
- Other SMS messages

## 🎨 UI/UX

### SmsTransactionPrompt

- Toast notification when SMS detected
- Slide-in panel with transaction details
- Edit-before-save option
- Quick-save button
- Dismiss option
- Batch import mode for multiple SMS

### SmsSettings

- Enable/disable SMS detection
- Sender whitelist management
- Auto-save toggle
- Category suggestion confidence threshold
- Clear SMS cache
- Privacy information

## 🧪 Testing

### Test SMS Messages

**M-PESA Received:**
```
KCB123ABC Confirmed. You have received Ksh5,000.00 from JOHN DOE 254712345678 on 01/12/2024 at 10:30 AM. New M-PESA balance is Ksh12,500.00.
```

**Bank Debit:**
```
Your KCB account 1234567890 has been debited with KES 2,500.00 on 01/12/2024. Reference: ATM/001234. Available balance: KES 45,000.00
```

**GTBank Alert:**
```
Acct: 0123456789 Desc: POS Purchase Amt: NGN 3,500.00 Date: 01-Dec-2024 Bal: NGN 125,000.00
```

### Regex Patterns

Located in `smsTransactionService.ts`:
- M-PESA patterns (8 transaction types)
- Generic bank patterns (credit, debit, transfer)
- Multi-currency support
- Reference number extraction
- Balance extraction

## 📊 Analytics

Track SMS detection metrics:
- SMS detection rate
- Category suggestion accuracy
- Auto-save vs manual review ratio
- Supported vs unsupported institution ratio

## 🔮 Future Enhancements

1. **Machine Learning**: Learn user's transaction patterns for better categorization
2. **More Institutions**: Add more banks and mobile money providers
3. **Multi-Language**: Support SMS in Swahili, French, Portuguese
4. **Receipt Matching**: Match SMS to receipt photos
5. **Duplicate Detection**: Prevent duplicate transactions from multiple SMS
6. **Custom Patterns**: Allow users to add custom SMS patterns

## 🐛 Troubleshooting

### SMS Not Detected

1. Check SMS read permission is granted
2. Verify sender is in whitelist
3. Check SMS format matches supported patterns
4. Review logs in smsTransactionService.ts

### Wrong Category Suggestions

1. Lower confidence threshold in settings
2. Check if institution pattern needs updating
3. Add custom keyword mapping

### Performance Issues

1. Limit SMS history scan depth
2. Enable auto-save to reduce UI prompts
3. Clear SMS cache periodically

## 📚 Related Documentation

- [MOBILE_WEB_SYNC_PLAN.md](../../../MOBILE_WEB_SYNC_PLAN.md) - Overall sync strategy
- [PRE_MIGRATION_CHECKLIST.md](../../../PRE_MIGRATION_CHECKLIST.md) - Migration guidelines
- [Platform Detection](../../utils/platform.ts) - Platform detection utility

## ⚖️ License

Same as main project
