import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export default function DocumentUpload() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [form, setForm] = useState({ project_id: "", title: "", document_type: "scope_of_works", description: "" });
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    supabase.from("projects").select("id,name").eq("user_id", user.id).then(({ data }) => setProjects(data || []));
  }, [user.id]);

  const handleFiles = (selectedFiles) => {
    const valid = Array.from(selectedFiles).filter(f => f.name.match(/\.(pdf|docx?|xlsx?|csv|txt|json|xml|html?|jpe?g|png|gif|webp)$/i));
    setFiles(prev => [...prev, ...valid]);
    valid.forEach(f => {
      if (f.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviews(p => [...p, { name: f.name, url: e.target.result, type: 'image' }]);
        reader.readAsDataURL(f);
      } else {
        setPreviews(p => [...p, { name: f.name, url: null, type: f.type }]);
      }
    });
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.project_id || !form.title) { toast.error("Project and title required"); return; }
    if (files.length === 0) { toast.error("Select at least one file"); return; }
    setUploading(true); setUploadProgress(0); setAiAnalysis(null);
    const uploadedDocs = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split('.').pop();
        const path = user.id + '/' + Date.now() + '_' + i + '.' + ext;
        const { error: uploadError } = await supabase.storage.from("documents").upload(path, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from("documents").getPublicUrl(path);
        uploadedDocs.push({ project_id: form.project_id, user_id: user.id, title: form.title + (files.length > 1 ? ' (' + (i + 1) + ')' : ''), description: form.description, document_type: form.document_type, file_url: publicUrl, original_name: file.name, file_type: ext, file_size: file.size, status: "uploaded", version: 1 });
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }
      const { error: insertError } = await supabase.from("safety_documents").insert(uploadedDocs);
      if (insertError) throw insertError;
      toast.success(uploadedDocs.length + ' file(s) uploaded successfully');

      try {
        const formData = new FormData();
        files.forEach(f => formData.append("files", f));
        formData.append("project_id", form.project_id);
        formData.append("user_id", user.id);
        const analysisRes = await fetch("/api/upload-and-analyze", { method: "POST", body: formData });
        const analysisData = await analysisRes.json();
        if (analysisData.success) { setAiAnalysis(analysisData.analysis); toast.success("AI analysis complete!"); }
      } catch (e) { console.warn("AI analysis unavailable:", e.message); }

      setForm({ project_id: "", title: "", document_type: "scope_of_works", description: "" });
      setFiles([]); setPreviews([]); setUploadProgress(0);
    } catch (err) { toast.error(err.message || "Upload failed"); }
    finally { setUploading(false); }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Upload Documents</h2>
        <p className="text-gray-500 mt-1">Upload scope of works, tender docs, BOQs, images - any format. AI extracts scope and generates H&S files.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card"><div className="card-body space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Project *</label><select className="input" value={form.project_id} onChange={e => setForm({...form, project_id: e.target.value})} required><option value="">Select project...</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
            <div><label className="label">Document Type</label><select className="input" value={form.document_type} onChange={e => setForm({...form, document_type: e.target.value})}>
              <option value="scope_of_works">Scope of Works</option><option value="tender_document">Tender Document</option><option value="bill_of_quantities">Bill of Quantities</option>
              <option value="safety_file">Safety File</option><option value="method_statement">Method Statement</option><option value="risk_assessment">Risk Assessment</option>
              <option value="contract">Contract</option><option value="drawing">Drawing / Plan</option><option value="photo">Site Photo / Image</option><option value="other">Other</option>
            </select></div>
          </div>
          <div><label className="label">Document Title *</label><input type="text" className="input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Main Building Scope of Works" required /></div>
          <div><label className="label">Description</label><textarea className="input" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Brief description..." /></div>
        </div></div>

        <div className="card"><div className="card-header"><h3 className="font-semibold">Upload Files</h3></div><div className="card-body">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-safety-500 transition-colors cursor-pointer"
            onClick={() => document.getElementById('file-input').click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}>
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            <p className="mt-2 text-sm text-gray-600">Drag & drop files or click to browse</p>
            <p className="text-xs text-gray-400 mt-1">PDF, DOCX, XLSX, Images (JPG, PNG, GIF), TXT, CSV, JSON</p>
            <input id="file-input" type="file" multiple className="hidden" onChange={e => { handleFiles(e.target.files); e.target.value = ''; }} accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.json,.xml,.html,.jpg,.jpeg,.png,.gif,.webp" />
          </div>

          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {previews.map((p, i) => (
                <div key={i} className="relative group border rounded-lg p-2 bg-gray-50">
                  {p.type === 'image' ? <img src={p.url} alt={p.name} className="h-20 w-full object-cover rounded" /> : <div className="h-20 flex items-center justify-center bg-gray-100 rounded"><svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg></div>}
                  <p className="text-xs truncate mt-1">{p.name}</p>
                  <button type="button" onClick={() => removeFile(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                </div>
              ))}
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-4"><div className="bg-gray-200 rounded-full h-2"><div className="bg-safety-600 h-2 rounded-full transition-all" style={{width: uploadProgress + '%'}} /></div><p className="text-xs text-gray-500 mt-1">Uploading... ' + uploadProgress + '%</p></div>
          )}

          {aiAnalysis && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">AI Analysis Complete</h4>
              {aiAnalysis.scope_of_works && <div className="mb-2"><p className="text-xs font-medium text-green-700">Detected Scope:</p><p className="text-sm text-green-900">' + aiAnalysis.scope_of_works.substring(0, 300) + '...</p></div>}
              {aiAnalysis.key_activities && <div><p className="text-xs font-medium text-green-700">Key Activities:</p><div className="flex flex-wrap gap-1 mt-1">{aiAnalysis.key_activities.slice(0, 5).map((a, i) => <span key={i} className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">{a}</span>)}</div></div>}
            </div>
          )}
        </div></div>

        <button type="submit" disabled={uploading} className="btn-primary w-full py-3 text-base">
          {uploading ? 'Uploading ' + uploadProgress + '%...' : 'Upload ' + (files.length > 0 ? '(' + files.length + ' files)' : '')}
        </button>
      </form>
    </div>
  );
}