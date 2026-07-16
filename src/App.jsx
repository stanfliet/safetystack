import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import Layout from "./components/Layout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Projects from "./pages/projects/Projects";
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

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
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
      </Route>
    </Routes>
  );
}
