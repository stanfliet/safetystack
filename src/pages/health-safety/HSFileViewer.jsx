import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

export default function HSFileViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState("");

  useEffect(() => { if (id) fetchFile(); }, [id]);

  async function fetchFile() {
    const { data, error } = await supabase.from("hs_files").select("*, projects(name)").eq("id", id).single();
    if (error) { toast.error(error.message); navigate("/health-safety"); return; }
    setFile(data);
    setEditContent(data.content || "");
    setLoading(false);
  }

  function extractSections(html) {
    if (!html) return [];
    const sections = [];
    const regex = /<h2[^>]*id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/h2>/gi;
    let match;
    while ((match = regex.exec(html)) !== null) {
      sections.push({ id: match[1], title: match[2].replace(/<[^>]*>/g, "") });
    }
    return sections;
  }

  async function handleSave() {
    const { error } = await supabase.from("hs_files").update({
      content: editContent,
      version: (file.version || 1) + 1
    }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Document saved");
    setEditMode(false);
    fetchFile();
  }

  async function handleDownload() {
    const html = file.content || "";
    const blob = new Blob([
      "<html><head><meta charset='UTF-8'><title>" + file.title + "</title>" +
      "<style>body{font-family:Arial,sans-serif;max-width:1200px;margin:auto;padding:20px}" +
      "h1{color:#1e40af}h2{color:#1e3a8a;border-bottom:2px solid #1e40af;margin-top:32px}" +
      "table{width:100%;border-collapse:collapse;margin:16px 0}th,td{border:1px solid #ddd;padding:10px}" +
      "th{background:#1e40af;color:white}</style></head><body>" + html +
      "</body></html>"
    ], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (file.title || "hs-file").replace(/[^a-zA-Z0-9]/g, "_") + ".html";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-safety-500 border-t-transparent rounded-full" /></div>;
  if (!file) return <p>File not found</p>;

  const sections = extractSections(file.content);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <button onClick={() => navigate("/health-safety")} className="hover:text-safety-600">H&S Files</button>
            <span>/</span>
            <span>{file.title}</span>
          </div>
          <h2 className="text-2xl font-bold">{file.title}</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEditMode(!editMode)} className="btn-secondary">{editMode ? "Preview" : "Edit"}</button>
          <button onClick={handleDownload} className="btn-primary">Download HTML</button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1">
          <div className="card sticky top-4">
            <div className="card-header"><h3 className="font-semibold">Index</h3></div>
            <div className="card-body p-3">
              <nav className="space-y-1 max-h-[600px] overflow-y-auto">
                {sections.map((s, i) => (
                  <button key={s.id || i}
                    onClick={() => { const el = document.getElementById("section-" + s.id); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
                    {i+1}. {s.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className="col-span-3">
          {editMode ? (
            <div className="space-y-4">
              <textarea className="input font-mono text-sm h-[800px]" value={editContent} onChange={e => setEditContent(e.target.value)} />
              <div className="flex gap-2 justify-end">
                <button onClick={() => { setEditMode(false); setEditContent(file.content); }} className="btn-secondary">Cancel</button>
                <button onClick={handleSave} className="btn-primary">Save Changes</button>
              </div>
            </div>
          ) : (
            <div className="card"><div className="card-body p-8"><div dangerouslySetInnerHTML={{ __html: file.content || "<p>No content</p>" }} /></div></div>
          )}
        </div>
      </div>
    </div>
  );
}
