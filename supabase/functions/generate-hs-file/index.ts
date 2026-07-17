import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface HsFileRequest {
  hs_file_id: string
  project_name: string
  project_number?: string
  project_address?: string
  client_name?: string
  contractor_name?: string
  site_manager?: string
  sections: string[] // which sections to generate
}

const SYSTEM_PROMPT = You are a South African Health & Safety documentation expert.
You have extensive knowledge of:
- OHSA (Occupational Health and Safety Act 85 of 1993)
- Construction Regulations 2014
- SANS 10085, SANS 10400, SANS 50001
- All legal appointments required by law
- Risk assessment methodologies
- H&S plan requirements
- Emergency preparedness and evacuation procedures
- COIDA requirements
- Environmental management plans

Generate professional, legally compliant H&S documentation in South African English.

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  
  try {
    const { hs_file_id, project_name, project_number, project_address, client_name, contractor_name, site_manager, sections }: HsFileRequest = await req.json()
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Generate content for each requested section
    const sectionContents: Record<string, any> = {}
    
    for (const section of sections) {
      const prompt = getSectionPrompt(section, { project_name, project_number, project_address, client_name, contractor_name, site_manager })
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': Bearer ,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 4000,
        }),
      })
      
      const data = await response.json()
      sectionContents[section] = {
        content: data.choices?.[0]?.message?.content || '',
        generated_at: new Date().toISOString(),
      }
      
      // Store section in database
      await supabase.from('hs_sections').upsert({
        hs_file_id,
        section_number: getSectionNumber(section),
        title: getSectionTitle(section),
        content: sectionContents[section],
        status: 'complete',
      }, { onConflict: 'hs_file_id,section_number' })
    }
    
    // Update HS file status
    await supabase.from('hs_files').update({ status: 'complete', updated_at: new Date().toISOString() }).eq('id', hs_file_id)
    
    return new Response(JSON.stringify({ success: true, data: sectionContents }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

function getSectionNumber(section: string): number {
  const map: Record<string, number> = {
    'index': 0, 'legal-appointments': 1, 'policies': 2, 'risk-assessments': 3,
    'method-statements': 4, 'registers': 5, 'checklists': 6, 'hs-plan': 7,
    'evacuation': 8, 'emergency': 9, 'toolbox-talks': 10, 'appendix': 11
  }
  return map[section] || 99
}

function getSectionTitle(section: string): string {
  const map: Record<string, string> = {
    'index': 'Document Index', 'legal-appointments': 'Legal Appointments',
    'policies': 'H&S Policies', 'risk-assessments': 'Risk Assessments',
    'method-statements': 'Method Statements', 'registers': 'Registers & Logs',
    'checklists': 'Inspection Checklists', 'hs-plan': 'H&S Management Plan',
    'evacuation': 'Evacuation Plan', 'emergency': 'Emergency Preparedness & Readiness',
    'toolbox-talks': 'Toolbox Talks', 'appendix': 'Appendix & References'
  }
  return map[section] || section
}

function getSectionPrompt(section: string, info: any): string {
  const base = Project: 
Project Number: 
Address: 
Client: 
Contractor: 
Site Manager: 


  const prompts: Record<string, string> = {
    'index': ${base}\nGenerate a complete document index/table of contents for a Health and Safety File with all required sections, page numbers, and document references.,
    'legal-appointments': ${base}\nGenerate ALL required legal appointments under OHSA and Construction Regulations 2014 including: 
1. CEO/MD Appointment (Section 16(1) & 16(2))
2. Construction Manager Appointment
3. Site Supervisor Appointment
4. Health & Safety Officer Appointment
5. Fall Protection Plan Supervisor
6. Scaffolding Supervisor
7. Electrical Contractor Appointment
8. Fire Prevention Officer
9. First Aider Appointment
10. Environmental Officer
Each with formal letter format, full legislative references, and acceptance sections.,
    'policies': ${base}\nGenerate comprehensive H&S policies including: Health & Safety Policy (signed by CEO), Alcohol & Substance Abuse Policy, Smoking Policy, PPE Policy, HIV/AIDS Policy, Harassment Policy, Environmental Policy, Quality Policy. Each with company letterhead format.,
    'risk-assessments': ${base}\nGenerate detailed risk assessments for construction activities including: 
- Working at height
- Excavation and trenching
- Lifting operations
- Electrical work
- Hot work
- Demolition
- Confined spaces
- Plant and machinery operations
- Manual handling
Each with hazard identification, risk rating (before/after controls), control measures, and responsible persons.,
    'hs-plan': ${base}\nGenerate a comprehensive H&S Management Plan including: 
1. Project description and scope
2. H&S policy and objectives
3. Organisational structure and responsibilities
4. Risk management approach
5. Training and competency requirements
6. Incident management procedure
7. Emergency procedures
8. Monitoring and measurement
9. Audit and review
10. Documentation and records,
    'evacuation': ${base}\nGenerate a complete emergency evacuation plan including: 
- Assembly points
- Evacuation routes and diagrams
- Fire prevention measures
- Emergency contact numbers
- Fire drill schedule
- Roles and responsibilities during evacuation
- Persons with special needs procedure,
    'emergency': ${base}\nGenerate emergency preparedness and readiness procedures including:
- Medical emergency response
- Fire emergency response
- Chemical spill response
- Structural collapse response
- Severe weather response
- First aid requirements and station locations
- Emergency equipment inventory
- Communication protocol during emergencies,
    'toolbox-talks': ${base}\nGenerate 20 toolbox talk topics with full content for each including: 
1. Working at Height Safety
2. Electrical Safety
3. Fire Safety
4. Manual Handling
5. PPE Usage
6. Excavation Safety
7. Scaffolding Safety
8. Ladder Safety
9. Housekeeping
10. Chemical Safety
11. Noise and Hearing Protection
12. Hand and Power Tool Safety
13. Lifting Operations
14. Welding Safety
15. Confined Space Awareness
16. Fall Protection
17. Emergency Procedures
18. Environmental Awareness
19. Fatigue Management
20. Substance Abuse
Each with: topic title, key points, discussion questions, and acknowledgement section.,
    'method-statements': ${base}\nGenerate detailed method statements for: excavations, concrete works, steel erection, scaffolding erection/use/dismantling, roofing works, electrical installations, plumbing works, painting works, demolition, and crane lifting operations. Each with sequence of work, hazards identified, controls, and PPE requirements.,
    'registers': ${base}\nGenerate register templates for: 
- Plant and equipment register
- PPE issue register
- Training register
- Incident/accident register
- First aid treatment register
- Fire equipment inspection register
- Scaffold inspection register
- Ladder register
- Visitor register
- Toolbox talk attendance register
- Hazard identification register
- Medical surveillance register,
    'checklists': ${base}\nGenerate comprehensive inspection checklists for:
- Daily site inspection
- Weekly H&S inspection
- Scaffolding inspection
- Electrical equipment inspection (portable tool testing)
- Fire extinguisher inspection
- First aid kit inspection
- PPE inspection
- Ladder inspection
- Excavation inspection
- Crane and lifting equipment inspection,
    'appendix': ${base}\nGenerate appendix section with: relevant legislation references (OHSA, Construction Regs, COIDA, BCEA), SANS standards references, definitions and abbreviations, industry body contacts (CIDB, SACPCMP, NHBRC), and reference documents list.
  }
  
  return prompts[section] || ${base}\nGenerate content for .
}
