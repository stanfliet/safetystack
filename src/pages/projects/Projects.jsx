import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable, { Modal } from "../../components/ui/DataTable";
import toast from "react-hot-toast";

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", client_name: "", site_address: "", project_type: "building", status: "planning" });

  useEffect(() => { fetchProjects(); }, []);

  async function fetchProjects() {
    const { data, error } = await supabase.from("projects").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (!error) setProjects(data || []);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.name) { toast.error("Project name required"); return; }
    const { error } = await supabase.from("projects").insert({ ...form, user_id: user.id });
    if (error) { toast.error(error.message); return; }
    toast.success("Project created"); setShowNew(false); fetchProjects();
  }

  const cols = [
    { Header: "Name", accessor: "name", cell: r => <span className="font-medium">{r.name}</span> },
    { Header: "Client", accessor: "client_name" },
    { Header: "Type", accessor: "project_type", cell: r => <span className="capitalize">{r.project_type?.replace(/_/g, " ")}</span> },
    { Header: "Status", accessor: "status", cell: r => { const s = { planning: "badge-info", active: "badge-success", on_hold: "badge-warning", completed: "badge-neutral", closed: "badge-neutral" }; return <span className={s[r.status]}>{r.status?.replace(/_/g, " ")}</span>; } },
    { Header: "Compliance", accessor: "compliance_score", cell: r => <span className="font-medium">{Math.round(r.compliance_score || 0)}%</span> }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold">Projects</h2><p className="text-gray-500 mt-1">{projects.length} project{projects.length !== 1 ? "s" : ""}</p></div>
        <button onClick={() => setShowNew(true)} className="btn-primary"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>New Project</button>
      </div>
      <DataTable columns={cols} data={projects} loading={loading} searchable emptyMessage="No projects yet. Create your first project!" />
      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="New Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="label">Project Name *</label><input type="text" className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Client</label><input type="text" className="input" value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })} /></div>
            <div><label className="label">Type</label><select className="input" value={form.project_type} onChange={e => setForm({ ...form, project_type: e.target.value })}><option value="roadworks">Roadworks</option><option value="housing">Housing</option><option value="civils">Civils</option><option value="building">Building</option><option value="infrastructure">Infrastructure</option><option value="other">Other</option></select></div>
          </div>
          <div><label className="label">Site Address</label><textarea className="input" rows="2" value={form.site_address} onChange={e => setForm({ ...form, site_address: e.target.value })} /></div>
          <button type="submit" className="btn-primary w-full">Create Project</button>
        </form>
      </Modal>
    </div>
  );
}
