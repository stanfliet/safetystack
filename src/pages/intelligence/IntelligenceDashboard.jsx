import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable from "../../components/ui/DataTable";

export default function IntelligenceDashboard() {
  const { user } = useAuth();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState("");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    supabase.from("projects").select("id,name").eq("user_id", user.id).then(({ data }) => setProjects(data || []));
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [selectedProject]);

  async function fetchInsights() {
    setLoading(true);
    let q = supabase.from("intelligence_insights").select("*, projects(name)").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50);
    if (selectedProject) q = q.eq("project_id", selectedProject);
    const { data } = await q;
    if (data) setInsights(data);
    setLoading(false);
  }

  async function markRead(id) {
    await supabase.from("intelligence_insights").update({ is_read: true }).eq("id", id);
    fetchInsights();
  }

  const cols = [
    { Header: "Title", accessor: "title", cell: r => (
      <div className="flex items-center gap-2">
        {!r.is_read && <span className="w-2 h-2 bg-safety-500 rounded-full flex-shrink-0" />}
        <span className={"font-medium " + (!r.is_read ? "text-gray-900" : "text-gray-500")}>{r.title}</span>
      </div>
    )},
    { Header: "Category", accessor: "category", cell: r => <span className="capitalize">{r.category}</span> },
    { Header: "Project", accessor: "projects.name" },
    { Header: "Severity", accessor: "severity", cell: r => {
      const s = { low: "badge-success", medium: "badge-warning", high: "badge-danger", critical: "badge-danger" };
      return <span className={s[r.severity]}>{r.severity}</span>;
    }},
    { Header: "Date", accessor: "created_at", cell: r => new Date(r.created_at).toLocaleDateString() },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Intelligence Dashboard</h2>
          <p className="text-gray-500 mt-1">AI-powered insights, risk predictions and smart alerts</p>
        </div>
      </div>
      <div className="mb-4">
        <select className="input max-w-xs" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
          <option value="">All projects</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-sm text-gray-500">Total Insights</p>
          <p className="text-2xl font-bold text-safety-600">{insights.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500">Unread</p>
          <p className="text-2xl font-bold text-amber-600">{insights.filter(i => !i.is_read).length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500">High Severity</p>
          <p className="text-2xl font-bold text-red-600">{insights.filter(i => i.severity === "high" || i.severity === "critical").length}</p>
        </div>
      </div>
      <DataTable columns={cols} data={insights} loading={loading} searchable emptyMessage="No intelligence insights yet. Insights are generated as you use the platform." />
    </div>
  );
}
