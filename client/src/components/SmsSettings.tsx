// SMS Settings Component - Configure which senders to monitor
import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Check,
  Info
} from 'lucide-react';
import { FINANCIAL_SENDERS } from '../services/smsTransactionService';

interface SmsSetting {
  id: string;
  name: string;
  enabled: boolean;
}

interface SmsSettingsProps {
  onSettingsChange?: (enabledSenders: string[]) => void;
}

const STORAGE_KEY = 'sms_monitored_senders';

export function SmsSettings({ onSettingsChange }: SmsSettingsProps) {
  const [senders, setSenders] = useState<SmsSetting[]>([]);
  const [customSender, setCustomSender] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSenders(parsed);
      } catch {
        initializeDefaults();
      }
    } else {
      initializeDefaults();
    }
  }, []);

  // Save settings when changed
  useEffect(() => {
    if (senders.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(senders));
      const enabled = senders.filter(s => s.enabled).map(s => s.id);
      onSettingsChange?.(enabled);
    }
  }, [senders, onSettingsChange]);

  const initializeDefaults = () => {
    const defaults: SmsSetting[] = Object.entries(FINANCIAL_SENDERS).map(([id, config]) => ({
      id,
      name: config.name,
      enabled: ['MPESA', 'KCB', 'EQUITY', 'COOP', 'ABSA'].includes(id), // Enable common ones by default
    }));
    setSenders(defaults);
  };

  const toggleSender = (id: string) => {
    setSenders(prev => 
      prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
    );
  };

  const addCustomSender = () => {
    if (!customSender.trim()) return;
    
    const id = customSender.toUpperCase().replace(/\s+/g, '_');
    if (senders.some(s => s.id === id)) {
      alert('This sender already exists');
      return;
    }

    setSenders(prev => [
      ...prev,
      { id, name: customSender.trim(), enabled: true }
    ]);
    setCustomSender('');
  };

  const removeSender = (id: string) => {
    // Only allow removing custom senders
    if (FINANCIAL_SENDERS[id]) {
      alert('Cannot remove built-in senders');
      return;
    }
    setSenders(prev => prev.filter(s => s.id !== id));
  };

  const enableAll = () => {
    setSenders(prev => prev.map(s => ({ ...s, enabled: true })));
  };

  const disableAll = () => {
    setSenders(prev => prev.map(s => ({ ...s, enabled: false })));
  };

  const enabledCount = senders.filter(s => s.enabled).length;

  return (
    <div className="card">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-medium">SMS Transaction Sources</h3>
              <p className="text-xs text-secondary">
                {enabledCount} of {senders.length} sources enabled
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 rounded-lg hover:bg-surface-alt text-secondary"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {showInfo && (
          <div className="mt-3 p-3 bg-surface-alt rounded-lg text-sm text-secondary">
            <p className="mb-2">
              Select which SMS senders to monitor for automatic transaction detection.
              The app will parse messages from enabled senders and prompt you to save them.
            </p>
            <p>
              <strong>Privacy:</strong> SMS messages are processed locally on your device.
              No message content is sent to our servers.
            </p>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="p-3 border-b border-border flex gap-2">
        <button
          onClick={enableAll}
          className="btn btn-secondary text-sm flex-1"
        >
          Enable All
        </button>
        <button
          onClick={disableAll}
          className="btn btn-secondary text-sm flex-1"
        >
          Disable All
        </button>
      </div>

      {/* Senders list */}
      <div className="max-h-64 overflow-y-auto">
        {senders.map((sender) => (
          <div
            key={sender.id}
            className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleSender(sender.id)}
                className={`w-5 h-5 rounded flex items-center justify-center ${
                  sender.enabled 
                    ? 'bg-primary text-white' 
                    : 'border border-border'
                }`}
              >
                {sender.enabled && <Check className="w-3 h-3" />}
              </button>
              <div>
                <p className="font-medium">{sender.name}</p>
                <p className="text-xs text-secondary">{sender.id}</p>
              </div>
            </div>
            
            {!FINANCIAL_SENDERS[sender.id] && (
              <button
                onClick={() => removeSender(sender.id)}
                className="p-2 rounded-lg hover:bg-surface-alt text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add custom sender */}
      <div className="p-4 border-t border-border">
        <label className="text-sm text-secondary mb-2 block">
          Add Custom Sender
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customSender}
            onChange={(e) => setCustomSender(e.target.value)}
            placeholder="e.g., MYBANK"
            className="input flex-1"
            onKeyDown={(e) => e.key === 'Enter' && addCustomSender()}
          />
          <button
            onClick={addCustomSender}
            className="btn btn-primary"
            disabled={!customSender.trim()}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-secondary mt-2">
          Enter the exact sender name as it appears in your SMS
        </p>
      </div>
    </div>
  );
}

export default SmsSettings;
