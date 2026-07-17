const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const SUPABASE_SECRET_KEY = Deno.env.get('SUPABASE_SERCRET_KEY')!

// ...

const rpcRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/search_knowledge_fts`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
  },
  body: JSON.stringify(rpcParams),
})

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