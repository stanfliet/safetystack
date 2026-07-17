import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const DOC_TYPES = [
  { value: "safety_file", label: "Safety File" },
  { value: "hs_policy", label: "H&S Policy" },
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
  { value: "sds_register", label: "SDS Register" },
  { value: "ppe_register", label: "PPE Register" },
  { value: "plant_register", label: "Plant Register" }
];

export default function AIDocumentGenerator() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [docType, setDocType] = useState("safety_file");
  const [context, setContext] = useState({
    company_name: "",
    site_address: "",
    safety_officer: "",
    number_of_workers: ""
  });
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (user) {
      supabase.from("projects").select("id,name").eq("user_id", user.id).then(({ data }) => setProjects(data || []));
    }
  }, [user]);

  async function handleGenerate(e) {
    e.preventDefault();
    if (!selectedProject) { toast.error("Please select a project"); return; }
    setGenerating(true);
    setResult(null);
    try {
      const { data: project } = await supabase.from("projects").select("*").eq("id", selectedProject).single();
      const fullContext = {
        ...context,
        project_name: project?.name || "",
        client_name: project?.client_name || ""
      };

      const response = await fetch("/api/generate-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "single",
          project_id: selectedProject,
          document_type: docType,
          context: fullContext
        })
      });

      if (!response.ok) throw new Error("Generation failed");
      const doc = await response.json();

      const { data: savedDoc } = await supabase.from("safety_documents").insert({
        project_id: selectedProject,
        user_id: user.id,
        document_type: docType,
        title: `${DOC_TYPES.find(d => d.value === docType)?.label || docType} - ${project?.name || ""}`,
        content: doc.content,
        status: "draft",
        generated_by_ai: true,
        version: 1
      }).select().single();

      setResult(savedDoc);
      toast.success("Document generated and saved!");
    } catch (err) {
      toast.error(err.message || "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  async function handleFileUpload(e) {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(files);
    if (files.length === 0) return;

    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      files.forEach(f => formData.append("files", f));
      formData.append("project_id", selectedProject || "");
      formData.append("user_id", user?.id || "");

      const response = await fetch("/api/upload-and-analyze", {
        method: "POST",
        headers: { "x-analysis-type": "document_review" },
        body: formData
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      setAnalysisResult(data);
      toast.success("Analysis complete!");
    } catch (err) {
      toast.error(err.message || "Upload / analyze failed");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">AI Document Generator</h2>
        <p className="text-gray-500 mt-1">Generate professional OHS documents or upload existing ones for AI analysis</p>
      </div>

      {/* Upload and Analyze Section */}
      <div className="card p-6">
        <h3 className="font-semibold mb-4">Upload Document for AI Analysis</h3>
        <p className="text-sm text-gray-500 mb-4">Upload PDF, Word, or image files. The AI will review them for compliance and suggest improvements.</p>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-safety-400 transition-colors">
          <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-gray-600 font-medium mb-1">Click to upload files</p>
          <p className="text-xs text-gray-400">PDF, DOCX, PNG, JPG up to 10MB each</p>
          <input type="file" multiple className="hidden" accept=".pdf,.docx,.doc,.png,.jpg,.jpeg" onChange={handleFileUpload} />
        </label>

        {uploadedFiles.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Uploaded files ({uploadedFiles.length}):</p>
            {uploadedFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded mb-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {f.name}
              </div>
            ))}
            {analyzing && (
              <div className="flex items-center gap-2 mt-2 text-sm text-safety-600">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing...
              </div>
            )}
            {analysisResult && (
              <div className="mt-3 p-4 bg-green-50 rounded-lg text-sm">
                <p className="font-medium text-green-800 mb-1">Analysis Complete</p>
                <p className="text-green-700 whitespace-pre-wrap">{analysisResult.summary || analysisResult.content || "Review complete."}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Generate Document Section */}
      <div className="card p-6">
        <h3 className="font-semibold mb-4">Generate a New Document</h3>
        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="label">1. Select Project</label>
            <select className="input" value={selectedProject} onChange={e => setSelectedProject(e.target.value)} required>
              <option value="">Choose a project...</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="label">2. Document Type</label>
            <select className="input" value={docType} onChange={e => setDocType(e.target.value)}>
              {DOC_TYPES.map(dt => <option key={dt.value} value={dt.value}>{dt.label}</option>)}
            </select>
          </div>

          <div>
            <label className="label">3. Project Context (optional)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label text-xs text-gray-500">Company Name</label>
                <input type="text" className="input" value={context.company_name} onChange={e => setContext({ ...context, company_name: e.target.value })} />
              </div>
              <div>
                <label className="label text-xs text-gray-500">Safety Officer</label>
                <input type="text" className="input" value={context.safety_officer} onChange={e => setContext({ ...context, safety_officer: e.target.value })} />
              </div>
              <div>
                <label className="label text-xs text-gray-500">Site Address</label>
                <input type="text" className="input" value={context.site_address} onChange={e => setContext({ ...context, site_address: e.target.value })} />
              </div>
              <div>
                <label className="label text-xs text-gray-500">Number of Workers</label>
                <input type="text" className="input" value={context.number_of_workers} onChange={e => setContext({ ...context, number_of_workers: e.target.value })} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={generating || !selectedProject} className="btn-primary w-full py-3 text-base">
            {generating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </span>
            ) : "Generate Document"}
          </button>
        </form>
      </div>

      {result?.content && (
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="font-semibold">{result.title}</h3>
            <div className="flex gap-2">
              <button onClick={() => window.print()} className="btn-secondary text-sm">Print</button>
              <button onClick={() => {
                const b = new Blob([result.content], { type: "text/html" });
                const u = URL.createObjectURL(b);
                const a = document.createElement("a");
                a.href = u;
                a.download = result.title.replace(/\s+/g, "_") + ".html";
                a.click();
                URL.revokeObjectURL(u);
              }} className="btn-secondary text-sm">Download</button>
            </div>
          </div>
          <div className="card-body">
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: result.content }} />
          </div>
        </div>
      )}
    </div>
  );
}
