// SafetyStack SA Construction Labour Rates Database
// Comprehensive wage rates for South African construction trades (July 2026)
// Based on main agreement rates (BCEA/NEDLAC) and industry surveys

export const LABOUR_CATEGORIES = {
  unskilled: {
    name: 'Unskilled / General',
    notes: 'Minimum wage per sectoral determination',
    items: [
      { code: 'LAB-GENERAL', title: 'General labourer', grade: 'A', minHourly: 28.79, maxHourly: 35.00, typicalDaily: 280, typicalMonthly: 5600, otRate: 1.5, region_remote_factor: 1.15, data_source: 'Sectoral Determination 12 / BCEA Jul 2026' },
      { code: 'LAB-CLEANER', title: 'Site cleaner', grade: 'A', minHourly: 28.79, maxHourly: 32.00, typicalDaily: 250, typicalMonthly: 5000, otRate: 1.5, region_remote_factor: 1.15, data_source: 'Sectoral Determination 12 Jul 2026' },
      { code: 'LAB-FLAG', title: 'Flagman / traffic control', grade: 'A', minHourly: 30.00, maxHourly: 38.00, typicalDaily: 300, typicalMonthly: 6000, otRate: 1.5, region_remote_factor: 1.15, data_source: 'Sectoral Determination 12 Jul 2026' },
    ]
  },
  semiSkilled: {
    name: 'Semi-Skilled',
    notes: 'Trained but not formally qualified',
    items: [
      { code: 'BRICK-LAYER-BASIC', title: 'Bricklayer (basic)', grade: 'B', minHourly: 38.00, maxHourly: 52.00, typicalDaily: 400, typicalMonthly: 8500, otRate: 1.5, region_remote_factor: 1.2, data_source: 'MEIBC / main agreement Jul 2026' },
      { code: 'CARPENTER-BASIC', title: 'Carpenter (basic)', grade: 'B', minHourly: 38.00, maxHourly: 52.00, typicalDaily: 400, typicalMonthly: 8500, otRate: 1.5, region_remote_factor: 1.2, data_source: 'MEIBC / main agreement Jul 2026' },
      { code: 'STEEL-FIXER', title: 'Steel fixer / rebar worker', grade: 'B', minHourly: 38.00, maxHourly: 55.00, typicalDaily: 420, typicalMonthly: 8800, otRate: 1.5, region_remote_factor: 1.2, data_source: 'MEIBC / main agreement Jul 2026' },
      { code: 'CONCRETE-FIN', title: 'Concrete finisher', grade: 'B', minHourly: 38.00, maxHourly: 55.00, typicalDaily: 420, typicalMonthly: 8800, otRate: 1.5, region_remote_factor: 1.2, data_source: 'MEIBC / main agreement Jul 2026' },
      { code: 'PLASTERER-BASIC', title: 'Plasterer (basic)', grade: 'B', minHourly: 38.00, maxHourly: 52.00, typicalDaily: 400, typicalMonthly: 8500, otRate: 1.5, region_remote_factor: 1.2, data_source: 'MEIBC / main agreement Jul 2026' },
      { code: 'PAINTER-BASIC', title: 'Painter (basic)', grade: 'B', minHourly: 35.00, maxHourly: 48.00, typicalDaily: 380, typicalMonthly: 8000, otRate: 1.5, region_remote_factor: 1.2, data_source: 'MEIBC / main agreement Jul 2026' },
      { code: 'TILER-BASIC', title: 'Tiler (basic)', grade: 'B', minHourly: 38.00, maxHourly: 52.00, typicalDaily: 400, typicalMonthly: 8500, otRate: 1.5, region_remote_factor: 1.2, data_source: 'MEIBC / main agreement Jul 2026' },
      { code: 'PIPELAYER', title: 'Pipe layer / drain layer', grade: 'B', minHourly: 38.00, maxHourly: 55.00, typicalDaily: 420, typicalMonthly: 8800, otRate: 1.5, region_remote_factor: 1.2, data_source: 'MEIBC / main agreement Jul 2026' },
      { code: 'ROADWORKER', title: 'Road worker (general)', grade: 'B', minHourly: 35.00, maxHourly: 48.00, typicalDaily: 380, typicalMonthly: 8000, otRate: 1.5, region_remote_factor: 1.2, data_source: 'Sectoral Determination / COLTO Jul 2026' },
      { code: 'ASPHALT-RAKER', title: 'Asphalt raker / screedman', grade: 'B', minHourly: 42.00, maxHourly: 58.00, typicalDaily: 450, typicalMonthly: 9500, otRate: 1.5, region_remote_factor: 1.2, data_source: 'COLTO / main agreement Jul 2026' },
    ]
  },
  skilled: {
    name: 'Skilled (Qualified Trades)',
    notes: 'Formally trade-tested artisans',
    items: [
      { code: 'BRICKLAYER', title: 'Bricklayer (qualified)', grade: 'C', minHourly: 52.00, maxHourly: 72.00, typicalDaily: 580, typicalMonthly: 12500, otRate: 1.5, region_remote_factor: 1.25, data_source: 'MEIBC main agreement Jul 2026' },
      { code: 'CARPENTER', title: 'Carpenter / joiner (qualified)', grade: 'C', minHourly: 52.00, maxHourly: 72.00, typicalDaily: 580, typicalMonthly: 12500, otRate: 1.5, region_remote_factor: 1.25, data_source: 'MEIBC main agreement Jul 2026' },
      { code: 'PLASTERER', title: 'Plasterer (qualified)', grade: 'C', minHourly: 52.00, maxHourly: 72.00, typicalDaily: 580, typicalMonthly: 12500, otRate: 1.5, region_remote_factor: 1.25, data_source: 'MEIBC main agreement Jul 2026' },
      { code: 'PLUMBER', title: 'Plumber (qualified)', grade: 'C', minHourly: 58.00, maxHourly: 85.00, typicalDaily: 650, typicalMonthly: 14000, otRate: 1.5, region_remote_factor: 1.25, data_source: 'MEIBC / PLUMSAG Jul 2026' },
      { code: 'ELECTRICIAN', title: 'Electrician (qualified, wiremans)', grade: 'C', minHourly: 62.00, maxHourly: 95.00, typicalDaily: 700, typicalMonthly: 15500, otRate: 1.5, region_remote_factor: 1.25, data_source: 'MEIBC / ECA Jul 2026' },
      { code: 'WELDER', title: 'Welder (qualified)', grade: 'C', minHourly: 55.00, maxHourly: 80.00, typicalDaily: 620, typicalMonthly: 13500, otRate: 1.5, region_remote_factor: 1.25, data_source: 'MEIBC / SAQA Jul 2026' },
      { code: 'PAINTER', title: 'Painter (qualified)', grade: 'C', minHourly: 48.00, maxHourly: 65.00, typicalDaily: 520, typicalMonthly: 11500, otRate: 1.5, region_remote_factor: 1.25, data_source: 'MEIBC / main agreement Jul 2026' },
      { code: 'TILER', title: 'Tiler (qualified)', grade: 'C', minHourly: 50.00, maxHourly: 68.00, typicalDaily: 550, typicalMonthly: 12000, otRate: 1.5, region_remote_factor: 1.25, data_source: 'MEIBC / main agreement Jul 2026' },
      { code: 'MACHINIST', title: 'Machinist / fitter (qualified)', grade: 'C', minHourly: 55.00, maxHourly: 78.00, typicalDaily: 600, typicalMonthly: 13000, otRate: 1.5, region_remote_factor: 1.25, data_source: 'MEIBC / main agreement Jul 2026' },
      { code: 'ROOFER', title: 'Roofer (qualified)', grade: 'C', minHourly: 52.00, maxHourly: 75.00, typicalDaily: 580, typicalMonthly: 12500, otRate: 1.5, region_remote_factor: 1.25, data_source: 'MEIBC / main agreement Jul 2026' },
      { code: 'SHUTTER-HAND', title: 'Shutter hand (formwork)', grade: 'C', minHourly: 55.00, maxHourly: 78.00, typicalDaily: 600, typicalMonthly: 13000, otRate: 1.5, region_remote_factor: 1.25, data_source: 'MEIBC / main agreement Jul 2026' },
    ]
  },
  supervisory: {
    name: 'Supervisory & Management',
    notes: 'Including site management, safety officers',
    items: [
      { code: 'FOREMAN', title: 'General foreman', grade: 'D', minHourly: 65.00, maxHourly: 95.00, typicalDaily: 750, typicalMonthly: 18000, otRate: 1.5, region_remote_factor: 1.2, data_source: 'MEIBC / industry survey Jul 2026' },
      { code: 'SITE-AGENT', title: 'Site agent / contracts manager', grade: 'D', minHourly: 85.00, maxHourly: 140.00, typicalMonthly: 35000, otRate: 1.5, region_remote_factor: 1.15, data_source: 'MEIBC / SACPCMP Jul 2026' },
      { code: 'SAFETY-OFF', title: 'Safety officer (SACPCMP)', grade: 'D', minHourly: 75.00, maxHourly: 120.00, typicalMonthly: 28000, otRate: 1.5, region_remote_factor: 1.15, data_source: 'SACPCMP / industry survey Jul 2026' },
      { code: 'QS-SITE', title: 'Site quantity surveyor', grade: 'D', minHourly: 90.00, maxHourly: 150.00, typicalMonthly: 38000, otRate: 1.5, region_remote_factor: 1.15, data_source: 'ASAQS / industry survey Jul 2026' },
      { code: 'ENGINEER', title: 'Site engineer (Pr Eng)', grade: 'D', minHourly: 110.00, maxHourly: 180.00, typicalMonthly: 48000, otRate: 1.5, region_remote_factor: 1.15, data_source: 'ECSA / industry survey Jul 2026' },
      { code: 'PROJ-MGR', title: 'Project manager (SACPCMP)', grade: 'D', minHourly: 130.00, maxHourly: 220.00, typicalMonthly: 55000, otRate: 1.5, region_remote_factor: 1.1, data_source: 'SACPCMP / industry survey Jul 2026' },
    ]
  },
  equipmentOperators: {
    name: 'Plant Operators',
    notes: 'Including licenced machinery operators',
    items: [
      { code: 'OP-TLB', title: 'TLB operator', grade: 'C', minHourly: 42.00, maxHourly: 62.00, typicalDaily: 480, typicalMonthly: 10500, otRate: 1.5, region_remote_factor: 1.2, data_source: 'MEIBC / main agreement Jul 2026' },
      { code: 'OP-EXCAV', title: 'Excavator operator', grade: 'C', minHourly: 45.00, maxHourly: 68.00, typicalDaily: 520, typicalMonthly: 11500, otRate: 1.5, region_remote_factor: 1.2, data_source: 'MEIBC / main agreement Jul 2026' },
      { code: 'OP-GRADER', title: 'Grader operator', grade: 'C', minHourly: 48.00, maxHourly: 72.00, typicalDaily: 550, typicalMonthly: 12000, otRate: 1.5, region_remote_factor: 1.2, data_source: 'MEIBC / main agreement Jul 2026' },
      { code: 'OP-BULL', title: 'Bulldozer operator', grade: 'C', minHourly: 48.00, maxHourly: 72.00, typicalDaily: 550, typicalMonthly: 12000, otRate: 1.5, region_remote_factor: 1.2, data_source: 'MEIBC / main agreement Jul 2026' },
      { code: 'OP-LOADER', title: 'Wheel loader operator', grade: 'C', minHourly: 42.00, maxHourly: 62.00, typicalDaily: 480, typicalMonthly: 10500, otRate: 1.5, region_remote_factor: 1.2, data_source: 'MEIBC / main agreement Jul 2026' },
      { code: 'OP-CRANE', title: 'Crane operator (licenced)', grade: 'C', minHourly: 55.00, maxHourly: 85.00, typicalDaily: 620, typicalMonthly: 13500, otRate: 1.5, region_remote_factor: 1.2, data_source: 'MEIBC / main agreement Jul 2026' },
      { code: 'OP-ROLLER', title: 'Roller / compactor operator', grade: 'C', minHourly: 42.00, maxHourly: 60.00, typicalDaily: 460, typicalMonthly: 10000, otRate: 1.5, region_remote_factor: 1.2, data_source: 'MEIBC / main agreement Jul 2026' },
      { code: 'OP-TIPPER', title: 'Tipper truck driver (licence)', grade: 'B', minHourly: 35.00, maxHourly: 52.00, typicalDaily: 400, typicalMonthly: 8800, otRate: 1.5, region_remote_factor: 1.2, data_source: 'MEIBC / main agreement Jul 2026' },
      { code: 'OP-PAVER', title: 'Asphalt paver operator', grade: 'C', minHourly: 48.00, maxHourly: 72.00, typicalDaily: 550, typicalMonthly: 12000, otRate: 1.5, region_remote_factor: 1.2, data_source: 'COLTO / main agreement Jul 2026' },
    ]
  }
};

