import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const [form, setForm] = useState({ full_name: "", company_name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.password) { toast.error("Please fill in required fields"); return; }
    if (form.password !== form.confirmPassword) { toast.error("Passwords do not match"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try { await signUp(form.email, form.password, { full_name: form.full_name, company_name: form.company_name }); toast.success("Account created! Check your email to verify."); }
    catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex"><div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10"><div className="w-12 h-12 bg-safety-600 rounded-xl flex items-center justify-center mx-auto mb-4"><svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div><h1 className="text-2xl font-bold">Create Your Account</h1><p className="text-gray-500 mt-2">Start your 14-day free trial</p></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4"><div><label className="label">Full name *</label><input type="text" name="full_name" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} className="input" placeholder="John Dube" /></div><div><label className="label">Company</label><input type="text" name="company_name" value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} className="input" placeholder="BuildCorp SA" /></div></div>
          <div><label className="label">Email *</label><input type="email" name="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input" placeholder="you@company.co.za" /></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="label">Password *</label><input type="password" name="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="input" placeholder="Min 6 chars" /></div><div><label className="label">Confirm *</label><input type="password" name="confirmPassword" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} className="input" placeholder="Confirm" /></div></div>
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Creating account..." : "Create account"}</button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-500">Already have an account? <Link to="/login" className="text-safety-600 font-medium">Sign in</Link></p>
      </div>
    </div></div>
  );
}
