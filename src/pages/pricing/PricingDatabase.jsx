import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable, { Modal } from "../../components/ui/DataTable";
import toast from "react-hot-toast";

const SEED_DATA = {
  materials: [
    { category: "materials", item_code: "CON-G20", description: "Ready-mix Concrete Grade 20 (20MPa)", unit: "m3", unit_price: 1850 },
    { category: "materials", item_code: "CON-G25", description: "Ready-mix Concrete Grade 25 (25MPa)", unit: "m3", unit_price: 1950 },
    { category: "materials", item_code: "CON-G30", description: "Ready-mix Concrete Grade 30 (30MPa)", unit: "m3", unit_price: 2100 },
    { category: "materials", item_code: "STL-Y12", description: "Reinforcing Steel Y12", unit: "ton", unit_price: 18500 },
    { category: "materials", item_code: "STL-Y16", description: "Reinforcing Steel Y16", unit: "ton", unit_price: 18200 },
    { category: "materials", item_code: "BRK-CL", description: "Clay Face Brick (100x220x75mm)", unit: "each", unit_price: 4.50 },
    { category: "materials", item_code: "BRK-CM", description: "Cement Brick (90x190x90mm)", unit: "each", unit_price: 2.80 },
    { category: "materials", item_code: "CEM-C42", description: "Cement CEM I 42.5N (50kg bag)", unit: "bag", unit_price: 95 },
    { category: "materials", item_code: "AGG-13", description: "13mm Crushed Stone", unit: "ton", unit_price: 320 },
    { category: "materials", item_code: "AGG-19", description: "19mm Crushed Stone", unit: "ton", unit_price: 310 },
    { category: "materials", item_code: "SND-RV", description: "River Sand", unit: "ton", unit_price: 250 },
    { category: "materials", item_code: "SND-BL", description: "Building Sand/Plaster Sand", unit: "ton", unit_price: 220 },
    { category: "materials", item_code: "TMB-BRG", description: "Structural Timber Beam (76x152mm)", unit: "m", unit_price: 85 },
    { category: "materials", item_code: "TMB-PLY", description: "WBP Plywood 18mm", unit: "sheet", unit_price: 450 },
    { category: "materials", item_code: "TMB-SHUT", description: "Shutterply 18mm (Formwork)", unit: "sheet", unit_price: 580 },
    { category: "materials", item_code: "PLB-PVC50", description: "uPVC Pipe 50mm class 16", unit: "m", unit_price: 65 },
    { category: "materials", item_code: "PLB-PVC110", description: "uPVC Pipe 110mm class 16", unit: "m", unit_price: 125 },
    { category: "materials", item_code: "ELC-2.5", description: "Twin & Earth Cable 2.5mm2", unit: "m", unit_price: 18 },
    { category: "materials", item_code: "ELC-6.0", description: "Twin & Earth Cable 6.0mm2", unit: "m", unit_price: 32 },
    { category: "materials", item_code: "PPE-HLM", description: "Safety Helmet (Standard)", unit: "each", unit_price: 85 },
    { category: "materials", item_code: "PPE-VST", description: "Safety Vest (Hi-Vis)", unit: "each", unit_price: 45 },
    { category: "materials", item_code: "PPE-BTS", description: "Safety Boots (Steel Toe)", unit: "pair", unit_price: 350 }
  ],
  plant: [
    { category: "plant", item_code: "PLT-EXC20", description: "Excavator 20-ton", unit: "hr", unit_price: 650 },
    { category: "plant", item_code: "PLT-TLB", description: "Tractor Loader Backhoe (TLB)", unit: "hr", unit_price: 450 },
    { category: "plant", item_code: "PLT-GRDR", description: "Motor Grader", unit: "hr", unit_price: 750 },
    { category: "plant", item_code: "PLT-ROLL10", description: "Vibratory Roller 10-ton", unit: "hr", unit_price: 550 },
    { category: "plant", item_code: "PLT-CRANE25", description: "Mobile Crane 25-ton", unit: "hr", unit_price: 950 },
    { category: "plant", item_code: "PLT-DUMP10", description: "Dump Truck 10m3", unit: "hr", unit_price: 480 },
    { category: "plant", item_code: "PLT-CONCP", description: "Concrete Pump (boom)", unit: "hr", unit_price: 750 },
    { category: "plant", item_code: "PLT-BACKHOE", description: "Backhoe Loader", unit: "hr", unit_price: 420 },
    { category: "plant", item_code: "PLT-SKID", description: "Skid Steer Loader", unit: "hr", unit_price: 380 },
    { category: "plant", item_code: "PLT-COMP", description: "Diesel Compressor (250cfm)", unit: "hr", unit_price: 320 },
    { category: "plant", item_code: "PLT-GEN50", description: "Diesel Generator 50kVA", unit: "hr", unit_price: 280 },
    { category: "plant", item_code: "PLT-WLDR", description: "Diesel Welder (400A)", unit: "hr", unit_price: 250 },
    { category: "plant", item_code: "PLT-FORK", description: "Forklift 3-ton", unit: "hr", unit_price: 300 },
    { category: "plant", item_code: "PLT-TIPPER", description: "Tipper Truck 15-ton", unit": "hr", unit_price: 520 },
    { category: "plant", item_code: "PLT-WTR", description: "Water Tanker 10,000L", unit: "hr", unit_price: 400 }
  ],
  labour: [
    { category: "labour", item_code: "LAB-GEN", description: "General Worker (unskilled)", unit: "hr", unit_price: 35 },
    { category: "labour", item_code: "LAB-SKL", description: "Semi-skilled Worker", unit: "hr", unit_price: 55 },
    { category: "labour", item_code: "LAB-ART", description: "Artisan (skilled)", unit: "hr", unit_price: 85 },
    { category: "labour", item_code: "LAB-WLDR", description: "Certified Welder", unit: "hr", unit_price: 95 },
    { category: "labour", item_code: "LAB-ELEC", description: "Electrician", unit: "hr", unit_price: 90 },
    { category: "labour", item_code: "LAB-PLMB", description: "Plumber", unit: "hr", unit_price: 85 },
    { category: "labour", item_code: "LAB-CRNO", description: "Crane Operator", unit: "hr", unit_price: 80 },
    { category: "labour", item_code: "LAB-EXCO", description: "Excavator Operator", unit: "hr", unit_price: 75 },
    { category: "labour", item_code: "LAB-SFGO", description: "Safety Officer (qualified)", unit: "hr", unit_price: 110 },
    { category: "labour", item_code: "LAB-TPDR", description: "Truck/Tipper Driver", unit: "hr", unit_price: 60 },
    { category: "labour", item_code: "LAB-LABT", description: "Laboratory Technician", unit: "hr", unit_price: 95 },
    { category: "labour", item_code: "LAB-QS", description: "Quantity Surveyor", unit: "hr", unit_price: 180 },
    { category: "labour", item_code: "LAB-ENGC", description: "Civil Engineer", unit: "hr", unit_price: 220 },
    { category: "labour", item_code: "LAB-FORMN", description: "Foreman", unit: "hr", unit_price: 75 }
  ]
};

export default function PricingDatabase() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [category, setCategory] = useState("materials");
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ category: "materials", description: "", unit: "", supply_rate: "", install_rate: "", total_rate: "", region: "national", source: "" });

  useEffect(() => { fetchItems(); }, [user]);

  async function fetchItems() {
    if (!user) return;
    setLoading(true);
    const { data: userItems } = await supabase
      .from("pricing_items")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (userItems && userItems.length > 0) {
      setItems(userItems);
    }
    setLoading(false);
  }

  async function handleSeed() {
    if (!user) return;
    setSeeding(true);
    let seeded = 0;
    for (const cat of ["materials", "plant", "labour"]) {
      const batch = SEED_DATA[cat].map(item => ({
        ...item,
        total_rate: item.unit_price,
        region: "national",
        source: "ASAQS 2024",
        user_id: user.id
      }));
      const { error } = await supabase.from("pricing_items").insert(batch);
      if (!error) seeded += batch.length;
    }
    if (seeded > 0) {
      toast.success(`Seeded ${seeded} pricing items`);
      fetchItems();
    } else {
      toast.error("Seed failed - check database permissions");
    }
    setSeeding(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.description) { toast.error("Description required"); return; }
    const rate = parseFloat(form.supply_rate) + parseFloat(form.install_rate);
    const { error } = await supabase.from("pricing_items").insert({
      ...form, user_id: user.id,
      unit_price: rate,
      supply_rate: parseFloat(form.supply_rate) || 0,
      install_rate: parseFloat(form.install_rate) || 0,
      total_rate: parseFloat(form.total_rate) || rate
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Pricing item added"); setShowNew(false); fetchItems();
  }

  const cols = [
    { Header: "Code", accessor: "item_code", cell: r => <span className="font-mono text-xs">{r.item_code || "-"}</span> },
    { Header: "Description", accessor: "description", cell: r => <span className="font-medium">{r.description}</span> },
    { Header: "Unit", accessor: "unit", cell: r => <span className="text-sm">{r.unit}</span> },
    { Header: "Unit Price", accessor: "unit_price", cell: r => r.unit_price ? "R " + Number(r.unit_price).toLocaleString() : r.total_rate ? "R " + Number(r.total_rate).toLocaleString() : "-" },
    { Header: "Source", accessor: "source", cell: r => <span className="text-xs text-gray-400">{r.source || "-"}</span> }
  ];

  const filtered = items.filter(i => i.category === category);
  const isEmpty = items.length === 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Pricing Database</h2>
          <p className="text-gray-500 mt-1">{items.length} pricing items</p>
        </div>
        <div className="flex gap-2">
          {isEmpty && (
            <button onClick={handleSeed} disabled={seeding} className="btn-success">
              {seeding ? "Seeding..." : "Seed with ASAQS 2024 Rates"}
            </button>
          )}
          <button onClick={() => setShowNew(true)} className="btn-primary">Add Item</button>
        </div>
      </div>

      {isEmpty ? (
        <div className="card p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Pricing Database is Empty</h3>
          <p className="text-gray-500 mb-4 max-w-md mx-auto">Click "Seed with ASAQS 2024 Rates" to populate with industry-standard pricing for materials, plant hire, and labour rates.</p>
          <button onClick={handleSeed} disabled={seeding} className="btn-success px-8 py-3">
            {seeding ? "Seeding..." : "Seed with ASAQS 2024 Rates"}
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-4">
            {["materials", "plant", "labour"].map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={"px-4 py-2 rounded-lg text-sm font-medium transition-colors " + (category === c ? "bg-safety-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50")}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
          <DataTable columns={cols} data={filtered} loading={loading} searchable emptyMessage="No pricing items in this category." />
        </>
      )}

      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="Add Pricing Item">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="label">Category</label>
            <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="materials">Materials</option>
              <option value="plant">Plant and Equipment</option>
              <option value="labour">Labour</option>
            </select>
          </div>
          <div><label className="label">Description *</label>
            <input type="text" className="input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="e.g. Concrete 25MPa ready mix" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Code</label><input type="text" className="input" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} /></div>
            <div><label className="label">Unit</label><input type="text" className="input" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} placeholder="m3, ton, each" /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="label">Supply Rate</label><input type="number" className="input" value={form.supply_rate} onChange={e => setForm({ ...form, supply_rate: e.target.value })} /></div>
            <div><label className="label">Install Rate</label><input type="number" className="input" value={form.install_rate} onChange={e => setForm({ ...form, install_rate: e.target.value })} /></div>
            <div><label className="label">Total Rate</label><input type="number" className="input" value={form.total_rate} onChange={e => setForm({ ...form, total_rate: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Region</label>
              <select className="input" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })}>
                <option value="national">National</option>
                <option value="gauteng">Gauteng</option>
                <option value="western_cape">Western Cape</option>
                <option value="kwazulu_natal">KwaZulu-Natal</option>
              </select>
            </div>
            <div><label className="label">Source</label><input type="text" className="input" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} placeholder="ASAQS, supplier quote" /></div>
          </div>
          <button type="submit" className="btn-primary w-full">Add Item</button>
        </form>
      </Modal>
    </div>
  );
}
