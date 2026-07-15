import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable from "../../components/ui/DataTable";

export default function SafetyFiles() {
  const { user } = useAuth();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchDocs(); }, []);

  async function fetchDocs() {
    const { data, error } = await supabase.from("safety_documents").select("*, projects(name)").eq("user_id",user.id).order("updated_at",{ascending:false});
    if (!error) setDocs(data||[]);
    setLoading(false);
  }

  const cols = [
    { Header:"Title", accessor:"title", cell:r => <span className="font-medium">{r.title}</span> },
    { Header:"Type", accessor:"document_type", cell:r => <span className="capitalize">{r.document_type.replace(/_/g," ")}</span> },
    { Header:"Project", accessor:"projects", cell:r => r.projects?.name||"-" },
    { Header:"Status", accessor:"status", cell:r => { const c={draft:"badge-neutral",review:"badge-warning",approved:"badge-success",expired:"badge-danger"}; return <span className={c[r.status]}>{r.status}</span>; }},
    { Header:"Version", accessor:"version" },
    { Header:"Created", accessor:"created_at", cell:r => new Date(r.created_at).toLocaleDateString() }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold">Safety Files</h2><p className="text-gray-500 mt-1">{docs.length} document{docs.length!==1?"s":""}</p></div>
        <Link to="/ai-document-generator" className="btn-primary"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>Generate Document</Link>
      </div>
      <DataTable columns={cols} data={docs} loading={loading} searchable emptyMessage="No safety documents yet. Use the AI Document Generator to create one." />
    </div>
  );
}
