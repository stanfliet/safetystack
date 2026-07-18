import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const CONTRACT_STANDARDS = ['gcc2010', 'gcc2015', 'fidic', 'nec3', 'nec4', 'jbcc'];

export default function ContractManagement() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ contract_standard: 'gcc2015', contract_number: '', contract_name: '', contract_value: '', client_name: '', contractor_name: '', start_date: '', end_date: '', project_id: '' });
  const [projects, setProjects] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [variations, setVariations] = useState([]);
  const [claims, setClaims] = useState([]);

  useEffect(() => { fetchContracts(); fetchProjects(); }, []);

  async function fetchContracts() {
    const { data } = await supabase.from('contract_records').select('*').order('created_at', { ascending: false });
    if (data) setContracts(data); setLoading(false);
  }
  async function fetchProjects() {
    const { data } = await supabase.from('projects').select('id, name').order('name');
    if (data) setProjects(data);
  }
  async function fetchDetails(id) {
    setSelectedContract(id);
    const { data: v } = await supabase.from('contract_variations').select('*').eq('contract_id', id).order('variation_number');
    if (v) setVariations(v);
    const { data: c } = await supabase.from('contract_claims').select('*').eq('contract_id', id).order('claim_date', { ascending: false });
    if (c) setClaims(c);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('contract_records').insert({ ...form, contract_value: parseFloat(form.contract_value) || 0, created_by: user.id });
    setShowForm(false); fetchContracts();
    setForm({ contract_standard: 'gcc2015', contract_number: '', contract_name: '', contract_value: '', client_name: '', contractor_name: '', start_date: '', end_date: '', project_id: '' });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-gray-800">Contract Management</h2><p className="text-sm text-gray-500 mt-1">{contracts.length} contracts</p></div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">{showForm ? 'Cancel' : '+ New Contract'}</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Standard</label>
              <select value={form.contract_standard} onChange={(e) => setForm({...form, contract_standard: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">{CONTRACT_STANDARDS.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Contract Number</label>
              <input type="text" required value={form.contract_number} onChange={(e) => setForm({...form, contract_number: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" required value={form.contract_name} onChange={(e) => setForm({...form, contract_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Value (ZAR)</label>
              <input type="number" step="0.01" value={form.contract_value} onChange={(e) => setForm({...form, contract_value: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <input type="text" value={form.client_name} onChange={(e) => setForm({...form, client_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Contractor</label>
              <input type="text" value={form.contractor_name} onChange={(e) => setForm({...form, contractor_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="date" value={form.start_date} onChange={(e) => setForm({...form, start_date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="date" value={form.end_date} onChange={(e) => setForm({...form, end_date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
              <select value={form.project_id} onChange={(e) => setForm({...form, project_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"><option value="">Select...</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          </div>
          <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium">Create Contract</button>
        </form>
      )}
      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-medium text-gray-700 mb-3">Contracts</h3>
            <div className="space-y-2">
              {contracts.map(c => (
                <button key={c.id} onClick={() => fetchDetails(c.id)}
                  className={'block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ' + (selectedContract === c.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100')}>
                  <span className="font-medium">{c.contract_number}</span>
                  <span className="block text-xs text-gray-400 mt-0.5">{c.contract_name} R{Number(c.contract_value).toLocaleString()}</span>
                </button>
              ))}
              {contracts.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No contracts yet</p>}
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            {selectedContract ? (<>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-medium text-gray-700 mb-3">Variations ({variations.length})</h3>
                {variations.map(v => (
                  <div key={v.id} className="flex justify-between px-3 py-2 bg-gray-50 rounded-lg text-sm mb-1">
                    <span className="text-gray-700">#{v.variation_number} {v.description}</span>
                    <span className="text-gray-500">R{Number(v.variation_amount||0).toLocaleString()}</span>
                  </div>
                ))}
                {variations.length === 0 && <p className="text-sm text-gray-400">No variations</p>}
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-medium text-gray-700 mb-3">Claims ({claims.length})</h3>
                {claims.map(cl => (
                  <div key={cl.id} className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-lg text-sm mb-1">
                    <span className="text-gray-700">{cl.claim_type} {cl.description}</span>
                    <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + (cl.status==='approved'?'bg-green-100 text-green-700':cl.status==='rejected'?'bg-red-100 text-red-700':'bg-amber-100 text-amber-700')}>{cl.status}</span>
                  </div>
                ))}
                {claims.length === 0 && <p className="text-sm text-gray-400">No claims</p>}
              </div>
            </>) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">Select a contract to view details</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
