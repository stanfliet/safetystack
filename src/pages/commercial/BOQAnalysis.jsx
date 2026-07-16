import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable, { Modal } from "../../components/ui/DataTable";
import toast from "react-hot-toast";

export default function BOQAnalysis() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ item_number: "", description: "", unit: "", quantity: "", rate: "", project_id: "" });

  useEffect(() => { fetchProjects(); }, []);

  async function fetchProjects() {
    const { data } = await supabase.from("projects").select("id,name").eq("user_id", user.id);
    setProjects(data || []);
  }

  useEffect(() => {
    if (selectedProject) fetchItems();
  }, [selectedProject]);

  async function fetchItems() {
    setLoading(true);
    const { data } = await supabase.from("boq_items").select("*").eq("project_id", selectedProject).order("item_number");
    if (data) setItems(data);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.description || !form.project_id) { toast.error("Description and project required"); return; }
    const { error } = await supabase.from("boq_items").insert({
      ...form, user_id: user.id,
      quantity: parseFloat(form.quantity) || 0,
      rate: parseFloat(form.rate) || 0,
      total: (parseFloat(form.quantity) || 0) * (parseFloat(form.rate) || 0)
    });
    if (error) { toast.error(error.message); return; }
    toast.success("BOQ item added"); setShowNew(false); fetchItems();
  }

  const cols = [
    { Header: "Item #", accessor: "item_number" },
    { Header: "Description", accessor: "description", cell: r => <span className="font-medium">{r.description}</span> },
    { Header: "Unit", accessor: "unit" },
    { Header: "Quantity", accessor: "quantity", cell: r => Number(r.quantity).toLocaleString() },
    { Header: "Rate", accessor: "rate", cell: r => "R " + Number(r.rate).toLocaleString() },
    { Header: "Total", accessor: "total", cell: r => <span className="font-semibold">R {Number(r.total || r.quantity * r.rate).toLocaleString()}</span> },
  ];

  const grandTotal = items.reduce((sum, i) => sum + (i.total || i.quantity * i.rate), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold">BOQ Analysis</h2><p className="text-gray-500 mt-1">Bill of Quantities management and cost analysis</p></div>
        <button onClick={() => setShowNew(true)} className="btn-primary">Add Item</button>
      </div>
      <div className="mb-4">
        <select className="input max-w-xs" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
          <option value="">Select a project...</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      {selectedProject && (
        <div className="mb-4 card p-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">Grand Total</p>
          <p className="text-2xl font-bold text-emerald-600">R {grandTotal.toLocaleString()}</p>
        </div>
      )}
      <DataTable columns={cols} data={items} loading={loading} searchable emptyMessage="Select a project or add BOQ items." />
      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="Add BOQ Item">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="label">Project *</label>
            <select className="input" value={form.project_id} onChange={e => setForm({ ...form, project_id: e.target.value })} required>
              <option value="">Select...</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Item #</label><input type="text" className="input" value={form.item_number} onChange={e => setForm({ ...form, item_number: e.target.value })} placeholder="e.g. 1.1" /></div>
            <div><label className="label">Unit</label><input type="text" className="input" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} placeholder="m3, ton, each" /></div>
          </div>
          <div><label className="label">Description *</label><input type="text" className="input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Quantity</label><input type="number" className="input" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} /></div>
            <div><label className="label">Rate (ZAR)</label><input type="number" className="input" value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} /></div>
          </div>
          <button type="submit" className="btn-primary w-full">Add Item</button>
        </form>
      </Modal>
    </div>
  );
}
