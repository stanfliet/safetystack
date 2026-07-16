import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable, { Modal } from "../../components/ui/DataTable";
import toast from "react-hot-toast";

export default function HealthSafetyHub() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({
    title: "", project_id: "", client: "", site_address: "",
    scope_of_works: "", principal_contractor: "", safety_officer: "",
    number_of_workers: "", project_duration: "", logo_url: ""
  });
  const [generating, setGenerating] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const [f, p] = await Promise.all([
      supabase.from("hs_files").select("*, projects(name)").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("projects").select("id,name").eq("user_id", user.id)
    ]);
    if (!f.error) setFiles(f.data || []);
    if (!p.error) setProjects(p.data || []);
    setLoading(false);
  }

  async function handleGenerate(e) {
    e.preventDefault();
    if (!form.title || !form.project_id) { toast.error("Title and project required"); return; }
    setGenerating(true);
    try {
      const { data: projectDocs } = await supabase.from("hs_documents")
        .select("*").eq("project_id", form.project_id);
      const docs = projectDocs || [];

      const res = await fetch("/api/generate-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_data: form,
          documents: docs.map(d => ({ name: d.title || d.original_name, type: d.document_type || d.file_type }))
        })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Generation failed");

      const { error } = await supabase.from("hs_files").insert({
        title: form.title, project_id: form.project_id, user_id: user.id,
        content: result.content, status: "generated", version: 1
      });
      if (error) throw error;

      toast.success("H&S File generated successfully!");
      setShowNew(false);
      fetchData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setGenerating(false);
    }
  }

  const statusStyles = { draft: "badge-neutral", generated: "badge-info", reviewed: "badge-warning", approved: "badge-success" };

  const cols = [
    { Header: "Title", accessor: "title", cell: r => (
      <button onClick={() => navigate("/health-safety/" + r.id)} className="font-medium text-safety-600 hover:text-safety-800 text-left">
        {r.title}
      </button>
    )},
    { Header: "Project", accessor: "projects.name" },
    { Header: "Version", accessor: "version" },
    { Header: "Status", accessor: "status", cell: r => <span className={statusStyles[r.status] || "badge-neutral"}>{r.status}</span> },
    { Header: "Created", accessor: "created_at", cell: r => new Date(r.created_at).toLocaleDateString() },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Health & Safety Files</h2>
          <p className="text-gray-500 mt-1">Complete H&S file management with AI generation</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowNew(true)} className="btn-primary">Generate New H&S File</button>
        </div>
      </div>
      <DataTable columns={cols} data={files} loading={loading} searchable
        emptyMessage="No H&S files yet." />
      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="Generate Complete H&S File" size="lg">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Title *</label>
              <input type="text" className="input" value={form.title}
                onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div>
              <label className="label">Project *</label>
              <select className="input" value={form.project_id}
                onChange={e => setForm({...form, project_id: e.target.value})}>
                <option value="">Select project...</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Client</label>
              <input type="text" className="input" value={form.client}
                onChange={e => setForm({...form, client: e.target.value})} />
            </div>
            <div>
              <label className="label">Site Address</label>
              <input type="text" className="input" value={form.site_address}
                onChange={e => setForm({...form, site_address: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="label">Scope of Works</label>
            <textarea className="input" rows={2} value={form.scope_of_works}
              onChange={e => setForm({...form, scope_of_works: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Principal Contractor</label><input type="text" className="input" value={form.principal_contractor} onChange={e => setForm({...form, principal_contractor: e.target.value})} /></div>
            <div><label className="label">Safety Officer</label><input type="text" className="input" value={form.safety_officer} onChange={e => setForm({...form, safety_officer: e.target.value})} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Number of Workers</label><input type="number" className="input" value={form.number_of_workers} onChange={e => setForm({...form, number_of_workers: e.target.value})} /></div>
            <div><label className="label">Project Duration</label><input type="text" className="input" value={form.project_duration} onChange={e => setForm({...form, project_duration: e.target.value})} /></div>
          </div>
          <div><label className="label">Company Logo URL (optional)</label><input type="url" className="input" value={form.logo_url} onChange={e => setForm({...form, logo_url: e.target.value})} /></div>
          <button type="submit" className="btn-primary w-full" disabled={generating}>
            {generating ? "Generating... (1-2 mins)" : "Generate Complete H&S File"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
