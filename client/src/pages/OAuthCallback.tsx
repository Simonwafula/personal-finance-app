import { useEffect } from "react";

export default function OAuthCallback() {
  useEffect(() => {
    try {
      // Notify the opener window that oauth succeeded; parent should reload user state
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: 'oauth', success: true }, window.location.origin);
      }
    } catch (e) {
      // ignore
    }
    // close after a short pause to allow message to dispatch
    const t = setTimeout(() => {
      try { window.close(); } catch (e) {}
    }, 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h3>Signing you in…</h3>
      <p>If the window does not close automatically, you can safely close this tab and return to the app.</p>
    </div>
  );
}
