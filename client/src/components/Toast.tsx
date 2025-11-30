import { useEffect } from 'react';

type ToastProps = {
  message: string;
  visible: boolean;
  onClose?: () => void;
  durationMs?: number;
};

export default function Toast({ message, visible, onClose, durationMs = 3000 }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      onClose?.();
    }, durationMs);
    return () => clearTimeout(t);
  }, [visible, durationMs, onClose]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 right-4 z-[100] pointer-events-none px-4 py-2 rounded-lg shadow-lg text-sm font-medium
                 bg-green-600/90 text-white backdrop-blur-md border border-green-300/50"
      style={{
        transform: 'translateY(0)',
        transition: 'opacity 200ms ease, transform 200ms ease',
      }}
    >
      {message}
    </div>
  );
}
