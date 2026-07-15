import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";

export default function Workers() {
  const { user } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ project_id:"", first_name:"", last_name:"", id_number:"", role:"general_worker", trade:"", contact_number:"", induction_status:false });

  useEffect(() => {
    fetchWorkers();
    supabase.from("projects").select("id,name").eq("user_id",user.id).then(({data})=>setProjects(data||[]));
  }, []);

  async function fetchWorkers() {
    const { data, error } = await supabase.from("workers").select("*, projects(name)").eq("user_id",user.id).order("created_at",{ascending:false});
    if (!error) setWorkers(data||[]);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.project_id || !form.first_name || !form.last_name) { toast.error("Required fields missing"); return; }
    const { error } = await supabase.from("workers").insert({...form, user_id:user.id, status:"active", certifications:[]});
    if (error) { toast.error(error.message); return; }
    toast.success("Worker added"); setShowNew(false); fetchWorkers();
  }

  const roleColors = { general_worker:"badge-neutral", artisan:"badge-info", foreman:"badge-warning", supervisor:"badge-info", operator:"badge-warning", safety_officer:"badge-success" };
  const statusColors = { active:"badge-success", inactive:"badge-neutral", suspended:"badge-danger" };

  const cols = [
    { Header:"Name", accessor:"name", cell:r => <span className="font-medium">{r.first_name} {r.last_name}</span> },
    { Header:"Role", accessor:"role", cell:r => <span className={roleColors[r.role]||"badge-neutral"}>{r.role.replace(/_/g," ")}</span> },
    { Header:"Project", accessor:"projects", cell:r => r.projects?.name||"-" },
    { Header:"ID Number", accessor:"id_number" },
    { Header:"Inducted", accessor:"induction_status", cell:r => r.induction_status ? <span className="badge-success">Yes</span> : <span className="badge-warning">No</span> },
    { Header:"Status", accessor:"status", cell:r => <span className={statusColors[r.status]}>{r.status}</span> }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold">Workers</h2><p className="text-gray-500 mt-1">{workers.length} worker{workers.length!==1?"s":""}</p></div>
        <button onClick={()=>setShowNew(true)} className="btn-primary"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>Add Worker</button>
      </div>
      <DataTable columns={cols} data={workers} loading={loading} searchable emptyMessage="No workers on record." />
      <Modal isOpen={showNew} onClose={()=>setShowNew(false)} title="Add Worker">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="label">Project *</label><select className="input" value={form.project_id} onChange={e=>setForm({...form,project_id:e.target.value})} required><option value="">Select...</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="label">First Name *</label><input type="text" className="input" value={form.first_name} onChange={e=>setForm({...form,first_name:e.target.value})} /></div><div><label className="label">Last Name *</label><input type="text" className="input" value={form.last_name} onChange={e=>setForm({...form,last_name:e.target.value})} /></div></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Role</label><select className="input" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option value="general_worker">General Worker</option><option value="artisan">Artisan</option><option value="foreman">Foreman</option><option value="supervisor">Supervisor</option><option value="operator">Operator</option><option value="safety_officer">Safety Officer</option></select></div>
            <div><label className="label">ID Number</label><input type="text" className="input" value={form.id_number} onChange={e=>setForm({...form,id_number:e.target.value})} /></div>
          </div>
          <div><label className="label">Contact Number</label><input type="text" className="input" value={form.contact_number} onChange={e=>setForm({...form,contact_number:e.target.value})} /></div>
          <div className="flex items-center gap-2"><input type="checkbox" className="rounded" checked={form.induction_status} onChange={e=>setForm({...form,induction_status:e.target.checked})} /><span className="text-sm">Induction completed</span></div>
          <button type="submit" className="btn-primary w-full">Add Worker</button>
        </form>
      </Modal>
    </div>
  );
}
