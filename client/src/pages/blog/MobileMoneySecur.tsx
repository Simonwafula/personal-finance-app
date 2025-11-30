import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

export default function MobileMoneySecur() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
        <HiArrowLeft /> Back to Articles
      </Link>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-3xl">
            🔒
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Accounts</div>
            <h1 className="text-3xl font-bold mt-1">Keeping Your M-Pesa & Mobile Money Secure</h1>
          </div>
        </div>
        
        <div className="text-sm text-[var(--text-muted)] mb-6">7 min read</div>

        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-lg leading-relaxed">
            M-Pesa and mobile money have revolutionized financial access in Kenya, but convenience comes with risk. SIM swap fraud, social engineering, and PIN theft drain accounts daily—and recovery is often impossible. Unlike bank accounts with fraud protection, mobile money losses are frequently permanent. Let's explore comprehensive security strategies to protect your mobile wallet from the growing sophistication of digital thieves.
          </p>

          <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-6 border-l-4 border-red-500">
            <h3 className="font-bold text-lg mb-2 text-red-600 dark:text-red-400">The Stakes Are High</h3>
            <p className="text-sm">
              M-Pesa processes over KES 11 trillion annually in Kenya. Criminals know this and have industrialized theft—organized gangs with insiders at telecoms, sophisticated phishing operations, and AI-powered social engineering. Your mobile money is a prime target, and the responsibility to protect it falls entirely on you.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Top Mobile Money Threats</h2>

          <div className="space-y-4">
            <div className="card bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border-2 border-red-200 dark:border-red-800">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span>📱</span> SIM Swap Fraud
              </h3>
              <p className="text-sm mb-3"><strong>How it works:</strong> Criminals impersonate you at Safaricom/Airtel shop, claim "lost SIM," get new SIM with your number.</p>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-4 text-sm">
                <strong className="block mb-2">Within minutes they:</strong>
                <ul className="list-disc list-inside space-y-1">
                  <li>Reset your M-Pesa PIN via SMS</li>
                  <li>Transfer all funds out</li>
                  <li>Change security settings</li>
                  <li>Lock you out completely</li>
                </ul>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-3"><strong>Prevention:</strong> Require biometric verification for SIM replacement, use M-Pesa lock.</p>
            </div>

            <div className="card bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 border-2 border-amber-200 dark:border-amber-800">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span>🎣</span> Phishing & Social Engineering
              </h3>
              <p className="text-sm mb-3"><strong>Common tactics:</strong></p>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li>"You've won KES 50K! Send KES 500 processing fee to claim"</li>
                <li>"We're from Safaricom, confirm your PIN to unlock account"</li>
                <li>Fake M-Pesa notification: "You've received KES 10,000" (but you didn't)</li>
                <li>"Emergency! Send money now, I'll explain later" (impersonating family)</li>
              </ul>
            </div>

            <div className="card bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-2 border-purple-200 dark:border-purple-800">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span>🔑</span> PIN Theft & Shoulder Surfing
              </h3>
              <p className="text-sm">
                Watching you enter PIN at the matatu stage, ATM, shop. Or tricking you into revealing it: "Type your PIN to verify" scams.
              </p>
            </div>

            <div className="card bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border-2 border-blue-200 dark:border-blue-800">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span>💻</span> Malware & Fake Apps
              </h3>
              <p className="text-sm">
                Fake M-Pesa apps in third-party stores, malware that intercepts SMS codes, screen recorders that capture PINs.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Essential Security Measures</h2>

          <div className="space-y-4">
            <div className="card bg-green-50 dark:bg-green-900/10 border-l-4 border-green-500">
              <h3 className="font-bold text-lg mb-3">1. 🔢 Strong PIN Management</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>✅ DO:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Use unique 4-digit PIN (not birth year, 1234, phone number)</li>
                    <li>Change PIN every 3-6 months</li>
                    <li>Use different PINs for M-Pesa, Airtel Money, bank cards</li>
                    <li>Memorize—never write down or save in phone</li>
                  </ul>
                </div>
                <div>
                  <strong>❌ DON'T:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Share PIN with anyone (even family during emergencies)</li>
                    <li>Use same PIN for multiple services</li>
                    <li>Save PIN in notes, contacts, or messages</li>
                    <li>Let others "borrow" your phone for M-Pesa transactions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500">
              <h3 className="font-bold text-lg mb-3">2. 🔒 Enable M-Pesa Lock</h3>
              <p className="text-sm mb-3">Dial *234*1*5# to activate M-Pesa lock—requires PIN to access app.</p>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-3 text-sm">
                <strong>Why it matters:</strong> Even if someone steals your phone unlocked, they can't access M-Pesa without the lock PIN (separate from phone PIN).
              </div>
            </div>

            <div className="card bg-purple-50 dark:bg-purple-900/10 border-l-4 border-purple-500">
              <h3 className="font-bold text-lg mb-3">3. 📲 SIM Security</h3>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li><strong>Register biometrics:</strong> Visit Safaricom/Airtel shop, link fingerprints to SIM</li>
                <li><strong>Set SIM PIN:</strong> Requires PIN to use SIM even if moved to another phone</li>
                <li><strong>Monitor for network loss:</strong> Sudden "no service" = possible SIM swap in progress</li>
                <li><strong>Use eSIM if available:</strong> Can't be physically swapped</li>
              </ul>
            </div>

            <div className="card bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500">
              <h3 className="font-bold text-lg mb-3">4. 📱 Phone Security</h3>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li><strong>Screen lock:</strong> Biometric (fingerprint/face) + strong backup PIN/pattern</li>
                <li><strong>Auto-lock:</strong> Set to 30 seconds—never leave phone unattended unlocked</li>
                <li><strong>Disable lock screen notifications:</strong> Prevents SMS codes showing on locked screen</li>
                <li><strong>Enable Find My Device:</strong> Remote wipe if phone stolen</li>
              </ul>
            </div>

            <div className="card bg-indigo-50 dark:bg-indigo-900/10 border-l-4 border-indigo-500">
              <h3 className="font-bold text-lg mb-3">5. ✉️ SMS & Notification Hygiene</h3>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li><strong>Delete transaction confirmations:</strong> Don't leave paper trail of PINs/receipts</li>
                <li><strong>Screenshot sparingly:</strong> If you must, delete immediately after use</li>
                <li><strong>Check sender ID:</strong> Real M-Pesa messages come from "M-PESA" only</li>
                <li><strong>Never click links:</strong> M-Pesa doesn't send links via SMS</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Red Flags: Spotting Scams</h2>

          <div className="space-y-3">
            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <strong className="text-red-600 dark:text-red-400">🚩 Urgent pressure:</strong>
              <p className="text-sm mt-1">"Send money NOW or account will be blocked" = scam. Legit companies never rush you.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <strong className="text-red-600 dark:text-red-400">🚩 Requesting PIN/password:</strong>
              <p className="text-sm mt-1">No legitimate entity EVER asks for your PIN. Not Safaricom, not police, not bank. Zero exceptions.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <strong className="text-red-600 dark:text-red-400">🚩 Too good to be true:</strong>
              <p className="text-sm mt-1">"You won lottery you didn't enter" or "Double your money in 24 hours" = guaranteed scam.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <strong className="text-red-600 dark:text-red-400">🚩 Typos/poor grammar:</strong>
              <p className="text-sm mt-1">Official communications are professionally written. "Dearr custommer you have won" = fake.</p>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
              <strong className="text-red-600 dark:text-red-400">🚩 Unexpected codes:</strong>
              <p className="text-sm mt-1">Got OTP or verification code you didn't request? Someone's trying to access your account.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">If You Suspect SIM Swap or Fraud</h2>

          <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-6 border-2 border-red-500">
            <h3 className="font-bold text-lg mb-4">IMMEDIATE ACTIONS (Do in this order):</h3>
            <ol className="space-y-3 text-sm list-decimal list-inside">
              <li>
                <strong>Call Safaricom/Airtel immediately:</strong>
                <p className="ml-6 mt-1">Safaricom: 100 or 0722000000 | Airtel: 234 or 0734000234</p>
                <p className="ml-6 text-xs text-[var(--text-muted)]">Report SIM swap fraud, request SIM block</p>
              </li>
              <li>
                <strong>Lock M-Pesa remotely:</strong>
                <p className="ml-6 mt-1">Use friend's phone to dial *234*1*5# or call customer care</p>
              </li>
              <li>
                <strong>Check M-Pesa balance & transactions:</strong>
                <p className="ml-6 mt-1">If you still have access, transfer funds to secure account</p>
              </li>
              <li>
                <strong>Visit nearest Safaricom/Airtel shop:</strong>
                <p className="ml-6 mt-1">Bring ID, file official report, get new SIM with biometric verification</p>
              </li>
              <li>
                <strong>File police report:</strong>
                <p className="ml-6 mt-1">Required for insurance claims, potential recovery</p>
              </li>
              <li>
                <strong>Change all PINs and passwords:</strong>
                <p className="ml-6 mt-1">M-Pesa, mobile banking, email—assume everything compromised</p>
              </li>
            </ol>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Smart Money Habits</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card bg-green-50 dark:bg-green-900/10">
              <h3 className="font-bold mb-3">✅ DO:</h3>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li>Transfer large balances to bank daily</li>
                <li>Keep only spending money in M-Pesa</li>
                <li>Use M-Pesa lock when not actively transacting</li>
                <li>Verify recipient number twice before sending</li>
                <li>Save frequent contacts for easier verification</li>
                <li>Check balance regularly (daily if active user)</li>
              </ul>
            </div>

            <div className="card bg-red-50 dark:bg-red-900/10">
              <h3 className="font-bold mb-3 text-red-600 dark:text-red-400">❌ DON'T:</h3>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li>Store large amounts in M-Pesa (KES 100K+)</li>
                <li>Share phone or PIN with anyone</li>
                <li>Click links in unsolicited messages</li>
                <li>Respond to "wrong number" M-Pesa messages</li>
                <li>Use M-Pesa on public/shared WiFi</li>
                <li>Leave M-Pesa menu open in public</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Transaction Verification Checklist</h2>

          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="font-bold mb-3">Before hitting "Send":</h3>
            <div className="space-y-2 text-sm">
              <label className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" disabled />
                <span>Correct recipient number? (Read it out loud)</span>
              </label>
              <label className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" disabled />
                <span>Correct amount? (Check twice for decimal placement)</span>
              </label>
              <label className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" disabled />
                <span>Do I actually know this person/business?</span>
              </label>
              <label className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" disabled />
                <span>Did they request this through verified channel?</span>
              </label>
              <label className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" disabled />
                <span>Am I being pressured or rushed?</span>
              </label>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-4 italic">
              M-Pesa is instant and irreversible. Take 10 extra seconds to verify—it's worth it.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Additional Security Tools</h2>

          <div className="space-y-4">
            <div className="card border-l-4 border-green-500">
              <h3 className="font-bold mb-2">M-Pesa Transaction Limits</h3>
              <p className="text-sm">Set daily/per-transaction limits via *234*6#. Restricts maximum damage if compromised.</p>
            </div>

            <div className="card border-l-4 border-blue-500">
              <h3 className="font-bold mb-2">Fuliza Management</h3>
              <p className="text-sm">If you don't use overdraft, deactivate Fuliza. Prevents fraudsters from borrowing against your limit.</p>
            </div>

            <div className="card border-l-4 border-purple-500">
              <h3 className="font-bold mb-2">M-Pesa Statements</h3>
              <p className="text-sm">Request monthly statements via *234*9#. Review for unauthorized transactions you might have missed.</p>
            </div>

            <div className="card border-l-4 border-amber-500">
              <h3 className="font-bold mb-2">Biometric Authentication</h3>
              <p className="text-sm">Some devices support fingerprint for M-Pesa app. Enable if available—adds extra layer.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-6 my-8 border-2 border-green-200 dark:border-green-800">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span>🎯</span> The Bottom Line
            </h3>
            <p>
              M-Pesa security is your responsibility—the platform is secure, but human errors and social engineering defeat technology. Never share your PIN, enable M-Pesa lock, keep minimal balance, and verify every transaction twice. SIM swap fraud is rampant—register biometrics at your telco shop immediately if you haven't. Treat mobile money like cash: you wouldn't walk around with KES 200K in your pocket, so don't leave it in M-Pesa either. Transfer large balances to bank accounts daily, stay paranoid about phishing, and remember: if someone asks for your PIN, it's a scam. No exceptions. Ever.
            </p>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-6 mt-8">
            <h3 className="font-bold mb-3">Related Articles:</h3>
            <div className="space-y-2">
              <Link to="/blog/separate-accounts" className="text-blue-600 hover:text-blue-700 block">
                → Why You Need Multiple Bank Accounts
              </Link>
              <Link to="/blog/monitor-accounts-regularly" className="text-blue-600 hover:text-blue-700 block">
                → Why You Should Monitor Bank Accounts Regularly
              </Link>
              <Link to="/blog/emergency-fund-guide" className="text-blue-600 hover:text-blue-700 block">
                → Building Your Emergency Fund: A Complete Guide
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
