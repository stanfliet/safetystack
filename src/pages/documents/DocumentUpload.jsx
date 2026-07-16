import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export default function DocumentUpload() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ project_id: "", title: "", document_type: "safety_file", file: null });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    supabase.from("projects").select("id,name").eq("user_id", user.id).then(({ data }) => setProjects(data || []));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.project_id || !form.title) { toast.error("Project and title required"); return; }
    setUploading(true);
    try {
      let fileUrl = null;
      if (form.file) {
        const ext = form.file.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("documents").upload(path, form.file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from("documents").getPublicUrl(path);
        fileUrl = publicUrl;
      }
      const { error } = await supabase.from("safety_documents").insert({
        project_id: form.project_id, user_id: user.id, title: form.title,
        document_type: form.document_type, file_url: fileUrl, status: "draft", version: 1
      });
      if (error) throw error;
      toast.success("Document uploaded");
      setForm({ project_id: "", title: "", document_type: "safety_file", file: null });
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6"><h2 className="text-2xl font-bold">Upload Document</h2><p className="text-gray-500 mt-1">Upload OHS documents to a project</p></div>
      <form onSubmit={handleSubmit} className="card">
        <div className="card-body space-y-4">
          <div><label className="label">Project *</label>
            <select className="input" value={form.project_id} onChange={e => setForm({ ...form, project_id: e.target.value })} required>
              <option value="">Select project...</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div><label className="label">Document Title *</label>
            <input type="text" className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Site Induction Register" required />
          </div>
          <div><label className="label">Document Type</label>
            <select className="input" value={form.document_type} onChange={e => setForm({ ...form, document_type: e.target.value })}>
              <option value="safety_file">Safety File</option>
              <option value="hs_policy">H&S Policy</option>
              <option value="method_statement">Method Statement</option>
              <option value="toolbox_talk">Toolbox Talk</option>
              <option value="emergency_plan">Emergency Plan</option>
              <option value="appointment_letter">Appointment Letter</option>
              <option value="ppe_register">PPE Register</option>
              <option value="plant_register">Plant Register</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div><label className="label">File (optional)</label>
            <input type="file" className="input" onChange={e => setForm({ ...form, file: e.target.files[0] })} />
            <p className="text-xs text-gray-400 mt-1">PDF, DOCX, or image files</p>
          </div>
          <button type="submit" disabled={uploading} className="btn-primary w-full">
            {uploading ? "Uploading..." : "Upload Document"}
          </button>
        </div>
      </form>
    </div>
  );
}
