import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import TopBar from "./TopBar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const titles = {
    "/dashboard": "Dashboard", "/projects": "Projects", "/safety-files": "Safety Files",
    "/risk-assessments": "Risk Assessments", "/inspections": "Inspections", "/incidents": "Incidents",
    "/workers": "Workers", "/ai-document-generator": "AI Document Generator", "/ai-agents": "AI Expert Agents",
    "/tender-contracts": "Tender & Contracts", "/pricing-database": "Pricing Database",
    "/compliance": "Compliance Dashboard", "/analytics": "Analytics",
    "/contractor-onboarding": "Contractor Onboarding", "/billing": "Billing & Subscription",
    "/settings": "Settings"
  };
  const title = Object.entries(titles).find(([k]) => location.pathname.startsWith(k))?.[1] || "SafetyStack";

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <TopBar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"><Outlet /></main>
      </div>
      <MobileNav />
    </div>
  );
}
