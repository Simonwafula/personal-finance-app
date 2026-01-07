// Capacitor plugin wrapper for SMS Reader
import { registerPlugin } from '@capacitor/core';
import type { SmsReaderPlugin } from './smsReaderTypes';

export type {
  SmsMessage,
  PermissionStatus,
  GetMessagesOptions,
  GetMessagesResult,
  StartListeningOptions,
  StartListeningResult,
  StopListeningResult,
  SmsReaderPlugin
} from './smsReaderTypes';

// Web fallback implementation
const webFallback: SmsReaderPlugin = {
  checkPermissions: async () => ({ sms: 'denied' as const }),
  requestPermissions: async () => ({ sms: 'denied' as const }),
  getMessages: async () => ({ messages: [] }),
  startListening: async () => ({ listening: false, senders: [] }),
  stopListening: async () => ({ listening: false }),
  addListener: async () => ({ remove: () => {} }),
  removeAllListeners: async () => {},
};

const SmsReader = registerPlugin<SmsReaderPlugin>('SmsReader', {
  web: () => Promise.resolve(webFallback),
});

export default SmsReader;
