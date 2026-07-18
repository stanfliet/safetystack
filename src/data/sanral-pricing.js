// SafeStack - SANRAL Road Construction Pricing Database (July 2026)
// South African National Roads Agency Limited - Road Construction & Maintenance Rates
// Rates in ZAR - Excluding VAT

export const SANRAL_CATEGORIES = {
  earthworks: {
    name: 'Earthworks',
    items: [
      { code: 'SAN-EARTH-CUT', description: 'Bulk excavation (cut to fill) - per m³', unit: 'm3', national: 55, gauteng: 50, western_cape: 60, kwazulu_natal: 58, eastern_cape: 55, limpopo: 68, mpumalanga: 62, north_west: 58, free_state: 55, northern_cape: 75, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-EARTH-BORROW', description: 'Borrow excavation (imported fill) - per m³', unit: 'm3', national: 85, gauteng: 80, western_cape: 92, kwazulu_natal: 88, eastern_cape: 85, limpopo: 100, mpumalanga: 92, north_west: 88, free_state: 85, northern_cape: 110, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-EARTH-COMP', description: 'Compaction to 95% MOD AASHTO - per m³', unit: 'm3', national: 35, gauteng: 32, western_cape: 40, kwazulu_natal: 38, eastern_cape: 35, limpopo: 45, mpumalanga: 40, north_west: 38, free_state: 36, northern_cape: 52, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-EARTH-COMP-H', description: 'Compaction to 97% MOD AASHTO - per m³', unit: 'm3', national: 48, gauteng: 45, western_cape: 55, kwazulu_natal: 52, eastern_cape: 48, limpopo: 60, mpumalanga: 55, north_west: 52, free_state: 48, northern_cape: 68, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-EARTH-SLOPE', description: 'Slope protection (topsoiling & grassing) - per m²', unit: 'm2', national: 28, gauteng: 26, western_cape: 32, kwazulu_natal: 30, eastern_cape: 28, limpopo: 35, mpumalanga: 32, north_west: 30, free_state: 28, northern_cape: 40, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-EARTH-GABION', description: 'Gabion baskets (1m x 1m x 1m filled) - each', unit: 'each', national: 650, gauteng: 630, western_cape: 700, kwazulu_natal: 680, eastern_cape: 660, limpopo: 750, mpumalanga: 700, north_west: 680, free_state: 660, northern_cape: 820, data_source: 'SANRAL Standard Rates Jul 2026' },
    ]
  },
  layers: {
    name: 'Base & Subbase Layers',
    items: [
      { code: 'SAN-LAY-G7', description: 'G7 selected subgrade (150mm layer) - per m²', unit: 'm2', national: 45, gauteng: 42, western_cape: 50, kwazulu_natal: 48, eastern_cape: 45, limpopo: 55, mpumalanga: 50, north_west: 48, free_state: 45, northern_cape: 62, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-LAY-G6', description: 'G6 subbase (150mm layer) - per m²', unit: 'm2', national: 58, gauteng: 55, western_cape: 65, kwazulu_natal: 62, eastern_cape: 58, limpopo: 72, mpumalanga: 65, north_west: 62, free_state: 58, northern_cape: 78, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-LAY-G5', description: 'G5 subbase (150mm layer) - per m²', unit: 'm2', national: 65, gauteng: 62, western_cape: 72, kwazulu_natal: 68, eastern_cape: 65, limpopo: 78, mpumalanga: 72, north_west: 68, free_state: 65, northern_cape: 85, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-LAY-C4', description: 'C4 cemented subbase (150mm) - per m²', unit: 'm2', national: 85, gauteng: 82, western_cape: 92, kwazulu_natal: 88, eastern_cape: 85, limpopo: 100, mpumalanga: 92, north_west: 88, free_state: 85, northern_cape: 110, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-LAY-C3', description: 'C3 cemented base (150mm) - per m²', unit: 'm2', national: 105, gauteng: 100, western_cape: 115, kwazulu_natal: 110, eastern_cape: 105, limpopo: 125, mpumalanga: 115, north_west: 110, free_state: 106, northern_cape: 135, data_source: 'SANRAL Standard Rates Jul 2026' },
    ]
  },
  surfacing: {
    name: 'Surfacing (Asphalt & Seal)',
    items: [
      { code: 'SAN-SURF-AC13', description: 'Asphalt AC 13mm wearing course (50mm) - per m²', unit: 'm2', national: 120, gauteng: 115, western_cape: 130, kwazulu_natal: 125, eastern_cape: 120, limpopo: 140, mpumalanga: 130, north_west: 125, free_state: 120, northern_cape: 155, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-SURF-AC20', description: 'Asphalt AC 20mm base course (75mm) - per m²', unit: 'm2', national: 145, gauteng: 140, western_cape: 158, kwazulu_natal: 150, eastern_cape: 145, limpopo: 170, mpumalanga: 158, north_west: 150, free_state: 146, northern_cape: 185, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-SURF-SEAL', description: 'Double seal (chip & spray) - per m²', unit: 'm2', national: 65, gauteng: 62, western_cape: 72, kwazulu_natal: 68, eastern_cape: 65, limpopo: 78, mpumalanga: 72, north_west: 68, free_state: 65, northern_cape: 85, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-SURF-SLURRY', description: 'Slurry seal (3mm) - per m²', unit: 'm2', national: 55, gauteng: 52, western_cape: 62, kwazulu_natal: 58, eastern_cape: 55, limpopo: 68, mpumalanga: 62, north_west: 58, free_state: 55, northern_cape: 75, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-SURF-FOG', description: 'Fog spray (emulsion) - per m²', unit: 'm2', national: 18, gauteng: 16, western_cape: 22, kwazulu_natal: 20, eastern_cape: 18, limpopo: 25, mpumalanga: 22, north_west: 20, free_state: 18, northern_cape: 30, data_source: 'SANRAL Standard Rates Jul 2026' },
    ]
  },
  drainage: {
    name: 'Drainage & Culverts',
    items: [
      { code: 'SAN-DRAIN-VDITCH', description: 'V-drain (concrete lined 600mm) - per m', unit: 'm', national: 280, gauteng: 270, western_cape: 305, kwazulu_natal: 295, eastern_cape: 285, limpopo: 325, mpumalanga: 305, north_west: 295, free_state: 288, northern_cape: 355, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-DRAIN-CULV600', description: 'Concrete pipe culvert 600mm - per m', unit: 'm', national: 2800, gauteng: 2700, western_cape: 3000, kwazulu_natal: 2900, eastern_cape: 2850, limpopo: 3200, mpumalanga: 3000, north_west: 2900, free_state: 2850, northern_cape: 3500, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-DRAIN-CULV900', description: 'Concrete pipe culvert 900mm - per m', unit: 'm', national: 4500, gauteng: 4350, western_cape: 4800, kwazulu_natal: 4680, eastern_cape: 4550, limpopo: 5100, mpumalanga: 4800, north_west: 4700, free_state: 4600, northern_cape: 5600, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-DRAIN-CATCH', description: 'Catchpit / manhole (1.2m deep) - each', unit: 'each', national: 3200, gauteng: 3100, western_cape: 3500, kwazulu_natal: 3400, eastern_cape: 3300, limpopo: 3700, mpumalanga: 3500, north_west: 3400, free_state: 3300, northern_cape: 4000, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-DRAIN-GABION', description: 'Gabion check dam (2m wide) - each', unit: 'each', national: 1850, gauteng: 1780, western_cape: 2000, kwazulu_natal: 1920, eastern_cape: 1880, limpopo: 2150, mpumalanga: 2000, north_west: 1920, free_state: 1880, northern_cape: 2350, data_source: 'SANRAL Standard Rates Jul 2026' },
    ]
  },
  structures: {
    name: 'Bridges & Structures',
    items: [
      { code: 'SAN-STR-FND', description: 'Bridge foundation excavation (rock) - per m³', unit: 'm3', national: 350, gauteng: 340, western_cape: 380, kwazulu_natal: 365, eastern_cape: 355, limpopo: 410, mpumalanga: 380, north_west: 370, free_state: 360, northern_cape: 440, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-STR-CONC30', description: 'Bridge grade 30MPa concrete - per m³', unit: 'm3', national: 2200, gauteng: 2150, western_cape: 2400, kwazulu_natal: 2300, eastern_cape: 2250, limpopo: 2550, mpumalanga: 2400, north_west: 2300, free_state: 2250, northern_cape: 2700, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-STR-CONC40', description: 'Bridge grade 40MPa concrete - per m³', unit: 'm3', national: 2600, gauteng: 2500, western_cape: 2800, kwazulu_natal: 2700, eastern_cape: 2650, limpopo: 3000, mpumalanga: 2800, north_west: 2700, free_state: 2650, northern_cape: 3200, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-STR-REBAR', description: 'Reinforcing steel (bridge grade 450MPa) - per ton', unit: 'ton', national: 19500, gauteng: 19000, western_cape: 21000, kwazulu_natal: 20500, eastern_cape: 19800, limpopo: 22500, mpumalanga: 21000, north_west: 20500, free_state: 20000, northern_cape: 24500, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-STR-PRESTRESS', description: 'Prestressing (strand & stressing) - per ton', unit: 'ton', national: 28000, gauteng: 27500, western_cape: 30000, kwazulu_natal: 29000, eastern_cape: 28500, limpopo: 32000, mpumalanga: 30000, north_west: 29000, free_state: 28500, northern_cape: 35000, data_source: 'SANRAL Standard Rates Jul 2026' },
    ]
  },
  furniture: {
    name: 'Road Furniture & Safety',
    items: [
      { code: 'SAN-FURN-GR', description: 'Guardrail (w-beam, galvanised) - per m', unit: 'm', national: 420, gauteng: 405, western_cape: 455, kwazulu_natal: 440, eastern_cape: 430, limpopo: 480, mpumalanga: 455, north_west: 440, free_state: 430, northern_cape: 520, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-FURN-CONE', description: 'Traffic cone (750mm reflective) - each', unit: 'each', national: 95, gauteng: 90, western_cape: 105, kwazulu_natal: 100, eastern_cape: 95, limpopo: 115, mpumalanga: 105, north_west: 100, free_state: 95, northern_cape: 125, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-FURN-SIGN', description: 'Road sign (2.4m post, retroreflective) - each', unit: 'each', national: 850, gauteng: 820, western_cape: 920, kwazulu_natal: 880, eastern_cape: 860, limpopo: 980, mpumalanga: 920, north_west: 880, free_state: 860, northern_cape: 1080, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-FURN-BMARK', description: 'Road marking (thermoplastic, 100mm line) - per m', unit: 'm', national: 45, gauteng: 42, western_cape: 50, kwazulu_natal: 48, eastern_cape: 45, limpopo: 55, mpumalanga: 50, north_west: 48, free_state: 45, northern_cape: 62, data_source: 'SANRAL Standard Rates Jul 2026' },
      { code: 'SAN-FURN-BARRIER', description: 'Concrete barrier (Jersey, 1m section) - each', unit: 'each', national: 650, gauteng: 630, western_cape: 700, kwazulu_natal: 680, eastern_cape: 660, limpopo: 750, mpumalanga: 700, north_west: 680, free_state: 660, northern_cape: 820, data_source: 'SANRAL Standard Rates Jul 2026' },
    ]
  }
};

export function searchSANRAL(query, region = 'national') {
  const q = query.toLowerCase();
  const results = [];
  for (const [, cat] of Object.entries(SANRAL_CATEGORIES)) {
    for (const item of cat.items) {
      if (item.description.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)) {
        results.push({ ...item, category: cat.name, price: item[region] || item.national });
      }
    }
  }
  return results;
}

export default SANRAL_CATEGORIES;
