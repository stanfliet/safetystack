import OpenAI from 'openai';

const OPENAI_BASE_URL = 'https://integrate.api.nvidia.com/v1';

const getKey = (key) => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) return process.env[key];
  return '';
};

const clients = {
  '1b': new OpenAI({ apiKey: getKey('NVAPI_KEY_1B'), baseURL: OPENAI_BASE_URL }),
  '70b': new OpenAI({ apiKey: getKey('NVAPI_KEY_70B'), baseURL: OPENAI_BASE_URL }),
  'deepseek': new OpenAI({ apiKey: getKey('NVAPI_KEY_DEEPSEEK'), baseURL: OPENAI_BASE_URL }),
  'nemotron': new OpenAI({ apiKey: getKey('NVAPI_KEY_NEMOTRON'), baseURL: OPENAI_BASE_URL }),
};

const MODELS = {
  '1b': { client: '1b', model: 'meta/llama-3.2-1b-instruct', maxTokens: 1024, temp: 0.2 },
  '70b': { client: '70b', model: 'meta/llama-3.1-70b-instruct', maxTokens: 4096, temp: 0.3 },
  'deepseek': { client: 'deepseek', model: 'deepseek-ai/deepseek-v4-pro', maxTokens: 16384, temp: 0.2 },
  'nemotron': { client: 'nemotron', model: 'nvidia/nemotron-3-super-120b-a12b', maxTokens: 16384, temp: 0.3 },
};

function pickModel(task, textLen = 0) {
  if (task === 'hs_file') return 'nemotron';
  if (task === 'boq_price') return 'deepseek';
  if (task === 'doc_analysis') return textLen > 50000 ? 'nemotron' : textLen > 20000 ? 'deepseek' : '70b';
  if (task === 'agent_chat') return '70b';
  return '70b';
}

function extractJson(text) {
  const m = text.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch(e) {} }
  const am = text.match(/\[[\s\S]*\]/);
  if (am) { try { return JSON.parse(am[0]); } catch(e) {} }
  return null;
}

export async function chatWithModel(modelKey, messages, opts = {}) {
  const cfg = MODELS[modelKey] || MODELS['70b'];
  const c = clients[cfg.client];
  if (!c) throw new Error('AI client not available');
  try {
    const params = {
      model: cfg.model, messages,
      temperature: opts.temperature ?? cfg.temp,
      top_p: opts.top_p ?? 0.7,
      max_tokens: opts.maxTokens ?? cfg.maxTokens,
    };
    const comp = await c.chat.completions.create(params);
    return comp.choices?.[0]?.message?.content || '';
  } catch (e) {
    console.error('AI error:', e.message);
    if (modelKey !== '1b') {
      try { return await chatWithModel('1b', messages, opts); } catch(f) {}
    }
    throw e;
  }
}

// === 1. DOCUMENT ANALYSIS ===
export async function analyzeDocument(text, type = 'general', fileName = '') {
  const prompts = {
    general: 'You are a senior construction document analyst. Extract ALL structured info as JSON: scope_of_works, project_type, risks, compliance_requirements, contractor_details, key_activities.',
    hs_file: 'You are a SACPCMP registered H&S Practitioner. Expert in OHS Act 85/1993, Construction Regs 2014, COIDA, SANS. Extract ALL H&S info.',
    boq: 'You are a PrQS (ASAQS). Expert in SANS 4000, FIDIC, GCC, JBCC, NEC. Extract ALL BOQ line items: item_number, description, unit, quantity, rate as JSON array.',
    scope: 'Extract the complete scope of works, specifications, quantities, materials, and technical requirements as JSON.',
  };
  const model = pickModel('doc_analysis', text.length);
  const fn = fileName ? `\nFile: ${fileName}` : '';
  const resp = await chatWithModel(model, [
    { role: 'system', content: `${prompts[type] || prompts.general}\nReturn structured JSON.` },
    { role: 'user', content: `Analyze this document${fn}:\n\n${text.substring(0, 100000)}` }
  ], { temperature: 0.2, maxTokens: 8000 });
  const j = extractJson(resp);
  return j || { raw_analysis: resp.substring(0, 10000) };
}

