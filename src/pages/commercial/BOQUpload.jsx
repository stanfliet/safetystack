import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

export default function BOQUpload() {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [projects, setProjects] = useState([]);
  const [location, setLocation] = useState("national");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState("upload"); // upload, extracting, pricing, complete

  useState(() => {
    supabase.from("projects").select("id,name").eq("user_id", user?.id).then(({ data }) => {
      if (data) setProjects(data);
    });
  }, [user]);

  async function handleUpload(f) {
    const valid = Array.from(f).filter(f => f.name.match(/\.(pdf|docx?|xlsx?|csv|txt|jpe?g|png)$/i));
    setFiles(prev => [...prev, ...valid]);
  }

  async function handleProcess() {
    if (!files.length || !projectId) { toast.error("Select files and project"); return; }
    setProcessing(true);
    setStep("extracting");
    setResult(null);

    try {
      const formData = new FormData();
      files.forEach(f => formData.append("files", f));
      formData.append("project_id", projectId);
      formData.append("user_id", user.id);
      formData.append("project_location", location);

      setStep("extracting");
      const res = await fetch("/api/boq-process", { method: "POST", body: formData });
      const data = await res.json();

      if (!data.success) throw new Error(data.error || "Processing failed");

      setResult(data);
      setStep("complete");
      toast.success(`Processed ${data.item_count} BOQ items! Total: R ${(data.grand_total || 0).toLocaleString()}`);
    } catch (e) {
      toast.error(e.message);
      setStep("upload");
    } finally {
      setProcessing(false);
    }
  }

  async function downloadExcel() {
    if (!result?.items_priced?.length) return;
    const XLSX = await import("xlsx");
    const wb = XLSX.utils.book_new();
    const rows = result.items_priced.map((item, i) => ({
      "Item #": item.item_number || (i + 1),
      Description: item.description,
      Unit: item.unit || "each",
      Quantity: item.quantity || 0,
      "Material Rate": item.rate_build_up?.materials?.rate_per_unit || "",
      "Labour Rate": item.rate_build_up?.labour?.hourly_rate || "",
      "Total Direct Cost": item.total_direct_cost || 0,
      "P&G%": item.p_and_g_percent || 0,
      "P&G Amount": item.p_and_g_amount || 0,
      "O&P%": item.overheads_and_profit_percent || 0,
      "O&P Amount": item.overheads_and_profit_amount || 0,
      "Contingency%": item.contingency_percent || 0,
      "Contingency Amount": item.contingency_amount || 0,
      "Total Rate": item.total_rate || 0,
      "Total Amount": item.total_amount || 0,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Priced BOQ");
    const grandRow = { Description: "GRAND TOTAL", "Total Amount": result.grand_total };
    XLSX.utils.sheet_add_json(ws, [grandRow], { skipHeader: true, origin: -1 });
    XLSX.writeFile(wb, `BOQ_Priced_${new Date().toISOString().split("T")[0]}.xlsx`);
    toast.success("Excel downloaded");
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">BOQ Upload & AI Pricing</h2>
        <p className="text-gray-500 mt-1">Upload a Bill of Quantities in any format — AI extracts items and prices each line item</p>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-4">1. Select Project & Location</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Project *</label>
            <select className="input" value={projectId} onChange={e => setProjectId(e.target.value)}>
              <option value="">Select project...</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Project Location</label>
            <select className="input" value={location} onChange={e => setLocation(e.target.value)}>
              <option value="national">National Average</option>
              <option value="gauteng">Gauteng</option>
              <option value="western_cape">Western Cape</option>
              <option value="kwazulu_natal">KwaZulu-Natal</option>
              <option value="eastern_cape">Eastern Cape</option>
              <option value="free_state">Free State</option>
              <option value="mpumalanga">Mpumalanga</option>
              <option value="limpopo">Limpopo</option>
              <option value="north_west">North West</option>
              <option value="northern_cape">Northern Cape</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-4">2. Upload BOQ Documents</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-safety-500 cursor-pointer"
          onClick={() => document.getElementById("boq-files").click()}>
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="mt-2 text-sm text-gray-600">PDF, Excel, Word, CSV, or Image of BOQ</p>
          <input id="boq-files" type="file" multiple className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.jpg,.jpeg,.png"
            onChange={e => { handleUpload(e.target.files); e.target.value = ""; }} />
        </div>
        {files.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {files.map((f, i) => (
              <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
                {f.name}
                <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-700">&times;</button>
              </span>
            ))}
          </div>
        )}
      </div>

      <button onClick={handleProcess} disabled={processing || !files.length || !projectId}
        className="btn-primary w-full py-3 text-base">
        {processing ? (step === "extracting" ? "Extracting BOQ Items..." : step === "pricing" ? "Pricing Items..." : "Processing...")
          : `Process & Price BOQ (${files.length} file${files.length !== 1 ? "s" : ""})`}
      </button>

      {processing && (
        <div className="card p-6 text-center">
          <div className="animate-spin w-10 h-10 border-4 border-safety-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">
            {step === "extracting" ? "AI is extracting BOQ line items from your documents..." : "AI is pricing each line item with detailed rate build-ups..."}
          </p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4 text-center">
              <p className="text-sm text-gray-500">Items Extracted</p>
              <p className="text-2xl font-bold text-safety-600">{result.item_count || 0}</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-sm text-gray-500">Files Processed</p>
              <p className="text-2xl font-bold text-emerald-600">{result.files?.length || 0}</p>
            </div>
            <div className="card p-4 text-center bg-emerald-50 border-emerald-200">
              <p className="text-sm text-emerald-700">Grand Total</p>
              <p className="text-2xl font-bold text-emerald-600">R {(result.grand_total || 0).toLocaleString()}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h3 className="font-semibold">Priced BOQ Items</h3>
              <div className="flex gap-2">
                <button onClick={downloadExcel} className="btn-secondary text-sm">Download Excel</button>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Item #</th>
                      <th>Description</th>
                      <th>Unit</th>
                      <th>Qty</th>
                      <th>Materials</th>
                      <th>Labour</th>
                      <th>Plant</th>
                      <th>Transport</th>
                      <th>P&G</th>
                      <th>O&P</th>
                      <th>Contingency</th>
                      <th>Rate</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(result.items_priced || []).map((item, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="text-xs">{item.item_number || (i + 1)}</td>
                        <td className="text-xs max-w-xs truncate">{item.description}</td>
                        <td className="text-xs">{item.unit || "each"}</td>
                        <td className="text-xs text-right">{item.quantity || 0}</td>
                        <td className="text-xs text-right">R {((item.rate_build_up?.materials?.total || 0) / (item.quantity || 1)).toFixed(0) || "-"}</td>
                        <td className="text-xs text-right">R {((item.rate_build_up?.labour?.total || 0) / (item.quantity || 1)).toFixed(0) || "-"}</td>
                        <td className="text-xs text-right">R {((item.rate_build_up?.plant?.total || 0) / (item.quantity || 1)).toFixed(0) || "-"}</td>
                        <td className="text-xs text-right">R {((item.rate_build_up?.transport?.total || 0) / (item.quantity || 1)).toFixed(0) || "-"}</td>
                        <td className="text-xs text-right">{item.p_and_g_percent || 0}%</td>
                        <td className="text-xs text-right">{item.overheads_and_profit_percent || 0}%</td>
                        <td className="text-xs text-right">{item.contingency_percent || 0}%</td>
                        <td className="text-xs text-right font-medium">R {(item.total_rate || 0).toLocaleString()}</td>
                        <td className="text-xs text-right font-semibold">R {(item.total_amount || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-emerald-50 font-bold">
                      <td colSpan="11" className="text-right text-sm">Grand Total:</td>
                      <td className="text-right text-sm">R {(result.grand_total || 0).toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
