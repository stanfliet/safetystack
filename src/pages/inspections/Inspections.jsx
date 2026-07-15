import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";

export default function Inspections() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ project_id:"", inspection_type:"site_safety", title:"", inspector_name:"", scheduled_date:"" });

  useEffect(() => {
    fetchInspections();
    supabase.from("projects").select("id,name").eq("user_id",user.id).then(({data})=>setProjects(data||[]));
  }, []);

  async function fetchInspections() {
    const { data, error } = await supabase.from("inspections").select("*, projects(name)").eq("user_id",user.id).order("created_at",{ascending:false});
    if (!error) setInspections(data||[]);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.project_id || !form.title) { toast.error("Required fields missing"); return; }
    const { data, error } = await supabase.from("inspections").insert({...form, user_id:user.id, checklist_items:[], status:"draft"}).select().single();
    if (error) { toast.error(error.message); return; }
    toast.success("Inspection created"); setShowNew(false); navigate(`/inspections/${data.id}`);
  }

  const cols = [
    { Header:"Title", accessor:"title", cell:r => <span className="font-medium">{r.title}</span> },
    { Header:"Type", accessor:"inspection_type", cell:r => <span className="capitalize">{r.inspection_type.replace(/_/g," ")}</span> },
    { Header:"Project", accessor:"projects", cell:r => r.projects?.name||"-" },
    { Header:"Score", accessor:"overall_score", cell:r => r.overall_score?`${r.overall_score}%`:"-" },
    { Header:"Status", accessor:"status", cell:r => { const c={draft:"badge-neutral",in_progress:"badge-warning",completed:"badge-success",requires_action:"badge-danger"}; return <span className={c[r.status]}>{r.status.replace(/_/g," ")}</span>; }},
    { Header:"Date", accessor:"scheduled_date", cell:r => r.scheduled_date||"-" }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold">Inspections</h2><p className="text-gray-500 mt-1">{inspections.length} inspection{inspections.length!==1?"s":""}</p></div>
        <button onClick={()=>setShowNew(true)} className="btn-primary"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>New Inspection</button>
      </div>
      <DataTable columns={cols} data={inspections} loading={loading} searchable onRowClick={r=>navigate(`/inspections/${r.id}`)} emptyMessage="No inspections yet." />
      <Modal isOpen={showNew} onClose={()=>setShowNew(false)} title="New Inspection">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="label">Project *</label><select className="input" value={form.project_id} onChange={e=>setForm({...form,project_id:e.target.value})} required><option value="">Select...</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <div><label className="label">Title *</label><input type="text" className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Type</label><select className="input" value={form.inspection_type} onChange={e=>setForm({...form,inspection_type:e.target.value})}><option value="site_safety">Site Safety</option><option value="equipment">Equipment</option><option value="ppe">PPE</option><option value="housekeeping">Housekeeping</option><option value="fire_safety">Fire Safety</option><option value="electrical">Electrical</option><option value="excavation">Excavation</option><option value="scaffold">Scaffold</option><option value="custom">Custom</option></select></div>
            <div><label className="label">Date</label><input type="date" className="input" value={form.scheduled_date} onChange={e=>setForm({...form,scheduled_date:e.target.value})} /></div>
          </div>
          <div><label className="label">Inspector</label><input type="text" className="input" value={form.inspector_name} onChange={e=>setForm({...form,inspector_name:e.target.value})} /></div>
          <button type="submit" className="btn-primary w-full">Create</button>
        </form>
      </Modal>
    </div>
  );
}
