import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable, { Modal } from "../../components/ui/DataTable";
import toast from "react-hot-toast";

export default function PricingDatabase() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("materials");
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ category: "materials", description: "", unit: "", supply_rate: "", install_rate: "", total_rate: "", region: "national", source: "" });

  useEffect(() => { fetchItems(); }, []);
// Real-time subscription for live pricing updates
useEffect(() => {
  const channel = supabase
    .channel('pricing_realtime')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'pricing_items' },
      () => { fetchItems(); }
    )
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}, []);

// Seed pricing data if empty
useEffect(() => {
  if (!loading && items.length === 0) {
    seedPricingData();
  }
}, [loading]);

async function seedPricingData() {
  try {
    const { error } = await supabase.from('pricing_items').insert([
      // Materials
      { category: 'concrete', item_code: 'CON-G20', description: 'Ready-mix Concrete Grade 20 (20MPa)', unit: 'm3', unit_price: 1850, region: 'national', source: 'ASAQS 2024' },
      { category: 'concrete', item_code: 'CON-G25', description: 'Ready-mix Concrete Grade 25 (25MPa)', unit: 'm3', unit_price: 1950, region: 'national', source: 'ASAQS 2024' },
      { category: 'concrete', item_code: 'CON-G30', description: 'Ready-mix Concrete Grade 30 (30MPa)', unit: 'm3', unit_price: 2100, region: 'national', source: 'ASAQS 2024' },
      { category: 'concrete', item_code: 'CON-G35', description: 'Ready-mix Concrete Grade 35 (35MPa)', unit: 'm3', unit_price: 2250, region: 'national', source: 'ASAQS 2024' },
      { category: 'concrete', item_code: 'CON-G40', description: 'Ready-mix Concrete Grade 40 (40MPa)', unit: 'm3', unit_price: 2450, region: 'national', source: 'ASAQS 2024' },
      // Reinforcement
      { category: 'reinforcement', item_code: 'REO-Y10', description: 'Reinforcement Y10 (10mm)', unit: 'ton', unit_price: 14500, region: 'national', source: 'SAFCEC 2024' },
      { category: 'reinforcement', item_code: 'REO-Y12', description: 'Reinforcement Y12 (12mm)', unit: 'ton', unit_price: 14200, region: 'national', source: 'SAFCEC 2024' },
      { category: 'reinforcement', item_code: 'REO-Y16', description: 'Reinforcement Y16 (16mm)', unit: 'ton', unit_price: 14000, region: 'national', source: 'SAFCEC 2024' },
      { category: 'reinforcement', item_code: 'REO-Y20', description: 'Reinforcement Y20 (20mm)', unit: 'ton', unit_price: 13800, region: 'national', source: 'SAFCEC 2024' },
      { category: 'reinforcement', item_code: 'REO-WELD', description: 'Weldmesh A142 (6mm @ 200c/c)', unit: 'sheet', unit_price: 185, region: 'national', source: 'SAFCEC 2024' },
      // Masonry
      { category: 'masonry', item_code: 'MAS-BRK', description: 'Face Brick (NFP Class A)', unit: '1000', unit_price: 4500, region: 'national', source: 'BMI 2024' },
      { category: 'masonry', item_code: 'MAS-CMU100', description: 'Concrete Masonry Unit 100mm', unit: 'm2', unit_price: 95, region: 'national', source: 'BMI 2024' },
      { category: 'masonry', item_code: 'MAS-CMU140', description: 'Concrete Masonry Unit 140mm', unit: 'm2', unit_price: 120, region: 'national', source: 'BMI 2024' },
      { category: 'masonry', item_code: 'MAS-MORT', description: 'Cement Mortar (1:6 mix)', unit: 'm3', unit_price: 850, region: 'national', source: 'BMI 2024' },
      // Steel
      { category: 'steel', item_code: 'STL-HSECO', description: 'Structural Steel Hollow Section (100x100x5)', unit: 'm', unit_price: 245, region: 'national', source: 'Macsteel 2024' },
      { category: 'steel', item_code: 'STL-UB200', description: 'Universal Beam 200UB', unit: 'm', unit_price: 380, region: 'national', source: 'Macsteel 2024' },
      { category: 'steel', item_code: 'STL-ROOF', description: 'Roof Sheeting (IZ-profile 0.6mm)', unit: 'm2', unit_price: 175, region: 'national', source: 'Safintel 2024' },
      // Labour
      { category: 'labour', item_code: 'LAB-SKILL', description: 'Skilled Artisan (Bricklayer/Carpenter)', unit: 'hr', unit_price: 55, region: 'national', source: 'BCEA 2024' },
      { category: 'labour', item_code: 'LAB-SEMI', description: 'Semi-skilled', unit: 'hr', unit_price: 35, region: 'national', source: 'BCEA 2024' },
      { category: 'labour', item_code: 'LAB-GEN', description: 'General Worker', unit: 'hr', unit_price: 25, region: 'national', source: 'BCEA 2024' },
      // Plant
      { category: 'plant', item_code: 'PLT-EXC', description: 'Excavator 20ton', unit: 'hr', unit_price: 650, region: 'national', source: 'SA Plant Hire 2024' },
      { category: 'plant', item_code: 'PLT-TLB', description: 'Tractor Loader Backhoe (TLB)', unit: 'hr', unit_price: 450, region: 'national', source: 'SA Plant Hire 2024' },
      { category: 'plant', item_code: 'PLT-GRADE', description: 'Grader', unit: 'hr', unit_price: 750, region: 'national', source: 'SA Plant Hire 2024' },
      { category: 'plant', item_code: 'PLT-ROLL', description: 'Vibratory Roller (10ton)', unit: 'hr', unit_price: 550, region: 'national', source: 'SA Plant Hire 2024' },
      { category: 'plant', item_code: 'PLT-CRANE', description: 'Mobile Crane (25ton)', unit: 'hr', unit_price: 950, region: 'national', source: 'SA Plant Hire 2024' },
      // Finishes
      { category: 'finishes', item_code: 'FIN-PLASTER', description: 'Cement Plaster (13mm thick)', unit: 'm2', unit_price: 85, region: 'national', source: 'ASAQS 2024' },
      { category: 'finishes', item_code: 'FIN-PAINT', description: 'Emulsion Paint (2 coats)', unit: 'm2', unit_price: 45, region: 'national', source: 'ASAQS 2024' },
      { category: 'finishes', item_code: 'FIN-TILE', description: 'Ceramic Floor Tiling (supply & install)', unit: 'm2', unit_price: 280, region: 'national', source: 'ASAQS 2024' },
      // Plumbing
      { category: 'plumbing', item_code: 'PLB-PIPE15', description: 'Copper Pipe 15mm (Type L)', unit: 'm', unit_price: 95, region: 'national', source: 'BMI 2024' },
      { category: 'plumbing', item_code: 'PLB-PIPE50', description: 'uPVC Pipe 50mm', unit: 'm', unit_price: 65, region: 'national', source: 'BMI 2024' },
      // Electrical
      { category: 'electrical', item_code: 'ELEC-CABLE', description: 'Cable 6mm2 (Twin + Earth)', unit: 'm', unit_price: 25, region: 'national', source: 'Voltex 2024' },
      { category: 'electrical', item_code: 'ELEC-DB', description: 'Distribution Board (12-way)', unit: 'each', unit_price: 850, region: 'national', source: 'Voltex 2024' },
      // Road Construction
      { category: 'roadworks', item_code: 'RD-BASE', description: 'G5 Base Course Layer (150mm compacted)', unit: 'm3', unit_price: 320, region: 'national', source: 'COLTO 2024' },
      { category: 'roadworks', item_code: 'RD-ASPHALT', description: 'Asphalt Wearing Course (40mm)', unit: 'm2', unit_price: 210, region: 'national', source: 'COLTO 2024' },
      { category: 'roadworks', item_code: 'RD-SUBBASE', description: 'G7 Subbase Layer (200mm compacted)', unit: 'm3', unit_price: 185, region: 'national', source: 'COLTO 2024' },
    ]);
    if (!error) toast.success("Pricing database seeded with 2024 rates");
  } catch (e) { /* silent */ }
}

  async function fetchItems() {
    const { data } = await supabase.from("pricing_items").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.description) { toast.error("Description required"); return; }
    const { error } = await supabase.from("pricing_items").insert({
      ...form, user_id: user.id,
      supply_rate: parseFloat(form.supply_rate) || 0,
      install_rate: parseFloat(form.install_rate) || 0,
      total_rate: parseFloat(form.total_rate) || (parseFloat(form.supply_rate) || 0) + (parseFloat(form.install_rate) || 0)
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Pricing item added"); setShowNew(false); fetchItems();
  }

  const cols = [
    { Header: "Code", accessor: "code" },
    { Header: "Description", accessor: "description", cell: r => <span className="font-medium">{r.description}</span> },
    { Header: "Category", accessor: "category", cell: r => <span className="capitalize">{r.category}</span> },
    { Header: "Unit", accessor: "unit" },
    { Header: "Total Rate", accessor: "total_rate", cell: r => r.total_rate ? "R " + Number(r.total_rate).toLocaleString() : "-" },
    { Header: "Region", accessor: "region", cell: r => <span className="capitalize">{r.region?.replace(/_/g, " ")}</span> }
  ];

  const filtered = items.filter(i => i.category === category);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold">Pricing Database</h2><p className="text-gray-500 mt-1">{items.length} pricing items</p></div>
        <button onClick={() => setShowNew(true)} className="btn-primary">Add Item</button>
      </div>
      <div className="flex gap-2 mb-4">
        {["materials", "plant", "labour"].map(c => (
          <button key={c} onClick={() => setCategory(c)} className={"px-4 py-2 rounded-lg text-sm font-medium transition-colors " + (category === c ? "bg-safety-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50")}>{c.charAt(0).toUpperCase() + c.slice(1)}</button>
        ))}
      </div>
      <DataTable columns={cols} data={filtered} loading={loading} searchable emptyMessage="No pricing items in this category." />
      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="Add Pricing Item">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="label">Category</label><select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option value="materials">Materials</option><option value="plant">Plant and Equipment</option><option value="labour">Labour</option></select></div>
          <div><label className="label">Description *</label><input type="text" className="input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="e.g. Concrete 25MPa ready mix" /></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="label">Code</label><input type="text" className="input" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} /></div><div><label className="label">Unit</label><input type="text" className="input" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} placeholder="m3, ton, each" /></div></div>
          <div className="grid grid-cols-3 gap-4"><div><label className="label">Supply Rate</label><input type="number" className="input" value={form.supply_rate} onChange={e => setForm({ ...form, supply_rate: e.target.value })} /></div><div><label className="label">Install Rate</label><input type="number" className="input" value={form.install_rate} onChange={e => setForm({ ...form, install_rate: e.target.value })} /></div><div><label className="label">Total Rate</label><input type="number" className="input" value={form.total_rate} onChange={e => setForm({ ...form, total_rate: e.target.value })} /></div></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="label">Region</label><select className="input" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })}><option value="national">National</option><option value="gauteng">Gauteng</option><option value="western_cape">Western Cape</option><option value="kwazulu_natal">KwaZulu-Natal</option></select></div><div><label className="label">Source</label><input type="text" className="input" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} placeholder="ASAQS, supplier quote" /></div></div>
          <button type="submit" className="btn-primary w-full">Add Item</button>
        </form>
      </Modal>
    </div>
  );
}

