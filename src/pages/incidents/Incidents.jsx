import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable, { Modal } from "../../components/ui/DataTable";
import toast from "react-hot-toast";

export default function Incidents() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: "", project_id: "", incident_type: "near_miss", severity: "medium", incident_date: "", description: "" });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const [i, p] = await Promise.all([
      supabase.from("incidents").select("*, projects(name)").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("projects").select("id,name").eq("user_id", user.id)
    ]);
    if (!i.error) setItems(i.data || []);
    if (!p.error) setProjects(p.data || []);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.title || !form.project_id) { toast.error("Title and project required"); return; }
    const { error } = await supabase.from("incidents").insert({ ...form, user_id: user.id, status: "reported" });
    if (error) { toast.error(error.message); return; }
    toast.success("Incident reported"); setShowNew(false); fetchData();
  }

  const sev = { low: "badge-success", medium: "badge-warning", high: "badge-danger", critical: "badge-danger" };
  const cols = [
    { Header: "Title", accessor: "title", cell: r => <span className="font-medium">{r.title}</span> },
    { Header: "Project", accessor: "projects.name" },
    { Header: "Type", accessor: "incident_type", cell: r => <span className="capitalize">{r.incident_type?.replace(/_/g, " ")}</span> },
    { Header: "Severity", accessor: "severity", cell: r => <span className={sev[r.severity]}>{r.severity}</span> },
    { Header: "Status", accessor: "status", cell: r => { const s = { reported: "badge-info", under_investigation: "badge-warning", corrective_action: "badge-neutral", closed: "badge-success" }; return <span className={s[r.status]}>{r.status?.replace(/_/g, " ")}</span>; } }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold">Incidents</h2><p className="text-gray-500 mt-1">{items.length} incident{items.length !== 1 ? "s" : ""}</p></div>
        <button onClick={() => setShowNew(true)} className="btn-primary">Report Incident</button>
      </div>
      <DataTable columns={cols} data={items} loading={loading} searchable emptyMessage="No incidents reported." />
      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="Report Incident">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="label">Title *</label><input type="text" className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="label">Project *</label><select className="input" value={form.project_id} onChange={e => setForm({ ...form, project_id: e.target.value })}><option value="">Select...</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Type</label><select className="input" value={form.incident_type} onChange={e => setForm({ ...form, incident_type: e.target.value })}><option value="near_miss">Near Miss</option><option value="first_aid">First Aid</option><option value="medical_treatment">Medical Treatment</option><option value="lost_time">Lost Time</option><option value="fatality">Fatality</option><option value="environmental">Environmental</option><option value="property_damage">Property Damage</option></select></div>
            <div><label className="label">Severity</label><select className="input" value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select></div>
          </div>
          <div><label className="label">Date</label><input type="date" className="input" value={form.incident_date} onChange={e => setForm({ ...form, incident_date: e.target.value })} /></div>
          <div><label className="label">Description</label><textarea className="input" rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <button type="submit" className="btn-primary w-full">Report</button>
        </form>
      </Modal>
    </div>
  );
}
