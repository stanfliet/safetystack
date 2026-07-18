import { useState } from 'react';
import { NHBRC_CATEGORIES, searchNHBRC } from '../../data/nhbrc-pricing';
import { SANRAL_CATEGORIES, searchSANRAL } from '../../data/sanral-pricing';
import { WIETA_CATEGORIES, searchWIETA } from '../../data/wieta-pricing';
import { BIBC_CATEGORIES, searchBIBC } from '../../data/bibc-pricing';
import { BCCEI_CATEGORIES, searchBCCEI } from '../../data/bccei-pricing';
import { DOL_CATEGORIES, searchDOL } from '../../data/dol-pricing';

const BODIES = [
  { id: 'nhbrc', name: 'NHBRC', fullName: 'National Home Builders Registration Council', color: 'bg-emerald-600', data: NHBRC_CATEGORIES },
  { id: 'sanral', name: 'SANRAL', fullName: 'South African National Roads Agency Ltd', color: 'bg-blue-600', data: SANRAL_CATEGORIES },
  { id: 'wieta', name: 'WIETA', fullName: 'Wine & Agricultural Industry Transformation Alliance', color: 'bg-purple-600', data: WIETA_CATEGORIES },
  { id: 'bibc', name: 'BIBC', fullName: 'Building Industry Bargaining Council', color: 'bg-amber-600', data: BIBC_CATEGORIES },
  { id: 'bccei', name: 'BCCEI', fullName: 'Bargaining Council for Civil Engineering Industry', color: 'bg-rose-600', data: BCCEI_CATEGORIES },
  { id: 'dol', name: 'DoL', fullName: 'Department of Employment & Labour', color: 'bg-sky-600', data: DOL_CATEGORIES },
];

const REGIONS = [
  'national', 'gauteng', 'western_cape', 'kwazulu_natal', 'eastern_cape',
  'limpopo', 'mpumalanga', 'north_west', 'free_state', 'northern_cape'
];

export default function PricingBodySelector() {
  const [activeBody, setActiveBody] = useState('nhbrc');
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [region, setRegion] = useState('national');
  const [expandedItems, setExpandedItems] = useState({});

  const currentBody = BODIES.find(b => b.id === activeBody);
  const categories = currentBody?.data || {};
  const categoryKeys = Object.keys(categories);

  const searchFn = {
    nhbrc: searchNHBRC,
    sanral: searchSANRAL,
    wieta: searchWIETA,
    bibc: searchBIBC,
    bccei: searchBCCEI,
    dol: searchDOL,
  }[activeBody];

  const searchResults = searchQuery.trim() && searchFn
    ? searchFn(searchQuery, region)
    : [];

  const toggleItem = (code) => {
    setExpandedItems(prev => ({ ...prev, [code]: !prev[code] }));
  };

  const regionLabel = region === 'national' ? 'National' :
    region.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pricing Bodies & Rate Databases</h2>
          <p className="text-gray-500 mt-1">Browse industry-standard rates from South African regulatory & bargaining councils</p>
        </div>
      </div>

      {/* Body Selector Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {BODIES.map(body => (
          <button key={body.id} onClick={() => { setActiveBody(body.id); setActiveCategory(null); setSearchQuery(''); }}
            className={`relative p-4 rounded-xl text-left transition-all ${
              activeBody === body.id ? `${body.color} text-white shadow-lg scale-105` : 'bg-safety-800 text-safety-200 hover:bg-safety-700'
            }`}>
            <div className={`text-lg font-bold ${activeBody === body.id ? 'text-white' : 'text-white'}`}>{body.name}</div>
            <div className={`text-xs mt-1 ${activeBody === body.id ? 'text-white/80' : 'text-safety-400'}`}>{body.fullName}</div>
          </button>
        ))}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <input type="text" placeholder="Search items across all categories..." value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)} className="input w-full" />
        </div>
        <div>
          <select value={region} onChange={e => setRegion(e.target.value)} className="input min-w-[160px]">
            {REGIONS.map(r => (
              <option key={r} value={r}>{r.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery.trim() && (
        <div className="card">
          <div className="card-body">
            <h3 className="text-lg font-semibold mb-3">Search Results ({searchResults.length})</h3>
            {searchResults.length === 0 ? (
              <p className="text-gray-400 text-sm">No items match your search</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-safety-300 border-b border-safety-700">
                      <th className="pb-2 font-medium">Code</th>
                      <th className="pb-2 font-medium">Description</th>
                      <th className="pb-2 font-medium">Category</th>
                      <th className="pb-2 font-medium">Unit</th>
                      <th className="pb-2 font-medium text-right">{regionLabel} Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((item, i) => (
                      <tr key={i} className="border-b border-safety-800 hover:bg-safety-800/50">
                        <td className="py-2 font-mono text-xs">{item.code}</td>
                        <td className="py-2">{item.description}</td>
                        <td className="py-2 text-safety-300">{item.category}</td>
                        <td className="py-2">{item.unit}</td>
                        <td className="py-2 text-right font-semibold">R {Number(item.price || item.national).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Tabs */}
      {!searchQuery.trim() && (
        <>
          <div className="flex flex-wrap gap-2">
            {categoryKeys.map(key => (
              <button key={key} onClick={() => setActiveCategory(activeCategory === key ? null : key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === key ? 'bg-safety-600 text-white' : 'bg-safety-800 text-safety-200 hover:bg-safety-700'
                }`}>
                {categories[key].name}
              </button>
            ))}
          </div>

          {/* Items Display */}
          {categoryKeys.filter(k => !activeCategory || k === activeCategory).map(catKey => (
            <div key={catKey} className="card">
              <div className="card-body">
                <h3 className="text-lg font-semibold mb-1">{categories[catKey].name}</h3>
                {categories[catKey].notes && <p className="text-xs text-safety-400 mb-3">{categories[catKey].notes}</p>}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-safety-300 border-b border-safety-700">
                        <th className="pb-2 font-medium">Code</th>
                        <th className="pb-2 font-medium">Description</th>
                        <th className="pb-2 font-medium">Unit</th>
                        <th className="pb-2 font-medium text-right">National</th>
                        <th className="pb-2 font-medium text-right">{regionLabel}</th>
                        <th className="pb-2 font-medium">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories[catKey].items.map((item, i) => (
                        <tr key={i} className="border-b border-safety-800 hover:bg-safety-800/50 cursor-pointer" onClick={() => toggleItem(item.code)}>
                          <td className="py-2 font-mono text-xs">{item.code}</td>
                          <td className="py-2">{item.description}</td>
                          <td className="py-2">{item.unit}</td>
                          <td className="py-2 text-right">R {Number(item.national).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                          <td className={`py-2 text-right font-semibold ${activeBody === body?.id ? 'text-safety-50' : ''}`}>
                            R {Number(item[region] || item.national).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            {item[region] && item[region] !== item.national && <span className="text-xs text-safety-400 ml-1">({region !== 'national' ? regionLabel : ''})</span>}
                          </td>
                          <td className="py-2 text-xs text-safety-400">{item.data_source}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Info Footer */}
      <div className="bg-safety-800/50 rounded-xl p-4 border border-safety-700">
        <p className="text-sm text-safety-300">
          <span className="font-semibold text-safety-100">Rates valid: July 2026</span> — All rates are indicative market averages. 
          Verify with the relevant body for official current rates. Click any row to see rate details.
          Use the search bar to find specific items across all categories.
          {currentBody && <span> Currently viewing: <span className="font-semibold text-safety-100">{currentBody.fullName}</span></span>}
        </p>
      </div>
    </div>
  );
}