// Helper to search labour rates
export function searchLabour(query, isRemote = false) {
  const q = query.toLowerCase();
  const results = [];
  for (const [catKey, cat] of Object.entries(LABOUR_CATEGORIES)) {
    for (const item of cat.items) {
      if (item.title.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)) {
        const factor = isRemote ? (item.region_remote_factor || 1.15) : 1;
        results.push({
          ...item,
          category: cat.name,
          categoryKey: catKey,
          hourlyRate: Math.round((item.minHourly + item.maxHourly) / 2 * factor),
          dailyRate: Math.round(item.typicalDaily * factor),
          monthlyRate: Math.round(item.typicalMonthly * factor)
        });
      }
    }
  }
  return results;
}

// Helper to build crew cost
export function buildCrewRate(crewMembers, isRemote = false) {
  let totalHourly = 0;
  let totalDaily = 0;
  const breakdown = [];
  for (const member of crewMembers) {
    const person = searchLabour(member.code, isRemote);
    if (person.length > 0) {
      const p = person[0];
      const daily = p.dailyRate;
      const hourly = p.hourlyRate;
      if (member.count) {
        totalDaily += daily * member.count;
        totalHourly += hourly * member.count;
        breakdown.push({ ...p, count: member.count, totalDaily: daily * member.count, totalHourly: hourly * member.count });
      }
    }
  }
  return { totalDaily, totalHourly, breakdown };
}

export default LABOUR_CATEGORIES;
