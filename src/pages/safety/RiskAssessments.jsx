import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";

export default function RiskAssessments() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ project_id:"", assessment_type:"task_specific", title:"", activity:"", location:"" });

  useEffect(() => {
    fetchData();
    supabase.from("projects").select("id,name").eq("user_id",user.id).then(({data})=>setProjects(data||[]));
  }, []);

  async function fetchData() {
    const { data, error } = await supabase.from("risk_assessments").select("*, projects(name)").eq("user_id",user.id).order("created_at",{ascending:false});
    if (!error) setAssessments(data||[]);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.project_id || !form.title) { toast.error("Required fields missing"); return; }
    const { error } = await supabase.from("risk_assessments").insert({...form, user_id:user.id, risks:[], status:"draft"});
    if (error) { toast.error(error.message); return; }
    toast.success("Risk assessment created"); setShowNew(false); fetchData();
  }

  const cols = [
    { Header:"Title", accessor:"title", cell:r => <span className="font-medium">{r.title}</span> },
    { Header:"Type", accessor:"assessment_type", cell:r => <span className="capitalize">{r.assessment_type.replace(/_/g," ")}</span> },
    { Header:"Project", accessor:"projects", cell:r => r.projects?.name||"-" },
    { Header:"Status", accessor:"status", cell:r => { const c={draft:"badge-neutral",reviewed:"badge-warning",approved:"badge-success"}; return <span className={c[r.status]||"badge-neutral"}>{r.status}</span>; }},
    { Header:"Created", accessor:"created_at", cell:r => new Date(r.created_at).toLocaleDateString() }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold">Risk Assessments</h2><p className="text-gray-500 mt-1">{assessments.length} assessment{assessments.length!==1?"s":""}</p></div>
        <button onClick={()=>setShowNew(true)} className="btn-primary"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>New Assessment</button>
      </div>
      <DataTable columns={cols} data={assessments} loading={loading} searchable emptyMessage="No risk assessments yet." />
      <Modal isOpen={showNew} onClose={()=>setShowNew(false)} title="New Risk Assessment">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="label">Project *</label>
            <select className="input" value={form.project_id} onChange={e=>setForm({...form,project_id:e.target.value})} required>
              <option value="">Select project...</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div><label className="label">Title *</label><input type="text" className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required /></div>
          <div><label className="label">Type</label>
            <select className="input" value={form.assessment_type} onChange={e=>setForm({...form,assessment_type:e.target.value})}>
              <option value="baseline">Baseline</option><option value="task_specific">Task-Specific</option><option value="continuous">Continuous</option>
            </select>
          </div>
          <div><label className="label">Activity/Location</label><input type="text" className="input" value={form.activity} onChange={e=>setForm({...form,activity:e.target.value})} placeholder="e.g. Excavation works" /></div>
          <button type="submit" className="btn-primary w-full">Create Assessment</button>
        </form>
      </Modal>
    </div>
  );
}
