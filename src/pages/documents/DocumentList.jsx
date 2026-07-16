import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable from "../../components/ui/DataTable";

export default function DocumentList() {
  const { user } = useAuth();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    const { data } = await supabase
      .from("safety_documents")
      .select("*, projects(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setDocs(data);
    setLoading(false);
  }

  const st = { draft: "badge-neutral", review: "badge-warning", approved: "badge-success", expired: "badge-danger" };
  const cols = [
    { Header: "Title", accessor: "title", cell: r => <span className="font-medium">{r.title}</span> },
    { Header: "Project", accessor: "projects.name" },
    { Header: "Type", accessor: "document_type", cell: r => <span className="capitalize">{r.document_type?.replace(/_/g, " ")}</span> },
    { Header: "Version", accessor: "version" },
    { Header: "Status", accessor: "status", cell: r => <span className={st[r.status]}>{r.status}</span> },
    { Header: "AI", accessor: "generated_by_ai", cell: r => r.generated_by_ai ? <span className="badge-info">AI</span> : <span className="badge-neutral">Manual</span> }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Documents</h2>
          <p className="text-gray-500 mt-1">{docs.length} document{docs.length !== 1 ? "s" : ""}</p>
        </div>
        <Link to="/documents/upload" className="btn-primary">Upload Document</Link>
      </div>
      <DataTable columns={cols} data={docs} loading={loading} searchable emptyMessage="No documents yet. Upload your first document." />
    </div>
  );
}
