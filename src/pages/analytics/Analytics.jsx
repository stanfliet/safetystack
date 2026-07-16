import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

export default function Analytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});

  useEffect(() => { fetchStats(); }, []);

  async function fetchStats() {
    const [p, i, inc, w, sd] = await Promise.all([
      supabase.from("projects").select("*").eq("user_id", user.id),
      supabase.from("inspections").select("*").eq("user_id", user.id),
      supabase.from("incidents").select("*").eq("user_id", user.id),
      supabase.from("workers").select("*").eq("user_id", user.id),
      supabase.from("safety_documents").select("*").eq("user_id", user.id)
    ]);
    const projects = p.data || []; const inspections = i.data || []; const incidents = inc.data || []; const workers = w.data || []; const docs = sd.data || [];
    setStats({
      totalProjects: projects.length, activeProjects: projects.filter(x => x.status === "active").length,
      completedProjects: projects.filter(x => x.status === "completed").length,
      totalInspections: inspections.length, completedInspections: inspections.filter(x => x.status === "completed").length,
      totalIncidents: incidents.length, closedIncidents: incidents.filter(x => x.status === "closed").length,
      totalWorkers: workers.length, inductedWorkers: workers.filter(x => x.induction_status).length,
      totalDocuments: docs.length, approvedDocs: docs.filter(x => x.status === "approved").length,
      byType: projects.reduce((acc, p) => { acc[p.project_type] = (acc[p.project_type] || 0) + 1; return acc; }, {})
    });
  }

  const StatBox = ({ label, value, color = "text-safety-600" }) => (
    <div className="card p-4"><p className="text-sm text-gray-500">{label}</p><p className={"text-2xl font-bold " + color}>{value}</p></div>
  );

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold">Analytics</h2><p className="text-gray-500 mt-1">Multi-dimensional safety and operational metrics</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox label="Total Projects" value={stats.totalProjects || 0} color="text-blue-600" />
        <StatBox label="Active Projects" value={stats.activeProjects || 0} color="text-green-600" />
        <StatBox label="Total Workers" value={stats.totalWorkers || 0} color="text-purple-600" />
        <StatBox label="Inducted Workers" value={stats.inductedWorkers || 0} color="text-cyan-600" />
        <StatBox label="Inspections" value={stats.totalInspections || 0} color="text-amber-600" />
        <StatBox label="Completed" value={stats.completedInspections || 0} color="text-green-600" />
        <StatBox label="Incidents" value={stats.totalIncidents || 0} color="text-red-600" />
        <StatBox label="Closed" value={stats.closedIncidents || 0} color="text-green-600" />
      </div>
      <div className="card"><div className="card-header"><h3 className="text-lg font-semibold">Documents</h3></div>
        <div className="card-body"><div className="grid grid-cols-2 gap-4"><div className="bg-blue-50 rounded-lg p-4"><p className="text-sm text-blue-600">Total Documents</p><p className="text-2xl font-bold text-blue-700">{stats.totalDocuments || 0}</p></div><div className="bg-green-50 rounded-lg p-4"><p className="text-sm text-green-600">Approved</p><p className="text-2xl font-bold text-green-700">{stats.approvedDocs || 0}</p></div></div></div>
      </div>
      <div className="card"><div className="card-header"><h3 className="text-lg font-semibold">Project Type Breakdown</h3></div>
        <div className="card-body">
          {stats.byType && Object.entries(stats.byType).length > 0 ? (
            <div className="space-y-3">{Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} className="flex items-center gap-3"><span className="w-32 text-sm font-medium capitalize">{type.replace(/_/g, " ")}</span><div className="flex-1 bg-gray-200 rounded-full h-4"><div className="bg-safety-500 h-4 rounded-full" style={{ width: ((count / stats.totalProjects) * 100) + "%" }} /></div><span className="text-sm font-semibold w-8 text-right">{count}</span></div>
            ))}</div>
          ) : <p className="text-gray-500 text-center">No data yet</p>}
        </div>
      </div>
    </div>
  );
}
