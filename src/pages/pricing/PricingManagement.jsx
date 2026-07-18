import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

const TABS = [
  { key: 'materials', label: 'Materials', table: 'material_prices', codeField: 'material_code', nameField: 'material_name', rateField: 'base_price', unitField: 'unit' },
  { key: 'labour', label: 'Labour', table: 'labour_rates', codeField: 'labour_code', nameField: 'labour_type', rateField: 'hourly_rate', unitField: '' },
  { key: 'plant', label: 'Plant & Equipment', table: 'plant_rates', codeField: 'plant_code', nameField: 'plant_name', rateField: 'hourly_rental_rate', unitField: '' },
];

export default function PricingManagement() {
  const [activeTab, setActiveTab] = useState('materials');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchData(); }, [activeTab]);

  async function fetchData() {
    setLoading(true);
    const tab = TABS.find(t => t.key === activeTab);
    const { data: result } = await supabase.from(tab.table).select('*').order('created_at', { ascending: false });
    if (result) setData(result); setLoading(false);
  }

  const tab = TABS.find(t => t.key === activeTab);
  const filtered = data.filter(d => {
    const fields = [d[tab.codeField], d[tab.nameField], d.description];
    return fields.some(f => f?.toLowerCase().includes(search.toLowerCase()));
  });

  const getUnit = (item) => {
    if (item.unit) return item.unit;
    const t = TABS.find(t => t.key === activeTab);
    if (t.key === 'labour') return item.hourly_rate ? 'hr' : item.daily_rate ? 'day' : '-';
    if (t.key === 'plant') return item.hourly_rental_rate ? 'hr' : item.daily_rental_rate ? 'day' : item.monthly_rental_rate ? 'month' : '-';
    return '-';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-gray-800">Pricing Management</h2><p className="text-sm text-gray-500 mt-1">{data.length} active rates</p></div>
      </div>
      <div className="flex gap-2 border-b border-gray-200">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={'px-4 py-2 text-sm font-medium border-b-2 transition-colors ' + (activeTab===t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500')}>{t.label}</button>
        ))}
      </div>
      <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg text-sm" />
      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr><th className="text-left px-4 py-3 font-medium text-gray-600">Code</th><th className="text-left px-4 py-3 font-medium text-gray-600">Name</th><th className="text-right px-4 py-3 font-medium text-gray-600">Rate</th><th className="text-center px-4 py-3 font-medium text-gray-600">Unit</th><th className="text-left px-4 py-3 font-medium text-gray-600">Region</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-blue-600">{item[tab.codeField]||'-'}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{item[tab.nameField]||'-'}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-800">R{Number(item[tab.rateField]||0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-gray-500">{getUnit(item)}</td>
                  <td className="px-4 py-3 text-gray-500">{item.region||'National'}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No rates found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
