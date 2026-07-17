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

const SYSTEM_PROMPT = `You are a South African Health & Safety documentation expert.
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
          'Authorization': `Bearer ${openaiApiKey}`,
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

