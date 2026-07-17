// supabase/functions/search-knowledge/index.ts
// Uses direct Supabase REST API — no external client library needed

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const url = new URL(req.url)
    const query = url.searchParams.get('q') || ''
    const category = url.searchParams.get('category')
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '10', 10), 50)

    if (!query.trim()) {
      return new Response(
        JSON.stringify({ error: 'Query parameter q is required', results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Call the search_knowledge_fts RPC directly via REST
    const rpcParams: Record<string, unknown> = {
      search_query: query,
      match_count: limit,
    }
    if (category) rpcParams.filter_category = category

    const rpcRes = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/search_knowledge_fts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(rpcParams),
      }
    )

    if (!rpcRes.ok) {
      const errText = await rpcRes.text()
      throw new Error(`RPC call failed (${rpcRes.status}): ${errText}`)
    }

    const results = await rpcRes.json()

    return new Response(
      JSON.stringify({ results: results || [], method: 'fts' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message, results: [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})