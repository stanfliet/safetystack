import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function TenderManagement() {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ tender_reference: '', tender_name: '', description: '', client_name: '', tender_value: '', closing_date: '', opening_date: '', project_id: '' });

  useEffect(() => { fetchTenders(); fetchProjects(); }, []);

  async function fetchTenders() {
    const { data } = await supabase.from('tender_records').select('*').order('created_at', { ascending: false });
    if (data) setTenders(data); setLoading(false);
  }
  async function fetchProjects() {
    const { data } = await supabase.from('projects').select('id, name').order('name');
    if (data) setProjects(data);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !form.project_id) return;
    await supabase.from('tender_records').insert({ ...form, tender_value: parseFloat(form.tender_value)||0, created_by: user.id, status: 'preparation' });
    setShowForm(false); fetchTenders();
    setForm({ tender_reference: '', tender_name: '', description: '', client_name: '', tender_value: '', closing_date: '', opening_date: '', project_id: '' });
  }

  const statusBadge = (s) => {
    const m = { awarded: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700', evaluation: 'bg-blue-100 text-blue-700', submitted: 'bg-amber-100 text-amber-700' };
    return <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + (m[s]||'bg-gray-100 text-gray-700')}>{s}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-gray-800">Tender Management</h2><p className="text-sm text-gray-500 mt-1">{tenders.length} tenders</p></div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">{showForm ? 'Cancel' : '+ New Tender'}</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
              <input type="text" required value={form.tender_reference} onChange={(e) => setForm({...form, tender_reference: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" required value={form.tender_name} onChange={(e) => setForm({...form, tender_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <input type="text" value={form.client_name} onChange={(e) => setForm({...form, client_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Value (ZAR)</label>
              <input type="number" step="0.01" value={form.tender_value} onChange={(e) => setForm({...form, tender_value: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Closing Date</label>
              <input type="date" value={form.closing_date} onChange={(e) => setForm({...form, closing_date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
              <select value={form.project_id} onChange={(e) => setForm({...form, project_id: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"><option value="">Select...</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          </div>
          <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium">Create Tender</button>
        </form>
      )}
      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr><th className="text-left px-4 py-3 font-medium text-gray-600">Reference</th><th className="text-left px-4 py-3 font-medium text-gray-600">Name</th><th className="text-left px-4 py-3 font-medium text-gray-600">Client</th><th className="text-right px-4 py-3 font-medium text-gray-600">Value</th><th className="text-center px-4 py-3 font-medium text-gray-600">Status</th><th className="text-right px-4 py-3 font-medium text-gray-600">Closing</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tenders.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-blue-600">{t.tender_reference}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{t.tender_name}</td>
                  <td className="px-4 py-3 text-gray-500">{t.client_name||'-'}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-800">R{Number(t.tender_value||0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">{statusBadge(t.status)}</td>
                  <td className="px-4 py-3 text-right text-gray-400">{t.closing_date ? new Date(t.closing_date).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
              {tenders.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No tenders yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
