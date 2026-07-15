import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export default function IncidentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchIncident(); }, [id]);

  async function fetchIncident() {
    const { data, error } = await supabase.from("incidents").select("*, projects(name)").eq("id",id).single();
    if(error) { toast.error("Not found"); return; }
    setIncident(data); setLoading(false);
  }

  if(loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-safety-600" /></div>;
  if(!incident) return <div className="text-center py-12 text-gray-500">Incident not found</div>;

  const sev = {low:"badge-success",medium:"badge-warning",high:"badge-danger",critical:"badge-danger"};
  const st = {reported:"badge-info",under_investigation:"badge-warning",corrective_action:"badge-neutral",closed:"badge-success"};

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/incidents" className="text-sm text-safety-600 font-medium">&larr; Back to Incidents</Link>
      <div className="card"><div className="card-header flex items-center justify-between"><h2 className="text-xl font-bold">{incident.title}</h2><span className={sev[incident.severity]}>{incident.severity}</span></div>
        <div className="card-body space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-gray-500">Type</p><p className="font-medium capitalize">{incident.incident_type?.replace(/_/g," ")}</p></div>
            <div><p className="text-sm text-gray-500">Status</p><span className={st[incident.status]}>{incident.status?.replace(/_/g," ")}</span></div>
            <div><p className="text-sm text-gray-500">Date</p><p className="font-medium">{incident.incident_date?new Date(incident.incident_date).toLocaleDateString():"-"}</p></div>
            <div><p className="text-sm text-gray-500">DoL Reportable</p><p className="font-medium">{incident.dol_reportable ? "Yes" : "No"}</p></div>
          </div>
          {incident.description && <div><p className="text-sm text-gray-500">Description</p><p className="mt-1">{incident.description}</p></div>}
          {incident.root_cause && <div><p className="text-sm text-gray-500">Root Cause</p><p className="mt-1">{incident.root_cause}</p></div>}
          {incident.corrective_actions && <div><p className="text-sm text-gray-500">Corrective Actions</p><p className="mt-1">{incident.corrective_actions}</p></div>}
        </div>
      </div>
    </div>
  );
}
