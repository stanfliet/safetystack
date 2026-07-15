import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

export default function ComplianceDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const [pData, aData] = await Promise.all([
      supabase.from("projects").select("id,name,compliance_score,status").eq("user_id",user.id).order("compliance_score",{ascending:true}),
      supabase.from("compliance_actions").select("*, projects(name)").eq("user_id",user.id).not("status","eq","resolved").order("priority",{ascending:false})
    ]);
    if(!pData.error) setProjects(pData.data||[]);
    if(!aData.error) setActions(aData.data||[]);
    setLoading(false);
  }

  if(loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-safety-600" /></div>;

  const priorColors = {low:"badge-success",medium:"badge-warning",high:"badge-danger",critical:"badge-danger"};
  const statusColors = {open:"badge-info",in_progress:"badge-warning",resolved:"badge-success",overdue:"badge-danger"};

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold">Compliance Dashboard</h2><p className="text-gray-500 mt-1">Regulatory adherence overview across all projects</p></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card"><div className="card-header"><h3 className="text-lg font-semibold">Project Compliance Scores</h3></div>
          <div className="card-body space-y-4">
            {projects.length===0 ? <p className="text-gray-500 text-center py-4">No projects</p>
              : projects.map(p => (
                <Link key={p.id} to={`/projects/${p.id}`} className="block">
                  <div className="flex items-center justify-between mb-1"><span className="text-sm font-medium">{p.name}</span><span className="text-sm font-semibold">{Math.round(p.compliance_score||0)}%</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className={"h-2.5 rounded-full transition-all "+(p.compliance_score>=80?"bg-green-500":p.compliance_score>=60?"bg-amber-500":"bg-red-500")} style={{width:`${p.compliance_score||0}%`}} />
                  </div>
                </Link>
              ))
            }
          </div>
        </div>

        <div className="card"><div className="card-header"><h3 className="text-lg font-semibold">Outstanding Actions</h3></div>
          <div className="card-body p-0">
            {actions.length===0 ? <div className="text-center py-8 text-gray-500">No outstanding actions</div>
              : <div className="divide-y divide-gray-100">{actions.map(a => (
                  <div key={a.id} className="px-6 py-4">
                    <div className="flex items-center justify-between"><p className="text-sm font-medium">{a.title}</p><span className={priorColors[a.priority]||"badge-neutral"}>{a.priority}</span></div>
                    <p className="text-xs text-gray-500 mt-0.5">{a.projects?.name||"No project"} · <span className={statusColors[a.status]}>{a.status.replace(/_/g," ")}</span></p>
                    {a.due_date && <p className="text-xs text-gray-400 mt-1">Due: {new Date(a.due_date).toLocaleDateString()}</p>}
                  </div>
                ))}</div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
