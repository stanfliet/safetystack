import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable, { Modal } from "../../components/ui/DataTable";
import toast from "react-hot-toast";

export default function RiskAssessments() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: "", project_id: "", assessment_type: "task_specific", activity: "", location: "" });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const [r, p] = await Promise.all([
      supabase.from("risk_assessments").select("*, projects(name)").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("projects").select("id,name").eq("user_id", user.id)
    ]);
    if (!r.error) setItems(r.data || []);
    if (!p.error) setProjects(p.data || []);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.title || !form.project_id) { toast.error("Title and project required"); return; }
    const { error } = await supabase.from("risk_assessments").insert({ ...form, user_id: user.id, risks: [], status: "draft" });
    if (error) { toast.error(error.message); return; }
    toast.success("Risk assessment created"); setShowNew(false); fetchData();
  }

  const cols = [
    { Header: "Title", accessor: "title", cell: r => <span className="font-medium">{r.title}</span> },
    { Header: "Project", accessor: "projects.name" },
    { Header: "Type", accessor: "assessment_type", cell: r => <span className="capitalize">{r.assessment_type?.replace(/_/g, " ")}</span> },
    { Header: "Status", accessor: "status", cell: r => { const s = { draft: "badge-neutral", reviewed: "badge-info", approved: "badge-success" }; return <span className={s[r.status]}>{r.status}</span>; } }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold">Risk Assessments</h2><p className="text-gray-500 mt-1">{items.length} assessment{items.length !== 1 ? "s" : ""}</p></div>
        <button onClick={() => setShowNew(true)} className="btn-primary">New Assessment</button>
      </div>
      <DataTable columns={cols} data={items} loading={loading} searchable emptyMessage="No risk assessments yet." />
      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="New Risk Assessment">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="label">Title *</label><input type="text" className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="label">Project *</label><select className="input" value={form.project_id} onChange={e => setForm({ ...form, project_id: e.target.value })}><option value="">Select...</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="label">Type</label><select className="input" value={form.assessment_type} onChange={e => setForm({ ...form, assessment_type: e.target.value })}><option value="baseline">Baseline</option><option value="task_specific">Task-Specific</option><option value="continuous">Continuous</option></select></div><div><label className="label">Activity</label><input type="text" className="input" value={form.activity} onChange={e => setForm({ ...form, activity: e.target.value })} /></div></div>
          <button type="submit" className="btn-primary w-full">Create</button>
        </form>
      </Modal>
    </div>
  );
}
