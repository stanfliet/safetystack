import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable from "../../components/ui/DataTable";
import toast from "react-hot-toast";

const ANALYSIS_TYPES = [
  { value: "general", label: "General Analysis" },
  { value: "boq", label: "BOQ Pricing" },
  { value: "hs", label: "H&S Requirements" },
  { value: "compliance", label: "Compliance Check" },
  { value: "scope", label: "Scope of Works" },
  { value: "tender", label: "Tender Evaluation" },
  { value: "contract", label: "Contract Review" }
];

const SEED_DATA = {
  materials: [
    { category: "materials", code: "CON-G20", description: "Ready-mix Concrete Grade 20 (20MPa)", unit: "m3", total_rate: 1850 },
    { category: "materials", code: "CON-G25", description: "Ready-mix Concrete Grade 25 (25MPa)", unit: "m3", total_rate: 1950 },
    { category: "materials", code: "CON-G30", description: "Ready-mix Concrete Grade 30 (30MPa)", unit: "m3", total_rate: 2100 },
    { category: "materials", code: "STL-Y12", description: "Reinforcing Steel Y12", unit: "ton", total_rate: 18500 },
    { category: "materials", code: "STL-Y16", description: "Reinforcing Steel Y16", unit: "ton", total_rate: 18200 },
    { category: "materials", code: "BRK-CL", description: "Clay Face Brick (100x220x75mm)", unit: "each", total_rate: 4.50 },
    { category: "materials", code: "BRK-CM", description: "Cement Brick (90x190x90mm)", unit: "each", total_rate: 2.80 },
    { category: "materials", code: "CEM-C42", description: "Cement CEM I 42.5N (50kg bag)", unit: "bag", total_rate: 95 },
    { category: "materials", code: "AGG-13", description: "13mm Crushed Stone", unit: "ton", total_rate: 320 },
    { category: "materials", code: "AGG-19", description: "19mm Crushed Stone", unit: "ton", total_rate: 310 },
    { category: "materials", code: "SND-RVR", description: "River Sand", unit: "m3", total_rate: 280 },
    { category: "materials", code: "SND-PLT", description: "Plaster Sand", unit: "m3", total_rate: 260 },
    { category: "materials", code: "BLD-CMU90", description: "Concrete Masonry Unit 90mm", unit: "each", total_rate: 3.20 },
    { category: "materials", code: "BLD-CMU140", description: "Concrete Masonry Unit 140mm", unit: "each", total_rate: 4.80 },
    { category: "materials", code: "TMB-SHUT", description: "Shuttering Plywood 18mm", unit: "sheet", total_rate: 580 },
    { category: "materials", code: "PLB-PVC50", description: "uPVC Pipe 50mm class 16", unit: "m", total_rate: 65 },
    { category: "materials", code: "PLB-PVC110", description: "uPVC Pipe 110mm class 16", unit: "m", total_rate: 125 },
    { category: "materials", code: "ELC-2.5", description: "Twin & Earth Cable 2.5mm2", unit: "m", total_rate: 18 },
    { category: "materials", code: "ELC-6.0", description: "Twin & Earth Cable 6.0mm2", unit: "m", total_rate: 32 },
    { category: "materials", code: "PPE-HLM", description: "Safety Helmet (Standard)", unit: "each", total_rate: 85 },
    { category: "materials", code: "PPE-VST", description: "Safety Vest (Hi-Vis)", unit: "each", total_rate: 45 },
    { category: "materials", code: "PPE-BTS", description: "Safety Boots (Steel Toe)", unit: "pair", total_rate: 350 }
  ],
  plant: [
    { category: "plant", code: "PLT-EXC20", description: "Excavator 20-ton", unit: "hr", total_rate: 650 },
    { category: "plant", code: "PLT-TLB", description: "Tractor Loader Backhoe (TLB)", unit: "hr", total_rate: 450 },
    { category: "plant", code: "PLT-GRDR", description: "Motor Grader", unit: "hr", total_rate: 750 },
    { category: "plant", code: "PLT-ROLL10", description: "Vibratory Roller 10-ton", unit: "hr", total_rate: 550 },
    { category: "plant", code: "PLT-CRANE25", description: "Mobile Crane 25-ton", unit: "hr", total_rate: 950 },
    { category: "plant", code: "PLT-DUMP10", description: "Dump Truck 10m3", unit: "hr", total_rate: 480 },
    { category: "plant", code: "PLT-CONCP", description: "Concrete Pump (boom)", unit: "hr", total_rate: 750 },
    { category: "plant", code: "PLT-BACKHOE", description: "Backhoe Loader", unit: "hr", total_rate: 420 },
    { category: "plant", code: "PLT-SKID", description: "Skid Steer Loader", unit: "hr", total_rate: 380 },
    { category: "plant", code: "PLT-COMP", description: "Diesel Compressor (250cfm)", unit: "hr", total_rate: 320 },
    { category: "plant", code: "PLT-GEN50", description: "Diesel Generator 50kVA", unit: "hr", total_rate: 280 },
    { category: "plant", code: "PLT-WLDR", description: "Diesel Welder (400A)", unit: "hr", total_rate: 250 },
    { category: "plant", code: "PLT-FORK", description: "Forklift 3-ton", unit: "hr", total_rate: 300 },
    { category: "plant", code: "PLT-TIPPER", description: "Tipper Truck 15-ton", unit: "hr", total_rate: 520 },
    { category: "plant", code: "PLT-WTR", description: "Water Tanker 10,000L", unit: "hr", total_rate: 400 }
  ],
  labour: [
    { category: "labour", code: "LAB-GEN", description: "General Worker (unskilled)", unit: "hr", total_rate: 35 },
    { category: "labour", code: "LAB-SKL", description: "Semi-skilled Worker", unit: "hr", total_rate: 55 },
    { category: "labour", code: "LAB-ART", description: "Artisan (skilled)", unit: "hr", total_rate: 85 },
    { category: "labour", code: "LAB-WLDR", description: "Certified Welder", unit: "hr", total_rate: 95 },
    { category: "labour", code: "LAB-ELEC", description: "Electrician", unit: "hr", total_rate: 90 },
    { category: "labour", code: "LAB-PLMB", description: "Plumber", unit: "hr", total_rate: 85 },
    { category: "labour", code: "LAB-CRNO", description: "Crane Operator", unit: "hr", total_rate: 80 },
    { category: "labour", code: "LAB-EXCO", description: "Excavator Operator", unit: "hr", total_rate: 75 },
    { category: "labour", code: "LAB-SFGO", description: "Safety Officer (qualified)", unit: "hr", total_rate: 110 },
    { category: "labour", code: "LAB-TPDR", description: "Truck/Tipper Driver", unit: "hr", total_rate: 60 },
    { category: "labour", code: "LAB-LABT", description: "Laboratory Technician", unit: "hr", total_rate: 95 },
    { category: "labour", code: "LAB-QS", description: "Quantity Surveyor", unit: "hr", total_rate: 180 },
    { category: "labour", code: "LAB-ENGC", description: "Civil Engineer", unit: "hr", total_rate: 220 },
    { category: "labour", code: "LAB-FORMN", description: "Foreman", unit: "hr", total_rate: 75 }
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
        category: item.category,
        code: item.code,
        description: item.description,
        unit: item.unit,
        total_rate: item.total_rate,
        supply_rate: 0,
        install_rate: 0,
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
      supply_rate: parseFloat(form.supply_rate) || 0,
      install_rate: parseFloat(form.install_rate) || 0,
      total_rate: parseFloat(form.total_rate) || rate
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Pricing item added"); setShowNew(false); fetchItems();
  }

  const cols = [
    { Header: "Code", accessor: "code", cell: r => <span className="font-mono text-xs">{r.code || "-"}</span> },
    { Header: "Description", accessor: "description", cell: r => <span className="font-medium">{r.description}</span> },
    { Header: "Unit", accessor: "unit", cell: r => <span className="text-sm">{r.unit}</span> },
    { Header: "Unit Price", accessor: "total_rate", cell: r => r.total_rate ? "R " + Number(r.total_rate).toLocaleString() : "-" },
    { Header: "Source", accessor: "source", cell: r => <span className="text-xs text-gray-400">{r.source || "-"}</span> }
  ];

  const filtered = items.filter(i => i.category === category);

  // Rest of component stays unchanged from line 141 onwards
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Pricing Database</h2>
          <p className="text-gray-500 mt-1">{filtered.length} items in <span className="capitalize">{category}</span></p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary" onClick={() => setShowNew(!showNew)}>{showNew ? "Cancel" : "Add Item"}</button>
          <button className="btn-primary" onClick={handleSeed} disabled={seeding}>{seeding ? "Seeding..." : "Seed ASAQS Data"}</button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6">
        {["materials", "plant", "labour"].map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              category === cat ? "bg-safety-600 text-white" : "bg-safety-800 text-safety-200 hover:bg-safety-700"
            }`}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</button>
        ))}
      </div>

      {/* New Item Form */}
      {showNew && (
        <form onSubmit={handleCreate} className="card mb-6"><div className="card-body grid grid-cols-3 gap-4">
          <div><label className="label">Code</label><input type="text" className="input" value={form.code} onChange={e => setForm({...form, code: e.target.value})} placeholder="e.g. CON-G30" /></div>
          <div className="col-span-2"><label className="label">Description *</label><input type="text" className="input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Item description" /></div>
          <div><label className="label">Unit</label><input type="text" className="input" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} placeholder="m3, hr, each" /></div>
          <div><label className="label">Supply Rate (R)</label><input type="number" className="input" value={form.supply_rate} onChange={e => setForm({...form, supply_rate: e.target.value})} placeholder="0" /></div>
          <div><label className="label">Install Rate (R)</label><input type="number" className="input" value={form.install_rate} onChange={e => setForm({...form, install_rate: e.target.value})} placeholder="0" /></div>
          <div><label className="label">Total Rate (R)</label><input type="number" className="input" value={form.total_rate} onChange={e => setForm({...form, total_rate: e.target.value})} placeholder="Auto-calculated" /></div>
          <div><label className="label">Region</label><input type="text" className="input" value={form.region} onChange={e => setForm({...form, region: e.target.value})} placeholder="national" /></div>
          <div><label className="label">Source</label><input type="text" className="input" value={form.source} onChange={e => setForm({...form, source: e.target.value})} placeholder="e.g. ASAQS 2024" /></div>
          <div className="flex items-end"><button type="submit" className="btn-primary">Save Item</button></div>
        </div></form>
      )}

      {/* Items Table */}
      <DataTable columns={cols} data={filtered} loading={loading} searchable emptyMessage="No pricing data. Click 'Seed ASAQS Data' to load industry-standard rates." />
    </div>
  );
}
