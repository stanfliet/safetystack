import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable, { Modal } from "../../components/ui/DataTable";
import toast from "react-hot-toast";

export default function Inspections() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: "", project_id: "", inspection_type: "site_inspection" });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const [i, p] = await Promise.all([
      supabase.from("inspections").select("*, projects(name)").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("projects").select("id,name").eq("user_id", user.id)
    ]);
    if (!i.error) setItems(i.data || []);
    if (!p.error) setProjects(p.data || []);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.title || !form.project_id) { toast.error("Title and project required"); return; }
    const { error } = await supabase.from("inspections").insert({ ...form, user_id: user.id, status: "draft" });
    if (error) { toast.error(error.message); return; }
    toast.success("Inspection created"); setShowNew(false); fetchData();
  }

  const cols = [
    { Header: "Title", accessor: "title", cell: r => <span className="font-medium">{r.title}</span> },
    { Header: "Project", accessor: "projects.name" },
    { Header: "Type", accessor: "inspection_type", cell: r => <span className="capitalize">{r.inspection_type?.replace(/_/g, " ")}</span> },
    { Header: "Score", accessor: "overall_score", cell: r => r.overall_score != null ? <span className="font-medium">{r.overall_score}%</span> : "-" },
    { Header: "Status", accessor: "status", cell: r => { const s = { draft: "badge-neutral", in_progress: "badge-info", completed: "badge-success", requires_action: "badge-danger" }; return <span className={s[r.status]}>{r.status?.replace(/_/g, " ")}</span>; } }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold">Inspections</h2><p className="text-gray-500 mt-1">{items.length} inspection{items.length !== 1 ? "s" : ""}</p></div>
        <button onClick={() => setShowNew(true)} className="btn-primary">New Inspection</button>
      </div>
      <DataTable columns={cols} data={items} loading={loading} searchable emptyMessage="No inspections yet." />
      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="New Inspection">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="label">Title *</label><input type="text" className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="label">Project *</label><select className="input" value={form.project_id} onChange={e => setForm({ ...form, project_id: e.target.value })}><option value="">Select...</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <div><label className="label">Type</label><select className="input" value={form.inspection_type} onChange={e => setForm({ ...form, inspection_type: e.target.value })}><option value="site_inspection">Site Inspection</option><option value="safety_audit">Safety Audit</option><option value="compliance_check">Compliance Check</option><option value="equipment_check">Equipment Check</option><option value="environmental">Environmental</option></select></div>
          <button type="submit" className="btn-primary w-full">Create</button>
        </form>
      </Modal>
    </div>
  );
}
