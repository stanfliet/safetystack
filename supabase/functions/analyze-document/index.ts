import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  
  try {
    const { text_content, file_type, analysis_type, file_name } = await req.json()
    
    const systemPrompts: Record<string, string> = {
      'general': 'You are an expert document analyst. Extract key information, summarize, and identify important data points from any document.',
      'contract': 'You are a construction law expert specializing in FIDIC, GCC, COLTO, JBCC, NEC, and SANS contracts. Analyze contracts for risks, obligations, and key clauses.',
      'specification': 'You are a construction specifications expert. Analyze technical specifications and extract key requirements, standards referenced, and compliance requirements.',
      'report': 'You are a construction report analyst. Extract findings, recommendations, and actionable items from reports.',
      'drawing': 'You are a construction drawing and plan reviewer. Extract dimensions, materials specified, and key design elements from drawing descriptions.',
      'legal': 'You are a legal document analyst specializing in construction law. Identify legal implications, obligations, and potential risks.',
    }
    
    const prompt = Analyze the following document of type .

Provide a comprehensive analysis including:
1. Document summary (2-3 sentences)
2. Key information extracted (bullet points)
3. Important dates, numbers, values mentioned
4. Action items or required follow-ups
5. Risks or concerns identified
6. Recommendations

Document content:


    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': Bearer ,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompts[analysis_type || 'general'] || systemPrompts.general },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    })
    
    const data = await response.json()
    
    return new Response(JSON.stringify({
      success: true,
      data: {
        analysis: data.choices?.[0]?.message?.content || '',
        model: 'gpt-4o',
        analyzed_at: new Date().toISOString(),
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}
