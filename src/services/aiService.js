import OpenAI from 'openai';

const BASE_URL = 'https://integrate.api.nvidia.com/v1';

const client1B = new OpenAI({
  apiKey: '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',
  baseURL: BASE_URL,
});
const client70B = new OpenAI({
  apiKey: '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',
  baseURL: BASE_URL,
});
const clientDeepSeek = new OpenAI({
  apiKey: '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',
  baseURL: BASE_URL,
});
const clientNemotron = new OpenAI({
  apiKey: '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',
  baseURL: BASE_URL,
});

export async function chatWithModel(model, messages, options = {}) {
  const modelMap = {
    '1b': { client: client1B, model: 'meta/llama-3.2-1b-instruct', maxTokens: 1024, temp: 0.2 },
    '70b': { client: client70B, model: 'meta/llama-3.1-70b-instruct', maxTokens: 1024, temp: 0.2 },
    'deepseek': { client: clientDeepSeek, model: 'deepseek-ai/deepseek-v4-pro', maxTokens: 16384, temp: 1 },
    'nemotron': { client: clientNemotron, model: 'nvidia/nemotron-3-super-120b-a12b', maxTokens: 16384, temp: 1 },
  };
  const config = modelMap[model] || modelMap['70b'];
  try {
    const completion = await config.client.chat.completions.create({
      model: config.model, messages,
      temperature: options.temperature || config.temp,
      top_p: 0.7,
      max_tokens: options.maxTokens || config.maxTokens,
      ...(model === 'nemotron' ? { reasoning_budget: 16384, chat_template_kwargs: { enable_thinking: true }, stream: true } : {}),
      ...(model === 'deepseek' ? { chat_template_kwargs: { thinking: false } } : {}),
    });
    if (model === 'nemotron') {
      let fullContent = '';
      for await (const chunk of completion) {
        fullContent += (chunk.choices?.[0]?.delta?.reasoning_content || '') + (chunk.choices?.[0]?.delta?.content || '');
      }
      return fullContent;
    }
    return completion.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('AI model ' + model + ' error:', error);
    throw error;
  }
}

export async function analyzeDocument(text, analysisType = 'general') {
  const prompts = {
    general: 'Extract ALL structured information from this construction document. Return comprehensive JSON.',
    hs_file: 'You are a senior OHS practitioner (SACPCMP). Expert in OHS Act 85/1993, Construction Regs 2014, COIDA, SANS. Extract all H&S info for a complete safety file.',
    boq: 'You are a PrQS (ASAQS). Expert in construction pricing, SANS 4000, FIDIC, GCC, JBCC, NEC, COLTO. Extract ALL BOQ line items with descriptions, units, quantities, rates.',
    compliance: 'Extract all compliance requirements, legal appointments, permits, licenses, regulatory obligations.',
  };
  const model = text.length > 50000 ? 'nemotron' : text.length > 20000 ? 'deepseek' : '70b';
  return await chatWithModel(model, [
    { role: 'system', content: prompts[analysisType] || prompts.general },
    { role: 'user', content: 'Analyze this document:\n\n' + text.substring(0, 100000) }
  ], { temperature: 0.3, maxTokens: 8000 });
}

