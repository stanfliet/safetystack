import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { StatCard } from "../../components/ui/DataTable";

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({ projects: 0, inspections: 0, incidents: 0, workers: 0 });

  useEffect(() => {
    async function load() {
      const [p, i, inc, w] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("inspections").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("incidents").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("workers").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      setStats({ projects: p.count || 0, inspections: i.count || 0, incidents: inc.count || 0, workers: w.count || 0 });
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-gray-500 mt-1">Welcome back{profile?.full_name ? ", " + profile.full_name : ""}</p>
        </div>
        <Link to="/projects" className="btn-primary">New Project</Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Projects" value={stats.projects} color="text-blue-600" link="/projects" />
        <StatCard label="Inspections" value={stats.inspections} color="text-amber-600" link="/inspections" />
        <StatCard label="Incidents" value={stats.incidents} color="text-red-600" link="/incidents" />
        <StatCard label="Workers" value={stats.workers} color="text-purple-600" link="/workers" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header"><h3 className="font-semibold">Quick Actions</h3></div>
          <div className="card-body grid grid-cols-2 gap-3">
            <Link to="/projects" className="p-3 bg-blue-50 rounded-lg text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors text-center">Manage Projects</Link>
            <Link to="/inspections" className="p-3 bg-amber-50 rounded-lg text-amber-700 text-sm font-medium hover:bg-amber-100 transition-colors text-center">New Inspection</Link>
            <Link to="/incidents" className="p-3 bg-red-50 rounded-lg text-red-700 text-sm font-medium hover:bg-red-100 transition-colors text-center">Report Incident</Link>
            <Link to="/ai-documents" className="p-3 bg-purple-50 rounded-lg text-purple-700 text-sm font-medium hover:bg-purple-100 transition-colors text-center">AI Documents</Link>
            <Link to="/workers" className="p-3 bg-green-50 rounded-lg text-green-700 text-sm font-medium hover:bg-green-100 transition-colors text-center">Manage Workers</Link>
            <Link to="/ai-agents" className="p-3 bg-cyan-50 rounded-lg text-cyan-700 text-sm font-medium hover:bg-cyan-100 transition-colors text-center">AI Agents</Link>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3 className="font-semibold">Regulatory Status</h3></div>
          <div className="card-body space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg"><span className="text-sm font-medium text-green-700">OHS Act Compliance</span><span className="badge-success">Compliant</span></div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg"><span className="text-sm font-medium text-amber-700">Construction Regs 2014</span><span className="badge-warning">Review Needed</span></div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"><span className="text-sm font-medium text-blue-700">COIDA Status</span><span className="badge-info">Active</span></div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><span className="text-sm font-medium text-gray-700">SACPCMP Registration</span><span className="badge-neutral">Not Required</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
