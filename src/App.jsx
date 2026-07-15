import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Projects from "./pages/projects/Projects";
import ProjectDetail from "./pages/projects/ProjectDetail";
import SafetyFiles from "./pages/safety/SafetyFiles";
import RiskAssessments from "./pages/safety/RiskAssessments";
import Inspections from "./pages/inspections/Inspections";
import InspectionDetail from "./pages/inspections/InspectionDetail";
import Incidents from "./pages/incidents/Incidents";
import IncidentDetail from "./pages/incidents/IncidentDetail";
import Workers from "./pages/workers/Workers";
import AIDocumentGenerator from "./pages/ai/AIDocumentGenerator";
import AIAgents from "./pages/ai/AIAgents";
import AgentChat from "./pages/ai/AgentChat";
import TenderContracts from "./pages/tenders/TenderContracts";
import PricingDatabase from "./pages/pricing/PricingDatabase";
import ComplianceDashboard from "./pages/compliance/ComplianceDashboard";
import Analytics from "./pages/analytics/Analytics";
import ContractorOnboarding from "./pages/contractors/ContractorOnboarding";
import Billing from "./pages/billing/Billing";
import Settings from "./pages/settings/Settings";

function LoadingScreen() {
  return <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center"><div className="w-12 h-12 border-4 border-safety-200 border-t-safety-600 rounded-full animate-spin mx-auto"></div><p className="mt-3 text-gray-500">Loading SafetyStack...</p></div>
  </div>;
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="safety-files" element={<SafetyFiles />} />
        <Route path="risk-assessments" element={<RiskAssessments />} />
        <Route path="inspections" element={<Inspections />} />
        <Route path="inspections/:id" element={<InspectionDetail />} />
        <Route path="incidents" element={<Incidents />} />
        <Route path="incidents/:id" element={<IncidentDetail />} />
        <Route path="workers" element={<Workers />} />
        <Route path="ai-document-generator" element={<AIDocumentGenerator />} />
        <Route path="ai-agents" element={<AIAgents />} />
        <Route path="ai-agents/:agentId" element={<AgentChat />} />
        <Route path="tender-contracts" element={<TenderContracts />} />
        <Route path="pricing-database" element={<PricingDatabase />} />
        <Route path="compliance" element={<ComplianceDashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="contractor-onboarding" element={<ContractorOnboarding />} />
        <Route path="billing" element={<Billing />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
