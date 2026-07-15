import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function TopBar({ title, onMenuClick }) {
  const { profile, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => { function h(e) { if (ref.current && !ref.current.contains(e.target)) setDropdownOpen(false); } document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h1 className="text-lg md:text-xl font-bold text-gray-900">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/ai-document-generator" className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-safety-600 text-white rounded-lg text-sm font-semibold hover:bg-safety-700 transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Generate Document
          </Link>
          <div className="relative" ref={ref}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 rounded-full bg-safety-100 flex items-center justify-center text-safety-700 text-sm font-semibold">{profile?.full_name?.charAt(0) || "U"}</div>
              <span className="hidden md:block text-sm font-medium text-gray-700">{profile?.full_name || "User"}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-100"><p className="text-sm font-medium text-gray-900">{profile?.full_name}</p><p className="text-xs text-gray-500">{profile?.company_name}</p></div>
                <Link to="/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">Settings</Link>
                <Link to="/billing" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">Billing</Link>
                <div className="border-t border-gray-100 mt-1">
                  <button onClick={() => { setDropdownOpen(false); signOut(); }} className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full">Sign Out</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
