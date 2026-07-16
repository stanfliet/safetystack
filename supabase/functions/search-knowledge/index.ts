import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

serve(async (req) => {
  try {
    const { query, category, match_count = 20 } = await req.json()
    
    if (!query) {
      return new Response(JSON.stringify({ error: 'Query is required' }), { status: 400 })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Generate embedding using a simple hash-based approach for demo
    // In production, use OpenAI/NVIDIA embeddings API
    const { createEmbedding } = await import('https://esm.sh/@xenova/transformers@2.6.0')
    // For now, use full-text search as primary with vector as fallback
    let query_builder = supabase
      .from('construction_knowledge')
      .select('*')
      .textSearch('content', query, { config: 'english' })

    if (category) {
      query_builder = query_builder.eq('category', category)
    }

    const { data, error } = await query_builder.limit(match_count)

    if (error) throw error

    return new Response(
      JSON.stringify({ results: data || [] }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    )
  }
})
