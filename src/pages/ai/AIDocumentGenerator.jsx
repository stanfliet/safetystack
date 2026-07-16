import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const DOC_TYPES = [
  { value: "safety_file", label: "Safety File" }, { value: "hs_policy", label: "H&S Policy" },
  { value: "appointment_letter", label: "Appointment Letter (S16.1)" },
  { value: "baseline_risk_assessment", label: "Baseline Risk Assessment" },
  { value: "task_risk_assessment", label: "Task-Specific Risk Assessment" },
  { value: "method_statement", label: "Method Statement" },
  { value: "safe_work_procedure", label: "Safe Work Procedure" },
  { value: "emergency_plan", label: "Emergency Plan" },
  { value: "fall_protection_plan", label: "Fall Protection Plan" },
  { value: "traffic_management_plan", label: "Traffic Management Plan" },
  { value: "induction_checklist", label: "Induction Checklist" },
  { value: "toolbox_talk", label: "Toolbox Talk" },
  { value: "ppe_register", label: "PPE Register" },
  { value: "plant_register", label: "Plant Register" }
];

export default function AIDocumentGenerator() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [docType, setDocType] = useState("safety_file");
  const [context, setContext] = useState({ company_name: "", site_address: "", safety_officer: "", number_of_workers: "" });
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    supabase.from("projects").select("id,name").eq("user_id", user.id).then(({ data }) => setProjects(data || []));
  }, []);

  async function handleGenerate(e) {
    e.preventDefault();
    if (!selectedProject) { toast.error("Please select a project"); return; }
    setGenerating(true); setResult(null);
    try {
      const { data: project } = await supabase.from("projects").select("*").eq("id", selectedProject).single();
      const fullContext = { ...context, project_name: project?.name || "", client_name: project?.client_name || "" };
      const response = await fetch("/api/generate-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "single", project_id: selectedProject, document_type: docType, context: fullContext })
      });
      if (!response.ok) throw new Error("Generation failed");
      const doc = await response.json();
      const { data: savedDoc } = await supabase.from("safety_documents").insert({
        project_id: selectedProject, user_id: user.id, document_type: docType,
        title: `${DOC_TYPES.find(d => d.value === docType)?.label || docType} - ${project?.name || ""}`,
        content: doc.content, status: "draft", generated_by_ai: true, version: 1
      }).select().single();
      setResult(savedDoc);
      toast.success("Document generated and saved!");
    } catch (err) { toast.error(err.message || "Generation failed"); }
    finally { setGenerating(false); }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6"><h2 className="text-2xl font-bold">AI Document Generator</h2><p className="text-gray-500 mt-1">Generate professional OHS documents with human expert voice</p></div>
      <form onSubmit={handleGenerate} className="space-y-6">
        <div className="card p-6"><h3 className="font-semibold mb-4">1. Select Project</h3>
          <select className="input" value={selectedProject} onChange={e => setSelectedProject(e.target.value)} required>
            <option value="">Choose a project...</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="card p-6"><h3 className="font-semibold mb-4">2. Document Type</h3>
          <select className="input" value={docType} onChange={e => setDocType(e.target.value)}>
            {DOC_TYPES.map(dt => <option key={dt.value} value={dt.value}>{dt.label}</option>)}
          </select>
        </div>
        <div className="card p-6"><h3 className="font-semibold mb-4">3. Project Context</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label">Company Name</label><input type="text" className="input" value={context.company_name} onChange={e => setContext({ ...context, company_name: e.target.value })} /></div>
            <div><label className="label">Safety Officer</label><input type="text" className="input" value={context.safety_officer} onChange={e => setContext({ ...context, safety_officer: e.target.value })} /></div>
            <div><label className="label">Site Address</label><input type="text" className="input" value={context.site_address} onChange={e => setContext({ ...context, site_address: e.target.value })} /></div>
            <div><label className="label">Workers</label><input type="text" className="input" value={context.number_of_workers} onChange={e => setContext({ ...context, number_of_workers: e.target.value })} /></div>
          </div>
        </div>
        <button type="submit" disabled={generating || !selectedProject} className="btn-primary w-full py-3 text-base">
          {generating ? "Generating..." : "Generate Document"}
        </button>
      </form>
      {result?.content && (
        <div className="card mt-6">
          <div className="card-header flex items-center justify-between">
            <h3 className="font-semibold">{result.title}</h3>
            <div className="flex gap-2">
              <button onClick={() => window.print()} className="btn-secondary text-sm">Print</button>
              <button onClick={() => { const b = new Blob([result.content], { type: "text/html" }); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = result.title.replace(/\s+/g, "_") + ".html"; a.click(); URL.revokeObjectURL(u); }} className="btn-secondary text-sm">Download</button>
            </div>
          </div>
          <div className="card-body"><div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: result.content }} /></div>
        </div>
      )}
    </div>
  );
}
