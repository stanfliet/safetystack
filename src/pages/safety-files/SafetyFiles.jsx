import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable, { Modal } from "../../components/ui/DataTable";
import toast from "react-hot-toast";

const DOC_TYPES = [
  { value: "safety_file", label: "Safety File" }, { value: "hs_policy", label: "H&S Policy" },
  { value: "appointment_letter", label: "Appointment Letter" }, { value: "method_statement", label: "Method Statement" },
  { value: "toolbox_talk", label: "Toolbox Talk" }, { value: "emergency_plan", label: "Emergency Plan" }
];

export default function SafetyFiles() {
  const { user } = useAuth();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: "", document_type: "safety_file", project_id: "" });
  const [projects, setProjects] = useState([]);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const [d, p] = await Promise.all([
      supabase.from("safety_documents").select("*, projects(name)").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("projects").select("id,name").eq("user_id", user.id)
    ]);
    if (!d.error) setDocs(d.data || []);
    if (!p.error) setProjects(p.data || []);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.title || !form.project_id) { toast.error("Title and project required"); return; }
    const { error } = await supabase.from("safety_documents").insert({ ...form, user_id: user.id, status: "draft", version: 1 });
    if (error) { toast.error(error.message); return; }
    toast.success("Document created"); setShowNew(false); fetchData();
  }

  const st = { draft: "badge-neutral", review: "badge-warning", approved: "badge-success", expired: "badge-danger" };
  const cols = [
    { Header: "Title", accessor: "title", cell: r => <span className="font-medium">{r.title}</span> },
    { Header: "Type", accessor: "document_type", cell: r => <span className="capitalize">{r.document_type?.replace(/_/g, " ")}</span> },
    { Header: "Project", accessor: "projects.name" },
    { Header: "Version", accessor: "version" },
    { Header: "Status", accessor: "status", cell: r => <span className={st[r.status]}>{r.status}</span> },
    { Header: "AI", accessor: "generated_by_ai", cell: r => r.generated_by_ai ? <span className="badge-info">AI</span> : <span className="badge-neutral">Manual</span> }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold">Safety Files</h2><p className="text-gray-500 mt-1">{docs.length} document{docs.length !== 1 ? "s" : ""}</p></div>
        <div className="flex gap-2"><button onClick={() => setShowNew(true)} className="btn-primary">New Document</button></div>
      </div>
      <DataTable columns={cols} data={docs} loading={loading} searchable emptyMessage="No safety documents yet." />
      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="New Document">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="label">Title *</label><input type="text" className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="label">Project *</label><select className="input" value={form.project_id} onChange={e => setForm({ ...form, project_id: e.target.value })}><option value="">Select project...</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <div><label className="label">Document Type</label><select className="input" value={form.document_type} onChange={e => setForm({ ...form, document_type: e.target.value })}>{DOC_TYPES.map(dt => <option key={dt.value} value={dt.value}>{dt.label}</option>)}</select></div>
          <button type="submit" className="btn-primary w-full">Create</button>
        </form>
      </Modal>
    </div>
  );
}
