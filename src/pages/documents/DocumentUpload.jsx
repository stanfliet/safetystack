import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const ANALYSIS_TYPES = [
  { value: "general", label: "General Analysis" },
  { value: "hs_file", label: "H&S File Extraction" },
  { value: "boq", label: "Bill of Quantities" },
  { value: "scope", label: "Scope of Works" },
  { value: "compliance", label: "Compliance Requirements" },
];

export default function DocumentUpload() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({ project_id: "", title: "", analysis_type: "general", description: "" });
  const [aiResult, setAiResult] = useState(null);

  useEffect(() => {
    supabase.from("projects").select("id,name").eq("user_id", user.id).then(({ data }) => setProjects(data || []));
  }, [user.id]);

  const handleFiles = (selected) => {
    const valid = Array.from(selected).filter(f =>
      f.name.match(/\.(pdf|docx?|xlsx?|xls|csv|txt|json|xml|html?|jpe?g|png|gif|webp|tiff)$/i)
    );
    setFiles(prev => [...prev, ...valid]);
  };

  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.project_id || !form.title) { toast.error("Project and title required"); return; }
    if (files.length === 0) { toast.error("Select at least one file"); return; }
    setUploading(true);
    setAiResult(null);

    try {
      // Upload to Supabase Storage
      const uploaded = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split(".").pop();
        const path = `${user.id}/${Date.now()}_${i}.${ext}`;
        const { error: upErr } = await supabase.storage.from("documents").upload(path, file);
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabase.storage.from("documents").getPublicUrl(path);
        uploaded.push({
          project_id: form.project_id, user_id: user.id, title: form.title + (files.length > 1 ? ` (${i + 1})` : ""),
          description: form.description, document_type: form.analysis_type, file_url: publicUrl,
          original_name: file.name, file_type: ext, file_size: file.size, status: "uploaded", version: 1
        });
      }

      // Save to DB
      const { error: insErr } = await supabase.from("documents").insert(uploaded);
      if (insErr) throw insErr;
      toast.success(`${uploaded.length} file(s) uploaded`);

      // AI Analysis via API
      try {
        const formData = new FormData();
        files.forEach(f => formData.append("files", f));
        formData.append("project_id", form.project_id);
        formData.append("user_id", user.id);
        formData.append("analysis_type", form.analysis_type);

        const res = await fetch("/api/upload-and-analyze", {
          method: "POST",
          headers: { "x-analysis-type": form.analysis_type },
          body: formData
        });
        const data = await res.json();
        if (data.success && data.analysis) {
          setAiResult(data.analysis);
          toast.success("AI analysis complete!");
        }
      } catch (aiErr) {
        console.warn("AI analysis unavailable:", aiErr.message);
      }

      // Reset form
      setForm({ project_id: "", title: "", analysis_type: "general", description: "" });
      setFiles([]);
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Upload & Analyze Documents</h2>
        <p className="text-gray-500 mt-1">Upload any document type — AI extracts scope, BOQ items, H&S requirements, or compliance info</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card"><div className="card-body space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Project *</label>
              <select className="input" value={form.project_id} onChange={e => setForm({...form, project_id: e.target.value})} required>
                <option value="">Select project...</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Analysis Type</label>
              <select className="input" value={form.analysis_type} onChange={e => setForm({...form, analysis_type: e.target.value})}>
                {ANALYSIS_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div><label className="label">Document Title *</label><input type="text" className="input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Main Building Scope of Works" required /></div>
          <div><label className="label">Description</label><textarea className="input" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Brief description..." /></div>
        </div></div>

        <div className="card"><div className="card-header"><h3 className="font-semibold">Upload Files</h3></div><div className="card-body">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-safety-500 transition-colors cursor-pointer"
            onClick={() => document.getElementById("file-input").click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}>
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            <p className="mt-2 text-sm text-gray-600">Drag & drop or click to browse — PDF, DOCX, XLSX, Images, TXT, CSV</p>
            <input id="file-input" type="file" multiple className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.json,.xml,.html,.jpg,.jpeg,.png,.gif,.webp" onChange={e => { handleFiles(e.target.files); e.target.value = ""; }} />
          </div>

          {files.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {files.map((f, i) => (
                <span key={i} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm">
                  <span className="w-2 h-2 rounded-full bg-safety-500" />
                  {f.name}
                  <button type="button" onClick={() => removeFile(i)} className="text-red-500 hover:text-red-700 text-lg leading-none">&times;</button>
                </span>
              ))}
            </div>
          )}
        </div></div>

        <button type="submit" disabled={uploading} className="btn-primary w-full py-3 text-base">
          {uploading ? "Uploading & Analyzing..." : `Upload & Analyze ${files.length > 0 ? `(${files.length} file${files.length > 1 ? "s" : ""})` : ""}`}
        </button>
      </form>

      {aiResult && (
        <div className="card mt-6">
          <div className="card-header"><h3 className="font-semibold text-green-800">AI Analysis Results</h3></div>
          <div className="card-body">
            <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">
              {JSON.stringify(aiResult, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
