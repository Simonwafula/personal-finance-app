// Web implementation stub for SMS Reader (SMS reading not available on web)
import type { 
  SmsReaderPlugin, 
  PermissionStatus, 
  GetMessagesOptions, 
  GetMessagesResult,
  StartListeningOptions,
  StartListeningResult,
  StopListeningResult 
} from './smsReader';

export class SmsReaderWeb implements SmsReaderPlugin {
  async checkPermissions(): Promise<PermissionStatus> {
    console.warn('SMS reading is not available on web');
    return { sms: 'denied' };
  }

  async requestPermissions(): Promise<PermissionStatus> {
    console.warn('SMS reading is not available on web');
    return { sms: 'denied' };
  }

  async getMessages(_options: GetMessagesOptions): Promise<GetMessagesResult> {
    console.warn('SMS reading is not available on web');
    return { messages: [] };
  }

  async startListening(_options: StartListeningOptions): Promise<StartListeningResult> {
    console.warn('SMS listening is not available on web');
    return { listening: false, senders: [] };
  }

  async stopListening(): Promise<StopListeningResult> {
    return { listening: false };
  }

  async addListener(): Promise<{ remove: () => void }> {
    return { remove: () => {} };
  }

  async removeAllListeners(): Promise<void> {
    // No-op on web
  }
}
