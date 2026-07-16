import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable, { Modal } from "../../components/ui/DataTable";
import toast from "react-hot-toast";

export default function TenderContracts() {
  const { user } = useAuth();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: "", tender_type: "tender", contract_type: "gcc", client_name: "", tender_value: "" });

  useEffect(() => { fetchTenders(); }, []);

  async function fetchTenders() {
    const { data } = await supabase.from("tender_documents").select("*, projects(name)").eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) setTenders(data);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.title) { toast.error("Title required"); return; }
    const { error } = await supabase.from("tender_documents").insert({ ...form, user_id: user.id, tender_value: parseFloat(form.tender_value) || 0, status: "draft" });
    if (error) { toast.error(error.message); return; }
    toast.success("Tender document created"); setShowNew(false); fetchTenders();
  }

  const st = { draft: "badge-neutral", review: "badge-warning", submitted: "badge-info", awarded: "badge-success", rejected: "badge-danger", closed: "badge-neutral" };
  const cols = [
    { Header: "Title", accessor: "title", cell: r => <span className="font-medium">{r.title}</span> },
    { Header: "Type", accessor: "tender_type", cell: r => <span className="uppercase">{r.tender_type}</span> },
    { Header: "Contract", accessor: "contract_type", cell: r => <span className="uppercase">{r.contract_type}</span> },
    { Header: "Client", accessor: "client_name" },
    { Header: "Value", accessor: "tender_value", cell: r => r.tender_value ? "R " + Number(r.tender_value).toLocaleString() : "-" },
    { Header: "Status", accessor: "status", cell: r => <span className={st[r.status]}>{r.status}</span> }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold">Tender and Contracts</h2><p className="text-gray-500 mt-1">{tenders.length} document{tenders.length !== 1 ? "s" : ""}</p></div>
        <button onClick={() => setShowNew(true)} className="btn-primary">New Document</button>
      </div>
      <DataTable columns={cols} data={tenders} loading={loading} searchable emptyMessage="No tender documents yet." />
      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="New Tender Document">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="label">Title *</label><input type="text" className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Type</label><select className="input" value={form.tender_type} onChange={e => setForm({ ...form, tender_type: e.target.value })}><option value="rfq">RFQ</option><option value="rfp">RFP</option><option value="tender">Tender</option><option value="boq">BOQ</option></select></div>
            <div><label className="label">Contract Type</label><select className="input" value={form.contract_type} onChange={e => setForm({ ...form, contract_type: e.target.value })}><option value="gcc">GCC</option><option value="fidic">FIDIC</option><option value="nec3">NEC3</option><option value="nec4">NEC4</option><option value="jbcc">JBCC</option></select></div>
          </div>
          <div><label className="label">Client</label><input type="text" className="input" value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })} /></div>
          <div><label className="label">Tender Value (ZAR)</label><input type="number" className="input" value={form.tender_value} onChange={e => setForm({ ...form, tender_value: e.target.value })} /></div>
          <button type="submit" className="btn-primary w-full">Create</button>
        </form>
      </Modal>
    </div>
  );
}
