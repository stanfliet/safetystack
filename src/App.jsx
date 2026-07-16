import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Projects from "./pages/projects/Projects";
import ProjectDetail from "./pages/projects/ProjectDetail";
import SafetyFiles from "./pages/safety-files/SafetyFiles";
import RiskAssessments from "./pages/risk-assessments/RiskAssessments";
import Inspections from "./pages/inspections/Inspections";
import Incidents from "./pages/incidents/Incidents";
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
import DocumentUpload from "./pages/documents/DocumentUpload";
import DocumentList from "./pages/documents/DocumentList";
import CommercialDashboard from "./pages/commercial/CommercialDashboard";
import BOQAnalysis from "./pages/commercial/BOQAnalysis";
import VariationTracking from "./pages/commercial/VariationTracking";
import IntelligenceDashboard from "./pages/intelligence/IntelligenceDashboard";
import KnowledgeSearch from "./pages/intelligence/KnowledgeSearch";
import HealthSafetyHub from "./pages/health-safety/HealthSafetyHub";
import HSFileViewer from "./pages/health-safety/HSFileViewer";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="safety-files" element={<SafetyFiles />} />
        <Route path="risk-assessments" element={<RiskAssessments />} />
        <Route path="inspections" element={<Inspections />} />
        <Route path="incidents" element={<Incidents />} />
        <Route path="workers" element={<Workers />} />
        <Route path="ai-documents" element={<AIDocumentGenerator />} />
        <Route path="ai-agents" element={<AIAgents />} />
        <Route path="ai-agents/:agentId" element={<AgentChat />} />
        <Route path="tenders" element={<TenderContracts />} />
        <Route path="pricing" element={<PricingDatabase />} />
        <Route path="compliance" element={<ComplianceDashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="onboarding" element={<ContractorOnboarding />} />
        <Route path="billing" element={<Billing />} />
        <Route path="settings" element={<Settings />} />
        {/* NEW FEATURE ROUTES */}
        <Route path="documents" element={<DocumentList />} />
        <Route path="documents/upload" element={<DocumentUpload />} />
        <Route path="commercial" element={<CommercialDashboard />} />
        <Route path="commercial/boq" element={<BOQAnalysis />} />
        <Route path="commercial/variations" element={<VariationTracking />} />
        <Route path="intelligence" element={<IntelligenceDashboard />} />
        <Route path="knowledge-search" element={<KnowledgeSearch />} />
        <Route path="health-safety" element={<HealthSafetyHub />} />
        <Route path="health-safety/:id" element={<HSFileViewer />} />
      </Route>
    </Routes>
  );
}