export async function generateHealthSafetyFile(projectData, documents) {
  const sp = 'You are a senior OHS practitioner (SACPCMP registered) with 25+ years in SA construction.\nKnowledge: OHS Act 85/1993, Construction Regs 2014, COIDA, SANS 10090/10400/50001, SACPCMP.\nGenerate a COMPLETE site-specific H&S File in HTML with ALL required sections including:\n1. COVER PAGE, 2. DOCUMENT CONTROL & INDEX, 3. COMPANY H&S POLICY, 4. LEGAL APPOINTMENTS, 5. SCOPE OF WORKS, 6. RISK ASSESSMENTS (Baseline, Issue-specific, Task-specific), 7. METHOD STATEMENTS, 8. SAFE WORK PROCEDURES, 9. SITE-SPECIFIC H&S PLAN, 10. EMERGENCY PREPAREDNESS, 11. TRAFFIC MANAGEMENT PLAN, 12. FALL PROTECTION PLAN, 13. ENVIRONMENTAL MANAGEMENT PLAN (NEMA), 14. REGISTERS (PPE, Plant, Inspections, Visitors, Induction, Toolbox Talks, Incidents, First Aid, Fire, Chemicals, Training, Waste), 15. CHECKLISTS (Daily, Weekly, Monthly, Scaffold, Excavation, Electrical, Fire, PPE, Plant), 16. TRAINING RECORDS, 17. TOOLBOX TALKS (12 talks), 18. INCIDENT MANAGEMENT, 19. H&S STATISTICS, 20. INSPECTION & AUDIT TEMPLATES, 21. MEDICAL, 22. CONSTRUCTION REGS 2014 CHECKLIST, 23. SANS 10400 COMPLIANCE, 24. APPENDICES. Format as professional HTML with anchors, styled tables, and signature blocks. Include site-specific content based on the project data provided.';
  const up = 'Generate complete H&S File for:\nProject: ' + (projectData.project_name || '[Project Name]') + '\nCompany: ' + (projectData.company_name || '[Company Name]') + '\nSite: ' + (projectData.site_address || '[Site Address]') + '\nScope: ' + (projectData.scope_of_works || '[Scope]') + '\nContractor: ' + (projectData.principal_contractor || '[Principal Contractor]') + '\nClient: ' + (projectData.client || '[Client]') + '\nDuration: ' + (projectData.project_duration || '[Duration]') + '\nWorkers: ' + (projectData.number_of_workers || '[Number]') + '\nSafety Officer: ' + (projectData.safety_officer || '[Safety Officer]') + '\n\nDocuments uploaded: ' + (documents || []).map(d => '- ' + d.name + ' (' + d.type + ')').join('\n');
  return await chatWithModel('nemotron', [{role:'system',content:sp},{role:'user',content:up}], {temperature:0.3,maxTokens:16000});
}

export async function priceBOQItem(item, projectLocation = 'national') {
  const sp = 'You are a PrQS (ASAQS) with 25+ years. Complete knowledge of materials, labour rates, contracts (FIDIC, COLTO, GCC, JBCC, NEC), cost formulas. Return ONLY valid JSON.';
  const up = 'Price BOQ line item for ' + projectLocation + ' (SA):\nItem: ' + (item.item_number || 'N/A') + '\nDescription: ' + item.description + '\nUnit: ' + (item.unit || 'each') + '\nQty: ' + (item.quantity || 1) + '\nCategory: ' + (item.category || 'General') + '\n\nReturn JSON: item_number, description, unit, quantity, detailed_rate_build_up (materials, labour, plant, transport), total_direct_cost, p_and_g_percentage, overheads_and_profit, contingency, total_rate, total_amount, notes_and_assumptions, data_source';
  const response = await chatWithModel('deepseek', [{role:'system',content:sp},{role:'user',content:up}], {temperature:0.2,maxTokens:8000});
  const jm = response.match(/\{[\s\S]*\}/);
  return jm ? JSON.parse(jm[0]) : {raw_response: response};
}

export async function agentChat(agentId, message, conversationHistory = []) {
  const agents = {
    'safety-officer': { name:'AI Safety Officer', sp:'You are SafetyStack\'s AI Safety Officer - SACPCMP registered Construction H&S Practitioner with 25+ years. Expert in OHS Act 85/1993, Construction Regs 2014, COIDA, SANS, legal appointments, risk assessments, method statements, fall protection, scaffolding, excavation, confined space, emergency planning, NEMA, incident investigation.' },
    'quantity-surveyor': { name:'AI Quantity Surveyor', sp:'You are SafetyStack\'s AI QS - PrQS (ASAQS) with 25+ years. Expert in SANS 4000, FIDIC, GCC, JBCC, NEC, COLTO, BOQ preparation, cost estimation, variations, final accounts, construction pricing, material rates, labour rates, plant rates.' },
    'contracts-administrator': { name:'AI Contracts Administrator', sp:'You are SafetyStack\'s AI Contracts Administrator. Expert in FIDIC (all forms), GCC, JBCC, NEC3/4, subcontract administration, claims, variations, extensions of time, payment certificates, dispute avoidance.' },
    'compliance-officer': { name:'AI Compliance Officer', sp:'You are SafetyStack\'s AI Compliance Officer. Expert in SA construction regulations: OHS Act, Construction Regs 2014, COIDA, NEMA, NHBRC, CIDB, SACPCMP, SANS 10400, local bylaws.' },
  };
  const agent = agents[agentId];
  if (!agent) return 'Agent not found. Available agents: ' + Object.keys(agents).join(', ');
  const history = (conversationHistory || []).map(m => ({ role: m.role, content: m.content }));
  const response = await chatWithModel('70b', [
    { role: 'system', content: agent.sp },
    ...history.slice(-10),
    { role: 'user', content: message }
  ], { temperature: 0.3, maxTokens: 4000 });
  return response;
}