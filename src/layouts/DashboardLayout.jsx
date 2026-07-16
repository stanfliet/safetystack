import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import TopBar from "./TopBar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const titles = {
    "/": "Dashboard", "/projects": "Projects", "/safety-files": "Safety Files",
    "/risk-assessments": "Risk Assessments", "/inspections": "Inspections",
    "/incidents": "Incidents", "/workers": "Workers", "/ai-documents": "AI Document Generator",
    "/ai-agents": "AI Expert Agents", "/tenders": "Tender & Contracts",
    "/pricing": "Pricing Database", "/compliance": "Compliance Dashboard",
    "/analytics": "Analytics", "/onboarding": "Contractor Onboarding",
    "/billing": "Billing & Subscription", "/settings": "Settings",
    "/documents": "Document Processing", "/commercial": "Commercial Management",
    "/knowledge-search": "Knowledge Search", "/intelligence": "Project Intelligence",
    "/health-safety": "Health & Safety"
  };
  const title = Object.entries(titles).find(([k]) => location.pathname.startsWith(k))?.[1] || "SafetyStack";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <div className="flex flex-col flex-1 min-w-0 lg:pl-64 overflow-hidden">
        <TopBar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}