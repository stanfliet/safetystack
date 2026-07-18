// SafeStack - BIBC Building Industry Bargaining Council Pricing Database (July 2026)
// Building Industry Bargaining Council - Labour & Compliance Rates
// Rates in ZAR - Based on BIBC Main Agreement

export const BIBC_CATEGORIES = {
  labourA: {
    name: 'Labour Grade A (Unskilled)',
    items: [
      { code: 'BIBC-LAB-A1', description: 'Grade A1 - General labourer (entry level) - hourly', unit: 'hr', national: 30.50, gauteng: 31.00, western_cape: 32.00, kwazulu_natal: 30.00, eastern_cape: 29.50, limpopo: 28.50, mpumalanga: 29.50, north_west: 30.00, free_state: 29.50, northern_cape: 31.00, data_source: 'BIBC Main Agreement Jul 2026' },
      { code: 'BIBC-LAB-A2', description: 'Grade A2 - General labourer (experienced) - hourly', unit: 'hr', national: 33.50, gauteng: 34.00, western_cape: 35.00, kwazulu_natal: 33.00, eastern_cape: 32.50, limpopo: 31.50, mpumalanga: 32.50, north_west: 33.00, free_state: 32.50, northern_cape: 34.00, data_source: 'BIBC Main Agreement Jul 2026' },
      { code: 'BIBC-LAB-A3', description: 'Grade A3 - Trades assistant - hourly', unit: 'hr', national: 36.50, gauteng: 37.00, western_cape: 38.00, kwazulu_natal: 36.00, eastern_cape: 35.50, limpopo: 34.50, mpumalanga: 35.50, north_west: 36.00, free_state: 35.50, northern_cape: 37.00, data_source: 'BIBC Main Agreement Jul 2026' },
    ]
  },
  labourB: {
    name: 'Labour Grade B (Semi-Skilled)',
    items: [
      { code: 'BIBC-LAB-B1', description: 'Grade B1 - Semi-skilled bricklayer - hourly', unit: 'hr', national: 42.00, gauteng: 42.50, western_cape: 44.00, kwazulu_natal: 41.50, eastern_cape: 41.00, limpopo: 39.50, mpumalanga: 40.50, north_west: 41.00, free_state: 40.50, northern_cape: 42.50, data_source: 'BIBC Main Agreement Jul 2026' },
      { code: 'BIBC-LAB-B2', description: 'Grade B2 - Semi-skilled carpenter - hourly', unit: 'hr', national: 42.00, gauteng: 42.50, western_cape: 44.00, kwazulu_natal: 41.50, eastern_cape: 41.00, limpopo: 39.50, mpumalanga: 40.50, north_west: 41.00, free_state: 40.50, northern_cape: 42.50, data_source: 'BIBC Main Agreement Jul 2026' },
      { code: 'BIBC-LAB-B3', description: 'Grade B3 - Semi-skilled plasterer - hourly', unit: 'hr', national: 42.00, gauteng: 42.50, western_cape: 44.00, kwazulu_natal: 41.50, eastern_cape: 41.00, limpopo: 39.50, mpumalanga: 40.50, north_west: 41.00, free_state: 40.50, northern_cape: 42.50, data_source: 'BIBC Main Agreement Jul 2026' },
      { code: 'BIBC-LAB-B4', description: 'Grade B4 - Semi-skilled painter - hourly', unit: 'hr', national: 40.00, gauteng: 40.50, western_cape: 42.00, kwazulu_natal: 39.50, eastern_cape: 39.00, limpopo: 37.50, mpumalanga: 38.50, north_west: 39.00, free_state: 38.50, northern_cape: 40.50, data_source: 'BIBC Main Agreement Jul 2026' },
      { code: 'BIBC-LAB-B5', description: 'Grade B5 - Steel fixer - hourly', unit: 'hr', national: 44.00, gauteng: 44.50, western_cape: 46.00, kwazulu_natal: 43.50, eastern_cape: 43.00, limpopo: 41.50, mpumalanga: 42.50, north_west: 43.00, free_state: 42.50, northern_cape: 44.50, data_source: 'BIBC Main Agreement Jul 2026' },
    ]
  },
  labourC: {
    name: 'Labour Grade C (Skilled Artisans)',
    items: [
      { code: 'BIBC-LAB-C1', description: 'Grade C1 - Qualified bricklayer - hourly', unit: 'hr', national: 62.00, gauteng: 63.00, western_cape: 65.00, kwazulu_natal: 61.50, eastern_cape: 60.50, limpopo: 58.00, mpumalanga: 60.00, north_west: 61.00, free_state: 60.00, northern_cape: 63.50, data_source: 'BIBC Main Agreement Jul 2026' },
      { code: 'BIBC-LAB-C2', description: 'Grade C2 - Qualified carpenter/joiner - hourly', unit: 'hr', national: 62.00, gauteng: 63.00, western_cape: 65.00, kwazulu_natal: 61.50, eastern_cape: 60.50, limpopo: 58.00, mpumalanga: 60.00, north_west: 61.00, free_state: 60.00, northern_cape: 63.50, data_source: 'BIBC Main Agreement Jul 2026' },
      { code: 'BIBC-LAB-C3', description: 'Grade C3 - Qualified plasterer - hourly', unit: 'hr', national: 62.00, gauteng: 63.00, western_cape: 65.00, kwazulu_natal: 61.50, eastern_cape: 60.50, limpopo: 58.00, mpumalanga: 60.00, north_west: 61.00, free_state: 60.00, northern_cape: 63.50, data_source: 'BIBC Main Agreement Jul 2026' },
      { code: 'BIBC-LAB-C4', description: 'Grade C4 - Qualified plumber - hourly', unit: 'hr', national: 65.00, gauteng: 66.00, western_cape: 68.00, kwazulu_natal: 64.50, eastern_cape: 63.50, limpopo: 61.00, mpumalanga: 63.00, north_west: 64.00, free_state: 63.00, northern_cape: 66.50, data_source: 'BIBC Main Agreement Jul 2026' },
      { code: 'BIBC-LAB-C5', description: 'Grade C5 - Qualified electrician - hourly', unit: 'hr', national: 68.00, gauteng: 69.00, western_cape: 72.00, kwazulu_natal: 67.50, eastern_cape: 66.50, limpopo: 64.00, mpumalanga: 66.00, north_west: 67.00, free_state: 66.00, northern_cape: 69.50, data_source: 'BIBC Main Agreement Jul 2026' },
    ]
  },
  compliance: {
    name: 'BIBC Compliance & Levies',
    items: [
      { code: 'BIBC-LEVY-BASIC', description: 'BIBC levy (basic, per worker per month) - per worker', unit: 'each', national: 85, gauteng: 88, western_cape: 92, kwazulu_natal: 85, eastern_cape: 82, limpopo: 78, mpumalanga: 82, north_west: 85, free_state: 82, northern_cape: 88, data_source: 'BIBC Levy Schedule Jul 2026' },
      { code: 'BIBC-LEVY-ART', description: 'BIBC levy (artisan, per worker per month) - per worker', unit: 'each', national: 120, gauteng: 125, western_cape: 130, kwazulu_natal: 120, eastern_cape: 118, limpopo: 112, mpumalanga: 115, north_west: 118, free_state: 115, northern_cape: 125, data_source: 'BIBC Levy Schedule Jul 2026' },
      { code: 'BIBC-PENALTY', description: 'BIBC late return penalty (per month) - per month', unit: 'month', national: 350, gauteng: 350, western_cape: 380, kwazulu_natal: 350, eastern_cape: 340, limpopo: 320, mpumalanga: 330, north_west: 340, free_state: 330, northern_cape: 350, data_source: 'BIBC Levy Schedule Jul 2026' },
      { code: 'BIBC-REG', description: 'BIBC employer registration fee - each', unit: 'each', national: 1250, gauteng: 1250, western_cape: 1350, kwazulu_natal: 1200, eastern_cape: 1180, limpopo: 1120, mpumalanga: 1150, north_west: 1180, free_state: 1150, northern_cape: 1250, data_source: 'BIBC Levy Schedule Jul 2026' },
    ]
  }
};

export function searchBIBC(query, region = 'national') {
  const q = query.toLowerCase();
  const results = [];
  for (const [, cat] of Object.entries(BIBC_CATEGORIES)) {
    for (const item of cat.items) {
      if (item.description.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)) {
        results.push({ ...item, category: cat.name, price: item[region] || item.national });
      }
    }
  }
  return results;
}

export default BIBC_CATEGORIES;
