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
  const [logoUploading, setLogoUploading] = useState(false);

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
    if (sections.length === 0) {
      // Fallback: extract any h2 elements without IDs
      const simpleRegex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
      while ((match = simpleRegex.exec(html)) !== null) {
        const title = match[1].replace(/<[^>]*>/g, "").trim();
        if (title) sections.push({ id: title.replace(/\s+/g, "-").toLowerCase(), title });
      }
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

  async function handleUploadLogo(e) {
    const logoFile = e.target.files?.[0];
    if (!logoFile) return;
    setLogoUploading(true);
    try {
      const path = `logos/${id}_${Date.now()}.${logoFile.name.split(".").pop()}`;
      const { error: upErr } = await supabase.storage.from("company-logos").upload(path, logoFile);
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from("company-logos").getPublicUrl(path);
      const { error: updErr } = await supabase.from("hs_files").update({ logo_url: publicUrl }).eq("id", id);
      if (updErr) throw updErr;
      setFile(prev => ({ ...prev, logo_url: publicUrl }));
      toast.success("Logo uploaded");
    } catch (e) {
      toast.error("Logo upload failed: " + e.message);
    } finally {
      setLogoUploading(false);
    }
  }

  async function handleDownload(format = "html") {
    const html = file.content || "";
    const title = (file.title || "hs-file").replace(/[^a-zA-Z0-9]/g, "_");

    if (format === "html") {
      const styledHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${file.title}</title>
<style>body{font-family:Arial,sans-serif;max-width:1200px;margin:auto;padding:20px;font-size:11pt}
h1{color:#1e40af;font-size:24pt}h2{color:#1e3a8a;border-bottom:2px solid #1e40af;margin-top:32px;font-size:18pt}
h3{color:#1e3a8a;margin-top:24px;font-size:14pt}
table{width:100%;border-collapse:collapse;margin:16px 0}th,td{border:1px solid #ccc;padding:8px;text-align:left}
th{background:#1e40af;color:white;font-weight:bold}tr:nth-child(even){background:#f9fafb}
.signature{margin-top:40px;border-top:1px solid #999;padding-top:10px}
.section{margin-bottom:20px}.page-break{page-break-before:always}
@page{size:A4;margin:20mm 25mm}@media print{body{font-size:10pt}}</style></head><body>${html}</body></html>`;
      const blob = new Blob([styledHtml], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = title + ".html"; a.click();
      URL.revokeObjectURL(url);
    } else if (format === "doc") {
      const docHtml = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="UTF-8"><style>body{font-family:Calibri,Arial,sans-serif;max-width:1200px;margin:auto;padding:30px}
h1{color:#1e40af;font-size:24pt}h2{color:#1e3a8a;border-bottom:2px solid #1e40af;margin-top:32px;font-size:18pt}
table{width:100%;border-collapse:collapse}th,td{border:1px solid #666;padding:8px}th{background:#1e40af;color:white}
@page{size:A4;margin:20mm 25mm}</style></head><body>${html}</body></html>`;
      const blob = new Blob([docHtml], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = title + ".doc"; a.click();
      URL.revokeObjectURL(url);
    } else if (format === "xlsx") {
      try {
        const XLSX = await import("xlsx");
        const wb = XLSX.utils.book_new();
        const rows = [{ "Section": "Document Title", "Content": file.title }];
        const div = document.createElement("div");
        div.innerHTML = html;
        div.querySelectorAll("h1, h2, h3, h4, p, table").forEach(el => {
          if (el.tagName.match(/^H[1-4]$/)) rows.push({ "Section": el.textContent.trim(), "Content": "" });
          else if (el.tagName === "P" && el.textContent.trim()) rows.push({ "Section": "", "Content": el.textContent.trim() });
          else if (el.tagName === "TABLE") {
            const headers = Array.from(el.querySelectorAll("th")).map(th => th.textContent.trim());
            el.querySelectorAll("tr").forEach(tr => {
              const cells = Array.from(tr.querySelectorAll("td")).map(td => td.textContent.trim());
              if (cells.length) {
                const row = {};
                headers.forEach((h, idx) => row[h || "Col" + (idx + 1)] = cells[idx] || "");
                rows.push(row);
              }
            });
          }
        });
        const ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, "H&S File");
        XLSX.writeFile(wb, title + ".xlsx");
      } catch (e) { toast.error("Excel export failed"); return; }
    } else if (format === "pdf") {
      const w = window.open("", "_blank");
      if (!w) { toast.error("Allow pop-ups for PDF"); return; }
      w.document.write(`<html><head><title>${file.title}</title>
<style>body{font-family:Arial,sans-serif;max-width:1200px;margin:auto;padding:20px}
h1{color:#1e40af}h2{color:#1e3a8a;border-bottom:2px solid #1e40af;margin-top:32px}
table{width:100%;border-collapse:collapse;margin:16px 0}th,td{border:1px solid #ddd;padding:10px}th{background:#1e40af;color:white}
@media print{body{font-size:10pt}}@page{size:A4;margin:20mm 25mm}</style></head><body>${html}
<script>window.onload=function(){window.print()};<\/script></body></html>`);
      w.document.close();
      toast.success("PDF preview opened. Print (Ctrl+P) to save as PDF.");
    }
    toast.success(format.toUpperCase() + " downloaded");
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
          <p className="text-xs text-gray-400 mt-1">Version {file.version} | Status: {file.status} | {new Date(file.created_at).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {file.logo_url && <img src={file.logo_url} alt="Logo" className="h-10" />}
          <label className="btn-outline text-xs cursor-pointer">
            {logoUploading ? "..." : "Logo"}
            <input type="file" className="hidden" accept="image/*" onChange={handleUploadLogo} />
          </label>
          <button onClick={() => setEditMode(!editMode)} className="btn-secondary text-xs">{editMode ? "Preview" : "Edit"}</button>
          <button onClick={() => handleDownload("doc")} className="btn-outline text-xs">Word</button>
          <button onClick={() => handleDownload("xlsx")} className="btn-outline text-xs">Excel</button>
          <button onClick={() => handleDownload("pdf")} className="btn-outline text-xs">PDF</button>
          <button onClick={() => handleDownload("html")} className="btn-primary text-xs">HTML</button>
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
                    onClick={() => {
                      const el = document.getElementById(s.id);
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 truncate">
                    {i + 1}. {s.title}
                  </button>
                ))}
                {sections.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No indexed sections</p>}
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
            <div className="card"><div className="card-body p-8">
              {file.logo_url && <img src={file.logo_url} alt="Company Logo" className="max-h-20 mb-6" />}
              <div dangerouslySetInnerHTML={{ __html: file.content || "<p>No content generated yet.</p>" }} />
            </div></div>
          )}
        </div>
      </div>
    </div>
  );
}
