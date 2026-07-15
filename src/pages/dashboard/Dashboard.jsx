import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import StatCard from "../../components/ui/StatCard";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalProjects: 0, activeIncidents: 0, pendingInspections: 0, avgComplianceScore: 0, totalWorkers: 0 });
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const [pCount, iCount, inspCount, wCount] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("incidents").select("*", { count: "exact", head: true }).eq("user_id", user.id).not("status","eq","closed"),
        supabase.from("inspections").select("*", { count: "exact", head: true }).eq("user_id", user.id).in("status",["draft","in_progress"]),
        supabase.from("workers").select("*", { count: "exact", head: true }).eq("user_id", user.id)
      ]);
      const { data: projs } = await supabase.from("projects").select("compliance_score").eq("user_id", user.id);
      const avg = projs?.length ? projs.reduce((s,p) => s + (p.compliance_score||0), 0) / projs.length : 0;
      setStats({ totalProjects: pCount.count||0, activeIncidents: iCount.count||0, pendingInspections: inspCount.count||0, avgComplianceScore: Math.round(avg), totalWorkers: wCount.count||0 });

      const { data: incs } = await supabase.from("incidents").select("*, projects(name)").eq("user_id", user.id).order("created_at",{ascending:false}).limit(5);
      setRecentIncidents(incs||[]);
      const { data: projs2 } = await supabase.from("projects").select("*").eq("user_id", user.id).in("status",["planning","active"]).order("updated_at",{ascending:false}).limit(6);
      setActiveProjects(projs2||[]);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }

  const sevColors = { low:"bg-green-100 text-green-800", medium:"bg-amber-100 text-amber-800", high:"bg-red-100 text-red-800", critical:"bg-red-100 text-red-800" };
  const statusColors = { planning:"badge-info", active:"badge-success", on_hold:"badge-warning", completed:"badge-neutral", closed:"badge-neutral" };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-safety-600" /></div>;

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold">Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}</h2><p className="text-gray-500 mt-1">Here's your safety compliance overview</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Projects" value={stats.totalProjects} color="blue" link="/projects"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
        <StatCard title="Active Incidents" value={stats.activeIncidents} color="red" link="/incidents"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>} />
        <StatCard title="Pending Inspections" value={stats.pendingInspections} color="amber" link="/inspections"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>} />
        <StatCard title="Compliance Score" value={`${stats.avgComplianceScore}%`} color="green" link="/compliance"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card"><div className="card-header flex items-center justify-between"><h3 className="text-lg font-semibold">Active Projects</h3><Link to="/projects" className="text-sm text-safety-600 font-medium">View all</Link></div>
            <div className="card-body p-0">
              {activeProjects.length === 0 ? <div className="text-center py-8 text-gray-500"><p>No projects yet</p><Link to="/projects" className="text-safety-600 font-medium mt-1 inline-block">Create your first project</Link></div>
                : <div className="divide-y divide-gray-100">{activeProjects.map(p => (
                    <Link key={p.id} to={`/projects/${p.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
                      <div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate">{p.name}</p><p className="text-xs text-gray-500">{p.client_name||"No client"} · {p.number_of_workers||0} workers</p></div>
                      <div className="flex items-center gap-3">
                        <div className="w-16 bg-gray-200 rounded-full h-2"><div className="bg-safety-600 h-2 rounded-full" style={{width:`${p.compliance_score||0}%`}} /></div>
                        <span className={"px-2.5 py-0.5 rounded-full text-xs font-medium capitalize " + (statusColors[p.status]||"badge-neutral")}>{p.status.replace("_"," ")}</span>
                      </div>
                    </Link>
                  ))}</div>
              }
            </div>
          </div>
        </div>

        <div className="card"><div className="card-header"><h3 className="text-lg font-semibold">Quick Actions</h3></div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-3">
              {[
                {label:"New Inspection", href:"/inspections/new", color:"bg-blue-50 text-blue-600", icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"},
                {label:"Report Incident", href:"/incidents/new", color:"bg-red-50 text-red-600", icon:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"},
                {label:"Generate Doc", href:"/ai-document-generator", color:"bg-purple-50 text-purple-600", icon:"M13 10V3L4 14h7v7l9-11h-7z"},
                {label:"Chat with AI", href:"/ai-agents/safety-officer", color:"bg-cyan-50 text-cyan-600", icon:"M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"}
              ].map(a => (
                <Link key={a.href} to={a.href} className="flex flex-col items-center gap-2 p-4 rounded-xl border hover:border-safety-300 hover:bg-safety-50 transition-all">
                  <div className={"w-10 h-10 rounded-lg flex items-center justify-center " + a.color}><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={a.icon} /></svg></div>
                  <span className="text-xs font-medium text-center">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card"><div className="card-header flex items-center justify-between"><h3 className="text-lg font-semibold">Recent Incidents</h3><Link to="/incidents" className="text-sm text-safety-600 font-medium">View all</Link></div>
          <div className="card-body p-0">
            {recentIncidents.length === 0 ? <div className="text-center py-8 text-gray-500">No incidents reported</div>
              : <div className="divide-y divide-gray-100">{recentIncidents.map(inc => (
                  <Link key={inc.id} to={`/incidents/${inc.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{inc.title}</p><p className="text-xs text-gray-500">{inc.projects?.name||"Unknown"} · {new Date(inc.created_at).toLocaleDateString()}</p></div>
                    <span className={"px-2.5 py-0.5 rounded-full text-xs font-medium capitalize " + (sevColors[inc.severity]||"badge-neutral")}>{inc.severity}</span>
                  </Link>
                ))}</div>
            }
          </div>
        </div>
        <div className="card"><div className="card-header"><h3 className="text-lg font-semibold">Compliance Overview</h3></div>
          <div className="card-body">
            <div className="text-center"><div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle cx="64" cy="64" r="54" fill="none" stroke={stats.avgComplianceScore>=80?"#16a34a":stats.avgComplianceScore>=60?"#f59e0b":"#dc2626"} strokeWidth="8" strokeDasharray={`${2*Math.PI*54}`} strokeDashoffset={`${2*Math.PI*54*(1-stats.avgComplianceScore/100)}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center"><div><span className="text-2xl font-bold">{Math.round(stats.avgComplianceScore)}%</span><p className="text-xs text-gray-500">Overall</p></div></div>
            </div></div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-green-50 rounded-lg p-3"><p className="text-xs text-green-600 font-medium">Projects</p><p className="text-lg font-bold text-green-700">{stats.totalProjects}</p></div>
              <div className="bg-blue-50 rounded-lg p-3"><p className="text-xs text-blue-600 font-medium">Workers</p><p className="text-lg font-bold text-blue-700">{stats.totalWorkers}</p></div>
              <div className="bg-amber-50 rounded-lg p-3"><p className="text-xs text-amber-600 font-medium">Open Incidents</p><p className="text-lg font-bold text-amber-700">{stats.activeIncidents}</p></div>
              <div className="bg-purple-50 rounded-lg p-3"><p className="text-xs text-purple-600 font-medium">Inspections Due</p><p className="text-lg font-bold text-purple-700">{stats.pendingInspections}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
