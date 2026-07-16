import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "", full_name: "", company_name: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error("Passwords do not match"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await signUp(form.email, form.password, { full_name: form.full_name, company_name: form.company_name, role: "user" });
      toast.success("Registration successful! Check your email to confirm.");
      navigate("/login");
    } catch (err) { toast.error(err.message || "Registration failed"); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-safety-800 to-safety-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-safety-600 rounded-xl flex items-center justify-center mx-auto mb-4"><span className="text-white text-2xl font-bold">SS</span></div>
          <h2 className="text-2xl font-bold">Create account</h2>
          <p className="text-gray-500 mt-1">Join SafetyStack today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4"><div><label className="label">Full Name</label><input type="text" className="input" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} /></div><div><label className="label">Company</label><input type="text" className="input" value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} /></div></div>
          <div><label className="label">Email</label><input type="email" className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="label">Password</label><input type="password" className="input" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div><div><label className="label">Confirm</label><input type="password" className="input" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} /></div></div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">{loading ? "Creating account..." : "Register"}</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">Already have an account? <Link to="/login" className="text-safety-600 font-medium hover:underline">Sign in</Link></p>
      </div>
    </div>
  );
}
