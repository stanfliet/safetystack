import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable, { Modal } from "../../components/ui/DataTable";
import toast from "react-hot-toast";

export default function VariationTracking() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: "", variation_type: "variation_order", description: "", value_change: "", project_id: "" });

  useEffect(() => { fetchProjects(); }, []);

  async function fetchProjects() {
    const { data } = await supabase.from("projects").select("id,name").eq("user_id", user.id);
    setProjects(data || []);
  }

  useEffect(() => {
    if (selectedProject) fetchVariations();
  }, [selectedProject]);

  async function fetchVariations() {
    setLoading(true);
    const { data } = await supabase.from("variations").select("*").eq("project_id", selectedProject).order("created_at", { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.title || !form.project_id) { toast.error("Title and project required"); return; }
    const { error } = await supabase.from("variations").insert({
      ...form, user_id: user.id,
      value_change: parseFloat(form.value_change) || 0,
      status: "draft"
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Variation created"); setShowNew(false); fetchVariations();
  }

  const st = { draft: "badge-neutral", approved: "badge-success", rejected: "badge-danger", pending: "badge-warning" };
  const cols = [
    { Header: "Title", accessor: "title", cell: r => <span className="font-medium">{r.title}</span> },
    { Header: "Type", accessor: "variation_type", cell: r => <span className="capitalize">{r.variation_type?.replace(/_/g, " ")}</span> },
    { Header: "Value Change", accessor: "value_change", cell: r => {
      const v = Number(r.value_change);
      return <span className={"font-semibold " + (v >= 0 ? "text-red-600" : "text-green-600")}>R {v.toLocaleString()}</span>;
    }},
    { Header: "Status", accessor: "status", cell: r => <span className={st[r.status]}>{r.status}</span> },
  ];

  const totalVariation = items.reduce((sum, i) => sum + (parseFloat(i.value_change) || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold">Variation Tracking</h2><p className="text-gray-500 mt-1">Contract variations, EOT claims and scope changes</p></div>
        <button onClick={() => setShowNew(true)} className="btn-primary">New Variation</button>
      </div>
      <div className="mb-4">
        <select className="input max-w-xs" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
          <option value="">Select a project...</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      {selectedProject && (
        <div className="mb-4 card p-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">Net Variation</p>
          <p className={"text-2xl font-bold " + (totalVariation >= 0 ? "text-red-600" : "text-green-600")}>
            R {totalVariation.toLocaleString()}
          </p>
        </div>
      )}
      <DataTable columns={cols} data={items} loading={loading} searchable emptyMessage="Select a project or create a variation." />
      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="New Variation">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="label">Project *</label>
            <select className="input" value={form.project_id} onChange={e => setForm({ ...form, project_id: e.target.value })} required>
              <option value="">Select...</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div><label className="label">Title *</label><input type="text" className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Type</label>
              <select className="input" value={form.variation_type} onChange={e => setForm({ ...form, variation_type: e.target.value })}>
                <option value="variation_order">Variation Order</option>
                <option value="eot_claim">EOT Claim</option>
                <option value="scope_change">Scope Change</option>
                <option value="dayworks">Dayworks</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div><label className="label">Value Change (ZAR)</label><input type="number" className="input" value={form.value_change} onChange={e => setForm({ ...form, value_change: e.target.value })} /></div>
          </div>
          <div><label className="label">Description</label><textarea className="input" rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <button type="submit" className="btn-primary w-full">Create Variation</button>
        </form>
      </Modal>
    </div>
  );
}
