import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { question, category, match_count = 20 } = req.body;
    if (!question || !question.trim()) return res.status(400).json({ error: 'Question required' });

    const { data: fnResult, error: fnError } = await supabase.functions.invoke('search-knowledge', {
      body: { query: question.trim(), category: category || null, match_count }
    });

    if (!fnError && fnResult?.results?.length > 0) {
      return res.status(200).json({ success: true, results: fnResult.results, method: 'vector' });
    }

    const { data: ftResults, error: ftError } = await supabase.rpc('search_knowledge_fts', {
      search_query: question.trim(), filter_category: category || null, match_count
    });

    if (!ftError && ftResults?.length > 0) {
      return res.status(200).json({ success: true, results: ftResults, method: 'fts' });
    }

    let query = supabase.from('construction_knowledge').select('*');
    if (category) query = query.eq('category', category);
    const { data: fbResults } = await query.ilike('content', '%' + question.trim() + '%').limit(match_count);

    res.status(200).json({ success: true, results: fbResults || [], method: 'fallback' });
  } catch (error) {
    console.error('Knowledge search error:', error);
    res.status(500).json({ error: 'Search failed: ' + error.message });
  }
}