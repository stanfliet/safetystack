// SafetyStack SA Construction Plant & Equipment Hire Rates Database
// Comprehensive market hire rates for South African construction plant (July 2026)
// Rates are per day (8-hour shift) unless otherwise indicated - excluding operator

export const PLANT_CATEGORIES = {
  earthmoving: {
    name: 'Earthmoving',
    items: [
      { code: 'TLB-4x4', description: 'TLB 4x4 backhoe loader (standard)', unit: 'day', national: 3800, remote: 4500, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'TLB-4x4-HP', description: 'TLB 4x4 backhoe loader (high power)', unit: 'day', national: 4500, remote: 5200, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'EXCAV-8', description: 'Excavator 8 ton', unit: 'day', national: 4200, remote: 5000, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'EXCAV-14', description: 'Excavator 14 ton', unit: 'day', national: 5200, remote: 6100, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'EXCAV-20', description: 'Excavator 20 ton', unit: 'day', national: 6500, remote: 7500, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'EXCAV-30', description: 'Excavator 30 ton', unit: 'day', national: 8500, remote: 9800, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'EXCAV-45', description: 'Excavator 45 ton', unit: 'day', national: 12000, remote: 13800, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'BULLDOZER-D6', description: 'Bulldozer D6', unit: 'day', national: 9500, remote: 11000, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'BULLDOZER-D8', description: 'Bulldozer D8', unit: 'day', national: 14000, remote: 16000, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'GRADER-140', description: 'Motor grader 140H', unit: 'day', national: 8500, remote: 9800, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'GRADER-160', description: 'Motor grader 160H', unit: 'day', national: 10000, remote: 11500, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'LOADER-3', description: 'Wheel loader 3 ton', unit: 'day', national: 4800, remote: 5600, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'LOADER-5', description: 'Wheel loader 5 ton', unit: 'day', national: 6800, remote: 7800, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'LOADER-8', description: 'Wheel loader 8 ton', unit: 'day', national: 9500, remote: 11000, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'ROLLER-10', description: 'Smooth drum roller 10 ton', unit: 'day', national: 4200, remote: 5000, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'ROLLER-18', description: 'Smooth drum roller 18 ton', unit: 'day', national: 5800, remote: 6700, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'PDR', description: 'Pneumatic tyred roller (PTR)', unit: 'day', national: 5200, remote: 6000, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'COMPACTOR', description: 'Jumping jack compactor', unit: 'day', national: 450, remote: 550, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'WACKER', description: 'Wacker plate compactor', unit: 'day', national: 350, remote: 420, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'TIPPER-10m3', description: '10m³ tipper truck', unit: 'day', national: 3200, remote: 3800, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'TIPPER-15m3', description: '15m³ tipper truck', unit: 'day', national: 3800, remote: 4500, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'TIPPER-20m3', description: '20m³ tipper truck', unit: 'day', national: 4500, remote: 5200, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'WATER-TRUCK', description: 'Water truck 10000L', unit: 'day', national: 3800, remote: 4500, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'VIBRATOR', description: 'Concrete vibrator', unit: 'day', national: 280, remote: 350, data_source: 'Plant Hire SA rate guide Jul 2026' },
    ]
  },
  concrete: {
    name: 'Concrete Equipment',
    items: [
      { code: 'MIXER-200L', description: '200L concrete mixer (diesel)', unit: 'day', national: 350, remote: 420, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'MIXER-500L', description: '500L concrete mixer (diesel)', unit: 'day', national: 650, remote: 780, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'PUMP-LINE', description: 'Concrete pump (line pump)', unit: 'day', national: 3800, remote: 4500, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'PUMP-BOOM-36', description: 'Concrete pump (36m boom)', unit: 'day', national: 8500, remote: 10000, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'PUMP-BOOM-52', description: 'Concrete pump (52m boom)', unit: 'day', national: 12000, remote: 14000, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'SCREED', description: 'Power screed', unit: 'day', national: 450, remote: 550, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'TROWEL', description: 'Power trowel (walk-behind)', unit: 'day', national: 380, remote: 460, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'CORE-DRILL', description: 'Concrete core drill rig', unit: 'day', national: 550, remote: 650, data_source: 'Plant Hire SA rate guide Jul 2026' },
    ]
  },
  materialHandling: {
    name: 'Material Handling',
    items: [
      { code: 'FORK-2.5', description: 'Forklift 2.5 ton', unit: 'day', national: 1200, remote: 1450, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'FORK-5', description: 'Forklift 5 ton', unit: 'day', national: 1800, remote: 2150, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'FORK-10', description: 'Forklift 10 ton', unit: 'day', national: 2800, remote: 3400, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'TELESCOPE-HANDLER', description: 'Telescopic handler (4 ton)', unit: 'day', national: 3200, remote: 3800, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'CRANE-5', description: 'Mobile crane 5 ton', unit: 'day', national: 3800, remote: 4500, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'CRANE-10', description: 'Mobile crane 10 ton', unit: 'day', national: 5200, remote: 6200, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'CRANE-25', description: 'Mobile crane 25 ton', unit: 'day', national: 8500, remote: 10000, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'CRANE-50', description: 'Mobile crane 50 ton', unit: 'day', national: 14000, remote: 16500, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'CRANE-100', description: 'Mobile crane 100 ton', unit: 'day', national: 25000, remote: 29000, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'CHERRY-PICKER', description: 'Cherry picker (boom lift 12m)', unit: 'day', national: 1800, remote: 2200, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'SCISSOR-6', description: 'Scissor lift 6m', unit: 'day', national: 950, remote: 1150, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'SCISSOR-12', description: 'Scissor lift 12m', unit: 'day', national: 1500, remote: 1800, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'HOIST-1', description: 'Material hoist 1 ton', unit: 'day', national: 850, remote: 1000, data_source: 'Plant Hire SA rate guide Jul 2026' },
    ]
  },
  roadworks: {
    name: 'Roadworks & Paving',
    items: [
      { code: 'PAVER-TRACK', description: 'Asphalt paver (tracked)', unit: 'day', national: 12000, remote: 14000, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'PAVER-WHEEL', description: 'Asphalt paver (wheeled)', unit: 'day', national: 10000, remote: 11500, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'MILLING-1M', description: 'Cold milling machine 1m', unit: 'day', national: 15000, remote: 17500, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'MILLING-2M', description: 'Cold milling machine 2m', unit: 'day', national: 22000, remote: 25500, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'CHIP-SPREADER', description: 'Chip spreader', unit: 'day', national: 8500, remote: 10000, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'BITUMEN-TANKER', description: 'Bitumen tanker 20000L', unit: 'day', national: 5200, remote: 6000, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'ROAD-SAW', description: 'Road saw (concrete/asphalt)', unit: 'day', national: 1200, remote: 1450, data_source: 'Plant Hire SA rate guide Jul 2026' },
    ]
  },
  compaction: {
    name: 'Compaction & Surfacing',
    items: [
      { code: 'TANDEM-1.5', description: 'Tandem vibratory roller 1.5 ton', unit: 'day', national: 2200, remote: 2650, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'TANDEM-3', description: 'Tandem vibratory roller 3 ton', unit: 'day', national: 3200, remote: 3800, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'SHEEPSFOOT', description: 'Sheepsfoot roller', unit: 'day', national: 5800, remote: 6700, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'GRID-ROLLER', description: 'Grid roller', unit: 'day', national: 5200, remote: 6000, data_source: 'Plant Hire SA rate guide Jul 2026' },
    ]
  },
  cutting: {
    name: 'Cutting & Drilling',
    items: [
      { code: 'STIHl-SAW', description: 'Stihl cut-off saw', unit: 'day', national: 280, remote: 350, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'JACKHAMMER', description: 'Jackhammer (pneumatic)', unit: 'day', national: 320, remote: 400, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'BREAKER-30', description: 'Hydraulic breaker 30kg (for excavator)', unit: 'day', national: 1800, remote: 2150, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'BREAKER-60', description: 'Hydraulic breaker 60kg', unit: 'day', national: 2500, remote: 3000, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'AUGER', description: 'Earth auger (post hole)', unit: 'day', national: 380, remote: 460, data_source: 'Plant Hire SA rate guide Jul 2026' },
    ]
  },
  pumping: {
    name: 'Pumping & Dewatering',
    items: [
      { code: 'PUMP-SUB-50', description: 'Submersible pump 50mm', unit: 'day', national: 280, remote: 350, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'PUMP-SUB-100', description: 'Submersible pump 100mm', unit: 'day', national: 450, remote: 550, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'PUMP-MUD', description: 'Mud pump (diaphragm)', unit: 'day', national: 380, remote: 460, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'PUMP-TRILL', description: 'Trash pump 150mm', unit: 'day', national: 650, remote: 780, data_source: 'Plant Hire SA rate guide Jul 2026' },
    ]
  },
  scaffolding: {
    name: 'Scaffolding & Access',
    items: [
      { code: 'SCAFF-STD', description: 'Standard scaffolding (m² per week)', unit: 'm2-week', national: 55, remote: 65, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'SCAFF-HVY', description: 'Heavy-duty scaffolding (m² per week)', unit: 'm2-week', national: 75, remote: 90, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'SCAFF-MOBILE', description: 'Mobile scaffold tower 2m', unit: 'week', national: 850, remote: 1000, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'LADDER-EXT', description: 'Extension ladder 6m', unit: 'week', national: 280, remote: 350, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'LADDER-FB', description: 'Fibreglass step ladder 2m', unit: 'week', national: 180, remote: 220, data_source: 'Plant Hire SA rate guide Jul 2026' },
    ]
  },
  generators: {
    name: 'Generators & Power',
    items: [
      { code: 'GEN-5', description: 'Diesel generator 5kVA', unit: 'day', national: 380, remote: 460, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'GEN-10', description: 'Diesel generator 10kVA', unit: 'day', national: 550, remote: 660, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'GEN-20', description: 'Diesel generator 20kVA', unit: 'day', national: 850, remote: 1000, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'GEN-50', description: 'Diesel generator 50kVA', unit: 'day', national: 1800, remote: 2150, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'GEN-100', description: 'Diesel generator 100kVA', unit: 'day', national: 3200, remote: 3800, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'GEN-200', description: 'Diesel generator 200kVA', unit: 'day', national: 5500, remote: 6500, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'LIGHT-TOWER', description: 'Light tower (LED, diesel)', unit: 'day', national: 550, remote: 660, data_source: 'Plant Hire SA rate guide Jul 2026' },
    ]
  },
  welding: {
    name: 'Welding & Fabrication',
    items: [
      { code: 'WELDER-AC', description: 'AC/DC welding machine (diesel)', unit: 'day', national: 380, remote: 460, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'WELDER-200', description: 'Inverter welder 200A', unit: 'day', national: 280, remote: 350, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'WELDER-GEN', description: 'Welding generator combo', unit: 'day', national: 550, remote: 660, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'PLASMA', description: 'Plasma cutter', unit: 'day', national: 450, remote: 550, data_source: 'Plant Hire SA rate guide Jul 2026' },
    ]
  },
  survey: {
    name: 'Survey & Testing',
    items: [
      { code: 'DUMPY', description: 'Dumpy level (optical)', unit: 'week', national: 350, remote: 420, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'THEODOLITE', description: 'Electronic theodolite', unit: 'week', national: 850, remote: 1000, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'TOTAL-STATION', description: 'Total station (set)', unit: 'week', national: 2500, remote: 3000, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'GPS-SURVEY', description: 'GPS survey kit (RTK)', unit: 'week', national: 4500, remote: 5200, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'CONE-PEN', description: 'Cone penetrometer (DCP)', unit: 'day', national: 350, remote: 420, data_source: 'Plant Hire SA rate guide Jul 2026' },
      { code: 'NUCLEAR-GAUGE', description: 'Nuclear density gauge', unit: 'day', national: 850, remote: 1000, data_source: 'Plant Hire SA rate guide Jul 2026' },
    ]
  },
  safety: {
    name: 'Safety Equipment',
    items: [
      { code: 'TRAFFIC-CONE', description: 'Traffic cone 750mm', unit: 'each', national: 85, remote: 100, data_source: 'Safety Shop price list Jul 2026' },
      { code: 'TRAFFIC-SIGN', description: 'Traffic sign (temporary)', unit: 'each', national: 250, remote: 300, data_source: 'Safety Shop price list Jul 2026' },
      { code: 'BARRICADE', description: 'Barricade (A-frame 2.4m)', unit: 'each', national: 320, remote: 380, data_source: 'Safety Shop price list Jul 2026' },
      { code: 'TAPE-DANGER', description: 'Danger tape (500m roll)', unit: 'roll', national: 120, remote: 145, data_source: 'Safety Shop price list Jul 2026' },
      { code: 'FIRE-EXT-9', description: 'Fire extinguisher 9kg (SANS)', unit: 'each', national: 450, remote: 520, data_source: 'Safety Shop price list Jul 2026' },
      { code: 'FIRE-EXT-CO2', description: 'CO2 fire extinguisher 4.5kg', unit: 'each', national: 650, remote: 750, data_source: 'Safety Shop price list Jul 2026' },
      { code: 'EYEWASH', description: 'Emergency eyewash station', unit: 'each', national: 380, remote: 450, data_source: 'Safety Shop price list Jul 2026' },
      { code: 'BANDAGE', description: 'First aid kit (site - 24 person)', unit: 'each', national: 550, remote: 630, data_source: 'Safety Shop price list Jul 2026' },
      { code: 'HARNESS', description: 'Full body safety harness (SANS)', unit: 'each', national: 850, remote: 980, data_source: 'Safety Shop price list Jul 2026' },
      { code: 'LANYARD', description: 'Shock-absorbing lanyard 2m', unit: 'each', national: 380, remote: 450, data_source: 'Safety Shop price list Jul 2026' },
    ]
  }
};

// Helper to search plant
export function searchPlant(query, isRemote = false) {
  const q = query.toLowerCase();
  const results = [];
  for (const [catKey, cat] of Object.entries(PLANT_CATEGORIES)) {
    for (const item of cat.items) {
      if (item.description.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)) {
        results.push({ ...item, category: cat.name, categoryKey: catKey, rate: isRemote ? item.remote : item.national });
      }
    }
  }
  return results;
}

// Helper to get plant hire rate with operator cost add-on
export function getPlantWithOperator(itemCode, isRemote = false) {
  for (const cat of Object.values(PLANT_CATEGORIES)) {
    const found = cat.items.find(i => i.code === itemCode);
    if (found) {
      const base = isRemote ? found.remote : found.national;
      // Operator add-on: ~R2000/day for earthmoving, R1500 for light plant
      const operatorCost = ['earthmoving', 'roadworks', 'concrete'].includes(cat.categoryKey) ? 2000 : 1200;
      return { ...found, hireRate: base, operatorAddOn: operatorCost, totalWithOperator: base + operatorCost };
    }
  }
  return null;
}

export default PLANT_CATEGORIES;
