import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields"); return; }
    setLoading(true);
    try { await signIn(email, password); toast.success("Welcome back!"); }
    catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-safety-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to SafetyStack</h1>
            <p className="text-gray-500 mt-2">Sign in to your OHS compliance account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label className="label">Email address</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@company.co.za" required /></div>
            <div><label className="label">Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="Enter your password" required /></div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-gray-300 text-safety-600" /><span className="text-sm text-gray-600">Remember me</span></label>
              <Link to="/reset-password" className="text-sm text-safety-600 hover:text-safety-700 font-medium">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Signing in..." : "Sign in"}</button>
          </form>
          <p className="text-center mt-6 text-sm text-gray-500">Don't have an account? <Link to="/register" className="text-safety-600 hover:text-safety-700 font-medium">Create one</Link></p>
        </div>
      </div>
      <div className="hidden lg:flex flex-1 bg-safety-950 items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <h2 className="text-3xl font-bold mb-4">South Africa's #1 Construction OHS Platform</h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>AI-powered document generation in seconds</li>
            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Real-time compliance tracking across all projects</li>
            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Built for SA OHS Act 85 of 1993 & Construction Regulations</li>
            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>7 specialised AI expert agents for every discipline</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
