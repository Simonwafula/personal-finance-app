// Hook for managing SMS transaction detection
import { useState, useEffect, useCallback } from 'react';
import SmsReader, { type SmsMessage } from '../plugins/smsReader';
import { 
  parseTransactionSms, 
  type ParsedTransaction,
  FINANCIAL_SENDERS,
  suggestCategory,
  getSourceDisplayName
} from '../services/smsTransactionService';

// Default senders to monitor - users can customize this
const DEFAULT_MONITORED_SENDERS = [
  'MPESA',
  'KCB',
  'EQUITY',
  'COOP',
  'ABSA',
  'STANBIC',
  'DTB',
  'NCBA',
  'FAMILY',
  'IMBANK',
  // Add more as needed
];

export interface PendingTransaction extends ParsedTransaction {
  id: string;
  dismissed: boolean;
  saved: boolean;
  suggestedCategory: string;
}

export interface UseSmsTransactionsOptions {
  autoStart?: boolean;
  senders?: string[];
  onNewTransaction?: (transaction: PendingTransaction) => void;
}

export function useSmsTransactions(options: UseSmsTransactionsOptions = {}) {
  const { 
    autoStart = false, 
    senders = DEFAULT_MONITORED_SENDERS,
    onNewTransaction 
  } = options;
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check permissions on mount
  useEffect(() => {
    checkPermissions();
  }, []);

  // Auto-start if enabled and permission granted
  useEffect(() => {
    if (autoStart && hasPermission === true && !isListening) {
      startListening();
    }
  }, [autoStart, hasPermission]);

  const checkPermissions = useCallback(async () => {
    try {
      const status = await SmsReader.checkPermissions();
      setHasPermission(status.sms === 'granted');
      return status.sms === 'granted';
    } catch (err) {
      console.error('Error checking SMS permissions:', err);
      setHasPermission(false);
      return false;
    }
  }, []);

  const requestPermissions = useCallback(async () => {
    try {
      setIsLoading(true);
      const status = await SmsReader.requestPermissions();
      const granted = status.sms === 'granted';
      setHasPermission(granted);
      return granted;
    } catch (err) {
      console.error('Error requesting SMS permissions:', err);
      setError('Failed to request SMS permissions');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const processMessage = useCallback((message: SmsMessage): PendingTransaction | null => {
    const parsed = parseTransactionSms(message);
    if (!parsed) return null;

    const pending: PendingTransaction = {
      ...parsed,
      id: message.id || `${message.date}-${Math.random()}`,
      dismissed: false,
      saved: false,
      suggestedCategory: suggestCategory(parsed),
    };

    return pending;
  }, []);

  const loadRecentTransactions = useCallback(async (limit = 50, since?: number) => {
    if (!hasPermission) {
      setError('SMS permission not granted');
      return [];
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await SmsReader.getMessages({
        senders,
        limit,
        since,
      });

      const transactions: PendingTransaction[] = [];
      for (const message of result.messages) {
        const pending = processMessage(message);
        if (pending) {
          transactions.push(pending);
        }
      }

      // Add new transactions that aren't already pending
      setPendingTransactions(prev => {
        const existingIds = new Set(prev.map(t => t.id));
        const newTransactions = transactions.filter(t => !existingIds.has(t.id));
        return [...newTransactions, ...prev];
      });

      return transactions;
    } catch (err) {
      console.error('Error loading SMS transactions:', err);
      setError('Failed to load SMS messages');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [hasPermission, senders, processMessage]);

  const startListening = useCallback(async () => {
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) return false;
    }

    try {
      setError(null);
      
      // Set up listener for new messages
      const listener = await SmsReader.addListener('smsReceived', (message) => {
        const pending = processMessage(message);
        if (pending) {
          setPendingTransactions(prev => [pending, ...prev]);
          onNewTransaction?.(pending);
        }
      });

      // Start listening
      const result = await SmsReader.startListening({ senders });
      setIsListening(result.listening);

      return result.listening;
    } catch (err) {
      console.error('Error starting SMS listener:', err);
      setError('Failed to start SMS monitoring');
      return false;
    }
  }, [hasPermission, senders, processMessage, onNewTransaction, requestPermissions]);

  const stopListening = useCallback(async () => {
    try {
      await SmsReader.removeAllListeners();
      await SmsReader.stopListening();
      setIsListening(false);
    } catch (err) {
      console.error('Error stopping SMS listener:', err);
    }
  }, []);

  const dismissTransaction = useCallback((id: string) => {
    setPendingTransactions(prev =>
      prev.map(t => t.id === id ? { ...t, dismissed: true } : t)
    );
  }, []);

  const markAsSaved = useCallback((id: string) => {
    setPendingTransactions(prev =>
      prev.map(t => t.id === id ? { ...t, saved: true } : t)
    );
  }, []);

  const clearDismissed = useCallback(() => {
    setPendingTransactions(prev => prev.filter(t => !t.dismissed));
  }, []);

  const clearSaved = useCallback(() => {
    setPendingTransactions(prev => prev.filter(t => !t.saved));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [isListening, stopListening]);

  return {
    // State
    hasPermission,
    isListening,
    isLoading,
    error,
    pendingTransactions: pendingTransactions.filter(t => !t.dismissed && !t.saved),
    allTransactions: pendingTransactions,
    
    // Actions
    checkPermissions,
    requestPermissions,
    loadRecentTransactions,
    startListening,
    stopListening,
    dismissTransaction,
    markAsSaved,
    clearDismissed,
    clearSaved,
    
    // Helpers
    availableSenders: Object.entries(FINANCIAL_SENDERS).map(([key, value]) => ({
      id: key,
      name: value.name,
    })),
    getSourceDisplayName,
    suggestCategory,
  };
}

export default useSmsTransactions;