// === 2. COMPLETE H&S FILE GENERATION ===
export async function generateHealthSafetyFile(projectData, documents = []) {
  const sp = `You are a SACPCMP registered Construction H&S Practitioner with 25+ years.
Expert: OHS Act 85/1993, Construction Regulations 2014, COIDA, SANS 10090/10400/50001, NEMA.
Generate a COMPLETE site-specific H&S File as professional HTML with ALL sections:
1. COVER PAGE with logo placeholder & document control
2. TABLE OF CONTENTS with anchors
3. DOCUMENT CONTROL & REVISION HISTORY
4. COMPANY H&S POLICY (signed)
5. LEGAL APPOINTMENTS: S16(1), S16(2), Agent, Principal Contractor, Construction Manager, Safety Officer, H&S Rep, First Aider, Fire Fighter, Emergency Coordinator
6. SCOPE OF WORKS (detailed)
7. BASELINE RISK ASSESSMENT (20+ hazards with 5x5 matrix)
8. TASK-SPECIFIC RISK ASSESSMENTS
9. METHOD STATEMENTS (critical tasks)
10. SAFE WORK PROCEDURES (height, excavation, electrical, confined space, hot work, lifting)
11. SITE-SPECIFIC H&S PLAN
12. EMERGENCY PREPAREDNESS & RESPONSE PLAN
13. EVACUATION PLAN with assembly points
14. FALL PROTECTION PLAN
15. TRAFFIC MANAGEMENT PLAN
16. ENVIRONMENTAL MANAGEMENT PLAN (NEMA)
17. REGISTERS: PPE, Plant, Inspection, Visitor, Induction, Toolbox Talk, Incident, First Aid, Fire, Chemical (SDS), Training, Waste
18. CHECKLISTS: Daily, Weekly, Monthly, Scaffold, Excavation, Electrical, Fire, PPE, Plant Pre-Use
19. TRAINING RECORDS
20. TOOLBOX TALKS (12 talks: height, lifting, fire, electrical, PPE, housekeeping, excavation, scaffold, chemicals, emergency, environmental, health)
21. INCIDENT MANAGEMENT PROCEDURE
22. H&S STATISTICS TRACKING
23. MEDICAL SURVEILLANCE
24. CONSTRUCTION REGS 2014 COMPLIANCE CHECKLIST
25. SANS 10400 COMPLIANCE CHECKLIST
26. APPENDICES
CRITICAL: Generate REAL content for every section. Professional HTML with blue/navy scheme, tables, signature blocks.`;
  const up = `Project: ${projectData.project_name||projectData.title||'[Project]'}
Company: ${projectData.company_name||'[Company]'}  Site: ${projectData.site_address||'[Site]'}
Scope: ${projectData.scope_of_works||'[Scope]'}  Contractor: ${projectData.principal_contractor||'[PC]'}
Client: ${projectData.client||'[Client]'}  Duration: ${projectData.project_duration||'[Duration]'}
Workers: ${projectData.number_of_workers||'[N]'}  Safety Officer: ${projectData.safety_officer||'[SO]'}
Documents: ${(documents||[]).map(d=>d.name||d.originalName||'Doc').join(', ')||'None'}
Generate COMPLETE H&S File NOW. Start directly with HTML.`;
  return await chatWithModel('nemotron', [{role:'system',content:sp},{role:'user',content:up}], {temperature:0.25,maxTokens:16384});
}

// === 3. BOQ EXTRACTION & PRICING ===
export async function extractBOQFromText(text, fileName = '') {
  const fn = fileName ? `\nSource: ${fileName}` : '';
  const resp = await chatWithModel('deepseek', [
    { role: 'system', content: 'You are a PrQS (ASAQS) QS with 25+ years. Expert in SANS 4000, CESMM, FIDIC, GCC, JBCC, NEC, COLTO. Extract ALL BOQ line items as JSON array: [{item_number, description, unit, quantity, rate_provided, category, notes}]. Return ONLY the JSON array.' },
    { role: 'user', content: `Extract ALL BOQ items from this document${fn}:\n\n${text.substring(0, 120000)}` }
  ], { temperature: 0.1, maxTokens: 16384 });
  const j = extractJson(resp);
  if (Array.isArray(j)) return j;
  if (j?.items) return j.items;
  throw new Error('Could not extract BOQ items');
}

