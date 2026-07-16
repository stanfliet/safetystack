import { useState } from "react";
import { Link } from "react-router-dom";

export function StatCard({ label, value, icon, color, link }) {
  const wrap = (content) => link ? <Link to={link} className="card p-5 hover:shadow-md transition-all block">{content}</Link> : <div className="card p-5">{content}</div>;
  return wrap(
    <><div className="flex items-center justify-between"><p className="text-sm text-gray-500">{label}</p>{icon && <span className={"text-2xl " + color}>{icon}</span>}</div><p className="text-2xl font-bold mt-1">{value ?? 0}</p></>
  );
}

export function DataTable({ columns, data, loading, searchable, emptyMessage }) {
  const [search, setSearch] = useState("");
  const [sortedField, setSortedField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(0);
  const pageSize = 15;

  let filtered = data;
  if (searchable && search) {
    filtered = data.filter(r => columns.some(c => String(r[c.accessor] ?? "").toLowerCase().includes(search.toLowerCase())));
  }
  if (sortedField) {
    filtered = [...filtered].sort((a, b) => {
      const va = a[sortedField] ?? "", vb = b[sortedField] ?? "";
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const pages = Math.ceil(filtered.length / pageSize);

  if (loading) return <div className="card p-12 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-safety-600 mx-auto"></div><p className="text-sm text-gray-500 mt-3">Loading...</p></div>;

  return (
    <div className="card">
      {searchable && <div className="card-header"><input type="text" placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} className="input max-w-xs" /></div>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 bg-gray-50">
            {columns.map((col, i) => (
              <th key={i} className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer hover:text-gray-900" onClick={() => { setSortedField(col.accessor); setSortDir(d => d === "asc" ? "desc" : "asc"); }}>
                {col.Header} {sortedField === col.accessor ? (sortDir === "asc" ? " \u25B2" : " \u25BC") : ""}
              </th>
            ))}
          </tr></thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={columns.length} className="text-center py-12 text-gray-500">{emptyMessage || "No data"}</td></tr>
            ) : paged.map((row, ri) => (
              <tr key={row.id || ri} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                {columns.map((col, ci) => (
                  <td key={ci} className="px-4 py-3">{col.cell ? col.cell(row) : (row[col.accessor] ?? "-")}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && <div className="card-body flex items-center justify-between border-t border-gray-100"><p className="text-sm text-gray-500">Page {page + 1} of {pages}</p><div className="flex gap-2"><button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="btn-secondary text-xs">Prev</button><button disabled={page >= pages - 1} onClick={() => setPage(p => p + 1)} className="btn-secondary text-xs">Next</button></div></div>}
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// Add default export for DataTable (used by some imports as default)
export default DataTable;
