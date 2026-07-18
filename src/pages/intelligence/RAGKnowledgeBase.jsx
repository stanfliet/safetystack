import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const CATEGORIES = [
  { id: 'safety', name: 'Safety', icon: 'SHIELD' },
  { id: 'regulations', name: 'Regulations', icon: 'SCALE' },
  { id: 'contracts', name: 'Contracts', icon: 'DOC' },
  { id: 'pricing', name: 'Pricing', icon: 'MONEY' },
  { id: 'engineering', name: 'Engineering', icon: 'BUILD' },
  { id: 'materials', name: 'Materials', icon: 'BRICK' },
];

const icons = { SHIELD: '🛡️', SCALE: '⚖️', DOC: '📋', MONEY: '💰', BUILD: '🏗️', BRICK: '🧱' };

export default function RAGKnowledgeBase() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: 'safety', subcategory: '', title: '', content: '', source: '' });

  useEffect(() => { fetchDocuments(); }, [category]);

  async function fetchDocuments() {
    setLoading(true);
    let query = supabase.from('knowledge_documents').select('*').order('created_at', { ascending: false });
    if (category) query = query.eq('category', category);
    const { data } = await query;
    if (data) setDocuments(data); setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await supabase.from('knowledge_documents').insert(form);
    setShowForm(false); fetchDocuments();
    setForm({ category: 'safety', subcategory: '', title: '', content: '', source: '' });
  }

  const filtered = documents.filter(d => !search || d.title?.toLowerCase().includes(search.toLowerCase()) || d.content?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-gray-800">RAG Knowledge Base</h2><p className="text-sm text-gray-500 mt-1">{documents.length} documents</p></div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">{showForm ? 'Cancel' : '+ Add Document'}</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
              <input type="text" value={form.subcategory} onChange={(e) => setForm({...form, subcategory: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea rows={5} required value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <input type="text" value={form.source} onChange={(e) => setForm({...form, source: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
          </div>
          <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium">Save Document</button>
        </form>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <input type="text" placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setCategory('')} className={'px-3 py-1.5 rounded-full text-xs font-medium ' + (!category ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-300' : 'bg-gray-100 text-gray-600')}>All</button>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCategory(c.id)}
              className={'px-3 py-1.5 rounded-full text-xs font-medium ' + (category===c.id ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-300' : 'bg-gray-100 text-gray-600')}>{icons[c.icon]} {c.name}</button>
          ))}
        </div>
      </div>
      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(d => (
            <div key={d.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-purple-200 transition-colors">
              <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">{d.category}</span>{d.is_active===false && <span className="text-xs text-gray-400">(inactive)</span>}</div>
              <h3 className="font-medium text-gray-800 text-sm mb-1">{d.title}</h3>
              <p className="text-xs text-gray-500" style={{overflow:'hidden',display:'-webkit-box','-webkit-line-clamp':3,'-webkit-box-orient':'vertical'}}>{d.content}</p>
              <div className="flex items-center justify-between mt-3 text-xs text-gray-400"><span>{d.source||'No source'}</span><span>{new Date(d.created_at).toLocaleDateString()}</span></div>
            </div>
          ))}
          {filtered.length === 0 && <div className="col-span-full text-center py-12 text-gray-400">No documents found</div>}
        </div>
      )}
    </div>
  );
}
