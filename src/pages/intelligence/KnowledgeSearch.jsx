import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'law', label: 'Law & Regulations' },
  { value: 'safety', label: 'Health & Safety' },
  { value: 'surveying', label: 'Quantity Surveying' },
  { value: 'contracts', label: 'Contracts (FIDIC/GCC/NEC/JBCC)' },
  { value: 'engineering', label: 'Engineering & COLTO' },
  { value: 'architecture', label: 'Architecture & SANS' },
  { value: 'materials', label: 'Materials Pricing' },
  { value: 'labour', label: 'Labour Rates' },
  { value: 'plant', label: 'Plant & Equipment' },
  { value: 'regulations', label: 'Regulations' },
];

export default function KnowledgeSearch() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) { toast.error('Enter a search query'); return; }
    setLoading(true);
    setSearched(true);

    try {
      // Try vector search first via edge function
      const { data: functionResult, error: fnError } = await supabase.functions.invoke('search-knowledge', {
        body: { query: query.trim(), category: category || null, match_count: 20 }
      });

      if (fnError) throw fnError;

      if (functionResult?.results?.length > 0) {
        setResults(functionResult.results);
      } else {
        // Fallback to full-text search
        let ftQuery = supabase
          .from('construction_knowledge')
          .select('*')
          .textSearch('content', query.trim(), { config: 'english' });

        if (category) ftQuery = ftQuery.eq('category', category);
        ftQuery = ftQuery.limit(20);

        const { data: ftResults, error: ftError } = await ftQuery;
        if (ftError) throw ftError;
        setResults(ftResults || []);
      }
    } catch (error) {
      // Final fallback: basic LIKE search
      try {
        let fbQuery = supabase
          .from('construction_knowledge')
          .select('*')
          .ilike('content', '%' + query.trim() + '%');
        if (category) fbQuery = fbQuery.eq('category', category);
        fbQuery = fbQuery.limit(20);

        const { data: fbResults } = await fbQuery;
        setResults(fbResults || []);
      } catch (e2) {
        toast.error('Search failed: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Construction Knowledge Base</h2>
          <p className="text-gray-500 mt-1">
            AI-powered semantic search across laws, safety, contracts, pricing, and materials
          </p>
        </div>
      </div>

      <div className="card mb-6">
        <div className="card-body">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  className="input"
                  placeholder="Search construction knowledge... e.g., 'FIDIC extension of time', 'concrete pricing Grade 30', 'scaffold safety requirements'"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
              </div>
              <select
                className="input max-w-xs"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {searched && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </p>

          {results.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-12">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-500">Try a different query or category</p>
              </div>
            </div>
          ) : (
            results.map((item, i) => (
              <div key={item.id || i} className="card hover:shadow-md transition-shadow">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-2 flex-wrap">
                      <span className="badge-info">{item.category}</span>
                      {item.subcategory && (
                        <span className="badge-neutral">{item.subcategory}</span>
                      )}
                    </div>
                    {item.similarity && (
                      <span className="text-xs text-gray-400">
                        {(item.similarity * 100).toFixed(0)}% match
                      </span>
                    )}
                  </div>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{item.content}</p>
                  {item.source && (
                    <p className="text-xs text-gray-400 mt-3">Source: {item.source}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!searched && (
        <div className="card">
          <div className="card-body text-center py-16">
            <svg className="w-16 h-16 mx-auto text-safety-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Search Construction Knowledge</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Query our comprehensive knowledge base covering South African construction law,
              safety regulations, contract forms (FIDIC, GCC, NEC, JBCC), material pricing,
              labour rates, and engineering standards.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
