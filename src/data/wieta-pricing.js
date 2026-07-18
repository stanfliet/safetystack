// SafeStack - WIETA Agricultural & Wine Industry Pricing Database (July 2026)
// Wine and Agricultural Industry Transformation Alliance - Labour & Compliance Rates
// Rates in ZAR

export const WIETA_CATEGORIES = {
  labour: {
    name: 'Agricultural Labour Rates',
    items: [
      { code: 'WIE-LAB-GEN', description: 'General farm worker (unskilled) - hourly', unit: 'hr', national: 28.50, gauteng: 28.50, western_cape: 30.00, kwazulu_natal: 27.50, eastern_cape: 27.50, limpopo: 26.00, mpumalanga: 27.00, north_west: 27.50, free_state: 27.00, northern_cape: 28.00, data_source: 'WIETA Wage Schedule Jul 2026' },
      { code: 'WIE-LAB-SKL', description: 'Skilled farm worker (tractor operator) - hourly', unit: 'hr', national: 42.00, gauteng: 42.00, western_cape: 45.00, kwazulu_natal: 40.00, eastern_cape: 40.00, limpopo: 38.00, mpumalanga: 39.00, north_west: 40.00, free_state: 39.00, northern_cape: 41.00, data_source: 'WIETA Wage Schedule Jul 2026' },
      { code: 'WIE-LAB-HARVEST', description: 'Harvest worker (seasonal) - hourly', unit: 'hr', national: 30.50, gauteng: 30.50, western_cape: 32.00, kwazulu_natal: 29.50, eastern_cape: 29.50, limpopo: 28.00, mpumalanga: 29.00, north_west: 29.50, free_state: 29.00, northern_cape: 30.00, data_source: 'WIETA Wage Schedule Jul 2026' },
      { code: 'WIE-LAB-SUPER', description: 'Farm supervisor / foreman - hourly', unit: 'hr', national: 55.00, gauteng: 55.00, western_cape: 58.00, kwazulu_natal: 52.00, eastern_cape: 52.00, limpopo: 50.00, mpumalanga: 51.00, north_west: 52.00, free_state: 51.00, northern_cape: 54.00, data_source: 'WIETA Wage Schedule Jul 2026' },
      { code: 'WIE-LAB-PACK', description: 'Packhouse worker (grading/packing) - hourly', unit: 'hr', national: 32.00, gauteng: 32.00, western_cape: 34.00, kwazulu_natal: 31.00, eastern_cape: 31.00, limpopo: 29.00, mpumalanga: 30.00, north_west: 31.00, free_state: 30.00, northern_cape: 32.00, data_source: 'WIETA Wage Schedule Jul 2026' },
    ]
  },
  compliance: {
    name: 'WIETA Compliance & Certification',
    items: [
      { code: 'WIE-COMP-AUDIT', description: 'WIETA compliance audit (initial) - per farm', unit: 'each', national: 8500, gauteng: 8500, western_cape: 9000, kwazulu_natal: 8200, eastern_cape: 8000, limpopo: 7800, mpumalanga: 8000, north_west: 8100, free_state: 8000, northern_cape: 8500, data_source: 'WIETA Fee Schedule Jul 2026' },
      { code: 'WIE-COMP-RENEW', description: 'WIETA certification renewal (annual) - per farm', unit: 'each', national: 4500, gauteng: 4500, western_cape: 4800, kwazulu_natal: 4300, eastern_cape: 4200, limpopo: 4000, mpumalanga: 4100, north_west: 4300, free_state: 4200, northern_cape: 4500, data_source: 'WIETA Fee Schedule Jul 2026' },
      { code: 'WIE-COMP-TRAIN', description: 'WIETA accredited training (per worker) - per person', unit: 'each', national: 350, gauteng: 350, western_cape: 380, kwazulu_natal: 340, eastern_cape: 330, limpopo: 320, mpumalanga: 330, north_west: 340, free_state: 330, northern_cape: 350, data_source: 'WIETA Fee Schedule Jul 2026' },
      { code: 'WIE-COMP-MEMBER', description: 'WIETA membership fee (annual, small farm) - per year', unit: 'year', national: 2500, gauteng: 2500, western_cape: 2700, kwazulu_natal: 2400, eastern_cape: 2300, limpopo: 2200, mpumalanga: 2300, north_west: 2400, free_state: 2300, northern_cape: 2500, data_source: 'WIETA Fee Schedule Jul 2026' },
      { code: 'WIE-COMP-MEMBER-L', description: 'WIETA membership fee (annual, large farm) - per year', unit: 'year', national: 6500, gauteng: 6500, western_cape: 7000, kwazulu_natal: 6300, eastern_cape: 6200, limpopo: 6000, mpumalanga: 6100, north_west: 6300, free_state: 6200, northern_cape: 6500, data_source: 'WIETA Fee Schedule Jul 2026' },
    ]
  },
  housing: {
    name: 'Farm Worker Housing',
    items: [
      { code: 'WIE-HSE-BASIC', description: 'Basic farm worker house (30m²) - per unit', unit: 'each', national: 85000, gauteng: 85000, western_cape: 95000, kwazulu_natal: 82000, eastern_cape: 80000, limpopo: 75000, mpumalanga: 78000, north_west: 80000, free_state: 78000, northern_cape: 85000, data_source: 'WIETA Housing Standards Jul 2026' },
      { code: 'WIE-HSE-ABLUT', description: 'Ablution block (shared) - per block', unit: 'each', national: 45000, gauteng: 45000, western_cape: 50000, kwazulu_natal: 42000, eastern_cape: 40000, limpopo: 38000, mpumalanga: 40000, north_west: 42000, free_state: 40000, northern_cape: 45000, data_source: 'WIETA Housing Standards Jul 2026' },
      { code: 'WIE-HSE-SEPTIC', description: 'Septic tank system - per system', unit: 'each', national: 15000, gauteng: 15000, western_cape: 16500, kwazulu_natal: 14500, eastern_cape: 14000, limpopo: 13000, mpumalanga: 13500, north_west: 14000, free_state: 13500, northern_cape: 15000, data_source: 'WIETA Housing Standards Jul 2026' },
    ]
  }
};

export function searchWIETA(query, region = 'national') {
  const q = query.toLowerCase();
  const results = [];
  for (const [, cat] of Object.entries(WIETA_CATEGORIES)) {
    for (const item of cat.items) {
      if (item.description.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)) {
        results.push({ ...item, category: cat.name, price: item[region] || item.national });
      }
    }
  }
  return results;
}

export default WIETA_CATEGORIES;
