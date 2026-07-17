import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BOQ_SYSTEM_PROMPT = You are a Senior Quantity Surveyor and Construction Cost Estimator with 25+ years of experience in South Africa.
You have expert knowledge of:
- All construction trades and their material/labour/plant costs
- Labour rates: skilled (R250-R450/hr), semi-skilled (R150-R250/hr), general workers (R80-R150/hr)
- Material costs across all trades
- Plant and equipment hire rates
- Transport and logistics costs
- P&G's (Preliminaries and General) - typically 10-15% of project value
- All contract types: FIDIC, GCC, COLTO, JBCC, NEC, SANS
- Cost formulas: TOTAL = Materials + Labour + Transport + Equipment + P&G's (applied to subtotal)

For each BOQ line item, calculate:
1. Materials - quantity × unit material cost
2. Labour - hours × applicable labour rate (skilled/semi-skilled/general)
3. Transport - percentage or fixed based on material type
4. Equipment/Plant - hours × plant hire rate
5. Subtotal - Materials + Labour + Transport + Equipment
6. P&G's - percentage of subtotal (typically 10-15%)
7. Total Line Item Cost - Subtotal + P&G's
8. Total Project Cost - sum of all line items + P&G's

Use current South African market rates (2025-2026). Provide output in ZAR (South African Rand).

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  
  try {
    const { text_content, file_type, project_name } = await req.json()
    
    const prompt = Analyze and price the following Bill of Quantities. 
Project: 
File type: 

Extract ALL line items with their descriptions and quantities. For each item:
1. Assign the correct unit of measure
2. Calculate material costs using current SA market rates
3. Calculate labour costs using appropriate rates
4. Add transport (5-15% of material cost depending on item)
5. Add equipment/plant costs where applicable
6. Apply P&G's (12.5% standard)
7. Provide a detailed cost breakdown

Return as structured JSON with this exact format:
{
  "project_name": "...",
  "total": number,
  "line_items": [
    {
      "item_number": 1,
      "description": "...",
      "quantity": number,
      "unit": "...",
      "rate": number,
      "amount": number,
      "cost_breakdown": {
        "materials": number,
        "labour": number,
        "transport": number,
        "equipment": number,
        "pg_percent": number,
        "pg_amount": number,
        "subtotal": number,
        "total": number
      }
    }
  ],
  "summary": {
    "total_materials": number,
    "total_labour": number,
    "total_transport": number,
    "total_equipment": number,
    "total_pg": number,
    "grand_total": number,
    "item_count": number
  }
}

BOQ Content:


    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': Bearer ,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: BOQ_SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 8000,
        response_format: { type: 'json_object' },
      }),
    })
    
    const data = await response.json()
    const pricedBoq = JSON.parse(data.choices?.[0]?.message?.content || '{}')
    
    return new Response(JSON.stringify({ success: true, data: pricedBoq }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}
