// SafeStack - DOL Department of Employment and Labour Pricing Database (July 2026)
// South African Department of Employment and Labour - COIDA, UIF, & Compliance Rates
// Rates in ZAR

export const DOL_CATEGORIES = {
  coida: {
    name: 'COIDA (Compensation for Occupational Injuries & Diseases)',
    items: [
      { code: 'DOL-COIDA-ASSESS', description: 'COIDA assessment fee (Class 1 - Construction, per R100 payroll) - per R100', unit: 'rate', national: 0.75, gauteng: 0.75, western_cape: 0.75, kwazulu_natal: 0.75, eastern_cape: 0.75, limpopo: 0.75, mpumalanga: 0.75, north_west: 0.75, free_state: 0.75, northern_cape: 0.75, data_source: 'DOL COIDA Gazette Jul 2026' },
      { code: 'DOL-COIDA-ASSESS-LOW', description: 'COIDA assessment fee (Class 4 - Low risk, per R100 payroll) - per R100', unit: 'rate', national: 0.35, gauteng: 0.35, western_cape: 0.35, kwazulu_natal: 0.35, eastern_cape: 0.35, limpopo: 0.35, mpumalanga: 0.35, north_west: 0.35, free_state: 0.35, northern_cape: 0.35, data_source: 'DOL COIDA Gazette Jul 2026' },
      { code: 'DOL-COIDA-LETTER', description: 'Letter of Good Standing (COIDA clearance) - each', unit: 'each', national: 120, gauteng: 120, western_cape: 120, kwazulu_natal: 120, eastern_cape: 120, limpopo: 120, mpumalanga: 120, north_west: 120, free_state: 120, northern_cape: 120, data_source: 'DOL Fee Schedule Jul 2026' },
      { code: 'DOL-COIDA-REG', description: 'COIDA employer registration - each', unit: 'each', national: 450, gauteng: 450, western_cape: 450, kwazulu_natal: 450, eastern_cape: 450, limpopo: 450, mpumalanga: 450, north_west: 450, free_state: 450, northern_cape: 450, data_source: 'DOL Fee Schedule Jul 2026' },
      { code: 'DOL-COIDA-PENALTY', description: 'COIDA late registration penalty - each', unit: 'each', national: 1500, gauteng: 1500, western_cape: 1500, kwazulu_natal: 1500, eastern_cape: 1500, limpopo: 1500, mpumalanga: 1500, north_west: 1500, free_state: 1500, northern_cape: 1500, data_source: 'DOL COIDA Gazette Jul 2026' },
    ]
  },
  uif: {
    name: 'UIF (Unemployment Insurance Fund)',
    items: [
      { code: 'DOL-UIF-EMPLOYER', description: 'UIF employer contribution (1% of payroll) - rate', unit: 'rate', national: 0.01, gauteng: 0.01, western_cape: 0.01, kwazulu_natal: 0.01, eastern_cape: 0.01, limpopo: 0.01, mpumalanga: 0.01, north_west: 0.01, free_state: 0.01, northern_cape: 0.01, data_source: 'UIF Act / DOL Jul 2026' },
      { code: 'DOL-UIF-EMPLOYEE', description: 'UIF employee contribution (1% of payroll) - rate', unit: 'rate', national: 0.01, gauteng: 0.01, western_cape: 0.01, kwazulu_natal: 0.01, eastern_cape: 0.01, limpopo: 0.01, mpumalanga: 0.01, north_west: 0.01, free_state: 0.01, northern_cape: 0.01, data_source: 'UIF Act / DOL Jul 2026' },
      { code: 'DOL-UIF-FILING', description: 'UIF monthly filing (per employee) - each', unit: 'each', national: 0, gauteng: 0, western_cape: 0, kwazulu_natal: 0, eastern_cape: 0, limpopo: 0, mpumalanga: 0, north_west: 0, free_state: 0, northern_cape: 0, data_source: 'UIF Act / DOL Jul 2026 - No fee (free)' },
    ]
  },
  ohs: {
    name: 'OHS Act Compliance',
    items: [
      { code: 'DOL-OHS-INSPECT', description: 'DoL OHS inspection (per visit, post-incident) - each', unit: 'each', national: 0, gauteng: 0, western_cape: 0, kwazulu_natal: 0, eastern_cape: 0, limpopo: 0, mpumalanga: 0, north_west: 0, free_state: 0, northern_cape: 0, data_source: 'DOL OHS Act 85 of 1993 - No fee (statutory)' },
      { code: 'DOL-OHS-24', description: 'Section 24 incident report filing - each', unit: 'each', national: 0, gauteng: 0, western_cape: 0, kwazulu_natal: 0, eastern_cape: 0, limpopo: 0, mpumalanga: 0, north_west: 0, free_state: 0, northern_cape: 0, data_source: 'DOL OHS Act 85 of 1993 - No fee (statutory)' },
      { code: 'DOL-OHS-COMPLAINT', description: 'OHS complaint investigation (per complaint) - each', unit: 'each', national: 0, gauteng: 0, western_cape: 0, kwazulu_natal: 0, eastern_cape: 0, limpopo: 0, mpumalanga: 0, north_west: 0, free_state: 0, northern_cape: 0, data_source: 'DOL OHS Act 85 of 1993 - No fee (statutory)' },
      { code: 'DOL-OHS-PENALTY', description: 'OHS non-compliance penalty (first offence) - each', unit: 'each', national: 50000, gauteng: 50000, western_cape: 50000, kwazulu_natal: 50000, eastern_cape: 50000, limpopo: 50000, mpumalanga: 50000, north_west: 50000, free_state: 50000, northern_cape: 50000, data_source: 'DOL OHS Act 85 of 1993 - Maximum penalty Jul 2026' },
      { code: 'DOL-OHS-PENALTY-MAX', description: 'OHS non-compliance penalty (subsequent/fatality) - each', unit: 'each', national: 250000, gauteng: 250000, western_cape: 250000, kwazulu_natal: 250000, eastern_cape: 250000, limpopo: 250000, mpumalanga: 250000, north_west: 250000, free_state: 250000, northern_cape: 250000, data_source: 'DOL OHS Act 85 of 1993 - Maximum penalty Jul 2026' },
    ]
  },
  minimumWage: {
    name: 'National Minimum Wage',
    items: [
      { code: 'DOL-NMW-2026', description: 'National Minimum Wage (per hour) - hourly', unit: 'hr', national: 28.79, gauteng: 28.79, western_cape: 28.79, kwazulu_natal: 28.79, eastern_cape: 28.79, limpopo: 28.79, mpumalanga: 28.79, north_west: 28.79, free_state: 28.79, northern_cape: 28.79, data_source: 'DOL National Minimum Wage Act Jul 2026' },
      { code: 'DOL-NMW-FARM', description: 'Farm worker minimum wage (per hour) - hourly', unit: 'hr', national: 28.79, gauteng: 28.79, western_cape: 28.79, kwazulu_natal: 28.79, eastern_cape: 28.79, limpopo: 28.79, mpumalanga: 28.79, north_west: 28.79, free_state: 28.79, northern_cape: 28.79, data_source: 'DOL National Minimum Wage Act Jul 2026' },
      { code: 'DOL-NMW-DOMESTIC', description: 'Domestic worker minimum wage (per hour) - hourly', unit: 'hr', national: 25.50, gauteng: 25.50, western_cape: 25.50, kwazulu_natal: 25.50, eastern_cape: 25.50, limpopo: 25.50, mpumalanga: 25.50, north_west: 25.50, free_state: 25.50, northern_cape: 25.50, data_source: 'DOL National Minimum Wage Act Jul 2026' },
    ]
  },
  employment: {
    name: 'Employment Services & Registration',
    items: [
      { code: 'DOL-EMP-CONTRACT', description: 'Fixed-term employment contract registration - each', unit: 'each', national: 0, gauteng: 0, western_cape: 0, kwazulu_natal: 0, eastern_cape: 0, limpopo: 0, mpumalanga: 0, north_west: 0, free_state: 0, northern_cape: 0, data_source: 'DOL Employment Services Act 4 of 2014 - No fee' },
      { code: 'DOL-EMP-LABOUR', description: 'Labour broker / TES registration (annual) - each', unit: 'each', national: 3500, gauteng: 3500, western_cape: 3500, kwazulu_natal: 3500, eastern_cape: 3500, limpopo: 3500, mpumalanga: 3500, north_west: 3500, free_state: 3500, northern_cape: 3500, data_source: 'DOL Fee Schedule Jul 2026' },
      { code: 'DOL-EMP-FOREIGN', description: 'Foreign worker exemption certificate - each', unit: 'each', national: 1360, gauteng: 1360, western_cape: 1360, kwazulu_natal: 1360, eastern_cape: 1360, limpopo: 1360, mpumalanga: 1360, north_west: 1360, free_state: 1360, northern_cape: 1360, data_source: 'DOL Fee Schedule Jul 2026' },
    ]
  }
};

export function searchDOL(query, region = 'national') {
  const q = query.toLowerCase();
  const results = [];
  for (const [, cat] of Object.entries(DOL_CATEGORIES)) {
    for (const item of cat.items) {
      if (item.description.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)) {
        results.push({ ...item, category: cat.name, price: item[region] || item.national });
      }
    }
  }
  return results;
}

export default DOL_CATEGORIES;
