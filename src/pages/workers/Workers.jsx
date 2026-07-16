import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable, { Modal } from "../../components/ui/DataTable";
import toast from "react-hot-toast";

export default function Workers() {
  const { user } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", id_number: "", role: "general", trade: "", project_id: "", induction_status: false });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const [w, p] = await Promise.all([
      supabase.from("workers").select("*, projects(name)").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("projects").select("id,name").eq("user_id", user.id)
    ]);
    if (!w.error) setWorkers(w.data || []);
    if (!p.error) setProjects(p.data || []);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.project_id) { toast.error("Name and project required"); return; }
    const { error } = await supabase.from("workers").insert({ ...form, user_id: user.id, status: "active" });
    if (error) { toast.error(error.message); return; }
    toast.success("Worker added"); setShowNew(false); fetchData();
  }

  const cols = [
    { Header: "Name", accessor: "first_name", cell: r => <span className="font-medium">{r.first_name} {r.last_name}</span> },
    { Header: "Project", accessor: "projects.name" },
    { Header: "Role", accessor: "role", cell: r => <span className="capitalize">{r.role?.replace(/_/g, " ")}</span> },
    { Header: "Trade", accessor: "trade" },
    { Header: "Inducted", accessor: "induction_status", cell: r => r.induction_status ? <span className="badge-success">Yes</span> : <span className="badge-danger">No</span> },
    { Header: "Status", accessor: "status", cell: r => { const s = { active: "badge-success", inactive: "badge-neutral", suspended: "badge-danger" }; return <span className={s[r.status]}>{r.status}</span>; } }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold">Workers</h2><p className="text-gray-500 mt-1">{workers.length} worker{workers.length !== 1 ? "s" : ""}</p></div>
        <button onClick={() => setShowNew(true)} className="btn-primary">Add Worker</button>
      </div>
      <DataTable columns={cols} data={workers} loading={loading} searchable emptyMessage="No workers yet." />
      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="Add Worker">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4"><div><label className="label">First Name *</label><input type="text" className="input" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} /></div><div><label className="label">Last Name *</label><input type="text" className="input" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} /></div></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="label">ID Number</label><input type="text" className="input" value={form.id_number} onChange={e => setForm({ ...form, id_number: e.target.value })} /></div><div><label className="label">Project *</label><select className="input" value={form.project_id} onChange={e => setForm({ ...form, project_id: e.target.value })}><option value="">Select...</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="label">Role</label><select className="input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}><option value="general">General Worker</option><option value="artisan">Artisan</option><option value="operator">Operator</option><option value="supervisor">Supervisor</option><option value="safety_officer">Safety Officer</option><option value="engineer">Engineer</option><option value="admin">Admin</option></select></div><div><label className="label">Trade</label><input type="text" className="input" value={form.trade} onChange={e => setForm({ ...form, trade: e.target.value })} placeholder="e.g. Welder, Rigger" /></div></div>
          <button type="submit" className="btn-primary w-full">Add Worker</button>
        </form>
      </Modal>
    </div>
  );
}
