import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export default function InspectionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchInspection(); }, [id]);

  async function fetchInspection() {
    const { data, error } = await supabase.from("inspections").select("*, projects(name)").eq("id",id).single();
    if(error) { toast.error("Not found"); return; }
    setInspection(data); setLoading(false);
  }

  if(loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-safety-600" /></div>;
  if(!inspection) return <div className="text-center py-12 text-gray-500">Inspection not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/inspections" className="text-sm text-safety-600 font-medium">&larr; Back to Inspections</Link>
      <div className="card"><div className="card-header"><h2 className="text-xl font-bold">{inspection.title}</h2></div>
        <div className="card-body space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-gray-500">Type</p><p className="font-medium capitalize">{inspection.inspection_type?.replace(/_/g," ")}</p></div>
            <div><p className="text-sm text-gray-500">Status</p><p className="font-medium capitalize">{inspection.status?.replace(/_/g," ")}</p></div>
            <div><p className="text-sm text-gray-500">Inspector</p><p className="font-medium">{inspection.inspector_name||"-"}</p></div>
            <div><p className="text-sm text-gray-500">Score</p><p className="font-medium">{inspection.overall_score?`${inspection.overall_score}%`:"-"}</p></div>
          </div>
          {inspection.findings && <div><p className="text-sm text-gray-500">Findings</p><p className="mt-1">{inspection.findings}</p></div>}
          {inspection.corrective_actions && <div><p className="text-sm text-gray-500">Corrective Actions</p><p className="mt-1">{inspection.corrective_actions}</p></div>}
        </div>
      </div>
    </div>
  );
}
