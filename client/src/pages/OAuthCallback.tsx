import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      // Notify the opener window that oauth succeeded; parent should reload user state
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: 'oauth', success: true }, window.location.origin);
      }
    } catch {
      // ignore cross-origin errors
    }
    // If this is not a popup flow, continue into the app.
    if (!window.opener || window.opener.closed) {
      // Dispatch auth change event to refresh user state
      window.dispatchEvent(new Event('authChanged'));
      const t = setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 300);
      return () => clearTimeout(t);
    }

    // Popup flow: close after a short pause to allow message to dispatch
    const t = setTimeout(() => {
      try { window.close(); } catch {
        // Window may not be closeable
      }
    }, 600);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div style={{ padding: 24 }}>
      <h3>Signing you in…</h3>
      <p>If the window does not close automatically, you can safely close this tab and return to the app.</p>
    </div>
  );
}
