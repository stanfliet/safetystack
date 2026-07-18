// SafeStack - NHBRC Housing Pricing Database (July 2026)
// National Home Builders Registration Council - Housing Construction Rates
// Rates in ZAR - All inclusive of VAT where indicated

export const NHBRC_CATEGORIES = {
  foundations: {
    name: 'Foundations & Earthworks',
    items: [
      { code: 'NHB-FND-STRIP', description: 'Strip footing excavation (600mm deep) - per m', unit: 'm', national: 180, gauteng: 175, western_cape: 195, kwazulu_natal: 185, eastern_cape: 178, limpopo: 210, mpumalanga: 195, north_west: 188, free_state: 180, northern_cape: 220, data_source: 'NHBRC Housing Standards Jul 2026' },
      { code: 'NHB-FND-BLIND', description: 'Blinding concrete 10MPa (50mm) - per m²', unit: 'm2', national: 85, gauteng: 82, western_cape: 92, kwazulu_natal: 88, eastern_cape: 85, limpopo: 98, mpumalanga: 92, north_west: 88, free_state: 86, northern_cape: 105, data_source: 'NHBRC Housing Standards Jul 2026' },
      { code: 'NHB-FND-REBAR', description: 'Reinforcing mesh A142 (6mm) - per m²', unit: 'm2', national: 95, gauteng: 92, western_cape: 102, kwazulu_natal: 98, eastern_cape: 95, limpopo: 110, mpumalanga: 102, north_west: 98, free_state: 96, northern_cape: 118, data_source: 'NHBRC Housing Standards Jul 2026' },
      { code: 'NHB-FND-CONC25', description: '25MPa concrete in foundations - per m³', unit: 'm3', national: 1550, gauteng: 1500, western_cape: 1650, kwazulu_natal: 1580, eastern_cape: 1520, limpopo: 1750, mpumalanga: 1650, north_west: 1580, free_state: 1540, northern_cape: 1850, data_source: 'NHBRC Housing Standards Jul 2026' },
      { code: 'NHB-FND-DPC', description: 'Damp proof course (HDPE 0.2mm) - per m²', unit: 'm2', national: 45, gauteng: 42, western_cape: 50, kwazulu_natal: 48, eastern_cape: 46, limpopo: 55, mpumalanga: 50, north_west: 48, free_state: 46, northern_cape: 62, data_source: 'NHBRC Housing Standards Jul 2026' },
      { code: 'NHB-FND-FILL', description: 'Granular fill (G5 material) - per m³', unit: 'm3', national: 180, gauteng: 170, western_cape: 195, kwazulu_natal: 185, eastern_cape: 175, limpopo: 210, mpumalanga: 195, north_west: 185, free_state: 178, northern_cape: 230, data_source: 'NHBRC Housing Standards Jul 2026' },
      { code: 'NHB-FND-COMP', description: 'Compaction of fill (95% MOD AASHTO) - per m²', unit: 'm2', national: 28, gauteng: 26, western_cape: 32, kwazulu_natal: 30, eastern_cape: 28, limpopo: 35, mpumalanga: 32, north_west: 30, free_state: 28, northern_cape: 40, data_source: 'NHBRC Housing Standards Jul 2026' },
    ]
  },
  superstructure: {
    name: 'Superstructure (Walls & Columns)',
    items: [
      { code: 'NHB-SUP-BRICK', description: 'Clay face brickwork (half-brick wall) - per m²', unit: 'm2', national: 220, gauteng: 210, western_cape: 240, kwazulu_natal: 230, eastern_cape: 225, limpopo: 255, mpumalanga: 238, north_west: 228, free_state: 222, northern_cape: 270, data_source: 'NHBRC Housing Standards Jul 2026' },
      { code: 'NHB-SUP-BLK140', description: 'Concrete block wall 140mm - per m²', unit: 'm2', national: 185, gauteng: 178, western_cape: 200, kwazulu_natal: 192, eastern_cape: 188, limpopo: 215, mpumalanga: 200, north_west: 192, free_state: 188, northern_cape: 230, data_source: 'NHBRC Housing Standards Jul 2026' },
      { code: 'NHB-SUP-LINTEL', description: 'Precast concrete lintel (1.5m) - each', unit: 'each', national: 180, gauteng: 170, western_cape: 195, kwazulu_natal: 188, eastern_cape: 182, limpopo: 210, mpumalanga: 195, north_west: 188, free_state: 182, northern_cape: 225, data_source: 'NHBRC Housing Standards Jul 2026' },
      { code: 'NHB-SUP-RING', description: 'Ring beam (225mm x 300mm) - per m', unit: 'm', national: 250, gauteng: 240, western_cape: 270, kwazulu_natal: 258, eastern_cape: 252, limpopo: 285, mpumalanga: 268, north_west: 258, free_state: 252, northern_cape: 310, data_source: 'NHBRC Housing Standards Jul 2026' },
      { code: 'NHB-SUP-COLUMN', description: 'Reinforced concrete column (300x300mm) - per m', unit: 'm', national: 380, gauteng: 365, western_cape: 410, kwazulu_natal: 395, eastern_cape: 385, limpopo: 430, mpumalanga: 405, north_west: 395, free_state: 388, northern_cape: 470, data_source: 'NHBRC Housing Standards Jul 2026' },
    ]
  },
  roofing: {
    name: 'Roofing',
    items: [
      { code: 'NHB-ROOF-TRUSS', description: 'Timber roof truss (standard house) - each', unit: 'each', national: 850, gauteng: 820, western_cape: 920, kwazulu_natal: 880, eastern_cape: 860, limpopo: 980, mpumalanga: 920, north_west: 890, free_state: 860, northern_cape: 1080, data_source: 'NHBRC Housing Standards Jul 2026' },
      { code: 'NHB-ROOF-IZM', description: 'Imerys/Zincalume roof sheeting 0.5mm - per m²', unit: 'm2', national: 185, gauteng: 178, western_cape: 200, kwazulu_natal: 192, eastern_cape: 188, limpopo: 215, mpumalanga: 200, north_west: 192, free_state: 188, northern_cape: 230, data_source: 'NHBRC Housing Standards Jul 2026' },
      { code: 'NHB-ROOF-CEILING', description: 'Ceiling board (6mm) and timber frame - per m²', unit: 'm2', national: 160, gauteng: 152, western_cape: 175, kwazulu_natal: 168, eastern_cape: 162, limpopo: 188, mpumalanga: 175, north_west: 168, free_state: 162, northern_cape: 205, data_source: 'NHBRC Housing Standards Jul 2026' },
      { code: 'NHB-ROOF-INSUL', description: 'Roof insulation (Isotherm 100mm) - per m²', unit: 'm2', national: 65, gauteng: 62, western_cape: 72, kwazulu_natal: 68, eastern_cape: 65, limpopo: 78, mpumalanga: 72, north_west: 68, free_state: 66, northern_cape: 85, data_source: 'NHBRC Housing Standards Jul 2026' },
      { code: 'NHB-ROOF-GUTTER', description: 'Guttering (PVC 100mm half-round) - per m', unit: 'm', national: 85, gauteng: 80, western_cape: 92, kwazulu_natal: 88, eastern_cape: 85, limpopo: 100, mpumalanga: 92, north_west: 88, free_state: 86, northern_cape: 110, data_source: 'NHBRC Housing Standards Jul 2026' },
      { code: 'NHB-ROOF-FASCIA', description: 'Fascia board (timber 200mm) - per m', unit: 'm', national: 95, gauteng: 90, western_cape: 105, kwazulu_natal: 100, eastern_cape: 96, limpopo: 112, mpumalanga: 105, north_west: 100, free_state: 96, northern_cape: 120, data_source: 'NHBRC Housing Standards Jul 2026' },
    ]
  },
  finishes: {
    name: 'Finishes (Internal & External)',
    items: [
      { code: 'NHB-FIN-PLASTER', description: 'Internal plaster (13mm cement/sand) - per m²', unit: 'm2', national: 95, gauteng: 90, western_cape: 105, kwazulu_natal: 100, eastern_cape: 95, limpopo: 115, mpumalanga: 105, north_west: 100, free_state: 96, northern_cape: 125, data_source: 'NHBRC Housing Standards Jul 2026' },
      { code: 'NHB-FIN-SCREED', description: 'Cement screed (50mm floor) - per m²', unit: 'm2', national: 120, gauteng: 115, western_cape: 130, kwazulu_natal: 125, eastern_cape: 120, limpopo: 140, mpumalanga: 130, north_west: 125, free_state: 122, northern_cape: 155, data_source: 'NHBRC Housing Standards Jul 2026' },
      { code: 'NHB-FIN-TILE-FLR', description: 'Floor tiling (ceramic 400x400) - per m²', unit: 'm2', national: 185, gauteng: 178, western_cape: 200, kwazulu_natal: 192, eastern_cape: 188, limpopo: 215, mpumalanga: 200, north_west: 192, free_state: 188, northern_cape: 235, data_source: 'NHBRC Housing Standards Jul 2026' },
      { code: 'NHB-FIN-PAINT', description: 'Emulsion paint (2 coats, walls) - per m²', unit: 'm2', national: 65, gauteng: 62, western_cape: 72, kwazulu_natal: 68, eastern_cape: 65, limpopo: 78, mpumalanga: 72, north_west: 68, free_state: 66, northern_cape: 85, data_source: 'NHBRC Housing Standards Jul 2026' },
      { code: 'NHB-FIN-SKIRT', description: 'Skirting (timber 75mm H) - per m', unit: 'm', national: 55, gauteng: 52, western_cape: 62, kwazulu_natal: 58, eastern_cape: 55, limpopo: 68, mpumalanga: 62, north_west: 58, free_state: 56, northern_cape: 72, data_source: 'NHBRC Housing Standards Jul 2026' },
    ]
  },
  services: {
    name: 'Electrical & Plumbing Services',
    items: [
      { code: 'NHB-SRV-POINT', description: 'Electrical single point (including conduit/box) - each', unit: 'each', national: 280, gauteng: 270, western_cape: 305, kwazulu_natal: 295, eastern_cape: 285, limpopo: 325, mpumalanga: 305, north_west: 295, free_state: 288, northern_cape: 355, data_source: 'NHBRC Housing Standards Jul 2026' },
      { code: 'NHB-SRV-DB', description: 'Distribution board (6-way, MCB+RCD) - each', unit: 'each', national: 1850, gauteng: 1800, western_cape: 2000, kwazulu_natal: 1920, eastern_cape: 1880, limpopo: 2150, mpumalanga: 2000, north_west: 1920, free_state: 1880, northern_cape: 2300, data_source: 'NHBRC Housing Standards Jul 2026' },
      { code: 'NHB-SRV-HW-GAS', description: 'Gas geyser (100L installation) - each', unit: 'each', national: 4500, gauteng: 4350, western_cape: 4800, kwazulu_natal: 4650, eastern_cape: 4550, limpopo: 5100, mpumalanga: 4800, north_west: 4700, free_state: 4600, northern_cape: 5600, data_source: 'NHBRC Housing Standards Jul 2026' },
      { code: 'NHB-SRV-WATER', description: 'Water connection point (HDPE pipe) - each', unit: 'each', national: 350, gauteng: 340, western_cape: 380, kwazulu_natal: 365, eastern_cape: 355, limpopo: 410, mpumalanga: 380, north_west: 370, free_state: 360, northern_cape: 440, data_source: 'NHBRC Housing Standards Jul 2026' },
      { code: 'NHB-SRV-SEWER', description: 'Sewer connection (110mm PVC including vent) - each', unit: 'each', national: 650, gauteng: 630, western_cape: 700, kwazulu_natal: 680, eastern_cape: 660, limpopo: 750, mpumalanga: 700, north_west: 680, free_state: 660, northern_cape: 810, data_source: 'NHBRC Housing Standards Jul 2026' },
    ]
  }
};

export const NHBRC_REGULATORY = {
  enrollmentFee: { code: 'NHBRC-ENROL', description: 'NHBRC enrolment fee (per house)', unit: 'each', amount: 1350, data_source: 'NHBRC Fee Schedule Jul 2026' },
  inspectionFee: { code: 'NHBRC-INSPECT', description: 'NHBRC inspection fee (per inspection visit)', unit: 'visit', amount: 450, data_source: 'NHBRC Fee Schedule Jul 2026' },
  latePenalty: { code: 'NHBRC-LATE', description: 'Late enrolment penalty (per month)', unit: 'month', amount: 250, data_source: 'NHBRC Fee Schedule Jul 2026' },
};

export function searchNHBRC(query, region = 'national') {
  const q = query.toLowerCase();
  const results = [];
  for (const [, cat] of Object.entries(NHBRC_CATEGORIES)) {
    for (const item of cat.items) {
      if (item.description.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)) {
        results.push({ ...item, category: cat.name, price: item[region] || item.national });
      }
    }
  }
  return results;
}

export default NHBRC_CATEGORIES;
