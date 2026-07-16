import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: '', label: 'All Infrastructure Disciplines' },
  { value: 'law', label: 'Construction Law & Contracts' },
  { value: 'safety', label: 'Health and Safety (OSHA/HSE)' },
  { value: 'surveying', label: 'Quantity Surveying & Costs' },
  { value: 'architecture', label: 'Architecture & Structural Engineering' },
  { value: 'materials', label: 'Materials & Pricing' },
  { value: 'labour', label: 'Labour Rates & Productivity' },
  { value: 'plant', label: 'Plant & Equipment' },
  { value: 'engineering', label: 'Engineering & COLTO' },
  { value: 'regulations', label: 'Regulations & Compliance' },
];

export default function KnowledgeSearch() {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const triggerSearch = async () => {
    if (!question.trim()) {
      toast.error('Please enter a search question');
      return;
    }
    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch('/api/knowledge/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim(), category: category || undefined })
      });
      const data = await response.json();
      if (data.success) {
        setResults(data.contextDocs || data.results || []);
      } else {
        // Fallback to Supabase direct query
        await fallbackSearch();
      }
    } catch (err) {
      console.error("Knowledge retrieval failure", err);
      await fallbackSearch();
    }
    setLoading(false);
  };

  const fallbackSearch = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('search-knowledge', {
        body: { query: question.trim(), category: category || null, match_count: 20 }
      });
      if (!error && data?.results?.length > 0) {
        setResults(data.results);
        return;
      }
      // Final fallback: LIKE search
      let q = supabase.from('construction_knowledge').select('*');
      if (category) q = q.eq('category', category);
      const { data: fb } = await q.ilike('content', `%${question.trim()}%`).limit(20);
      setResults(fb || []);
    } catch (e) {
      setResults([]);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Supabase Knowledge Search</h2>
        <p className="text-gray-500 mt-1">AI-powered semantic search across construction regulations, pricing, safety, and contracts</p>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded-lg bg-white text-gray-700"
        >
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && triggerSearch()}
            placeholder="Ask a technical or cost-estimation question..."
            className="p-2 border rounded-lg w-full"
          />
          <button
            onClick={triggerSearch}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium whitespace-nowrap"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {searched && (
        <div className="mt-6 space-y-4">
          {results.length === 0 && !loading && (
            <p className="text-gray-500 text-center py-8">No results found. Try a different search term or category.</p>
          )}
          {results.map((doc) => (
            <div key={doc.id} className="p-4 bg-gray-50 border-l-4 border-blue-500 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                  {doc.category}
                </span>
                {doc.subcategory && (
                  <span className="text-xs text-gray-500">| {doc.subcategory}</span>
                )}
                {doc.similarity && (
                  <span className="text-xs text-gray-400 ml-auto">
                    Match: {(doc.similarity * 100).toFixed(1)}%
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{doc.content}</p>
              {doc.source && (
                <p className="text-xs text-gray-400 mt-2">Source: {doc.source}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}