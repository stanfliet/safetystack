import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) { toast.error("Please enter your email"); return; }
    setLoading(true);
    try { await resetPassword(email); setSent(true); toast.success("Reset link sent!"); }
    catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="w-12 h-12 bg-safety-600 rounded-xl flex items-center justify-center mx-auto mb-4"><svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div>
        <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
        {!sent ? (
          <><p className="text-gray-500 mb-6">Enter your email and we'll send you a reset link</p>
          <form onSubmit={handleSubmit} className="space-y-4"><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@company.co.za" /><button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Sending..." : "Send reset link"}</button></form></>
        ) : <p className="text-gray-500 mb-6">Check your email for the reset link</p>}
        <p className="mt-6 text-sm text-gray-500"><Link to="/login" className="text-safety-600 font-medium">Back to sign in</Link></p>
      </div>
    </div>
  );
}
