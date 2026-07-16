import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

export default function CommercialDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ projects: 0, boqItems: 0, variations: 0 });

  useEffect(() => {
    async function load() {
      const [p, b, v] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("boq_items").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("variations").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      setStats({
        projects: p.count || 0,
        boqItems: b.count || 0,
        variations: v.count || 0,
      });
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Commercial Dashboard</h2>
        <p className="text-gray-500 mt-1">BOQ analysis, variation tracking and commercial management</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/commercial/boq" className="card p-5 hover:shadow-md transition-all">
          <p className="text-sm text-gray-500">BOQ Items</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.boqItems}</p>
          <p className="text-xs text-gray-400 mt-1">Bill of Quantity line items</p>
        </Link>
        <Link to="/commercial/variations" className="card p-5 hover:shadow-md transition-all">
          <p className="text-sm text-gray-500">Variations</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">{stats.variations}</p>
          <p className="text-xs text-gray-400 mt-1">Contract variations and EOT claims</p>
        </Link>
        <div className="card p-5">
          <p className="text-sm text-gray-500">Active Projects</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{stats.projects}</p>
          <p className="text-xs text-gray-400 mt-1">Projects with commercial data</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header"><h3 className="font-semibold">Quick Actions</h3></div>
          <div className="card-body grid grid-cols-2 gap-3">
            <Link to="/commercial/boq" className="p-3 bg-emerald-50 rounded-lg text-emerald-700 text-sm font-medium hover:bg-emerald-100 text-center">Manage BOQ</Link>
            <Link to="/commercial/variations" className="p-3 bg-amber-50 rounded-lg text-amber-700 text-sm font-medium hover:bg-amber-100 text-center">Track Variations</Link>
            <Link to="/tenders" className="p-3 bg-purple-50 rounded-lg text-purple-700 text-sm font-medium hover:bg-purple-100 text-center">Tender Documents</Link>
            <Link to="/pricing" className="p-3 bg-blue-50 rounded-lg text-blue-700 text-sm font-medium hover:bg-blue-100 text-center">Pricing Database</Link>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3 className="font-semibold">Commercial Overview</h3></div>
          <div className="card-body space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Total BOQ Items</span>
              <span className="font-semibold text-emerald-600">{stats.boqItems}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Total Variations</span>
              <span className="font-semibold text-amber-600">{stats.variations}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
