import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({});

  useEffect(() => { fetchProject(); fetchStats(); }, [id]);

  async function fetchProject() {
    const { data, error } = await supabase.from("projects").select("*").eq("id",id).single();
    if (error) { toast.error("Project not found"); return; }
    setProject(data); setForm(data); setLoading(false);
  }

  async function fetchStats() {
    const [d, ins, inc, w] = await Promise.all([
      supabase.from("safety_documents").select("*",{count:"exact",head:true}).eq("project_id",id),
      supabase.from("inspections").select("*",{count:"exact",head:true}).eq("project_id",id),
      supabase.from("incidents").select("*",{count:"exact",head:true}).eq("project_id",id),
      supabase.from("workers").select("*",{count:"exact",head:true}).eq("project_id",id)
    ]);
    setStats({ documents: d.count||0, inspections: ins.count||0, incidents: inc.count||0, workers: w.count||0 });
  }

  async function handleSave(e) {
    e.preventDefault(); setSaving(true);
    const { error } = await supabase.from("projects").update({...form,number_of_workers:parseInt(form.number_of_workers)||0}).eq("id",id);
    if (error) { toast.error(error.message); } else { toast.success("Updated"); setEditing(false); fetchProject(); }
    setSaving(false);
  }

  const sc = {planning:"badge-info",active:"badge-success",on_hold:"badge-warning",completed:"badge-neutral",closed:"badge-neutral"};
  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-safety-600" /></div>;
  if (!project) return <div className="text-center py-12 text-gray-500">Project not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><Link to="/projects" className="text-sm text-safety-600 font-medium mb-2 inline-block">&larr; Back</Link><h2 className="text-2xl font-bold">{project.name}</h2><p className="text-gray-500">{project.client_name && `Client: ${project.client_name}`}</p></div>
        <div className="flex gap-2"><button onClick={()=>setEditing(!editing)} className="btn-secondary">{editing?"Cancel":"Edit"}</button></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to={`/safety-files?project=${id}`} className="card p-4 hover:shadow-md"><p className="text-sm text-gray-500">Documents</p><p className="text-2xl font-bold text-safety-600">{stats.documents}</p></Link>
        <Link to={`/inspections?project=${id}`} className="card p-4 hover:shadow-md"><p className="text-sm text-gray-500">Inspections</p><p className="text-2xl font-bold text-amber-600">{stats.inspections}</p></Link>
        <Link to={`/incidents?project=${id}`} className="card p-4 hover:shadow-md"><p className="text-sm text-gray-500">Incidents</p><p className="text-2xl font-bold text-red-600">{stats.incidents}</p></Link>
        <Link to={`/workers?project=${id}`} className="card p-4 hover:shadow-md"><p className="text-sm text-gray-500">Workers</p><p className="text-2xl font-bold text-green-600">{stats.workers}</p></Link>
      </div>
      <div className="card">
        <div className="card-header"><h3 className="text-lg font-semibold">Project Details</h3></div>
        <div className="card-body">
          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="label">Name</label><input type="text" className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                <div><label className="label">Client</label><input type="text" className="input" value={form.client_name||""} onChange={e=>setForm({...form,client_name:e.target.value})} /></div>
                <div><label className="label">Type</label><select className="input" value={form.project_type} onChange={e=>setForm({...form,project_type:e.target.value})}><option value="building">Building</option><option value="roadworks">Roadworks</option><option value="housing">Housing</option><option value="civils">Civils</option><option value="infrastructure">Infrastructure</option><option value="mining_support">Mining</option><option value="other">Other</option></select></div>
                <div><label className="label">Status</label><select className="input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option value="planning">Planning</option><option value="active">Active</option><option value="on_hold">On Hold</option><option value="completed">Completed</option><option value="closed">Closed</option></select></div>
                <div><label className="label">Safety Officer</label><input type="text" className="input" value={form.safety_officer||""} onChange={e=>setForm({...form,safety_officer:e.target.value})} /></div>
                <div><label className="label">Workers</label><input type="number" className="input" value={form.number_of_workers||0} onChange={e=>setForm({...form,number_of_workers:e.target.value})} /></div>
              </div>
              <button type="submit" disabled={saving} className="btn-primary">{saving?"Saving...":"Save Changes"}</button>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><p className="text-sm text-gray-500">Status</p><span className={"badge mt-1 "+(sc[project.status])}>{project.status.replace("_"," ")}</span></div>
              <div><p className="text-sm text-gray-500">Type</p><p className="font-medium capitalize">{project.project_type}</p></div>
              <div><p className="text-sm text-gray-500">Client</p><p className="font-medium">{project.client_name||"-"}</p></div>
              <div><p className="text-sm text-gray-500">Safety Officer</p><p className="font-medium">{project.safety_officer||"-"}</p></div>
              <div><p className="text-sm text-gray-500">Workers</p><p className="font-medium">{project.number_of_workers||0}</p></div>
              <div><p className="text-sm text-gray-500">Compliance</p>
                <div className="flex items-center gap-3"><div className="flex-1 bg-gray-200 rounded-full h-2.5"><div className="bg-safety-600 h-2.5 rounded-full" style={{width:`${project.compliance_score||0}%`}} /></div><span className="font-semibold">{Math.round(project.compliance_score||0)}%</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