export async function priceBOQItem(item, location = 'national') {
  const sp = `You are a PrQS (ASAQS) QS with 25+ years in SA construction pricing.
Expert: ALL materials (concrete, steel, timber, roofing, paint, tiles, paving, kerbs, electrical, plumbing, cabinetry, welding, foundations), labour rates (skilled R280-400/hr, semi-skilled R160-195/hr, labourer R120-140/hr), plant rates, transport costs.
Pricing formulas: Materials=QtyxRatex(1+waste%), Labour=Qtyxhrs/unitxhrlyRate, Plant=Qtyxhrs/unitxhireRate, Transport=distxrate/km/units/load, Total=Materials+Labour+Plant+Transport, P&Gs=TotalxPG%, O&P=(Total+P&Gs)xOP%, Contingency=(Total+P&Gs+O&P)xC%, Rate=Total+P&Gs+O&P+Contingency/unit, Amount=RatxQty
Return ONLY valid JSON.`;
  const up = `Price for ${location} SA:\nItem: ${item.item_number||'N/A'}\nDesc: ${item.description}\nUnit: ${item.unit||'each'}\nQty: ${item.quantity||1}\nCat: ${item.category||'General'}`;
  const resp = await chatWithModel('deepseek', [{role:'system',content:sp},{role:'user',content:up}], {temperature:0.15,maxTokens:8000});
  const j = extractJson(resp);
  return j || { item_number: item.item_number, description: item.description, total_amount: 0, error: 'Parse failed' };
}

export async function priceFullBOQ(items, location = 'national') {
  const priced = [];
  for (const item of items) priced.push(await priceBOQItem(item, location));
  const total = priced.reduce((s,i) => s + (i.total_amount||0), 0);
  return { items: priced, grand_total: total };
}

// === 4. AI EXPERT AGENTS ===
export const AGENTS = {
  'safety-officer': {
    name:'AI Safety Officer', title:'OHS & Compliance Expert', icon:'S', gradient:'from-blue-600 to-blue-800',
    sp:'You are SafetyStack\'s AI Safety Officer - SACPCMP registered H&S Practitioner with 25+ years. Expert: OHS Act 85/1993, Construction Regulations 2014, COIDA, SANS 10090/10400/50001, NEMA, legal appointments, risk assessments, fall protection, emergency planning, incident investigation (ICAM, 5-Why), scaffolding, excavation, confined space, hazardous chemicals, medical surveillance, H&S file compilation. Give specific regulation numbers. Be practical and field-tested.',
    suggestions:['What legal appointments needed for a construction site?','Generate a Fall Protection Plan','What are Construction Regulation requirements for excavations?','How to conduct an ICAM incident investigation?']
  },
  'quantity-surveyor': {
    name:'AI Quantity Surveyor', title:'Cost Estimation & BOQ Expert', icon:'Q', gradient:'from-emerald-600 to-emerald-800',
    sp:'You are SafetyStack\'s AI QS - PrQS (ASAQS) with 25+ years. Expert: SANS 4000, CESMM, FIDIC, GCC 2018, JBCC 2018, NEC3/4, COLTO, BOQ preparation/pricing, rate build-ups, material pricing (all trades), labour rates (all skills/provinces), plant hire, P&Gs, O&Ps, contingency, cost planning, cash flow forecasting. Provide detailed cost breakdowns with formulas and current SA market rates.',
    suggestions:['Build up a rate for 30MPa concrete per m3','Price brickwork per m2 (half-brick wall)','What are typical P&G percentages?','Price a complete BOQ for a project']
  },
  'tender-manager': {
    name:'AI Tender Manager', title:'Procurement & Tender Expert', icon:'T', gradient:'from-purple-600 to-purple-800',
    sp:'You are SafetyStack\'s AI Tender Manager - SA procurement expert, 20+ years. Expert: CIDB grading (1-9, all categories), B-BBEE construction sector codes, PPPFA, MFMA, tender preparation/evaluation, EOI/RFP, joint ventures, tender strategy.',
    suggestions:['What CIDB grade for a R50M building project?','Calculate B-BBEE level','Tender submission checklist','Common tender disqualification reasons']
  },
  'contract-administrator': {
    name:'AI Contracts Administrator', title:'Contracts & Claims Expert', icon:'C', gradient:'from-amber-600 to-amber-800',
    sp:'You are SafetyStack\'s AI Contracts Admin - 25+ years. Expert: FIDIC (all forms), GCC 2018, JBCC 2018, NEC3/4, COLTO. EOT claims, variation orders, payment certificates, claims management, dispute resolution, adjudication, arbitration. Reference specific clauses.',
    suggestions:['Prepare a FIDIC EOT claim','Differences between GCC, JBCC, FIDIC?','How to value a variation under JBCC?','Write a payment certificate application']
  },
  'environmental-officer': {
    name:'AI Environmental Officer', title:'NEMA & Environmental Expert', icon:'E', gradient:'from-green-600 to-green-800',
    sp:'You are SafetyStack\'s AI Environmental Officer - 20+ years SA env law. Expert: NEMA, EIA Regulations, EMP/EMPr, Water Use Licences (NWA), Waste Act, Air Quality Act, ISO 14001, rehabilitation, dust/noise control.',
    suggestions:['What environmental authorizations for a road project?','Site-specific EMP checklist','Dust control on construction site','Water use licence requirements']
  },
  'quality-manager': {
    name:'AI Quality Manager', title:'ISO 9001 & QA Expert', icon:'Qm', gradient:'from-cyan-600 to-cyan-800',
    sp:'You are SafetyStack\'s AI Quality Manager - 20+ years. Expert: ISO 9001:2015, ITPs, NCRs, concrete quality (cubes, slump), compaction testing, asphalt QC, steel inspection, welding inspection, QA/QC documentation, quality audits.',
    suggestions:['Create an ITP for concrete works','Compaction acceptance criteria?','Concrete quality control procedure','How to manage NCRs effectively?']
  },
  'project-manager': {
    name:'AI Project Manager', title:'Programme & Project Controls', icon:'P', gradient:'from-rose-600 to-rose-800',
    sp:'You are SafetyStack\'s AI PM - SACPCMP registered, 25+ years. Expert: CPM/PERT scheduling, WBS, resource scheduling, progress reporting (S-curves, earned value), delay analysis, cost control, risk management, procurement, stakeholder management, project close-out.',
    suggestions:['Create a programme for a 6-month building project','Project risk register contents?','How to calculate earned value (CPI/SPI)?','Key deliverables at project close-out']
  }
};

