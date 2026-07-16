import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) { toast.error("Email and password required"); return; }
    setLoading(true);
    try { await signIn(email, password); navigate("/"); toast.success("Welcome back!"); }
    catch (err) { toast.error(err.message || "Login failed"); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-safety-800 to-safety-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-safety-600 rounded-xl flex items-center justify-center mx-auto mb-4"><span className="text-white text-2xl font-bold">SS</span></div>
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-gray-500 mt-1">Sign in to SafetyStack</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="label">Email</label><input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" /></div>
          <div><label className="label">Password</label><input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} /></div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">{loading ? "Signing in..." : "Sign In"}</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">Don't have an account? <Link to="/register" className="text-safety-600 font-medium hover:underline">Register</Link></p>
      </div>
    </div>
  );
}
