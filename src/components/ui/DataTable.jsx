import { useState } from "react";
export default function DataTable({ columns, data, onRowClick, loading, emptyMessage = "No data found", searchable = false }) {
  const [search, setSearch] = useState("");
  const filtered = searchable && search ? data.filter(r => columns.some(c => String(r[c.accessor]||"").toLowerCase().includes(search.toLowerCase()))) : data;
  if (loading) return <div className="card p-8 flex items-center justify-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-safety-600" /></div>;
  return (
    <div className="card overflow-hidden">
      {searchable && <div className="px-6 py-4 border-b border-gray-100"><input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="input max-w-xs" /></div>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50"><tr>{columns.map(c => <th key={c.accessor} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{c.Header}</th>)}</tr></thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length === 0 ? <tr><td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">{emptyMessage}</td></tr>
              : filtered.map((row, i) => (
                <tr key={row.id||i} onClick={() => onRowClick?.(row)} className={onRowClick?"cursor-pointer hover:bg-gray-50":""}>
                  {columns.map(c => <td key={c.accessor} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{c.cell ? c.cell(row) : row[c.accessor]}</td>)}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
