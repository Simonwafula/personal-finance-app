// Type definitions for SMS Reader plugin

export interface SmsMessage {
  id: string;
  address: string;
  body: string;
  date: number;
  read: boolean;
}

export interface PermissionStatus {
  sms: 'granted' | 'denied' | 'prompt';
}

export interface GetMessagesOptions {
  senders: string[];
  limit?: number;
  since?: number;
}

export interface GetMessagesResult {
  messages: SmsMessage[];
}

export interface StartListeningOptions {
  senders: string[];
}

export interface StartListeningResult {
  listening: boolean;
  senders: string[];
}

export interface StopListeningResult {
  listening: boolean;
}

export interface SmsReaderPlugin {
  checkPermissions(): Promise<PermissionStatus>;
  requestPermissions(): Promise<PermissionStatus>;
  getMessages(options: GetMessagesOptions): Promise<GetMessagesResult>;
  startListening(options: StartListeningOptions): Promise<StartListeningResult>;
  stopListening(): Promise<StopListeningResult>;
  addListener(
    eventName: 'smsReceived',
    listenerFunc: (message: SmsMessage) => void
  ): Promise<{ remove: () => void }>;
  removeAllListeners(): Promise<void>;
}