export async function agentChat(agentId, message, history = []) {
  const agent = AGENTS[agentId];
  if (!agent) return 'Agent not found. Available: ' + Object.keys(AGENTS).join(', ');
  const h = (history||[]).slice(-10).map(m => ({role:m.role,content:m.content}));
  return await chatWithModel('70b', [{role:'system',content:agent.sp},...h,{role:'user',content:message}], {temperature:0.3,maxTokens:4000});
}

// === 5. SINGLE DOCUMENT GENERATION ===
export const DOC_TEMPLATES = {
  hs_policy: 'Company H&S Policy with CEO commitment, scope, responsibilities, OHS Act Section 7 compliant.',
  appointment_letter: 'Legal Appointment letter for S16(1)/S16(2) with scope, responsibilities, acceptance.',
  baseline_risk_assessment: 'Baseline Risk Assessment - 20+ hazards with 5x5 matrix ratings.',
  task_risk_assessment: 'Task-specific RA with step-by-step breakdown, controls, residual risk.',
  method_statement: 'Method Statement with plant, materials, step-by-step methodology, risks, approvals.',
  safe_work_procedure: 'Safe Work Procedure with pre-work checks, safe sequence, emergency procedures.',
  emergency_plan: 'Emergency Plan with contacts, evacuation, fire, medical, chemical spill response.',
  fall_protection_plan: 'Fall Protection Plan - hierarchy of controls, edge protection, PFAS, rescue plan.',
  traffic_management_plan: 'Traffic Management Plan - routing, segregation, signage, delivery management.',
  induction_checklist: 'Site Induction Checklist with all required induction topics.',
  toolbox_talk: 'Toolbox Talk on a safety topic with discussion points and attendance register.',
  ppe_register: 'PPE Register with employee details, PPE items, issue dates, condition.',
  plant_register: 'Plant Register with type, inspections, certificates, operator details.',
};

export async function generateSingleDocument(docType, context = {}) {
  const tmpl = DOC_TEMPLATES[docType];
  if (!tmpl) throw new Error('Unknown doc type: ' + docType);
  const ctx = Object.entries(context).filter(([k,v])=>v).map(([k,v])=>`${k.replace(/_/g,' ')}: ${v}`).join('\n');
  return await chatWithModel('nemotron', [
    { role: 'system', content: 'You are a SACPCMP registered senior OHS practitioner. Generate professional HTML documents compliant with SA legislation.' },
    { role: 'user', content: 'Generate: ' + tmpl + '\n\nContext:\n' + (ctx||'General construction project') + '\n\nReturn complete HTML.' }
  ], { temperature: 0.3, maxTokens: 8000 });
}
