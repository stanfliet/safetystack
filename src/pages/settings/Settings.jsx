import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export default function Settings() {
  const { profile, updateProfile, signOut } = useAuth();
  const [form, setForm] = useState({ full_name: profile?.full_name||"", company_name: profile?.company_name||"", phone: profile?.phone||"" });
  const [saving, setSaving] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try { await updateProfile(form); toast.success("Profile updated"); }
    catch(err) { toast.error(err.message); }
    finally { setSaving(false); }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><h2 className="text-2xl font-bold">Settings</h2><p className="text-gray-500 mt-1">Manage your account settings</p></div>

      <div className="card"><div className="card-header"><h3 className="text-lg font-semibold">Profile</h3></div>
        <div className="card-body">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="label">Full Name</label><input type="text" className="input" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} /></div>
              <div><label className="label">Company</label><input type="text" className="input" value={form.company_name} onChange={e=>setForm({...form,company_name:e.target.value})} /></div>
              <div><label className="label">Phone</label><input type="text" className="input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
              <div><label className="label">Email</label><input type="email" className="input bg-gray-50" value={profile?.email||""} disabled /></div>
            </div>
            <button type="submit" disabled={saving} className="btn-primary">{saving?"Saving...":"Save Changes"}</button>
          </form>
        </div>
      </div>

      <div className="card"><div className="card-header"><h3 className="text-lg font-semibold">Account</h3></div>
        <div className="card-body space-y-4">
          <p className="text-sm text-gray-500">Your account role: <span className="font-medium capitalize">{profile?.role||"user"}</span></p>
          <p className="text-sm text-gray-500">Member since: {profile?.created_at?new Date(profile.created_at).toLocaleDateString():"-"}</p>
          <button onClick={signOut} className="btn-danger">Sign Out</button>
        </div>
      </div>
    </div>
  );
}
