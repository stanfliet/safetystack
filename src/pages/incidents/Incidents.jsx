import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";

export default function Incidents() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ project_id:"", incident_type:"near_miss", severity:"medium", title:"", description:"", incident_date:"", dol_reportable:false });

  useEffect(() => {
    fetchIncidents();
    supabase.from("projects").select("id,name").eq("user_id",user.id).then(({data})=>setProjects(data||[]));
  }, []);

  async function fetchIncidents() {
    const { data, error } = await supabase.from("incidents").select("*, projects(name)").eq("user_id",user.id).order("created_at",{ascending:false});
    if (!error) setIncidents(data||[]);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.project_id || !form.title) { toast.error("Required fields missing"); return; }
    const { data, error } = await supabase.from("incidents").insert({...form, user_id:user.id, status:"reported"}).select().single();
    if (error) { toast.error(error.message); return; }
    toast.success("Incident reported"); setShowNew(false); navigate(`/incidents/${data.id}`);
  }

  const sevColors = { low:"badge-success", medium:"badge-warning", high:"badge-danger", critical:"badge-danger" };
  const statColors = { reported:"badge-info", under_investigation:"badge-warning", corrective_action:"badge-neutral", closed:"badge-success" };

  const cols = [
    { Header:"Title", accessor:"title", cell:r => <span className="font-medium">{r.title}</span> },
    { Header:"Type", accessor:"incident_type", cell:r => <span className="capitalize">{r.incident_type.replace(/_/g," ")}</span> },
    { Header:"Project", accessor:"projects", cell:r => r.projects?.name||"-" },
    { Header:"Severity", accessor:"severity", cell:r => <span className={sevColors[r.severity]}>{r.severity}</span> },
    { Header:"Status", accessor:"status", cell:r => <span className={statColors[r.status]}>{r.status.replace(/_/g," ")}</span> },
    { Header:"Date", accessor:"created_at", cell:r => new Date(r.created_at).toLocaleDateString() }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold">Incidents</h2><p className="text-gray-500 mt-1">{incidents.length} incident{incidents.length!==1?"s":""}</p></div>
        <button onClick={()=>setShowNew(true)} className="btn-danger"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Report Incident</button>
      </div>
      <DataTable columns={cols} data={incidents} loading={loading} searchable onRowClick={r=>navigate(`/incidents/${r.id}`)} emptyMessage="No incidents reported." />
      <Modal isOpen={showNew} onClose={()=>setShowNew(false)} title="Report Incident">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="label">Project *</label><select className="input" value={form.project_id} onChange={e=>setForm({...form,project_id:e.target.value})} required><option value="">Select...</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <div><label className="label">Title *</label><input type="text" className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Brief description of incident" required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Type</label><select className="input" value={form.incident_type} onChange={e=>setForm({...form,incident_type:e.target.value})}><option value="near_miss">Near Miss</option><option value="first_aid">First Aid</option><option value="medical_treatment">Medical Treatment</option><option value="lost_time_injury">Lost Time Injury</option><option value="fatality">Fatality</option><option value="property_damage">Property Damage</option><option value="environmental">Environmental</option><option value="other">Other</option></select></div>
            <div><label className="label">Severity</label><select className="input" value={form.severity} onChange={e=>setForm({...form,severity:e.target.value})}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select></div>
          </div>
          <div><label className="label">Description</label><textarea className="input" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
          <div className="flex items-center gap-2"><input type="checkbox" className="rounded" checked={form.dol_reportable} onChange={e=>setForm({...form,dol_reportable:e.target.checked})} /><span className="text-sm">DoL Reportable (Section 24)</span></div>
          <button type="submit" className="btn-danger w-full">Report Incident</button>
        </form>
      </Modal>
    </div>
  );
}
