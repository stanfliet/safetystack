// SafeStack - BCCEI Bargaining Council for Civil Engineering Industry Pricing (July 2026)
// Bargaining Council for the Civil Engineering Industry - Labour & Compliance Rates
// Rates in ZAR - Based on BCCEI Main Agreement

export const BCCEI_CATEGORIES = {
  labourA: {
    name: 'General Workers (Grade A)',
    items: [
      { code: 'BCC-LAB-A1', description: 'Grade A1 - General worker (entry-level) - hourly', unit: 'hr', national: 31.50, gauteng: 32.00, western_cape: 33.50, kwazulu_natal: 31.00, eastern_cape: 30.50, limpopo: 29.50, mpumalanga: 30.50, north_west: 31.00, free_state: 30.50, northern_cape: 32.50, data_source: 'BCCEI Main Agreement Jul 2026' },
      { code: 'BCC-LAB-A2', description: 'Grade A2 - General worker (with experience) - hourly', unit: 'hr', national: 34.50, gauteng: 35.00, western_cape: 36.50, kwazulu_natal: 34.00, eastern_cape: 33.50, limpopo: 32.50, mpumalanga: 33.50, north_west: 34.00, free_state: 33.50, northern_cape: 35.50, data_source: 'BCCEI Main Agreement Jul 2026' },
      { code: 'BCC-LAB-A3', description: 'Grade A3 - Traffic controller/flagman - hourly', unit: 'hr', national: 35.00, gauteng: 35.50, western_cape: 37.00, kwazulu_natal: 34.50, eastern_cape: 34.00, limpopo: 33.00, mpumalanga: 34.00, north_west: 34.50, free_state: 34.00, northern_cape: 36.00, data_source: 'BCCEI Main Agreement Jul 2026' },
    ]
  },
  labourB: {
    name: 'Semi-Skilled Operators (Grade B)',
    items: [
      { code: 'BCC-LAB-B1', description: 'Grade B1 - Concrete finisher - hourly', unit: 'hr', national: 42.00, gauteng: 42.50, western_cape: 44.50, kwazulu_natal: 41.50, eastern_cape: 41.00, limpopo: 39.50, mpumalanga: 40.50, north_west: 41.00, free_state: 40.50, northern_cape: 43.00, data_source: 'BCCEI Main Agreement Jul 2026' },
      { code: 'BCC-LAB-B2', description: 'Grade B2 - Pipe layer - hourly', unit: 'hr', national: 42.00, gauteng: 42.50, western_cape: 44.50, kwazulu_natal: 41.50, eastern_cape: 41.00, limpopo: 39.50, mpumalanga: 40.50, north_west: 41.00, free_state: 40.50, northern_cape: 43.00, data_source: 'BCCEI Main Agreement Jul 2026' },
      { code: 'BCC-LAB-B3', description: 'Grade B3 - Steel fixer/rebar worker - hourly', unit: 'hr', national: 44.00, gauteng: 44.50, western_cape: 46.50, kwazulu_natal: 43.50, eastern_cape: 43.00, limpopo: 41.50, mpumalanga: 42.50, north_west: 43.00, free_state: 42.50, northern_cape: 45.00, data_source: 'BCCEI Main Agreement Jul 2026' },
      { code: 'BCC-LAB-B4', description: 'Grade B4 - Formwork erector - hourly', unit: 'hr', national: 44.00, gauteng: 44.50, western_cape: 46.50, kwazulu_natal: 43.50, eastern_cape: 43.00, limpopo: 41.50, mpumalanga: 42.50, north_west: 43.00, free_state: 42.50, northern_cape: 45.00, data_source: 'BCCEI Main Agreement Jul 2026' },
      { code: 'BCC-LAB-B5', description: 'Grade B5 - Asphalt raker - hourly', unit: 'hr', national: 45.00, gauteng: 45.50, western_cape: 47.50, kwazulu_natal: 44.50, eastern_cape: 44.00, limpopo: 42.50, mpumalanga: 43.50, north_west: 44.00, free_state: 43.50, northern_cape: 46.00, data_source: 'BCCEI Main Agreement Jul 2026' },
    ]
  },
  labourC: {
    name: 'Skilled Artisans (Grade C)',
    items: [
      { code: 'BCC-LAB-C1', description: 'Grade C1 - Qualified bricklayer - hourly', unit: 'hr', national: 60.00, gauteng: 61.00, western_cape: 64.00, kwazulu_natal: 59.00, eastern_cape: 58.00, limpopo: 56.00, mpumalanga: 57.50, north_west: 58.50, free_state: 58.00, northern_cape: 62.00, data_source: 'BCCEI Main Agreement Jul 2026' },
      { code: 'BCC-LAB-C2', description: 'Grade C2 - Qualified carpenter - hourly', unit: 'hr', national: 60.00, gauteng: 61.00, western_cape: 64.00, kwazulu_natal: 59.00, eastern_cape: 58.00, limpopo: 56.00, mpumalanga: 57.50, north_west: 58.50, free_state: 58.00, northern_cape: 62.00, data_source: 'BCCEI Main Agreement Jul 2026' },
      { code: 'BCC-LAB-C3', description: 'Grade C3 - Qualified plumber - hourly', unit: 'hr', national: 63.00, gauteng: 64.00, western_cape: 67.00, kwazulu_natal: 62.00, eastern_cape: 61.00, limpopo: 59.00, mpumalanga: 60.50, north_west: 61.50, free_state: 61.00, northern_cape: 65.00, data_source: 'BCCEI Main Agreement Jul 2026' },
      { code: 'BCC-LAB-C4', description: 'Grade C4 - Qualified electrician - hourly', unit: 'hr', national: 66.00, gauteng: 67.00, western_cape: 70.00, kwazulu_natal: 65.00, eastern_cape: 64.00, limpopo: 62.00, mpumalanga: 63.50, north_west: 64.50, free_state: 64.00, northern_cape: 68.00, data_source: 'BCCEI Main Agreement Jul 2026' },
      { code: 'BCC-LAB-C5', description: 'Grade C5 - Qualified welder - hourly', unit: 'hr', national: 62.00, gauteng: 63.00, western_cape: 66.00, kwazulu_natal: 61.00, eastern_cape: 60.00, limpopo: 58.00, mpumalanga: 59.50, north_west: 60.50, free_state: 60.00, northern_cape: 64.00, data_source: 'BCCEI Main Agreement Jul 2026' },
    ]
  },
  plant: {
    name: 'Plant & Equipment',
    items: [
      { code: 'BCC-PLT-TLB', description: 'TLB 4x4 backhoe loader (incl. operator) - hourly', unit: 'hr', national: 520, gauteng: 510, western_cape: 550, kwazulu_natal: 530, eastern_cape: 520, limpopo: 560, mpumalanga: 540, north_west: 530, free_state: 520, northern_cape: 580, data_source: 'BCCEI Plant Schedule Jul 2026' },
      { code: 'BCC-PLT-EX8', description: 'Excavator 8 ton (incl. operator) - hourly', unit: 'hr', national: 580, gauteng: 570, western_cape: 610, kwazulu_natal: 590, eastern_cape: 580, limpopo: 620, mpumalanga: 600, north_west: 590, free_state: 580, northern_cape: 650, data_source: 'BCCEI Plant Schedule Jul 2026' },
      { code: 'BCC-PLT-EX20', description: 'Excavator 20 ton (incl. operator) - hourly', unit: 'hr', national: 850, gauteng: 830, western_cape: 900, kwazulu_natal: 870, eastern_cape: 850, limpopo: 920, mpumalanga: 890, north_west: 870, free_state: 850, northern_cape: 980, data_source: 'BCCEI Plant Schedule Jul 2026' },
      { code: 'BCC-PLT-COMP', description: 'Diesel roller/compactor 10 ton (incl. operator) - hourly', unit: 'hr', national: 620, gauteng: 600, western_cape: 660, kwazulu_natal: 630, eastern_cape: 620, limpopo: 680, mpumalanga: 650, north_west: 630, free_state: 620, northern_cape: 720, data_source: 'BCCEI Plant Schedule Jul 2026' },
      { code: 'BCC-PLT-DUMP', description: 'Tipper truck 15 ton - hourly', unit: 'hr', national: 480, gauteng: 470, western_cape: 510, kwazulu_natal: 490, eastern_cape: 480, limpopo: 520, mpumalanga: 500, north_west: 490, free_state: 480, northern_cape: 560, data_source: 'BCCEI Plant Schedule Jul 2026' },
    ]
  },
  compliance: {
    name: 'BCCEI Compliance & Levies',
    items: [
      { code: 'BCC-LEVY-BAS', description: 'BCCEI levy (per worker per month) - per worker', unit: 'each', national: 95, gauteng: 98, western_cape: 105, kwazulu_natal: 95, eastern_cape: 92, limpopo: 88, mpumalanga: 90, north_west: 92, free_state: 90, northern_cape: 100, data_source: 'BCCEI Levy Schedule Jul 2026' },
      { code: 'BCC-REG-EMP', description: 'BCCEI employer registration fee - each', unit: 'each', national: 1500, gauteng: 1500, western_cape: 1650, kwazulu_natal: 1450, eastern_cape: 1400, limpopo: 1350, mpumalanga: 1400, north_west: 1420, free_state: 1400, northern_cape: 1550, data_source: 'BCCEI Levy Schedule Jul 2026' },
      { code: 'BCC-PENALTY', description: 'BCCEI late return penalty (per month) - per month', unit: 'month', national: 400, gauteng: 400, western_cape: 420, kwazulu_natal: 400, eastern_cape: 380, limpopo: 360, mpumalanga: 370, north_west: 380, free_state: 370, northern_cape: 400, data_source: 'BCCEI Levy Schedule Jul 2026' },
    ]
  }
};

export function searchBCCEI(query, region = 'national') {
  const q = query.toLowerCase();
  const results = [];
  for (const [, cat] of Object.entries(BCCEI_CATEGORIES)) {
    for (const item of cat.items) {
      if (item.description.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)) {
        results.push({ ...item, category: cat.name, price: item[region] || item.national });
      }
    }
  }
  return results;
}

export default BCCEI_CATEGORIES;
