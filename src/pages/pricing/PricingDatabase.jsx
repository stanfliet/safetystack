import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";

export default function PricingDatabase() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("materials");
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ category:"materials", description:"", unit:"", supply_rate:"", install_rate:"", total_rate:"", region:"national", source:"" });

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    const { data, error } = await supabase.from("pricing_items").select("*").eq("user_id",user.id).order("created_at",{ascending:false});
    if(!error) setItems(data||[]);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if(!form.description) { toast.error("Description required"); return; }
    const { error } = await supabase.from("pricing_items").insert({
      ...form, user_id:user.id,
      supply_rate:parseFloat(form.supply_rate)||0,
      install_rate:parseFloat(form.install_rate)||0,
      total_rate:parseFloat(form.total_rate)||(parseFloat(form.supply_rate)||0)+(parseFloat(form.install_rate)||0)
    });
    if(error) { toast.error(error.message); return; }
    toast.success("Pricing item added"); setShowNew(false); fetchItems();
  }

  const cols = [
    { Header:"Code", accessor:"code" },
    { Header:"Description", accessor:"description", cell:r => <span className="font-medium">{r.description}</span> },
    { Header:"Category", accessor:"category", cell:r => <span className="capitalize">{r.category}</span> },
    { Header:"Unit", accessor:"unit" },
    { Header:"Supply Rate", accessor:"supply_rate", cell:r => r.supply_rate?`R ${Number(r.supply_rate).toLocaleString()}`:"-" },
    { Header:"Total Rate", accessor:"total_rate", cell:r => r.total_rate?`R ${Number(r.total_rate).toLocaleString()}`:"-" },
    { Header:"Region", accessor:"region", cell:r => <span className="capitalize">{r.region?.replace(/_/g," ")}</span> }
  ];

  const filtered = items.filter(i => i.category === category);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold">Pricing Database</h2><p className="text-gray-500 mt-1">{items.length} pricing items</p></div>
        <button onClick={()=>setShowNew(true)} className="btn-primary"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>Add Item</button>
      </div>
      <div className="flex gap-2 mb-4">
        {["materials","plant","labour"].map(c => (
          <button key={c} onClick={()=>setCategory(c)} className={"px-4 py-2 rounded-lg text-sm font-medium transition-colors "+(category===c?"bg-safety-600 text-white":"bg-white border border-gray-200 text-gray-600 hover:bg-gray-50")}>{c.charAt(0).toUpperCase()+c.slice(1)}</button>
        ))}
      </div>
      <DataTable columns={cols} data={filtered} loading={loading} searchable emptyMessage="No pricing items in this category." />
      <Modal isOpen={showNew} onClose={()=>setShowNew(false)} title="Add Pricing Item">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="label">Category</label><select className="input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option value="materials">Materials</option><option value="plant">Plant & Equipment</option><option value="labour">Labour</option></select></div>
          <div><label className="label">Description *</label><input type="text" className="input" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="e.g. Concrete 25MPa ready mix" /></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="label">Code</label><input type="text" className="input" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} /></div><div><label className="label">Unit</label><input type="text" className="input" value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} placeholder="m³, ton, each" /></div></div>
          <div className="grid grid-cols-3 gap-4"><div><label className="label">Supply Rate</label><input type="number" className="input" value={form.supply_rate} onChange={e=>setForm({...form,supply_rate:e.target.value})} /></div><div><label className="label">Install Rate</label><input type="number" className="input" value={form.install_rate} onChange={e=>setForm({...form,install_rate:e.target.value})} /></div><div><label className="label">Total Rate</label><input type="number" className="input" value={form.total_rate} onChange={e=>setForm({...form,total_rate:e.target.value})} /></div></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="label">Region</label><select className="input" value={form.region} onChange={e=>setForm({...form,region:e.target.value})}><option value="national">National</option><option value="gauteng">Gauteng</option><option value="western_cape">Western Cape</option><option value="kwazulu_natal">KwaZulu-Natal</option></select></div><div><label className="label">Source</label><input type="text" className="input" value={form.source} onChange={e=>setForm({...form,source:e.target.value})} placeholder="ASAQS, supplier quote" /></div></div>
          <button type="submit" className="btn-primary w-full">Add Item</button>
        </form>
      </Modal>
    </div>
  );
}
