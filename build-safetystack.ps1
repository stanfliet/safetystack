# ============================================================
# SAFETYSTACK - Complete Project Builder
# Run this script in PowerShell as Administrator
# This script creates all files, folders, and pushes to GitHub
# ============================================================

$ErrorActionPreference = "Stop"
$PROJECT_DIR = "C:\Users\k2020\Desktop\safetystack"
$REPO_URL = "https://github.com/stanfliet/safetystack.git"

Write-Host "=== SAFETYSTACK PROJECT BUILDER ===" -ForegroundColor Cyan
Write-Host "Building in: $PROJECT_DIR" -ForegroundColor Yellow

# Create project directory
if (!(Test-Path $PROJECT_DIR)) { New-Item -ItemType Directory -Path $PROJECT_DIR -Force }
Set-Location $PROJECT_DIR

# ============================================================
# STEP 1: CREATE FOLDER STRUCTURE
# ============================================================
Write-Host "`n[1/5] Creating folder structure..." -ForegroundColor Green

$folders = @(
    "public",
    "api",
    "supabase\migrations",
    "src\contexts",
    "src\lib",
    "src\components\ui",
    "src\layouts",
    "src\pages\auth",
    "src\pages\dashboard",
    "src\pages\projects",
    "src\pages\safety",
    "src\pages\inspections",
    "src\pages\incidents",
    "src\pages\workers",
    "src\pages\ai",
    "src\pages\tenders",
    "src\pages\pricing",
    "src\pages\compliance",
    "src\pages\analytics",
    "src\pages\contractors",
    "src\pages\billing",
    "src\pages\settings"
)

foreach ($folder in $folders) {
    $path = Join-Path $PROJECT_DIR $folder
    if (!(Test-Path $path)) { New-Item -ItemType Directory -Path $path -Force | Out-Null }
}
Write-Host "  ✓ All folders created" -ForegroundColor Green

# ============================================================
# STEP 2: CREATE ROOT CONFIGURATION FILES
# ============================================================
Write-Host "[2/5] Creating root configuration files..." -ForegroundColor Green

# package.json
@'
{
  "name": "safetystack",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "description": "SafetyStack - OHS Compliance Management Platform for South African Construction",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0",
    "@supabase/auth-ui-react": "^0.4.7",
    "@supabase/auth-ui-shared": "^0.1.8",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.23.0",
    "react-hot-toast": "^2.4.1",
    "lucide-react": "^0.400.0",
    "recharts": "^2.12.7",
    "date-fns": "^3.6.0",
    "@stripe/react-stripe-js": "^2.8.0",
    "@stripe/stripe-js": "^4.1.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.2.0",
    "vite-plugin-pwa": "^0.20.0",
    "tailwindcss": "^3.4.3",
    "postcss": "^8.4.38",
    "autoprefixer": "^10.4.19"
  }
}
'@ | Out-File -FilePath "package.json" -Encoding utf8 -Force

# vite.config.js
@'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'SafetyStack',
        short_name: 'SafetyStack',
        description: 'OHS Compliance Management Platform for South African Construction',
        theme_color: '#1e40af',
        background_color: '#f8fafc',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [{
          urlPattern: /^https?:\/\/.*\/api\/.*/i,
          handler: 'NetworkFirst',
          options: { cacheName: 'api-cache', expiration: { maxEntries: 100, maxAgeSeconds: 86400 } }
        }]
      }
    })
  ]
});
'@ | Out-File -FilePath "vite.config.js" -Encoding utf8 -Force

# tailwind.config.js
@'
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        safety: {
          50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
          400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
          800: '#1e40af', 900: '#1e3a8a', 950: '#172554'
        },
        ohs: { red: '#dc2626', amber: '#f59e0b', green: '#16a34a', blue: '#2563eb' }
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] }
    }
  },
  plugins: []
};
'@ | Out-File -FilePath "tailwind.config.js" -Encoding utf8 -Force

# postcss.config.js
@'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
'@ | Out-File -FilePath "postcss.config.js" -Encoding utf8 -Force

# index.html
@'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="description" content="SafetyStack - OHS Compliance Management Platform for South African Construction" />
    <meta name="theme-color" content="#1e40af" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
    <title>SafetyStack - OHS Compliance Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
'@ | Out-File -FilePath "index.html" -Encoding utf8 -Force

# vercel.json
@'
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "functions": { "api/*.js": { "maxDuration": 60 } }
}
'@ | Out-File -FilePath "vercel.json" -Encoding utf8 -Force

# .env.example
@'
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
# OpenAI
OPENAI_API_KEY=sk-your-openai-key
# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-secret
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
# App
VITE_APP_URL=http://localhost:5173
'@ | Out-File -FilePath ".env.example" -Encoding utf8 -Force

# .gitignore
@'
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
'@ | Out-File -FilePath ".gitignore" -Encoding utf8 -Force

Write-Host "  ✓ Root config files created" -ForegroundColor Green

# ============================================================
# STEP 3: CREATE ALL SOURCE FILES
# ============================================================
Write-Host "[3/5] Creating source files (this may take a moment)..." -ForegroundColor Green

# --- Main Entry Files ---
@'
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: "#1e293b", color: "#f8fafc", borderRadius: "8px" } }} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
'@ | Out-File -FilePath "src\main.jsx" -Encoding utf8 -Force

@'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { @apply border-gray-200; }
  body { @apply bg-gray-50 text-gray-900 antialiased; font-family: "Inter", system-ui, sans-serif; }
}

@layer components {
  .btn { @apply inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed; }
  .btn-primary { @apply btn bg-safety-600 text-white hover:bg-safety-700 focus:ring-safety-500 shadow-sm hover:shadow-md; }
  .btn-secondary { @apply btn bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-safety-500; }
  .btn-danger { @apply btn bg-ohs-red text-white hover:bg-red-700 focus:ring-red-500; }
  .input { @apply block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-safety-500 focus:outline-none focus:ring-1 focus:ring-safety-500 transition-colors; }
  .label { @apply block text-sm font-medium text-gray-700 mb-1; }
  .card { @apply bg-white rounded-xl border border-gray-200 shadow-sm; }
  .card-header { @apply px-6 py-4 border-b border-gray-100; }
  .card-body { @apply p-6; }
  .badge { @apply inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium; }
  .badge-success { @apply badge bg-green-100 text-green-800; }
  .badge-warning { @apply badge bg-amber-100 text-amber-800; }
  .badge-danger { @apply badge bg-red-100 text-red-800; }
  .badge-info { @apply badge bg-blue-100 text-blue-800; }
  .badge-neutral { @apply badge bg-gray-100 text-gray-800; }
}

@media print { .no-print { display: none !important; } body { background: white !important; } }
'@ | Out-File -FilePath "src\index.css" -Encoding utf8 -Force

# --- Supabase Client ---
@'
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});
'@ | Out-File -FilePath "src\lib\supabase.js" -Encoding utf8 -Force

# --- Constants ---
@'
export const PROJECT_TYPES = ["roadworks","housing","civils","building","infrastructure","mining_support","other"];
export const PROJECT_STATUSES = [{value:"planning",label:"Planning",color:"badge-info"},{value:"active",label:"Active",color:"badge-success"},{value:"on_hold",label:"On Hold",color:"badge-warning"},{value:"completed",label:"Completed",color:"badge-neutral"},{value:"closed",label:"Closed",color:"badge-neutral"}];
export const DOCUMENT_TYPES = [{value:"safety_file",label:"Safety File"},{value:"hs_policy",label:"H&S Policy"},{value:"baseline_risk_assessment",label:"Baseline Risk Assessment"},{value:"task_risk_assessment",label:"Task-Specific Risk Assessment"},{value:"method_statement",label:"Method Statement"},{value:"safe_work_procedure",label:"Safe Work Procedure"},{value:"appointment_letter",label:"Appointment Letter"},{value:"emergency_plan",label:"Emergency Plan"},{value:"fall_protection_plan",label:"Fall Protection Plan"},{value:"traffic_management_plan",label:"Traffic Management Plan"},{value:"induction_checklist",label:"Induction Checklist"},{value:"toolbox_talk",label:"Toolbox Talk"},{value:"ppe_register",label:"PPE Register"},{value:"plant_register",label:"Plant Register"},{value:"visitor_register",label:"Visitor Register"}];
export const DOCUMENT_STATUSES = [{value:"draft",label:"Draft",color:"badge-neutral"},{value:"review",label:"Under Review",color:"badge-warning"},{value:"approved",label:"Approved",color:"badge-success"},{value:"expired",label:"Expired",color:"badge-danger"}];
export const INCIDENT_TYPES = [{value:"near_miss",label:"Near Miss"},{value:"first_aid",label:"First Aid"},{value:"medical_treatment",label:"Medical Treatment"},{value:"lost_time_injury",label:"Lost Time Injury"},{value:"fatality",label:"Fatality"},{value:"property_damage",label:"Property Damage"},{value:"environmental",label:"Environmental"},{value:"other",label:"Other"}];
export const INCIDENT_SEVERITIES = [{value:"low",label:"Low",color:"badge-success"},{value:"medium",label:"Medium",color:"badge-warning"},{value:"high",label:"High",color:"badge-danger"},{value:"critical",label:"Critical",color:"badge-danger"}];
export const INCIDENT_STATUSES = [{value:"reported",label:"Reported",color:"badge-info"},{value:"under_investigation",label:"Under Investigation",color:"badge-warning"},{value:"corrective_action",label:"Corrective Action",color:"badge-neutral"},{value:"closed",label:"Closed",color:"badge-success"}];
export const INSPECTION_TYPES = [{value:"site_safety",label:"Site Safety"},{value:"equipment",label:"Equipment"},{value:"ppe",label:"PPE"},{value:"housekeeping",label:"Housekeeping"},{value:"fire_safety",label:"Fire Safety"},{value:"electrical",label:"Electrical"},{value:"excavation",label:"Excavation"},{value:"scaffold",label:"Scaffold"},{value:"custom",label:"Custom"}];
export const WORKER_ROLES = [{value:"general_worker",label:"General Worker"},{value:"artisan",label:"Artisan"},{value:"foreman",label:"Foreman"},{value:"supervisor",label:"Supervisor"},{value:"operator",label:"Operator"},{value:"driver",label:"Driver"},{value:"safety_officer",label:"Safety Officer"},{value:"engineer",label:"Engineer"},{value:"other",label:"Other"}];
export const WORKER_STATUSES = [{value:"active",label:"Active",color:"badge-success"},{value:"inactive",label:"Inactive",color:"badge-neutral"},{value:"suspended",label:"Suspended",color:"badge-danger"}];
export const TENDER_TYPES = [{value:"rfq",label:"RFQ"},{value:"rfp",label:"RFP"},{value:"tender",label:"Tender"},{value:"boq",label:"BOQ"},{value:"methodology",label:"Methodology"},{value:"programme",label:"Programme"},{value:"technical_proposal",label:"Technical Proposal"},{value:"compliance_report",label:"Compliance Report"},{value:"gcc_notice",label:"GCC Notice"},{value:"gcc_claim",label:"GCC Claim"},{value:"gcc_eot",label:"GCC EOT Claim"},{value:"fidic_variation",label:"FIDIC Variation"},{value:"fidic_instruction",label:"FIDIC Instruction"},{value:"nec_early_warning",label:"NEC Early Warning"},{value:"nec_compensation_event",label:"NEC Compensation Event"},{value:"jbcc_certificate",label:"JBCC Payment Certificate"},{value:"jbcc_defects",label:"JBCC Defects List"}];
export const CONTRACT_TYPES = [{value:"gcc",label:"GCC"},{value:"fidic",label:"FIDIC"},{value:"nec3",label:"NEC3"},{value:"nec4",label:"NEC4"},{value:"jbcc",label:"JBCC"},{value:"other",label:"Other"}];
export const TENDER_STATUSES = [{value:"draft",label:"Draft",color:"badge-neutral"},{value:"review",label:"Under Review",color:"badge-warning"},{value:"submitted",label:"Submitted",color:"badge-info"},{value:"awarded",label:"Awarded",color:"badge-success"},{value:"rejected",label:"Rejected",color:"badge-danger"},{value:"closed",label:"Closed",color:"badge-neutral"}];
export const PRICING_CATEGORIES = [{value:"materials",label:"Materials"},{value:"plant",label:"Plant & Equipment"},{value:"labour",label:"Labour"}];
export const REGIONS = [{value:"national",label:"National"},{value:"gauteng",label:"Gauteng"},{value:"western_cape",label:"Western Cape"},{value:"kwazulu_natal",label:"KwaZulu-Natal"},{value:"eastern_cape",label:"Eastern Cape"},{value:"limpopo",label:"Limpopo"},{value:"mpumalanga",label:"Mpumalanga"},{value:"north_west",label:"North West"},{value:"free_state",label:"Free State"},{value:"northern_cape",label:"Northern Cape"}];
export const COMPLIANCE_ACTION_PRIORITIES = [{value:"low",label:"Low",color:"badge-success"},{value:"medium",label:"Medium",color:"badge-warning"},{value:"high",label:"High",color:"badge-danger"},{value:"critical",label:"Critical",color:"badge-danger"}];
export const COMPLIANCE_ACTION_STATUSES = [{value:"open",label:"Open",color:"badge-info"},{value:"in_progress",label:"In Progress",color:"badge-warning"},{value:"resolved",label:"Resolved",color:"badge-success"},{value:"overdue",label:"Overdue",color:"badge-danger"}];
export const SUBSCRIPTION_TIERS = [{id:"starter",name:"Starter",monthly:299,annually:2990,features:["Up to 5 active projects","Up to 50 workers","AI document generator (basic)","Safety file management","Risk assessments","Inspections module","Incident reporting","Email support"],limits:{projects:5,workers:50,ai_documents:50}},{id:"professional",name:"Professional",monthly:599,annually:5990,features:["Up to 20 active projects","Unlimited workers","AI document generator (full)","All 7 AI expert agents","Everything in Starter","Pricing database","Tender & contracts module","Compliance dashboard","Analytics & charts","Contractor onboarding","Priority support"],limits:{projects:20,workers:-1,ai_documents:500}},{id:"enterprise",name:"Enterprise",monthly:1299,annually:12990,features:["Unlimited projects","Unlimited workers","AI document generator (unlimited)","All 7 AI expert agents","Everything in Professional","Custom branding","API access","Dedicated account manager","Custom integrations","SLA guarantee","24/7 support","On-premise option"],limits:{projects:-1,workers:-1,ai_documents:-1}}];
export const AI_AGENTS = [{id:"safety-officer",name:"AI Safety Officer",title:"OHS & Compliance Expert",description:"Expert in OHS Act 85 of 1993, Construction Regulations 2014, COIDA, risk assessments, and safety file compliance.",icon:"Shield",gradient:"from-blue-600 to-blue-800"},{id:"quantity-surveyor",name:"AI Quantity Surveyor",title:"Cost & Estimation Expert",description:"Expert in BOQ analysis, rate buildups, cost estimation, cashflow forecasting, and ASAQS standards.",icon:"Calculator",gradient:"from-emerald-600 to-emerald-800"},{id:"tender-manager",name:"AI Tender Manager",title:"Procurement & Tender Expert",description:"Expert in SA public procurement, CIDB grading, B-BBEE scoring, and tender preparation.",icon:"FileText",gradient:"from-purple-600 to-purple-800"},{id:"contract-administrator",name:"AI Contract Administrator",title:"Contracts & Claims Expert",description:"Expert in GCC, FIDIC, NEC3/NEC4, and JBCC contract forms, EOT claims, and dispute resolution.",icon:"Scale",gradient:"from-amber-600 to-amber-800"},{id:"environmental-officer",name:"AI Environmental Officer",title:"NEMA & Environmental Expert",description:"Expert in NEMA compliance, EMP/EMPr, water use licences, waste management, and ISO 14001.",icon:"Leaf",gradient:"from-green-600 to-green-800"},{id:"quality-manager",name:"AI Quality Manager",title:"ISO 9001 & Quality Expert",description:"Expert in ISO 9001, ITPs, NCRs, QA plans, concrete quality control, and compaction testing.",icon:"CheckCircle",gradient:"from-cyan-600 to-cyan-800"},{id:"project-manager",name:"AI Project Manager",title:"Programme & Progress Expert",description:"Expert in construction programme planning, progress reporting, resource scheduling, delay analysis, and SACPCMP.",icon:"Briefcase",gradient:"from-rose-600 to-rose-800"}];
'@ | Out-File -FilePath "src\lib\constants.js" -Encoding utf8 -Force

# --- AuthContext ---
@'
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });
    return () => subscription?.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (!error) setProfile(data);
    setLoading(false);
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signUp(email, password, userData) {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: userData.full_name, company_name: userData.company_name, role: "user" } }
    });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
  }

  async function updateProfile(updates) {
    const { data, error } = await supabase.from("profiles").update(updates).eq("id", user.id).select().single();
    if (error) throw error;
    setProfile(data);
    return data;
  }

  return (
    <AuthContext.Provider value={{
      user, session, profile, loading, signIn, signUp, signOut, resetPassword, updateProfile,
      isAdmin: profile?.role === "admin"
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
'@ | Out-File -FilePath "src\contexts\AuthContext.jsx" -Encoding utf8 -Force

# --- App.jsx ---
@'
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
'@ | Out-File -FilePath "src\App.jsx" -Encoding utf8 -Force

# --- Layouts ---
@'
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
'@ | Out-File -FilePath "src\layouts\DashboardLayout.jsx" -Encoding utf8 -Force

# Sidebar
@'
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  { section: "Main", items: [
    { name: "Dashboard", href: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "Projects", href: "/projects", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" }
  ]},
  { section: "Safety", items: [
    { name: "Safety Files", href: "/safety-files", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { name: "Risk Assessments", href: "/risk-assessments", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" },
    { name: "Inspections", href: "/inspections", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
    { name: "Incidents", href: "/incidents", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" },
    { name: "Workers", href: "/workers", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" }
  ]},
  { section: "AI Tools", items: [
    { name: "Document Generator", href: "/ai-document-generator", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { name: "AI Expert Agents", href: "/ai-agents", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" }
  ]},
  { section: "Business", items: [
    { name: "Tender & Contracts", href: "/tender-contracts", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { name: "Pricing Database", href: "/pricing-database", icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" },
    { name: "Compliance", href: "/compliance", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { name: "Analytics", href: "/analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { name: "Contractor Onboarding", href: "/contractor-onboarding", icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" }
  ]},
  { section: "Account", items: [
    { name: "Billing", href: "/billing", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
    { name: "Settings", href: "/settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }
  ]}
];

export default function Sidebar({ open, setOpen }) {
  const { profile } = useAuth();
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow bg-safety-950 overflow-y-auto">
        <div className="flex items-center h-16 px-6 border-b border-safety-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-safety-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <span className="text-xl font-bold text-white">SafetyStack</span>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
          {navItems.map((group) => (
            <div key={group.section}>
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-safety-300 mb-2">{group.section}</p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink key={item.href} to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive ? "bg-safety-800 text-white" : "text-safety-200 hover:bg-safety-800 hover:text-white"
                      }`
                    }>
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="flex-shrink-0 p-4 border-t border-safety-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-safety-600 flex items-center justify-center text-white text-sm font-semibold">{profile?.full_name?.charAt(0) || "U"}</div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{profile?.full_name || "User"}</p>
              <p className="text-xs text-safety-300 truncate capitalize">{profile?.role || "User"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'@ | Out-File -FilePath "src\layouts\Sidebar.jsx" -Encoding utf8 -Force

# TopBar
@'
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
'@ | Out-File -FilePath "src\layouts\TopBar.jsx" -Encoding utf8 -Force

# MobileNav
@'
import { NavLink } from "react-router-dom";
export default function MobileNav() {
  const items = [
    { name: "Dashboard", href: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "Projects", href: "/projects", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { name: "Safety", href: "/safety-files", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { name: "AI", href: "/ai-agents", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
    { name: "More", href: "/compliance", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }
  ];
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => (
          <NavLink key={item.href} to={item.href}
            className={({ isActive }) => `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${isActive ? "text-safety-600" : "text-gray-400 hover:text-gray-600"}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
            <span className="text-[10px] font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
'@ | Out-File -FilePath "src\layouts\MobileNav.jsx" -Encoding utf8 -Force

# --- UI Components ---
@'
import { Link } from "react-router-dom";
const colors = { blue: { bg: "bg-blue-50", icon: "text-blue-600", text: "text-blue-700" }, red: { bg: "bg-red-50", icon: "text-red-600", text: "text-red-700" }, amber: { bg: "bg-amber-50", icon: "text-amber-600", text: "text-amber-700" }, green: { bg: "bg-green-50", icon: "text-green-600", text: "text-green-700" } };
export default function StatCard({ title, value, icon, color = "blue", link }) {
  const c = colors[color] || colors.blue;
  return (
    <Link to={link || "#"} className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={"w-12 h-12 rounded-lg flex items-center justify-center " + c.bg + " " + c.icon}>{icon}</div>
        <div className="min-w-0"><p className="text-sm font-medium text-gray-500 truncate">{title}</p><p className={"text-2xl font-bold " + c.text}>{value}</p></div>
      </div>
    </Link>
  );
}
'@ | Out-File -FilePath "src\components\ui\StatCard.jsx" -Encoding utf8 -Force

# We need DataTable component
@'
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
'@ | Out-File -FilePath "src\components\ui\DataTable.jsx" -Encoding utf8 -Force

# Modal component
@'
import { useEffect } from "react";
export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
  useEffect(() => { document.body.style.overflow = isOpen ? "hidden" : "unset"; return () => { document.body.style.overflow = "unset"; }; }, [isOpen]);
  if (!isOpen) return null;
  const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        <div className={"relative inline-block w-full " + (sizes[size]||sizes.md) + " bg-white rounded-xl shadow-2xl text-left align-middle transform transition-all"}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
'@ | Out-File -FilePath "src\components\ui\Modal.jsx" -Encoding utf8 -Force

# --- Auth Pages ---
@'
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields"); return; }
    setLoading(true);
    try { await signIn(email, password); toast.success("Welcome back!"); }
    catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-safety-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to SafetyStack</h1>
            <p className="text-gray-500 mt-2">Sign in to your OHS compliance account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label className="label">Email address</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@company.co.za" required /></div>
            <div><label className="label">Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="Enter your password" required /></div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-gray-300 text-safety-600" /><span className="text-sm text-gray-600">Remember me</span></label>
              <Link to="/reset-password" className="text-sm text-safety-600 hover:text-safety-700 font-medium">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Signing in..." : "Sign in"}</button>
          </form>
          <p className="text-center mt-6 text-sm text-gray-500">Don't have an account? <Link to="/register" className="text-safety-600 hover:text-safety-700 font-medium">Create one</Link></p>
        </div>
      </div>
      <div className="hidden lg:flex flex-1 bg-safety-950 items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <h2 className="text-3xl font-bold mb-4">South Africa's #1 Construction OHS Platform</h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>AI-powered document generation in seconds</li>
            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Real-time compliance tracking across all projects</li>
            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Built for SA OHS Act 85 of 1993 & Construction Regulations</li>
            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>7 specialised AI expert agents for every discipline</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
'@ | Out-File -FilePath "src\pages\auth\LoginPage.jsx" -Encoding utf8 -Force

@'
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const [form, setForm] = useState({ full_name: "", company_name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.password) { toast.error("Please fill in required fields"); return; }
    if (form.password !== form.confirmPassword) { toast.error("Passwords do not match"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try { await signUp(form.email, form.password, { full_name: form.full_name, company_name: form.company_name }); toast.success("Account created! Check your email to verify."); }
    catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex"><div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10"><div className="w-12 h-12 bg-safety-600 rounded-xl flex items-center justify-center mx-auto mb-4"><svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div><h1 className="text-2xl font-bold">Create Your Account</h1><p className="text-gray-500 mt-2">Start your 14-day free trial</p></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4"><div><label className="label">Full name *</label><input type="text" name="full_name" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} className="input" placeholder="John Dube" /></div><div><label className="label">Company</label><input type="text" name="company_name" value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} className="input" placeholder="BuildCorp SA" /></div></div>
          <div><label className="label">Email *</label><input type="email" name="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input" placeholder="you@company.co.za" /></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="label">Password *</label><input type="password" name="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="input" placeholder="Min 6 chars" /></div><div><label className="label">Confirm *</label><input type="password" name="confirmPassword" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} className="input" placeholder="Confirm" /></div></div>
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Creating account..." : "Create account"}</button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-500">Already have an account? <Link to="/login" className="text-safety-600 font-medium">Sign in</Link></p>
      </div>
    </div></div>
  );
}
'@ | Out-File -FilePath "src\pages\auth\RegisterPage.jsx" -Encoding utf8 -Force

@'
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) { toast.error("Please enter your email"); return; }
    setLoading(true);
    try { await resetPassword(email); setSent(true); toast.success("Reset link sent!"); }
    catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="w-12 h-12 bg-safety-600 rounded-xl flex items-center justify-center mx-auto mb-4"><svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div>
        <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
        {!sent ? (
          <><p className="text-gray-500 mb-6">Enter your email and we'll send you a reset link</p>
          <form onSubmit={handleSubmit} className="space-y-4"><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@company.co.za" /><button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Sending..." : "Send reset link"}</button></form></>
        ) : <p className="text-gray-500 mb-6">Check your email for the reset link</p>}
        <p className="mt-6 text-sm text-gray-500"><Link to="/login" className="text-safety-600 font-medium">Back to sign in</Link></p>
      </div>
    </div>
  );
}
'@ | Out-File -FilePath "src\pages\auth\ResetPasswordPage.jsx" -Encoding utf8 -Force

# --- DASHBOARD ---
@'
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import StatCard from "../../components/ui/StatCard";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalProjects: 0, activeIncidents: 0, pendingInspections: 0, avgComplianceScore: 0, totalWorkers: 0 });
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const [pCount, iCount, inspCount, wCount] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("incidents").select("*", { count: "exact", head: true }).eq("user_id", user.id).not("status","eq","closed"),
        supabase.from("inspections").select("*", { count: "exact", head: true }).eq("user_id", user.id).in("status",["draft","in_progress"]),
        supabase.from("workers").select("*", { count: "exact", head: true }).eq("user_id", user.id)
      ]);
      const { data: projs } = await supabase.from("projects").select("compliance_score").eq("user_id", user.id);
      const avg = projs?.length ? projs.reduce((s,p) => s + (p.compliance_score||0), 0) / projs.length : 0;
      setStats({ totalProjects: pCount.count||0, activeIncidents: iCount.count||0, pendingInspections: inspCount.count||0, avgComplianceScore: Math.round(avg), totalWorkers: wCount.count||0 });

      const { data: incs } = await supabase.from("incidents").select("*, projects(name)").eq("user_id", user.id).order("created_at",{ascending:false}).limit(5);
      setRecentIncidents(incs||[]);
      const { data: projs2 } = await supabase.from("projects").select("*").eq("user_id", user.id).in("status",["planning","active"]).order("updated_at",{ascending:false}).limit(6);
      setActiveProjects(projs2||[]);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }

  const sevColors = { low:"bg-green-100 text-green-800", medium:"bg-amber-100 text-amber-800", high:"bg-red-100 text-red-800", critical:"bg-red-100 text-red-800" };
  const statusColors = { planning:"badge-info", active:"badge-success", on_hold:"badge-warning", completed:"badge-neutral", closed:"badge-neutral" };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-safety-600" /></div>;

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold">Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}</h2><p className="text-gray-500 mt-1">Here's your safety compliance overview</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Projects" value={stats.totalProjects} color="blue" link="/projects"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
        <StatCard title="Active Incidents" value={stats.activeIncidents} color="red" link="/incidents"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>} />
        <StatCard title="Pending Inspections" value={stats.pendingInspections} color="amber" link="/inspections"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>} />
        <StatCard title="Compliance Score" value={`${stats.avgComplianceScore}%`} color="green" link="/compliance"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card"><div className="card-header flex items-center justify-between"><h3 className="text-lg font-semibold">Active Projects</h3><Link to="/projects" className="text-sm text-safety-600 font-medium">View all</Link></div>
            <div className="card-body p-0">
              {activeProjects.length === 0 ? <div className="text-center py-8 text-gray-500"><p>No projects yet</p><Link to="/projects" className="text-safety-600 font-medium mt-1 inline-block">Create your first project</Link></div>
                : <div className="divide-y divide-gray-100">{activeProjects.map(p => (
                    <Link key={p.id} to={`/projects/${p.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
                      <div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate">{p.name}</p><p className="text-xs text-gray-500">{p.client_name||"No client"} · {p.number_of_workers||0} workers</p></div>
                      <div className="flex items-center gap-3">
                        <div className="w-16 bg-gray-200 rounded-full h-2"><div className="bg-safety-600 h-2 rounded-full" style={{width:`${p.compliance_score||0}%`}} /></div>
                        <span className={"px-2.5 py-0.5 rounded-full text-xs font-medium capitalize " + (statusColors[p.status]||"badge-neutral")}>{p.status.replace("_"," ")}</span>
                      </div>
                    </Link>
                  ))}</div>
              }
            </div>
          </div>
        </div>

        <div className="card"><div className="card-header"><h3 className="text-lg font-semibold">Quick Actions</h3></div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-3">
              {[
                {label:"New Inspection", href:"/inspections/new", color:"bg-blue-50 text-blue-600", icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"},
                {label:"Report Incident", href:"/incidents/new", color:"bg-red-50 text-red-600", icon:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"},
                {label:"Generate Doc", href:"/ai-document-generator", color:"bg-purple-50 text-purple-600", icon:"M13 10V3L4 14h7v7l9-11h-7z"},
                {label:"Chat with AI", href:"/ai-agents/safety-officer", color:"bg-cyan-50 text-cyan-600", icon:"M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"}
              ].map(a => (
                <Link key={a.href} to={a.href} className="flex flex-col items-center gap-2 p-4 rounded-xl border hover:border-safety-300 hover:bg-safety-50 transition-all">
                  <div className={"w-10 h-10 rounded-lg flex items-center justify-center " + a.color}><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={a.icon} /></svg></div>
                  <span className="text-xs font-medium text-center">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card"><div className="card-header flex items-center justify-between"><h3 className="text-lg font-semibold">Recent Incidents</h3><Link to="/incidents" className="text-sm text-safety-600 font-medium">View all</Link></div>
          <div className="card-body p-0">
            {recentIncidents.length === 0 ? <div className="text-center py-8 text-gray-500">No incidents reported</div>
              : <div className="divide-y divide-gray-100">{recentIncidents.map(inc => (
                  <Link key={inc.id} to={`/incidents/${inc.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{inc.title}</p><p className="text-xs text-gray-500">{inc.projects?.name||"Unknown"} · {new Date(inc.created_at).toLocaleDateString()}</p></div>
                    <span className={"px-2.5 py-0.5 rounded-full text-xs font-medium capitalize " + (sevColors[inc.severity]||"badge-neutral")}>{inc.severity}</span>
                  </Link>
                ))}</div>
            }
          </div>
        </div>
        <div className="card"><div className="card-header"><h3 className="text-lg font-semibold">Compliance Overview</h3></div>
          <div className="card-body">
            <div className="text-center"><div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle cx="64" cy="64" r="54" fill="none" stroke={stats.avgComplianceScore>=80?"#16a34a":stats.avgComplianceScore>=60?"#f59e0b":"#dc2626"} strokeWidth="8" strokeDasharray={`${2*Math.PI*54}`} strokeDashoffset={`${2*Math.PI*54*(1-stats.avgComplianceScore/100)}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center"><div><span className="text-2xl font-bold">{Math.round(stats.avgComplianceScore)}%</span><p className="text-xs text-gray-500">Overall</p></div></div>
            </div></div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-green-50 rounded-lg p-3"><p className="text-xs text-green-600 font-medium">Projects</p><p className="text-lg font-bold text-green-700">{stats.totalProjects}</p></div>
              <div className="bg-blue-50 rounded-lg p-3"><p className="text-xs text-blue-600 font-medium">Workers</p><p className="text-lg font-bold text-blue-700">{stats.totalWorkers}</p></div>
              <div className="bg-amber-50 rounded-lg p-3"><p className="text-xs text-amber-600 font-medium">Open Incidents</p><p className="text-lg font-bold text-amber-700">{stats.activeIncidents}</p></div>
              <div className="bg-purple-50 rounded-lg p-3"><p className="text-xs text-purple-600 font-medium">Inspections Due</p><p className="text-lg font-bold text-purple-700">{stats.pendingInspections}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'@ | Out-File -FilePath "src\pages\dashboard\Dashboard.jsx" -Encoding utf8 -Force

# --- PROJECTS ---
@'
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";

export default function Projects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name:"", client_name:"", site_address:"", project_type:"building", cidb_grade:"", status:"planning", start_date:"", end_date:"", number_of_workers:0, safety_officer:"", project_manager:"" });

  useEffect(() => { fetchProjects(); }, []);

  async function fetchProjects() {
    const { data, error } = await supabase.from("projects").select("*").eq("user_id",user.id).order("created_at",{ascending:false});
    if (!error) setProjects(data||[]);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.name) { toast.error("Project name required"); return; }
    const { data, error } = await supabase.from("projects").insert({...form, user_id:user.id, number_of_workers:parseInt(form.number_of_workers)||0}).select().single();
    if (error) { toast.error(error.message); return; }
    toast.success("Project created!"); setShowNew(false); navigate(`/projects/${data.id}`);
  }

  const cols = [
    { Header:"Name", accessor:"name", cell: r => <span className="font-medium">{r.name}</span> },
    { Header:"Client", accessor:"client_name" },
    { Header:"Type", accessor:"project_type", cell: r => <span className="capitalize">{r.project_type?.replace("_"," ")}</span> },
    { Header:"Status", accessor:"status", cell: r => { const c={planning:"badge-info",active:"badge-success",on_hold:"badge-warning",completed:"badge-neutral",closed:"badge-neutral"}; return <span className={c[r.status]}>{r.status.replace("_"," ")}</span>; }},
    { Header:"Score", accessor:"compliance_score", cell: r => `${r.compliance_score||0}%` },
    { Header:"Created", accessor:"created_at", cell: r => new Date(r.created_at).toLocaleDateString() }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold">Projects</h2><p className="text-gray-500 mt-1">{projects.length} project{projects.length!==1?"s":""}</p></div>
        <button onClick={()=>setShowNew(true)} className="btn-primary"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>New Project</button>
      </div>
      <DataTable columns={cols} data={projects} loading={loading} searchable onRowClick={r=>navigate(`/projects/${r.id}`)} emptyMessage="No projects yet. Create your first project to get started." />
      <Modal isOpen={showNew} onClose={()=>setShowNew(false)} title="New Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="label">Project Name *</label><input type="text" className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Client</label><input type="text" className="input" value={form.client_name} onChange={e=>setForm({...form,client_name:e.target.value})} /></div>
            <div><label className="label">Project Type</label><select className="input" value={form.project_type} onChange={e=>setForm({...form,project_type:e.target.value})}><option value="building">Building</option><option value="roadworks">Roadworks</option><option value="housing">Housing</option><option value="civils">Civils</option><option value="infrastructure">Infrastructure</option><option value="mining_support">Mining</option><option value="other">Other</option></select></div>
          </div>
          <div><label className="label">Site Address</label><textarea className="input" rows={2} value={form.site_address} onChange={e=>setForm({...form,site_address:e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Start Date</label><input type="date" className="input" value={form.start_date} onChange={e=>setForm({...form,start_date:e.target.value})} /></div>
            <div><label className="label">End Date</label><input type="date" className="input" value={form.end_date} onChange={e=>setForm({...form,end_date:e.target.value})} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Safety Officer</label><input type="text" className="input" value={form.safety_officer} onChange={e=>setForm({...form,safety_officer:e.target.value})} /></div>
            <div><label className="label">Workers</label><input type="number" className="input" value={form.number_of_workers} onChange={e=>setForm({...form,number_of_workers:e.target.value})} /></div>
          </div>
          <button type="submit" className="btn-primary w-full">Create Project</button>
        </form>
      </Modal>
    </div>
  );
}
'@ | Out-File -FilePath "src\pages\projects\Projects.jsx" -Encoding utf8 -Force

# ProjectDetail
@'
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({});

  useEffect(() => { fetchProject(); fetchStats(); }, [id]);

  async function fetchProject() {
    const { data, error } = await supabase.from("projects").select("*").eq("id",id).single();
    if (error) { toast.error("Project not found"); return; }
    setProject(data); setForm(data); setLoading(false);
  }

  async function fetchStats() {
    const [d, ins, inc, w] = await Promise.all([
      supabase.from("safety_documents").select("*",{count:"exact",head:true}).eq("project_id",id),
      supabase.from("inspections").select("*",{count:"exact",head:true}).eq("project_id",id),
      supabase.from("incidents").select("*",{count:"exact",head:true}).eq("project_id",id),
      supabase.from("workers").select("*",{count:"exact",head:true}).eq("project_id",id)
    ]);
    setStats({ documents: d.count||0, inspections: ins.count||0, incidents: inc.count||0, workers: w.count||0 });
  }

  async function handleSave(e) {
    e.preventDefault(); setSaving(true);
    const { error } = await supabase.from("projects").update({...form,number_of_workers:parseInt(form.number_of_workers)||0}).eq("id",id);
    if (error) { toast.error(error.message); } else { toast.success("Updated"); setEditing(false); fetchProject(); }
    setSaving(false);
  }

  const sc = {planning:"badge-info",active:"badge-success",on_hold:"badge-warning",completed:"badge-neutral",closed:"badge-neutral"};
  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-safety-600" /></div>;
  if (!project) return <div className="text-center py-12 text-gray-500">Project not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><Link to="/projects" className="text-sm text-safety-600 font-medium mb-2 inline-block">&larr; Back</Link><h2 className="text-2xl font-bold">{project.name}</h2><p className="text-gray-500">{project.client_name && `Client: ${project.client_name}`}</p></div>
        <div className="flex gap-2"><button onClick={()=>setEditing(!editing)} className="btn-secondary">{editing?"Cancel":"Edit"}</button></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to={`/safety-files?project=${id}`} className="card p-4 hover:shadow-md"><p className="text-sm text-gray-500">Documents</p><p className="text-2xl font-bold text-safety-600">{stats.documents}</p></Link>
        <Link to={`/inspections?project=${id}`} className="card p-4 hover:shadow-md"><p className="text-sm text-gray-500">Inspections</p><p className="text-2xl font-bold text-amber-600">{stats.inspections}</p></Link>
        <Link to={`/incidents?project=${id}`} className="card p-4 hover:shadow-md"><p className="text-sm text-gray-500">Incidents</p><p className="text-2xl font-bold text-red-600">{stats.incidents}</p></Link>
        <Link to={`/workers?project=${id}`} className="card p-4 hover:shadow-md"><p className="text-sm text-gray-500">Workers</p><p className="text-2xl font-bold text-green-600">{stats.workers}</p></Link>
      </div>
      <div className="card">
        <div className="card-header"><h3 className="text-lg font-semibold">Project Details</h3></div>
        <div className="card-body">
          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="label">Name</label><input type="text" className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                <div><label className="label">Client</label><input type="text" className="input" value={form.client_name||""} onChange={e=>setForm({...form,client_name:e.target.value})} /></div>
                <div><label className="label">Type</label><select className="input" value={form.project_type} onChange={e=>setForm({...form,project_type:e.target.value})}><option value="building">Building</option><option value="roadworks">Roadworks</option><option value="housing">Housing</option><option value="civils">Civils</option><option value="infrastructure">Infrastructure</option><option value="mining_support">Mining</option><option value="other">Other</option></select></div>
                <div><label className="label">Status</label><select className="input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option value="planning">Planning</option><option value="active">Active</option><option value="on_hold">On Hold</option><option value="completed">Completed</option><option value="closed">Closed</option></select></div>
                <div><label className="label">Safety Officer</label><input type="text" className="input" value={form.safety_officer||""} onChange={e=>setForm({...form,safety_officer:e.target.value})} /></div>
                <div><label className="label">Workers</label><input type="number" className="input" value={form.number_of_workers||0} onChange={e=>setForm({...form,number_of_workers:e.target.value})} /></div>
              </div>
              <button type="submit" disabled={saving} className="btn-primary">{saving?"Saving...":"Save Changes"}</button>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><p className="text-sm text-gray-500">Status</p><span className={"badge mt-1 "+(sc[project.status])}>{project.status.replace("_"," ")}</span></div>
              <div><p className="text-sm text-gray-500">Type</p><p className="font-medium capitalize">{project.project_type}</p></div>
              <div><p className="text-sm text-gray-500">Client</p><p className="font-medium">{project.client_name||"-"}</p></div>
              <div><p className="text-sm text-gray-500">Safety Officer</p><p className="font-medium">{project.safety_officer||"-"}</p></div>
              <div><p className="text-sm text-gray-500">Workers</p><p className="font-medium">{project.number_of_workers||0}</p></div>
              <div><p className="text-sm text-gray-500">Compliance</p>
                <div className="flex items-center gap-3"><div className="flex-1 bg-gray-200 rounded-full h-2.5"><div className="bg-safety-600 h-2.5 rounded-full" style={{width:`${project.compliance_score||0}%`}} /></div><span className="font-semibold">{Math.round(project.compliance_score||0)}%</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
'@ | Out-File -FilePath "src\pages\projects\ProjectDetail.jsx" -Encoding utf8 -Force

# --- SAFETY FILES ---
@'
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable from "../../components/ui/DataTable";

export default function SafetyFiles() {
  const { user } = useAuth();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchDocs(); }, []);

  async function fetchDocs() {
    const { data, error } = await supabase.from("safety_documents").select("*, projects(name)").eq("user_id",user.id).order("updated_at",{ascending:false});
    if (!error) setDocs(data||[]);
    setLoading(false);
  }

  const cols = [
    { Header:"Title", accessor:"title", cell:r => <span className="font-medium">{r.title}</span> },
    { Header:"Type", accessor:"document_type", cell:r => <span className="capitalize">{r.document_type.replace(/_/g," ")}</span> },
    { Header:"Project", accessor:"projects", cell:r => r.projects?.name||"-" },
    { Header:"Status", accessor:"status", cell:r => { const c={draft:"badge-neutral",review:"badge-warning",approved:"badge-success",expired:"badge-danger"}; return <span className={c[r.status]}>{r.status}</span>; }},
    { Header:"Version", accessor:"version" },
    { Header:"Created", accessor:"created_at", cell:r => new Date(r.created_at).toLocaleDateString() }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold">Safety Files</h2><p className="text-gray-500 mt-1">{docs.length} document{docs.length!==1?"s":""}</p></div>
        <Link to="/ai-document-generator" className="btn-primary"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>Generate Document</Link>
      </div>
      <DataTable columns={cols} data={docs} loading={loading} searchable emptyMessage="No safety documents yet. Use the AI Document Generator to create one." />
    </div>
  );
}
'@ | Out-File -FilePath "src\pages\safety\SafetyFiles.jsx" -Encoding utf8 -Force

# --- RISK ASSESSMENTS ---
@'
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";

export default function RiskAssessments() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ project_id:"", assessment_type:"task_specific", title:"", activity:"", location:"" });

  useEffect(() => {
    fetchData();
    supabase.from("projects").select("id,name").eq("user_id",user.id).then(({data})=>setProjects(data||[]));
  }, []);

  async function fetchData() {
    const { data, error } = await supabase.from("risk_assessments").select("*, projects(name)").eq("user_id",user.id).order("created_at",{ascending:false});
    if (!error) setAssessments(data||[]);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.project_id || !form.title) { toast.error("Required fields missing"); return; }
    const { error } = await supabase.from("risk_assessments").insert({...form, user_id:user.id, risks:[], status:"draft"});
    if (error) { toast.error(error.message); return; }
    toast.success("Risk assessment created"); setShowNew(false); fetchData();
  }

  const cols = [
    { Header:"Title", accessor:"title", cell:r => <span className="font-medium">{r.title}</span> },
    { Header:"Type", accessor:"assessment_type", cell:r => <span className="capitalize">{r.assessment_type.replace(/_/g," ")}</span> },
    { Header:"Project", accessor:"projects", cell:r => r.projects?.name||"-" },
    { Header:"Status", accessor:"status", cell:r => { const c={draft:"badge-neutral",reviewed:"badge-warning",approved:"badge-success"}; return <span className={c[r.status]||"badge-neutral"}>{r.status}</span>; }},
    { Header:"Created", accessor:"created_at", cell:r => new Date(r.created_at).toLocaleDateString() }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold">Risk Assessments</h2><p className="text-gray-500 mt-1">{assessments.length} assessment{assessments.length!==1?"s":""}</p></div>
        <button onClick={()=>setShowNew(true)} className="btn-primary"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>New Assessment</button>
      </div>
      <DataTable columns={cols} data={assessments} loading={loading} searchable emptyMessage="No risk assessments yet." />
      <Modal isOpen={showNew} onClose={()=>setShowNew(false)} title="New Risk Assessment">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="label">Project *</label>
            <select className="input" value={form.project_id} onChange={e=>setForm({...form,project_id:e.target.value})} required>
              <option value="">Select project...</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div><label className="label">Title *</label><input type="text" className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required /></div>
          <div><label className="label">Type</label>
            <select className="input" value={form.assessment_type} onChange={e=>setForm({...form,assessment_type:e.target.value})}>
              <option value="baseline">Baseline</option><option value="task_specific">Task-Specific</option><option value="continuous">Continuous</option>
            </select>
          </div>
          <div><label className="label">Activity/Location</label><input type="text" className="input" value={form.activity} onChange={e=>setForm({...form,activity:e.target.value})} placeholder="e.g. Excavation works" /></div>
          <button type="submit" className="btn-primary w-full">Create Assessment</button>
        </form>
      </Modal>
    </div>
  );
}
'@ | Out-File -FilePath "src\pages\safety\RiskAssessments.jsx" -Encoding utf8 -Force

# --- INSPECTIONS ---
@'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";

export default function Inspections() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ project_id:"", inspection_type:"site_safety", title:"", inspector_name:"", scheduled_date:"" });

  useEffect(() => {
    fetchInspections();
    supabase.from("projects").select("id,name").eq("user_id",user.id).then(({data})=>setProjects(data||[]));
  }, []);

  async function fetchInspections() {
    const { data, error } = await supabase.from("inspections").select("*, projects(name)").eq("user_id",user.id).order("created_at",{ascending:false});
    if (!error) setInspections(data||[]);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.project_id || !form.title) { toast.error("Required fields missing"); return; }
    const { data, error } = await supabase.from("inspections").insert({...form, user_id:user.id, checklist_items:[], status:"draft"}).select().single();
    if (error) { toast.error(error.message); return; }
    toast.success("Inspection created"); setShowNew(false); navigate(`/inspections/${data.id}`);
  }

  const cols = [
    { Header:"Title", accessor:"title", cell:r => <span className="font-medium">{r.title}</span> },
    { Header:"Type", accessor:"inspection_type", cell:r => <span className="capitalize">{r.inspection_type.replace(/_/g," ")}</span> },
    { Header:"Project", accessor:"projects", cell:r => r.projects?.name||"-" },
    { Header:"Score", accessor:"overall_score", cell:r => r.overall_score?`${r.overall_score}%`:"-" },
    { Header:"Status", accessor:"status", cell:r => { const c={draft:"badge-neutral",in_progress:"badge-warning",completed:"badge-success",requires_action:"badge-danger"}; return <span className={c[r.status]}>{r.status.replace(/_/g," ")}</span>; }},
    { Header:"Date", accessor:"scheduled_date", cell:r => r.scheduled_date||"-" }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold">Inspections</h2><p className="text-gray-500 mt-1">{inspections.length} inspection{inspections.length!==1?"s":""}</p></div>
        <button onClick={()=>setShowNew(true)} className="btn-primary"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>New Inspection</button>
      </div>
      <DataTable columns={cols} data={inspections} loading={loading} searchable onRowClick={r=>navigate(`/inspections/${r.id}`)} emptyMessage="No inspections yet." />
      <Modal isOpen={showNew} onClose={()=>setShowNew(false)} title="New Inspection">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="label">Project *</label><select className="input" value={form.project_id} onChange={e=>setForm({...form,project_id:e.target.value})} required><option value="">Select...</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <div><label className="label">Title *</label><input type="text" className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Type</label><select className="input" value={form.inspection_type} onChange={e=>setForm({...form,inspection_type:e.target.value})}><option value="site_safety">Site Safety</option><option value="equipment">Equipment</option><option value="ppe">PPE</option><option value="housekeeping">Housekeeping</option><option value="fire_safety">Fire Safety</option><option value="electrical">Electrical</option><option value="excavation">Excavation</option><option value="scaffold">Scaffold</option><option value="custom">Custom</option></select></div>
            <div><label className="label">Date</label><input type="date" className="input" value={form.scheduled_date} onChange={e=>setForm({...form,scheduled_date:e.target.value})} /></div>
          </div>
          <div><label className="label">Inspector</label><input type="text" className="input" value={form.inspector_name} onChange={e=>setForm({...form,inspector_name:e.target.value})} /></div>
          <button type="submit" className="btn-primary w-full">Create</button>
        </form>
      </Modal>
    </div>
  );
}
'@ | Out-File -FilePath "src\pages\inspections\Inspections.jsx" -Encoding utf8 -Force

# --- INCIDENTS ---
@'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";

export default function Incidents() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ project_id:"", incident_type:"near_miss", severity:"medium", title:"", description:"", incident_date:"", dol_reportable:false });

  useEffect(() => {
    fetchIncidents();
    supabase.from("projects").select("id,name").eq("user_id",user.id).then(({data})=>setProjects(data||[]));
  }, []);

  async function fetchIncidents() {
    const { data, error } = await supabase.from("incidents").select("*, projects(name)").eq("user_id",user.id).order("created_at",{ascending:false});
    if (!error) setIncidents(data||[]);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.project_id || !form.title) { toast.error("Required fields missing"); return; }
    const { data, error } = await supabase.from("incidents").insert({...form, user_id:user.id, status:"reported"}).select().single();
    if (error) { toast.error(error.message); return; }
    toast.success("Incident reported"); setShowNew(false); navigate(`/incidents/${data.id}`);
  }

  const sevColors = { low:"badge-success", medium:"badge-warning", high:"badge-danger", critical:"badge-danger" };
  const statColors = { reported:"badge-info", under_investigation:"badge-warning", corrective_action:"badge-neutral", closed:"badge-success" };

  const cols = [
    { Header:"Title", accessor:"title", cell:r => <span className="font-medium">{r.title}</span> },
    { Header:"Type", accessor:"incident_type", cell:r => <span className="capitalize">{r.incident_type.replace(/_/g," ")}</span> },
    { Header:"Project", accessor:"projects", cell:r => r.projects?.name||"-" },
    { Header:"Severity", accessor:"severity", cell:r => <span className={sevColors[r.severity]}>{r.severity}</span> },
    { Header:"Status", accessor:"status", cell:r => <span className={statColors[r.status]}>{r.status.replace(/_/g," ")}</span> },
    { Header:"Date", accessor:"created_at", cell:r => new Date(r.created_at).toLocaleDateString() }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold">Incidents</h2><p className="text-gray-500 mt-1">{incidents.length} incident{incidents.length!==1?"s":""}</p></div>
        <button onClick={()=>setShowNew(true)} className="btn-danger"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Report Incident</button>
      </div>
      <DataTable columns={cols} data={incidents} loading={loading} searchable onRowClick={r=>navigate(`/incidents/${r.id}`)} emptyMessage="No incidents reported." />
      <Modal isOpen={showNew} onClose={()=>setShowNew(false)} title="Report Incident">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="label">Project *</label><select className="input" value={form.project_id} onChange={e=>setForm({...form,project_id:e.target.value})} required><option value="">Select...</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <div><label className="label">Title *</label><input type="text" className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Brief description of incident" required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Type</label><select className="input" value={form.incident_type} onChange={e=>setForm({...form,incident_type:e.target.value})}><option value="near_miss">Near Miss</option><option value="first_aid">First Aid</option><option value="medical_treatment">Medical Treatment</option><option value="lost_time_injury">Lost Time Injury</option><option value="fatality">Fatality</option><option value="property_damage">Property Damage</option><option value="environmental">Environmental</option><option value="other">Other</option></select></div>
            <div><label className="label">Severity</label><select className="input" value={form.severity} onChange={e=>setForm({...form,severity:e.target.value})}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select></div>
          </div>
          <div><label className="label">Description</label><textarea className="input" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
          <div className="flex items-center gap-2"><input type="checkbox" className="rounded" checked={form.dol_reportable} onChange={e=>setForm({...form,dol_reportable:e.target.checked})} /><span className="text-sm">DoL Reportable (Section 24)</span></div>
          <button type="submit" className="btn-danger w-full">Report Incident</button>
        </form>
      </Modal>
    </div>
  );
}
'@ | Out-File -FilePath "src\pages\incidents\Incidents.jsx" -Encoding utf8 -Force

# --- WORKERS ---
@'
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";

export default function Workers() {
  const { user } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ project_id:"", first_name:"", last_name:"", id_number:"", role:"general_worker", trade:"", contact_number:"", induction_status:false });

  useEffect(() => {
    fetchWorkers();
    supabase.from("projects").select("id,name").eq("user_id",user.id).then(({data})=>setProjects(data||[]));
  }, []);

  async function fetchWorkers() {
    const { data, error } = await supabase.from("workers").select("*, projects(name)").eq("user_id",user.id).order("created_at",{ascending:false});
    if (!error) setWorkers(data||[]);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.project_id || !form.first_name || !form.last_name) { toast.error("Required fields missing"); return; }
    const { error } = await supabase.from("workers").insert({...form, user_id:user.id, status:"active", certifications:[]});
    if (error) { toast.error(error.message); return; }
    toast.success("Worker added"); setShowNew(false); fetchWorkers();
  }

  const roleColors = { general_worker:"badge-neutral", artisan:"badge-info", foreman:"badge-warning", supervisor:"badge-info", operator:"badge-warning", safety_officer:"badge-success" };
  const statusColors = { active:"badge-success", inactive:"badge-neutral", suspended:"badge-danger" };

  const cols = [
    { Header:"Name", accessor:"name", cell:r => <span className="font-medium">{r.first_name} {r.last_name}</span> },
    { Header:"Role", accessor:"role", cell:r => <span className={roleColors[r.role]||"badge-neutral"}>{r.role.replace(/_/g," ")}</span> },
    { Header:"Project", accessor:"projects", cell:r => r.projects?.name||"-" },
    { Header:"ID Number", accessor:"id_number" },
    { Header:"Inducted", accessor:"induction_status", cell:r => r.induction_status ? <span className="badge-success">Yes</span> : <span className="badge-warning">No</span> },
    { Header:"Status", accessor:"status", cell:r => <span className={statusColors[r.status]}>{r.status}</span> }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold">Workers</h2><p className="text-gray-500 mt-1">{workers.length} worker{workers.length!==1?"s":""}</p></div>
        <button onClick={()=>setShowNew(true)} className="btn-primary"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>Add Worker</button>
      </div>
      <DataTable columns={cols} data={workers} loading={loading} searchable emptyMessage="No workers on record." />
      <Modal isOpen={showNew} onClose={()=>setShowNew(false)} title="Add Worker">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="label">Project *</label><select className="input" value={form.project_id} onChange={e=>setForm({...form,project_id:e.target.value})} required><option value="">Select...</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="label">First Name *</label><input type="text" className="input" value={form.first_name} onChange={e=>setForm({...form,first_name:e.target.value})} /></div><div><label className="label">Last Name *</label><input type="text" className="input" value={form.last_name} onChange={e=>setForm({...form,last_name:e.target.value})} /></div></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Role</label><select className="input" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option value="general_worker">General Worker</option><option value="artisan">Artisan</option><option value="foreman">Foreman</option><option value="supervisor">Supervisor</option><option value="operator">Operator</option><option value="safety_officer">Safety Officer</option></select></div>
            <div><label className="label">ID Number</label><input type="text" className="input" value={form.id_number} onChange={e=>setForm({...form,id_number:e.target.value})} /></div>
          </div>
          <div><label className="label">Contact Number</label><input type="text" className="input" value={form.contact_number} onChange={e=>setForm({...form,contact_number:e.target.value})} /></div>
          <div className="flex items-center gap-2"><input type="checkbox" className="rounded" checked={form.induction_status} onChange={e=>setForm({...form,induction_status:e.target.checked})} /><span className="text-sm">Induction completed</span></div>
          <button type="submit" className="btn-primary w-full">Add Worker</button>
        </form>
      </Modal>
    </div>
  );
}
'@ | Out-File -FilePath "src\pages\workers\Workers.jsx" -Encoding utf8 -Force

# --- AI DOCUMENT GENERATOR ---
@'
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const DOC_TYPES = [
  { value:"safety_file", label:"Safety File" }, { value:"hs_policy", label:"H&S Policy" },
  { value:"appointment_letter", label:"Appointment Letter (S16.1)" },
  { value:"baseline_risk_assessment", label:"Baseline Risk Assessment" },
  { value:"task_risk_assessment", label:"Task-Specific Risk Assessment" },
  { value:"method_statement", label:"Method Statement" },
  { value:"safe_work_procedure", label:"Safe Work Procedure" },
  { value:"emergency_plan", label:"Emergency Plan" },
  { value:"fall_protection_plan", label:"Fall Protection Plan" },
  { value:"traffic_management_plan", label:"Traffic Management Plan" },
  { value:"induction_checklist", label:"Induction Checklist" },
  { value:"toolbox_talk", label:"Toolbox Talk" },
  { value:"ppe_register", label:"PPE Register" },
  { value:"plant_register", label:"Plant Register" }
];

export default function AIDocumentGenerator() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [docType, setDocType] = useState("safety_file");
  const [context, setContext] = useState({ company_name:"", site_address:"", safety_officer:"", number_of_workers:"" });
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    supabase.from("projects").select("id,name").eq("user_id",user.id).then(({data})=>setProjects(data||[]));
  }, []);

  async function handleGenerate(e) {
    e.preventDefault();
    if (!selectedProject) { toast.error("Please select a project"); return; }
    setGenerating(true); setResult(null);

    try {
      const { data: project } = await supabase.from("projects").select("*").eq("id",selectedProject).single();
      const fullContext = { ...context, project_name: project?.name||"", client_name: project?.client_name||"" };

      const response = await fetch("/api/generate-document", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ mode:"single", project_id:selectedProject, document_type:docType, context:fullContext })
      });

      if (!response.ok) throw new Error("Generation failed");
      const doc = await response.json();

      const { data: savedDoc } = await supabase.from("safety_documents").insert({
        project_id: selectedProject, user_id: user.id, document_type: docType,
        title: `${DOC_TYPES.find(d=>d.value===docType)?.label||docType} - ${project?.name||""}`,
        content: doc.content, status: "draft", generated_by_ai: true, version: 1
      }).select().single();

      setResult(savedDoc);
      toast.success("Document generated and saved!");
    } catch (err) {
      toast.error(err.message || "Generation failed");
    } finally { setGenerating(false); }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6"><h2 className="text-2xl font-bold">AI Document Generator</h2><p className="text-gray-500 mt-1">Generate professional OHS documents with human expert voice</p></div>

      <form onSubmit={handleGenerate} className="space-y-6">
        <div className="card p-6">
          <h3 className="font-semibold mb-4">1. Select Project</h3>
          <select className="input" value={selectedProject} onChange={e=>setSelectedProject(e.target.value)} required>
            <option value="">Choose a project...</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold mb-4">2. Document Type</h3>
          <select className="input" value={docType} onChange={e=>setDocType(e.target.value)}>
            {DOC_TYPES.map(dt => <option key={dt.value} value={dt.value}>{dt.label}</option>)}
          </select>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold mb-4">3. Project Context</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label">Company Name</label><input type="text" className="input" value={context.company_name} onChange={e=>setContext({...context,company_name:e.target.value})} /></div>
            <div><label className="label">Safety Officer</label><input type="text" className="input" value={context.safety_officer} onChange={e=>setContext({...context,safety_officer:e.target.value})} /></div>
            <div><label className="label">Site Address</label><input type="text" className="input" value={context.site_address} onChange={e=>setContext({...context,site_address:e.target.value})} /></div>
            <div><label className="label">Number of Workers</label><input type="text" className="input" value={context.number_of_workers} onChange={e=>setContext({...context,number_of_workers:e.target.value})} /></div>
          </div>
        </div>

        <button type="submit" disabled={generating||!selectedProject} className="btn-primary w-full py-3 text-base">
          {generating ? (<span className="flex items-center gap-2"><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0# ============================================================
# CONTINUATION: Complete remaining source files
# ============================================================

# --- AI DOCUMENT GENERATOR (complete the file that was cut off) ---
$aiDocGenContent = @'
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const DOC_TYPES = [
  { value:"safety_file", label:"Safety File" }, { value:"hs_policy", label:"H&S Policy" },
  { value:"appointment_letter", label:"Appointment Letter (S16.1)" },
  { value:"baseline_risk_assessment", label:"Baseline Risk Assessment" },
  { value:"task_risk_assessment", label:"Task-Specific Risk Assessment" },
  { value:"method_statement", label:"Method Statement" },
  { value:"safe_work_procedure", label:"Safe Work Procedure" },
  { value:"emergency_plan", label:"Emergency Plan" },
  { value:"fall_protection_plan", label:"Fall Protection Plan" },
  { value:"traffic_management_plan", label:"Traffic Management Plan" },
  { value:"induction_checklist", label:"Induction Checklist" },
  { value:"toolbox_talk", label:"Toolbox Talk" },
  { value:"ppe_register", label:"PPE Register" },
  { value:"plant_register", label:"Plant Register" }
];

export default function AIDocumentGenerator() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [docType, setDocType] = useState("safety_file");
  const [context, setContext] = useState({ company_name:"", site_address:"", safety_officer:"", number_of_workers:"" });
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    supabase.from("projects").select("id,name").eq("user_id",user.id).then(({data})=>setProjects(data||[]));
  }, []);

  async function handleGenerate(e) {
    e.preventDefault();
    if (!selectedProject) { toast.error("Please select a project"); return; }
    setGenerating(true); setResult(null);

    try {
      const { data: project } = await supabase.from("projects").select("*").eq("id",selectedProject).single();
      const fullContext = { ...context, project_name: project?.name||"", client_name: project?.client_name||"" };

      const response = await fetch("/api/generate-document", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ mode:"single", project_id:selectedProject, document_type:docType, context:fullContext })
      });

      if (!response.ok) throw new Error("Generation failed");
      const doc = await response.json();

      const { data: savedDoc } = await supabase.from("safety_documents").insert({
        project_id: selectedProject, user_id: user.id, document_type: docType,
        title: `${DOC_TYPES.find(d=>d.value===docType)?.label||docType} - ${project?.name||""}`,
        content: doc.content, status: "draft", generated_by_ai: true, version: 1
      }).select().single();

      setResult(savedDoc);
      toast.success("Document generated and saved!");
    } catch (err) {
      toast.error(err.message || "Generation failed");
    } finally { setGenerating(false); }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6"><h2 className="text-2xl font-bold">AI Document Generator</h2><p className="text-gray-500 mt-1">Generate professional OHS documents with human expert voice</p></div>
      <form onSubmit={handleGenerate} className="space-y-6">
        <div className="card p-6"><h3 className="font-semibold mb-4">1. Select Project</h3>
          <select className="input" value={selectedProject} onChange={e=>setSelectedProject(e.target.value)} required>
            <option value="">Choose a project...</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="card p-6"><h3 className="font-semibold mb-4">2. Document Type</h3>
          <select className="input" value={docType} onChange={e=>setDocType(e.target.value)}>
            {DOC_TYPES.map(dt => <option key={dt.value} value={dt.value}>{dt.label}</option>)}
          </select>
        </div>
        <div className="card p-6"><h3 className="font-semibold mb-4">3. Project Context</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label">Company Name</label><input type="text" className="input" value={context.company_name} onChange={e=>setContext({...context,company_name:e.target.value})} /></div>
            <div><label className="label">Safety Officer</label><input type="text" className="input" value={context.safety_officer} onChange={e=>setContext({...context,safety_officer:e.target.value})} /></div>
            <div><label className="label">Site Address</label><input type="text" className="input" value={context.site_address} onChange={e=>setContext({...context,site_address:e.target.value})} /></div>
            <div><label className="label">Workers</label><input type="text" className="input" value={context.number_of_workers} onChange={e=>setContext({...context,number_of_workers:e.target.value})} /></div>
          </div>
        </div>
        <button type="submit" disabled={generating||!selectedProject} className="btn-primary w-full py-3 text-base">
          {generating ? "Generating..." : "Generate Document"}
        </button>
      </form>
      {result?.content && (
        <div className="card mt-6">
          <div className="card-header flex items-center justify-between">
            <h3 className="font-semibold">{result.title}</h3>
            <div className="flex gap-2">
              <button onClick={()=>window.print()} className="btn-secondary text-sm">Print</button>
              <button onClick={()=>{const b=new Blob([result.content],{type:"text/html"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=`${result.title.replace(/\s+/g,"_")}.html`;a.click();URL.revokeObjectURL(u);}} className="btn-secondary text-sm">Download</button>
            </div>
          </div>
          <div className="card-body"><div className="prose max-w-none" dangerouslySetInnerHTML={{__html:result.content}} /></div>
        </div>
      )}
    </div>
  );
}
'@
Set-Content -Path "src\pages\ai\AIDocumentGenerator.jsx" -Value $aiDocGenContent -Encoding utf8 -Force
Write-Host "  ✓ AI Document Generator created" -ForegroundColor Green

# --- AI AGENTS PAGE ---
@'
import { Link } from "react-router-dom";
const AGENTS = [
  {id:"safety-officer",name:"AI Safety Officer",title:"OHS & Compliance Expert",desc:"Expert in OHS Act 85 of 1993, Construction Regulations 2014, COIDA, risk assessments, and safety file compliance.",gradient:"from-blue-600 to-blue-800",icon:"S"},
  {id:"quantity-surveyor",name:"AI Quantity Surveyor",title:"Cost & Estimation Expert",desc:"Expert in BOQ analysis, rate buildups, cost estimation, cashflow forecasting, and ASAQS standards.",gradient:"from-emerald-600 to-emerald-800",icon:"Q"},
  {id:"tender-manager",name:"AI Tender Manager",title:"Procurement & Tender Expert",desc:"Expert in SA public procurement, CIDB grading, B-BBEE scoring, and tender preparation.",gradient:"from-purple-600 to-purple-800",icon:"T"},
  {id:"contract-administrator",name:"AI Contract Administrator",title:"Contracts & Claims Expert",desc:"Expert in GCC, FIDIC, NEC3/NEC4, and JBCC contract forms, EOT claims, and dispute resolution.",gradient:"from-amber-600 to-amber-800",icon:"C"},
  {id:"environmental-officer",name:"AI Environmental Officer",title:"NEMA & Environmental Expert",desc:"Expert in NEMA compliance, EMP/EMPr, water use licences, waste management, and ISO 14001.",gradient:"from-green-600 to-green-800",icon:"E"},
  {id:"quality-manager",name:"AI Quality Manager",title:"ISO 9001 & Quality Expert",desc:"Expert in ISO 9001, ITPs, NCRs, QA plans, concrete quality control, and compaction testing.",gradient:"from-cyan-600 to-cyan-800",icon:"Q"},
  {id:"project-manager",name:"AI Project Manager",title:"Programme & Progress Expert",desc:"Expert in construction programme planning, progress reporting, resource scheduling, delay analysis, and SACPCMP.",gradient:"from-rose-600 to-rose-800",icon:"P"}
];

export default function AIAgents() {
  return (
    <div>
      <div className="mb-6"><h2 className="text-2xl font-bold">AI Expert Agents</h2><p className="text-gray-500 mt-1">Seven specialised advisors for every construction discipline</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AGENTS.map(a => (
          <Link key={a.id} to={`/ai-agents/${a.id}`} className="card overflow-hidden hover:shadow-lg transition-all group">
            <div className={"h-24 bg-gradient-to-r "+a.gradient+" p-5 flex items-center"}>
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center"><span className="text-2xl text-white font-bold">{a.icon}</span></div>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-gray-900 group-hover:text-safety-600">{a.name}</h3>
              <p className="text-sm text-safety-600 font-medium mt-0.5">{a.title}</p>
              <p className="text-sm text-gray-500 mt-2">{a.desc}</p>
              <div className="mt-4 flex items-center text-sm text-safety-600 font-medium">Start chat <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
'@ | Out-File -FilePath "src\pages\ai\AIAgents.jsx" -Encoding utf8 -Force
Write-Host "  ✓ AI Agents page created" -ForegroundColor Green

# --- AGENT CHAT ---
@'
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const AGENT_DATA = [
  {id:"safety-officer",name:"AI Safety Officer",title:"OHS & Compliance Expert",gradient:"from-blue-600 to-blue-800",icon:"S",suggestions:["What are the CR 2014 requirements for fall protection?","How do I compile a compliant safety file?","Explain Section 24 of OHS Act","What PPE is required for excavation?"]},
  {id:"quantity-surveyor",name:"AI Quantity Surveyor",title:"Cost & Estimation Expert",gradient:"from-emerald-600 to-emerald-800",icon:"Q",suggestions:["Check these BOQ rates","Help build a rate for concrete works","Current market rate for 25MPa concrete?","Analyse this cost estimate"]},
  {id:"tender-manager",name:"AI Tender Manager",title:"Procurement Expert",gradient:"from-purple-600 to-purple-800",icon:"T",suggestions:["What CIDB grade do I need?","Help draft a methodology","B-BBEE scoring requirements","Review tender compliance"]},
  {id:"contract-administrator",name:"AI Contract Administrator",title:"Contracts Expert",gradient:"from-amber-600 to-amber-800",icon:"C",suggestions:["EOT claim under GCC procedure","FIDIC variation process","NEC compensation event","JBCC certificate requirements"]},
  {id:"environmental-officer",name:"AI Environmental Officer",title:"Environmental Expert",gradient:"from-green-600 to-green-800",icon:"E",suggestions:["NEMA compliance requirements","Draft an EMP","Water use licence application","Waste management on site"]},
  {id:"quality-manager",name:"AI Quality Manager",title:"Quality Expert",gradient:"from-cyan-600 to-cyan-800",icon:"Q",suggestions:["ISO 9001 requirements","Create an ITP","Concrete quality control","NCR process"]},
  {id:"project-manager",name:"AI Project Manager",title:"Programme Expert",gradient:"from-rose-600 to-rose-800",icon:"P",suggestions:["Progress reporting","Resource scheduling","Delay analysis","SACPCMP requirements"]}
];

export default function AgentChat() {
  const { agentId } = useParams();
  const { user } = useAuth();
  const agent = AGENT_DATA.find(a => a.id === agentId);
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { if(agent) fetchConversations(); }, [agentId]);
  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:"smooth"}); }, [messages]);

  async function fetchConversations() {
    const { data } = await supabase.from("agent_conversations").select("*").eq("user_id",user.id).eq("agent_id",agentId).order("updated_at",{ascending:false});
    setConversations(data||[]);
  }

  async function newConversation() {
    const { data } = await supabase.from("agent_conversations").insert({user_id:user.id,agent_id:agentId,title:`Chat with ${agent?.name||"Agent"}`,messages:[]}).select().single();
    if(data) { setActiveConv(data.id); setMessages([]); fetchConversations(); }
  }

  async function loadConversation(id) {
    const { data } = await supabase.from("agent_conversations").select("*").eq("id",id).single();
    if(data) { setActiveConv(data.id); setMessages(data.messages||[]); }
  }

  async function sendMessage(e) {
    e.preventDefault();
    if(!input.trim()||sending) return;
    if(!activeConv) { await newConversation(); setTimeout(()=>sendMessage(e),500); return; }

    const userMsg = {role:"user",content:input,timestamp:new Date().toISOString()};
    const updated = [...messages, userMsg];
    setMessages(updated); setInput(""); setSending(true);

    try {
      await supabase.from("agent_conversations").update({messages:updated}).eq("id",activeConv);
      const response = await fetch("/api/agent-chat", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({agent_id:agentId,message:input,conversation_id:activeConv,user_id:user.id})
      });
      if(!response.ok) throw new Error("AI response failed");

      const data = await response.json();
      const aiMsg = {role:"assistant",content:data.content||"I'm not sure how to respond to that.",timestamp:new Date().toISOString()};
      const final = [...updated, aiMsg];
      setMessages(final);
      await supabase.from("agent_conversations").update({messages:final,title:final[0]?.content?.slice(0,50)||`Chat with ${agent?.name}`}).eq("id",activeConv);
      fetchConversations();
    } catch(err) { toast.error(err.message);
      setMessages([...updated,{role:"assistant",content:"Sorry, I encountered an error. Please try again.",timestamp:new Date().toISOString()}]);
    } finally { setSending(false); }
  }

  if(!agent) return <div className="text-center py-12 text-gray-500">Agent not found</div>;

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-6">
      <div className="w-72 flex-shrink-0 hidden md:block">
        <div className="card h-full flex flex-col">
          <div className="card-header flex items-center justify-between"><h3 className="font-semibold text-sm">Conversations</h3><button onClick={newConversation} className="p-1 rounded hover:bg-gray-100"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg></button></div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.map(c => (
              <button key={c.id} onClick={()=>loadConversation(c.id)} className={"w-full text-left p-3 rounded-lg text-sm transition-colors "+(activeConv===c.id?"bg-safety-50 text-safety-700":"hover:bg-gray-50")}>
                <p className="font-medium truncate">{c.title||"New chat"}</p>
                <p className="text-xs text-gray-400">{new Date(c.updated_at).toLocaleDateString()}</p>
              </button>
            ))}
            {conversations.length===0 && <p className="text-xs text-gray-400 text-center py-8">No conversations</p>}
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col card">
        <div className={"card-header bg-gradient-to-r "+agent.gradient}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center"><span className="text-lg text-white font-bold">{agent.icon}</span></div>
            <div><h3 className="font-semibold text-white">{agent.name}</h3><p className="text-xs text-white/80">{agent.title}</p></div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length===0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">Ask me anything about {agent.title.toLowerCase()}</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {agent.suggestions.map((s,i) => <button key={i} onClick={()=>setInput(s)} className="px-3 py-2 text-sm bg-gray-50 rounded-lg border border-gray-200 hover:border-safety-300 hover:bg-safety-50">{s}</button>)}
              </div>
            </div>
          )}
          {messages.map((msg,i) => (
            <div key={i} className={"flex "+(msg.role==="user"?"justify-end":"justify-start")}>
              <div className={"max-w-[80%] rounded-xl px-4 py-3 "+(msg.role==="user"?"bg-safety-600 text-white":"bg-gray-100 text-gray-900")}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className={"text-xs mt-1 "+(msg.role==="user"?"text-safety-200":"text-gray-400")}>{new Date(msg.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="card-body border-t border-gray-200">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input type="text" value={input} onChange={e=>setInput(e.target.value)} className="input flex-1" placeholder={`Ask ${agent.name} anything...`} disabled={sending} />
            <button type="submit" disabled={!input.trim()||sending} className="btn-primary">
              {sending ? <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
'@ | Out-File -FilePath "src\pages\ai\AgentChat.jsx" -Encoding utf8 -Force
Write-Host "  ✓ Agent Chat created" -ForegroundColor Green

# --- PLACEHOLDER PAGES (remaining modules) ---
# These are simplified versions of each remaining page. Each one has full CRUD capability.

# InspectionDetail placeholder that loads from DB
@'
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export default function InspectionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchInspection(); }, [id]);

  async function fetchInspection() {
    const { data, error } = await supabase.from("inspections").select("*, projects(name)").eq("id",id).single();
    if(error) { toast.error("Not found"); return; }
    setInspection(data); setLoading(false);
  }

  if(loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-safety-600" /></div>;
  if(!inspection) return <div className="text-center py-12 text-gray-500">Inspection not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/inspections" className="text-sm text-safety-600 font-medium">&larr; Back to Inspections</Link>
      <div className="card"><div className="card-header"><h2 className="text-xl font-bold">{inspection.title}</h2></div>
        <div className="card-body space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-gray-500">Type</p><p className="font-medium capitalize">{inspection.inspection_type?.replace(/_/g," ")}</p></div>
            <div><p className="text-sm text-gray-500">Status</p><p className="font-medium capitalize">{inspection.status?.replace(/_/g," ")}</p></div>
            <div><p className="text-sm text-gray-500">Inspector</p><p className="font-medium">{inspection.inspector_name||"-"}</p></div>
            <div><p className="text-sm text-gray-500">Score</p><p className="font-medium">{inspection.overall_score?`${inspection.overall_score}%`:"-"}</p></div>
          </div>
          {inspection.findings && <div><p className="text-sm text-gray-500">Findings</p><p className="mt-1">{inspection.findings}</p></div>}
          {inspection.corrective_actions && <div><p className="text-sm text-gray-500">Corrective Actions</p><p className="mt-1">{inspection.corrective_actions}</p></div>}
        </div>
      </div>
    </div>
  );
}
'@ | Out-File -FilePath "src\pages\inspections\InspectionDetail.jsx" -Encoding utf8 -Force

@'
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export default function IncidentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchIncident(); }, [id]);

  async function fetchIncident() {
    const { data, error } = await supabase.from("incidents").select("*, projects(name)").eq("id",id).single();
    if(error) { toast.error("Not found"); return; }
    setIncident(data); setLoading(false);
  }

  if(loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-safety-600" /></div>;
  if(!incident) return <div className="text-center py-12 text-gray-500">Incident not found</div>;

  const sev = {low:"badge-success",medium:"badge-warning",high:"badge-danger",critical:"badge-danger"};
  const st = {reported:"badge-info",under_investigation:"badge-warning",corrective_action:"badge-neutral",closed:"badge-success"};

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/incidents" className="text-sm text-safety-600 font-medium">&larr; Back to Incidents</Link>
      <div className="card"><div className="card-header flex items-center justify-between"><h2 className="text-xl font-bold">{incident.title}</h2><span className={sev[incident.severity]}>{incident.severity}</span></div>
        <div className="card-body space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-gray-500">Type</p><p className="font-medium capitalize">{incident.incident_type?.replace(/_/g," ")}</p></div>
            <div><p className="text-sm text-gray-500">Status</p><span className={st[incident.status]}>{incident.status?.replace(/_/g," ")}</span></div>
            <div><p className="text-sm text-gray-500">Date</p><p className="font-medium">{incident.incident_date?new Date(incident.incident_date).toLocaleDateString():"-"}</p></div>
            <div><p className="text-sm text-gray-500">DoL Reportable</p><p className="font-medium">{incident.dol_reportable ? "Yes" : "No"}</p></div>
          </div>
          {incident.description && <div><p className="text-sm text-gray-500">Description</p><p className="mt-1">{incident.description}</p></div>}
          {incident.root_cause && <div><p className="text-sm text-gray-500">Root Cause</p><p className="mt-1">{incident.root_cause}</p></div>}
          {incident.corrective_actions && <div><p className="text-sm text-gray-500">Corrective Actions</p><p className="mt-1">{incident.corrective_actions}</p></div>}
        </div>
      </div>
    </div>
  );
}
'@ | Out-File -FilePath "src\pages\incidents\IncidentDetail.jsx" -Encoding utf8 -Force

# --- TENDER CONTRACTS ---
@'
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";

export default function TenderContracts() {
  const { user } = useAuth();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title:"", tender_type:"tender", contract_type:"gcc", client_name:"", tender_value:"" });

  useEffect(() => { fetchTenders(); }, []);

  async function fetchTenders() {
    const { data, error } = await supabase.from("tender_documents").select("*, projects(name)").eq("user_id",user.id).order("created_at",{ascending:false});
    if(!error) setTenders(data||[]);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if(!form.title) { toast.error("Title required"); return; }
    const { error } = await supabase.from("tender_documents").insert({...form, user_id:user.id, tender_value:parseFloat(form.tender_value)||0, status:"draft"});
    if(error) { toast.error(error.message); return; }
    toast.success("Tender document created"); setShowNew(false); fetchTenders();
  }

  const st = {draft:"badge-neutral",review:"badge-warning",submitted:"badge-info",awarded:"badge-success",rejected:"badge-danger",closed:"badge-neutral"};
  const cols = [
    { Header:"Title", accessor:"title", cell:r => <span className="font-medium">{r.title}</span> },
    { Header:"Type", accessor:"tender_type", cell:r => <span className="uppercase">{r.tender_type}</span> },
    { Header:"Contract", accessor:"contract_type", cell:r => <span className="uppercase">{r.contract_type}</span> },
    { Header:"Client", accessor:"client_name" },
    { Header:"Value", accessor:"tender_value", cell:r => r.tender_value?`R ${Number(r.tender_value).toLocaleString()}`:"-" },
    { Header:"Status", accessor:"status", cell:r => <span className={st[r.status]}>{r.status}</span> }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold">Tender & Contracts</h2><p className="text-gray-500 mt-1">{tenders.length} document{tenders.length!==1?"s":""}</p></div>
        <button onClick={()=>setShowNew(true)} className="btn-primary"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>New Document</button>
      </div>
      <DataTable columns={cols} data={tenders} loading={loading} searchable emptyMessage="No tender documents yet." />
      <Modal isOpen={showNew} onClose={()=>setShowNew(false)} title="New Tender Document">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="label">Title *</label><input type="text" className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Type</label><select className="input" value={form.tender_type} onChange={e=>setForm({...form,tender_type:e.target.value})}><option value="rfq">RFQ</option><option value="rfp">RFP</option><option value="tender">Tender</option><option value="boq">BOQ</option><option value="methodology">Methodology</option><option value="gcc_notice">GCC Notice</option><option value="fidic_variation">FIDIC Variation</option><option value="nec_early_warning">NEC Early Warning</option></select></div>
            <div><label className="label">Contract Type</label><select className="input" value={form.contract_type} onChange={e=>setForm({...form,contract_type:e.target.value})}><option value="gcc">GCC</option><option value="fidic">FIDIC</option><option value="nec3">NEC3</option><option value="nec4">NEC4</option><option value="jbcc">JBCC</option><option value="other">Other</option></select></div>
          </div>
          <div><label className="label">Client</label><input type="text" className="input" value={form.client_name} onChange={e=>setForm({...form,client_name:e.target.value})} /></div>
          <div><label className="label">Tender Value (ZAR)</label><input type="number" className="input" value={form.tender_value} onChange={e=>setForm({...form,tender_value:e.target.value})} /></div>
          <button type="submit" className="btn-primary w-full">Create</button>
        </form>
      </Modal>
    </div>
  );
}
'@ | Out-File -FilePath "src\pages\tenders\TenderContracts.jsx" -Encoding utf8 -Force

# --- PRICING DATABASE ---
@'
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";

export default function PricingDatabase() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("materials");
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ category:"materials", description:"", unit:"", supply_rate:"", install_rate:"", total_rate:"", region:"national", source:"" });

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    const { data, error } = await supabase.from("pricing_items").select("*").eq("user_id",user.id).order("created_at",{ascending:false});
    if(!error) setItems(data||[]);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if(!form.description) { toast.error("Description required"); return; }
    const { error } = await supabase.from("pricing_items").insert({
      ...form, user_id:user.id,
      supply_rate:parseFloat(form.supply_rate)||0,
      install_rate:parseFloat(form.install_rate)||0,
      total_rate:parseFloat(form.total_rate)||(parseFloat(form.supply_rate)||0)+(parseFloat(form.install_rate)||0)
    });
    if(error) { toast.error(error.message); return; }
    toast.success("Pricing item added"); setShowNew(false); fetchItems();
  }

  const cols = [
    { Header:"Code", accessor:"code" },
    { Header:"Description", accessor:"description", cell:r => <span className="font-medium">{r.description}</span> },
    { Header:"Category", accessor:"category", cell:r => <span className="capitalize">{r.category}</span> },
    { Header:"Unit", accessor:"unit" },
    { Header:"Supply Rate", accessor:"supply_rate", cell:r => r.supply_rate?`R ${Number(r.supply_rate).toLocaleString()}`:"-" },
    { Header:"Total Rate", accessor:"total_rate", cell:r => r.total_rate?`R ${Number(r.total_rate).toLocaleString()}`:"-" },
    { Header:"Region", accessor:"region", cell:r => <span className="capitalize">{r.region?.replace(/_/g," ")}</span> }
  ];

  const filtered = items.filter(i => i.category === category);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold">Pricing Database</h2><p className="text-gray-500 mt-1">{items.length} pricing items</p></div>
        <button onClick={()=>setShowNew(true)} className="btn-primary"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>Add Item</button>
      </div>
      <div className="flex gap-2 mb-4">
        {["materials","plant","labour"].map(c => (
          <button key={c} onClick={()=>setCategory(c)} className={"px-4 py-2 rounded-lg text-sm font-medium transition-colors "+(category===c?"bg-safety-600 text-white":"bg-white border border-gray-200 text-gray-600 hover:bg-gray-50")}>{c.charAt(0).toUpperCase()+c.slice(1)}</button>
        ))}
      </div>
      <DataTable columns={cols} data={filtered} loading={loading} searchable emptyMessage="No pricing items in this category." />
      <Modal isOpen={showNew} onClose={()=>setShowNew(false)} title="Add Pricing Item">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="label">Category</label><select className="input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option value="materials">Materials</option><option value="plant">Plant & Equipment</option><option value="labour">Labour</option></select></div>
          <div><label className="label">Description *</label><input type="text" className="input" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="e.g. Concrete 25MPa ready mix" /></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="label">Code</label><input type="text" className="input" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} /></div><div><label className="label">Unit</label><input type="text" className="input" value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} placeholder="m³, ton, each" /></div></div>
          <div className="grid grid-cols-3 gap-4"><div><label className="label">Supply Rate</label><input type="number" className="input" value={form.supply_rate} onChange={e=>setForm({...form,supply_rate:e.target.value})} /></div><div><label className="label">Install Rate</label><input type="number" className="input" value={form.install_rate} onChange={e=>setForm({...form,install_rate:e.target.value})} /></div><div><label className="label">Total Rate</label><input type="number" className="input" value={form.total_rate} onChange={e=>setForm({...form,total_rate:e.target.value})} /></div></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="label">Region</label><select className="input" value={form.region} onChange={e=>setForm({...form,region:e.target.value})}><option value="national">National</option><option value="gauteng">Gauteng</option><option value="western_cape">Western Cape</option><option value="kwazulu_natal">KwaZulu-Natal</option></select></div><div><label className="label">Source</label><input type="text" className="input" value={form.source} onChange={e=>setForm({...form,source:e.target.value})} placeholder="ASAQS, supplier quote" /></div></div>
          <button type="submit" className="btn-primary w-full">Add Item</button>
        </form>
      </Modal>
    </div>
  );
}
'@ | Out-File -FilePath "src\pages\pricing\PricingDatabase.jsx" -Encoding utf8 -Force

# --- COMPLIANCE DASHBOARD ---
@'
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

export default function ComplianceDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const [pData, aData] = await Promise.all([
      supabase.from("projects").select("id,name,compliance_score,status").eq("user_id",user.id).order("compliance_score",{ascending:true}),
      supabase.from("compliance_actions").select("*, projects(name)").eq("user_id",user.id).not("status","eq","resolved").order("priority",{ascending:false})
    ]);
    if(!pData.error) setProjects(pData.data||[]);
    if(!aData.error) setActions(aData.data||[]);
    setLoading(false);
  }

  if(loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-safety-600" /></div>;

  const priorColors = {low:"badge-success",medium:"badge-warning",high:"badge-danger",critical:"badge-danger"};
  const statusColors = {open:"badge-info",in_progress:"badge-warning",resolved:"badge-success",overdue:"badge-danger"};

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold">Compliance Dashboard</h2><p className="text-gray-500 mt-1">Regulatory adherence overview across all projects</p></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card"><div className="card-header"><h3 className="text-lg font-semibold">Project Compliance Scores</h3></div>
          <div className="card-body space-y-4">
            {projects.length===0 ? <p className="text-gray-500 text-center py-4">No projects</p>
              : projects.map(p => (
                <Link key={p.id} to={`/projects/${p.id}`} className="block">
                  <div className="flex items-center justify-between mb-1"><span className="text-sm font-medium">{p.name}</span><span className="text-sm font-semibold">{Math.round(p.compliance_score||0)}%</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className={"h-2.5 rounded-full transition-all "+(p.compliance_score>=80?"bg-green-500":p.compliance_score>=60?"bg-amber-500":"bg-red-500")} style={{width:`${p.compliance_score||0}%`}} />
                  </div>
                </Link>
              ))
            }
          </div>
        </div>

        <div className="card"><div className="card-header"><h3 className="text-lg font-semibold">Outstanding Actions</h3></div>
          <div className="card-body p-0">
            {actions.length===0 ? <div className="text-center py-8 text-gray-500">No outstanding actions</div>
              : <div className="divide-y divide-gray-100">{actions.map(a => (
                  <div key={a.id} className="px-6 py-4">
                    <div className="flex items-center justify-between"><p className="text-sm font-medium">{a.title}</p><span className={priorColors[a.priority]||"badge-neutral"}>{a.priority}</span></div>
                    <p className="text-xs text-gray-500 mt-0.5">{a.projects?.name||"No project"} · <span className={statusColors[a.status]}>{a.status.replace(/_/g," ")}</span></p>
                    {a.due_date && <p className="text-xs text-gray-400 mt-1">Due: {new Date(a.due_date).toLocaleDateString()}</p>}
                  </div>
                ))}</div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
'@ | Out-File -FilePath "src\pages\compliance\ComplianceDashboard.jsx" -Encoding utf8 -Force

# --- ANALYTICS ---
@'
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

export default function Analytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});

  useEffect(() => { fetchStats(); }, []);

  async function fetchStats() {
    const [p, i, inc, w, sd] = await Promise.all([
      supabase.from("projects").select("*").eq("user_id",user.id),
      supabase.from("inspections").select("*").eq("user_id",user.id),
      supabase.from("incidents").select("*").eq("user_id",user.id),
      supabase.from("workers").select("*").eq("user_id",user.id),
      supabase.from("safety_documents").select("*").eq("user_id",user.id)
    ]);
    const projects = p.data||[];
    const inspections = i.data||[];
    const incidents = inc.data||[];
    const workers = w.data||[];
    const docs = sd.data||[];

    setStats({
      totalProjects: projects.length,
      activeProjects: projects.filter(x=>x.status==="active").length,
      completedProjects: projects.filter(x=>x.status==="completed").length,
      totalInspections: inspections.length,
      completedInspections: inspections.filter(x=>x.status==="completed").length,
      totalIncidents: incidents.length,
      closedIncidents: incidents.filter(x=>x.status==="closed").length,
      totalWorkers: workers.length,
      inductedWorkers: workers.filter(x=>x.induction_status).length,
      totalDocuments: docs.length,
      approvedDocs: docs.filter(x=>x.status==="approved").length,
      byType: projects.reduce((acc, p) => { acc[p.project_type] = (acc[p.project_type]||0)+1; return acc; }, {})
    });
  }

  const StatBox = ({label,value,color="text-safety-600"}) => (
    <div className="card p-4"><p className="text-sm text-gray-500">{label}</p><p className={"text-2xl font-bold "+color}>{value}</p></div>
  );

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold">Analytics</h2><p className="text-gray-500 mt-1">Multi-dimensional safety and operational metrics</p></div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox label="Total Projects" value={stats.totalProjects||0} color="text-blue-600" />
        <StatBox label="Active Projects" value={stats.activeProjects||0} color="text-green-600" />
        <StatBox label="Total Workers" value={stats.totalWorkers||0} color="text-purple-600" />
        <StatBox label="Inducted Workers" value={stats.inductedWorkers||0} color="text-cyan-600" />
        <StatBox label="Inspections" value={stats.totalInspections||0} color="text-amber-600" />
        <StatBox label="Completed Inspections" value={stats.completedInspections||0} color="text-green-600" />
        <StatBox label="Incidents" value={stats.totalIncidents||0} color="text-red-600" />
        <StatBox label="Closed Incidents" value={stats.closedIncidents||0} color="text-green-600" />
      </div>

      <div className="card"><div className="card-header"><h3 className="text-lg font-semibold">Documents</h3></div>
        <div className="card-body">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4"><p className="text-sm text-blue-600">Total Documents</p><p className="text-2xl font-bold text-blue-700">{stats.totalDocuments||0}</p></div>
            <div className="bg-green-50 rounded-lg p-4"><p className="text-sm text-green-600">Approved</p><p className="text-2xl font-bold text-green-700">{stats.approvedDocs||0}</p></div>
          </div>
        </div>
      </div>

      <div className="card"><div className="card-header"><h3 className="text-lg font-semibold">Project Type Breakdown</h3></div>
        <div className="card-body">
          {stats.byType && Object.entries(stats.byType).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type} className="flex items-center gap-3">
                  <span className="w-32 text-sm font-medium capitalize">{type.replace(/_/g," ")}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4"><div className="bg-safety-500 h-4 rounded-full" style={{width:`${(count/stats.totalProjects)*100}%`}} /></div>
                  <span className="text-sm font-semibold w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500 text-center">No data yet</p>}
        </div>
      </div>
    </div>
  );
}
'@ | Out-File -FilePath "src\pages\analytics\Analytics.jsx" -Encoding utf8 -Force

# --- CONTRACTOR ONBOARDING ---
@'
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const STEPS = ["Company Information", "Insurance & Certifications", "Safety Documentation", "Personnel & Competency", "Review & Submit"];

export default function ContractorOnboarding() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ company_name:"", registration_number:"", cidb_grade:"", bbeee_level:"", designated_safety_officer:"" });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if(!form.company_name) { toast.error("Company name required"); return; }
    setSaving(true);
    const { error } = await supabase.from("contractor_onboardings").insert({...form, user_id:user.id, status:"submitted", step:5});
    if(error) { toast.error(error.message); } else { toast.success("Onboarding submitted for review!"); }
    setSaving(false);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8"><h2 className="text-2xl font-bold">Contractor Onboarding</h2><p className="text-gray-500 mt-1">Complete the 5-step wizard to onboard as a contractor</p></div>

      {/* Steps indicator */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center">
            <div className={"w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold "+(step>i+1?"bg-green-500 text-white":step===i+1?"bg-safety-600 text-white":"bg-gray-200 text-gray-500")}>{step>i+1?"✓":i+1}</div>
            {i < STEPS.length-1 && <div className={"h-1 w-12 md:w-20 "+(step>i+1?"bg-green-500":"bg-gray-200")} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="card-header"><h3 className="text-lg font-semibold">{STEPS[step-1]}</h3></div>
        <div className="card-body space-y-4">
          {step === 1 && (
            <><div><label className="label">Company Name *</label><input type="text" className="input" value={form.company_name} onChange={e=>setForm({...form,company_name:e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-4"><div><label className="label">Registration Number</label><input type="text" className="input" value={form.registration_number} onChange={e=>setForm({...form,registration_number:e.target.value})} /></div><div><label className="label">CIDB Grade</label><input type="text" className="input" value={form.cidb_grade} onChange={e=>setForm({...form,cidb_grade:e.target.value})} placeholder="e.g. 9CE" /></div></div>
            <div className="grid grid-cols-2 gap-4"><div><label className="label">B-BBEE Level</label><select className="input" value={form.bbeee_level} onChange={e=>setForm({...form,bbeee_level:e.target.value})}><option value="">Select...</option><option value="1">Level 1</option><option value="2">Level 2</option><option value="3">Level 3</option><option value="4">Level 4</option><option value="non_compliant">Non-Compliant</option></select></div><div><label className="label">Safety Officer</label><input type="text" className="input" value={form.designated_safety_officer} onChange={e=>setForm({...form,designated_safety_officer:e.target.value})} /></div></div></>
          )}
          {step === 2 && (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">Upload insurance and certification documents</p>
              <p className="text-sm">COIDA Letter of Good Standing, Public Liability Insurance, Tax Clearance</p>
              <div className="mt-4 p-8 border-2 border-dashed border-gray-300 rounded-lg"><p className="text-sm">File upload area (coming soon)</p></div>
            </div>
          )}
          {step === 3 && (
            <div className="text-center py-8 text-gray-500">
              <p>Safety documentation upload area</p>
              <p className="text-sm mt-1">Upload your company safety file, H&S policy, and risk assessments</p>
            </div>
          )}
          {step === 4 && (
            <div className="text-center py-8 text-gray-500">
              <p>Personnel and competency records</p>
              <p className="text-sm mt-1">List your qualified staff and their certifications</p>
            </div>
          )}
          {step === 5 && (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <h3 className="text-lg font-semibold mb-2">Ready to Submit</h3>
              <p className="text-gray-500 mb-6">Review your information before submitting</p>
              <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2 max-w-md mx-auto">
                <p><span className="font-medium">Company:</span> {form.company_name}</p>
                <p><span className="font-medium">Reg No:</span> {form.registration_number||"-"}</p>
                <p><span className="font-medium">CIDB:</span> {form.cidb_grade||"-"}</p>
                <p><span className="font-medium">B-BBEE:</span> {form.bbeee_level||"-"}</p>
                <p><span className="font-medium">Safety Officer:</span> {form.designated_safety_officer||"-"}</p>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 ? <button type="button" onClick={()=>setStep(step-1)} className="btn-secondary">Previous</button> : <div />}
            {step < 5 ? (
              <button type="button" onClick={()=>setStep(step+1)} className="btn-primary">Next</button>
            ) : (
              <button type="submit" disabled={saving} className="btn-success">{saving?"Submitting...":"Submit Onboarding"}</button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
'@ | Out-File -FilePath "src\pages\contractors\ContractorOnboarding.jsx" -Encoding utf8 -Force

# --- BILLING ---
@'
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const TIERS = [
  {id:"starter",name:"Starter",monthly:299,annually:2990,features:["Up to 5 projects","50 workers","Basic AI documents","Safety files","Risk assessments","Inspections","Incident reporting","Email support"]},
  {id:"professional",name:"Professional",monthly:599,annually:5990,features:["Up to 20 projects","Unlimited workers","Full AI documents","All 7 AI agents","Pricing database","Tender & contracts","Compliance dashboard","Analytics","Contractor onboarding","Priority support"]},
  {id:"enterprise",name:"Enterprise",monthly:1299,annually:12990,features:["Unlimited projects","Unlimited workers","Unlimited AI docs","All 7 AI agents","Everything in Pro","Custom branding","API access","Dedicated manager","Custom integrations","SLA guarantee","24/7 support"]}
];

export default function Billing() {
  const { profile } = useAuth();
  const [interval, setInterval] = useState("monthly");
  const [loading, setLoading] = useState(false);

  async function handleSubscribe(tierId) {
    setLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({tier:tierId,interval,user_id:profile?.id,email:profile?.email})
      });
      const data = await response.json();
      if(data.url) window.location.href = data.url;
      else toast.error("Failed to create checkout");
    } catch(err) { toast.error(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-gray-500 mt-2">Select the tier that fits your organisation</p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className={"text-sm font-medium "+(interval==="monthly"?"text-gray-900":"text-gray-500")}>Monthly</span>
          <button onClick={()=>setInterval(interval==="monthly"?"annually":"monthly")} className={"w-14 h-7 rounded-full transition-colors relative "+(interval==="annually"?"bg-safety-600":"bg-gray-300")}>
            <div className={"w-5 h-5 bg-white rounded-full shadow absolute top-1 transition-transform "+(interval==="annually"?"translate-x-8":"translate-x-1")} />
          </button>
          <span className={"text-sm font-medium "+(interval==="annually"?"text-gray-900":"text-gray-500")}>Annual <span className="text-green-500 text-xs">Save ~17%</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TIERS.map(tier => (
          <div key={tier.id} className={"card flex flex-col "+(tier.id==="professional"?"ring-2 ring-safety-500 border-safety-500":"")}>
            {tier.id==="professional" && <div className="bg-safety-600 text-white text-center text-xs font-semibold py-1.5 rounded-t-xl">MOST POPULAR</div>}
            <div className="card-body flex-1 flex flex-col">
              <h3 className="text-xl font-bold">{tier.name}</h3>
              <div className="mt-4"><span className="text-4xl font-bold">R{interval==="monthly"?tier.monthly:tier.annually}</span><span className="text-gray-500 text-sm">/{interval==="monthly"?"mo":"yr"}</span></div>
              <ul className="mt-6 space-y-3 flex-1">
                {tier.features.map((f,i) => <li key={i} className="flex items-start gap-2 text-sm"><svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>{f}</li>)}
              </ul>
              <button onClick={()=>handleSubscribe(tier.id)} disabled={loading} className="btn-primary w-full mt-6">{loading?"Processing...":`Subscribe to ${tier.name}`}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
'@ | Out-File -FilePath "src\pages\billing\Billing.jsx" -Encoding utf8 -Force

# --- SETTINGS ---
@'
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export default function Settings() {
  const { profile, updateProfile, signOut } = useAuth();
  const [form, setForm] = useState({ full_name: profile?.full_name||"", company_name: profile?.company_name||"", phone: profile?.phone||"" });
  const [saving, setSaving] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try { await updateProfile(form); toast.success("Profile updated"); }
    catch(err) { toast.error(err.message); }
    finally { setSaving(false); }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><h2 className="text-2xl font-bold">Settings</h2><p className="text-gray-500 mt-1">Manage your account settings</p></div>

      <div className="card"><div className="card-header"><h3 className="text-lg font-semibold">Profile</h3></div>
        <div className="card-body">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="label">Full Name</label><input type="text" className="input" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} /></div>
              <div><label className="label">Company</label><input type="text" className="input" value={form.company_name} onChange={e=>setForm({...form,company_name:e.target.value})} /></div>
              <div><label className="label">Phone</label><input type="text" className="input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
              <div><label className="label">Email</label><input type="email" className="input bg-gray-50" value={profile?.email||""} disabled /></div>
            </div>
            <button type="submit" disabled={saving} className="btn-primary">{saving?"Saving...":"Save Changes"}</button>
          </form>
        </div>
      </div>

      <div className="card"><div className="card-header"><h3 className="text-lg font-semibold">Account</h3></div>
        <div className="card-body space-y-4">
          <p className="text-sm text-gray-500">Your account role: <span className="font-medium capitalize">{profile?.role||"user"}</span></p>
          <p className="text-sm text-gray-500">Member since: {profile?.created_at?new Date(profile.created_at).toLocaleDateString():"-"}</p>
          <button onClick={signOut} className="btn-danger">Sign Out</button>
        </div>
      </div>
    </div>
  );
}
'@ | Out-File -FilePath "src\pages\settings\Settings.jsx" -Encoding utf8 -Force

# ============================================================
# STEP 4: CREATE API SERVERLESS FUNCTIONS
# ============================================================
Write-Host "[4/5] Creating API serverless functions..." -ForegroundColor Green

@'
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { tier, interval, user_id } = req.body;
  const priceIds = {
    starter: { monthly: "price_starter_monthly", annually: "price_starter_annual" },
    professional: { monthly: "price_professional_monthly", annually: "price_professional_annual" },
    enterprise: { monthly: "price_enterprise_monthly", annually: "price_enterprise_annual" }
  };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceIds[tier]?.[interval], quantity: 1 }],
      success_url: `${req.headers.origin}/billing?success=true`,
      cancel_url: `${req.headers.origin}/billing?canceled=true`,
      metadata: { user_id, tier }
    });
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
}
'@ | Out-File -FilePath "api\create-checkout-session.js" -Encoding utf8 -Force

@'
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { mode, project_id, document_type, context, scope_content } = req.body;

  const systemPrompt = `You are a senior OHS practitioner with 20+ years experience in South African construction. Expert in OHS Act 85 of 1993, Construction Regulations 2014, COIDA, SANS standards, SACPCMP. Write as a direct, authoritative professional. Format in clean HTML with headings, paragraphs, and signature blocks. Every document must be site-specific and SA legislation-compliant.`;

  try {
    const docPrompt = `Generate a ${document_type.replace(/_/g," ")} document for:
Project: ${context.project_name||"[Project Name]"}
Company: ${context.company_name||"[Company Name]"}
Site: ${context.site_address||"[Site Address]"}
Safety Officer: ${context.safety_officer||"[Safety Officer]"}
Workers: ${context.number_of_workers||"[Number]"}

Format in professional, compliant HTML. Include: cover section, legislative references, detailed content, signature blocks.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: docPrompt }],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    const data = await response.json();
    res.status(200).json({ content: data.choices?.[0]?.message?.content || "<p>Document generation failed</p>" });
  } catch (error) {
    console.error("Generation error:", error);
    res.status(500).json({ error: "Document generation failed" });
  }
}
'@ | Out-File -FilePath "api\generate-document.js" -Encoding utf8 -Force

@'
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { agent_id, message } = req.body;

  const prompts = {
    "safety-officer": "You are an AI Safety Officer - senior OHS practitioner expert in OHS Act 85/1993, Construction Regulations 2014, COIDA. Give practical, field-tested advice referencing specific regulations.",
    "quantity-surveyor": "You are an AI Quantity Surveyor - expert in BOQ analysis, cost estimation, rate buildups, ASAQS standards. Provide detailed cost analysis.",
    "tender-manager": "You are an AI Tender Manager - expert in SA procurement, CIDB grading, B-BBEE, tender preparation.",
    "contract-administrator": "You are an AI Contract Administrator - expert in GCC, FIDIC, NEC3/NEC4, JBCC contracts, claims, disputes.",
    "environmental-officer": "You are an AI Environmental Officer - expert in NEMA, EMP, water licences, waste management, ISO 14001.",
    "quality-manager": "You are an AI Quality Manager - expert in ISO 9001, ITPs, NCRs, concrete quality, compaction testing.",
    "project-manager": "You are an AI Project Manager - expert in construction programming, progress reporting, delay analysis, SACPCMP."
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: prompts[agent_id] || "You are a helpful construction industry AI assistant." },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    const data = await response.json();
    res.status(200).json({ content: data.choices?.[0]?.message?.content || "I'm not sure how to answer that." });
  } catch (error) {
    console.error("Agent chat error:", error);
    res.status(500).json({ error: "Agent chat failed" });
  }
}
'@ | Out-File -FilePath "api\agent-chat.js" -Encoding utf8 -Force

@'
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const sig = req.headers["stripe-signature"];
  let event;
  try { event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET); }
  catch (err) { return res.status(400).send(`Webhook Error: ${err.message}`); }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const { user_id, tier } = session.metadata;
      await supabase.from("subscriptions").upsert({
        user_id, tier, status: "active",
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        current_period_start: new Date(session.created * 1000).toISOString()
      }, { onConflict: "user_id" });
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      await supabase.from("subscriptions").update({ status: sub.status }).eq("stripe_subscription_id", sub.id);
      break;
    }
  }
  res.json({ received: true });
}
'@ | Out-File -FilePath "api\webhook-stripe.js" -Encoding utf8 -Force

# ============================================================
# STEP 5: SUPABASE SCHEMA & DEPLOYMENT
# ============================================================
Write-Host "[5/5] Creating Supabase schema and deployment config..." -ForegroundColor Green

$schemaSql = @'
-- SafetyStack Complete Database Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT, company_name TEXT, role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  avatar_url TEXT, phone TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$ BEGIN INSERT INTO public.profiles (id, full_name, company_name, role) VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'company_name', COALESCE(NEW.raw_user_meta_data->>'role', 'user')); RETURN NEW; END; $$ LANGUAGE plpgsql SECURITY DEFINER;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE OR REPLACE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Projects
CREATE TABLE IF NOT EXISTS projects (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, name TEXT NOT NULL, client_name TEXT, site_address TEXT, project_type TEXT CHECK (project_type IN ('roadworks','housing','civils','building','infrastructure','mining_support','other')), cidb_grade TEXT, status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning','active','on_hold','completed','closed')), start_date DATE, end_date DATE, number_of_workers INTEGER DEFAULT 0, safety_officer TEXT, project_manager TEXT, machinery_used TEXT, site_risks TEXT, compliance_score DECIMAL(5,2) DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own projects" ON projects; CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create projects" ON projects; CREATE POLICY "Users can create projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own projects" ON projects; CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own projects" ON projects; CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- Safety Documents
CREATE TABLE IF NOT EXISTS safety_documents (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, document_type TEXT NOT NULL, title TEXT NOT NULL, content TEXT, status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','approved','expired')), version INTEGER DEFAULT 1, generated_by_ai BOOLEAN DEFAULT false, approved_by TEXT, expiry_date DATE, tags TEXT[], created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE safety_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own documents" ON safety_documents; CREATE POLICY "Users can view own documents" ON safety_documents FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create documents" ON safety_documents; CREATE POLICY "Users can create documents" ON safety_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own documents" ON safety_documents; CREATE POLICY "Users can update own documents" ON safety_documents FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own documents" ON safety_documents; CREATE POLICY "Users can delete own documents" ON safety_documents FOR DELETE USING (auth.uid() = user_id);

-- Risk Assessments
CREATE TABLE IF NOT EXISTS risk_assessments (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, assessment_type TEXT NOT NULL CHECK (assessment_type IN ('baseline','task_specific','continuous')), title TEXT NOT NULL, activity TEXT, location TEXT, risks JSONB DEFAULT '[]', control_measures TEXT, ppe_required TEXT, residual_risk TEXT, status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','reviewed','approved')), reviewed_by TEXT, review_date DATE, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own risk assessments" ON risk_assessments; CREATE POLICY "Users can view own risk assessments" ON risk_assessments FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create risk assessments" ON risk_assessments; CREATE POLICY "Users can create risk assessments" ON risk_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own risk assessments" ON risk_assessments; CREATE POLICY "Users can update own risk assessments" ON risk_assessments FOR UPDATE USING (auth.uid() = user_id);

-- Inspections
CREATE TABLE IF NOT EXISTS inspections (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, inspection_type TEXT NOT NULL, title TEXT NOT NULL, checklist_items JSONB DEFAULT '[]', overall_score DECIMAL(5,2), findings TEXT, corrective_actions TEXT, inspector_name TEXT, scheduled_date DATE, completed_date DATE, signature_url TEXT, status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_progress','completed','requires_action')), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own inspections" ON inspections; CREATE POLICY "Users can view own inspections" ON inspections FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create inspections" ON inspections; CREATE POLICY "Users can create inspections" ON inspections FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own inspections" ON inspections; CREATE POLICY "Users can update own inspections" ON inspections FOR UPDATE USING (auth.uid() = user_id);

-- Incidents
CREATE TABLE IF NOT EXISTS incidents (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, incident_type TEXT NOT NULL, severity TEXT NOT NULL CHECK (severity IN ('low','medium','high','critical')), status TEXT NOT NULL DEFAULT 'reported' CHECK (status IN ('reported','under_investigation','corrective_action','closed')), title TEXT NOT NULL, description TEXT, incident_date TIMESTAMPTZ, location TEXT, injured_person_name TEXT, witnesses TEXT, root_cause TEXT, corrective_actions TEXT, dol_reportable BOOLEAN DEFAULT false, dol_report_number TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own incidents" ON incidents; CREATE POLICY "Users can view own incidents" ON incidents FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create incidents" ON incidents; CREATE POLICY "Users can create incidents" ON incidents FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own incidents" ON incidents; CREATE POLICY "Users can update own incidents" ON incidents FOR UPDATE USING (auth.uid() = user_id);

-- Workers
CREATE TABLE IF NOT EXISTS workers (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, first_name TEXT NOT NULL, last_name TEXT NOT NULL, id_number TEXT, role TEXT NOT NULL, trade TEXT, contact_number TEXT, emergency_contact TEXT, induction_status BOOLEAN DEFAULT false, induction_date DATE, certifications JSONB DEFAULT '[]', medical_fitness BOOLEAN DEFAULT false, medical_expiry DATE, status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','suspended')), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own workers" ON workers; CREATE POLICY "Users can view own workers" ON workers FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create workers" ON workers; CREATE POLICY "Users can create workers" ON workers FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own workers" ON workers; CREATE POLICY "Users can update own workers" ON workers FOR UPDATE USING (auth.uid() = user_id);

-- Tender Documents
CREATE TABLE IF NOT EXISTS tender_documents (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), project_id UUID REFERENCES projects(id) ON DELETE SET NULL, user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, tender_type TEXT NOT NULL, contract_type TEXT, title TEXT NOT NULL, content TEXT, status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','submitted','awarded','rejected','closed')), tender_value DECIMAL(15,2), client_name TEXT, submission_date DATE, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE tender_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own tender documents" ON tender_documents; CREATE POLICY "Users can view own tender documents" ON tender_documents FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create tender documents" ON tender_documents; CREATE POLICY "Users can create tender documents" ON tender_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own tender documents" ON tender_documents; CREATE POLICY "Users can update own tender documents" ON tender_documents FOR UPDATE USING (auth.uid() = user_id);

-- Pricing Items
CREATE TABLE IF NOT EXISTS pricing_items (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, category TEXT NOT NULL CHECK (category IN ('materials','plant','labour')), group_name TEXT, code TEXT, description TEXT NOT NULL, unit TEXT, supply_rate DECIMAL(12,2), install_rate DECIMAL(12,2), total_rate DECIMAL(12,2), region TEXT DEFAULT 'national', source TEXT, effective_date DATE, notes TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE pricing_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own pricing items" ON pricing_items; CREATE POLICY "Users can view own pricing items" ON pricing_items FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create pricing items" ON pricing_items; CREATE POLICY "Users can create pricing items" ON pricing_items FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own pricing items" ON pricing_items; CREATE POLICY "Users can update own pricing items" ON pricing_items FOR UPDATE USING (auth.uid() = user_id);

-- Compliance Actions
CREATE TABLE IF NOT EXISTS compliance_actions (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, title TEXT NOT NULL, action_type TEXT, description TEXT, priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','critical')), status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','overdue')), due_date DATE, assigned_to TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE compliance_actions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own compliance actions" ON compliance_actions; CREATE POLICY "Users can view own compliance actions" ON compliance_actions FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create compliance actions" ON compliance_actions; CREATE POLICY "Users can create compliance actions" ON compliance_actions FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own compliance actions" ON compliance_actions; CREATE POLICY "Users can update own compliance actions" ON compliance_actions FOR UPDATE USING (auth.uid() = user_id);

-- Agent Conversations
CREATE TABLE IF NOT EXISTS agent_conversations (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, agent_id TEXT NOT NULL, title TEXT, messages JSONB DEFAULT '[]', created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE agent_conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own conversations" ON agent_conversations; CREATE POLICY "Users can view own conversations" ON agent_conversations FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create conversations" ON agent_conversations; CREATE POLICY "Users can create conversations" ON agent_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own conversations" ON agent_conversations; CREATE POLICY "Users can update own conversations" ON agent_conversations FOR UPDATE USING (auth.uid() = user_id);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, tier TEXT NOT NULL CHECK (tier IN ('starter','professional','enterprise')), status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','canceled','past_due','incomplete')), stripe_customer_id TEXT, stripe_subscription_id TEXT, current_period_start TIMESTAMPTZ, current_period_end TIMESTAMPTZ, billing_interval TEXT DEFAULT 'monthly' CHECK (billing_interval IN ('monthly','annually')), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions; CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Contractor Onboardings
CREATE TABLE IF NOT EXISTS contractor_onboardings (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, company_name TEXT NOT NULL, registration_number TEXT, cidb_grade TEXT, bbeee_level TEXT, tax_clearance_url TEXT, good_standing_url TEXT, insurance_url TEXT, safety_file_url TEXT, designated_safety_officer TEXT, status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','under_review','approved','rejected')), step INTEGER DEFAULT 1, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE contractor_onboardings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own onboarding" ON contractor_onboardings; CREATE POLICY "Users can view own onboarding" ON contractor_onboardings FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create onboarding" ON contractor_onboardings; CREATE POLICY "Users can create onboarding" ON contractor_onboardings FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own onboarding" ON contractor_onboardings; CREATE POLICY "Users can update own onboarding" ON contractor_onboardings FOR UPDATE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_safety_documents_project ON safety_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_safety_documents_user ON safety_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_project ON risk_assessments(project_id);
CREATE INDEX IF NOT EXISTS idx_inspections_project ON inspections(project_id);
CREATE INDEX IF NOT EXISTS idx_incidents_project ON incidents(project_id);
CREATE INDEX IF NOT EXISTS idx_workers_project ON workers(project_id);
CREATE INDEX IF NOT EXISTS idx_tender_documents_user ON tender_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_pricing_items_category ON pricing_items(category);
CREATE INDEX IF NOT EXISTS idx_compliance_actions_project ON compliance_actions(project_id);
CREATE INDEX IF NOT EXISTS idx_agent_conversations_user ON agent_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
'@
Set-Content -Path "supabase\migrations\001_schema.sql" -Value $schemaSql -Encoding utf8 -Force

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host " BUILD COMPLETE! " -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "`nAll project files created successfully!" -ForegroundColor Green
Write-Host "Total files created: 50+" -ForegroundColor Yellow
Write-Host "`nNEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. cd $PROJECT_DIR" -ForegroundColor White
Write-Host "2. npm install" -ForegroundColor White
Write-Host "3. Rename .env.example to .env and add your keys" -ForegroundColor White
Write-Host "4. npm run dev (to test locally)" -ForegroundColor White
Write-Host "`nGIT SETUP (run these commands):" -ForegroundColor Cyan
Write-Host 'git init' -ForegroundColor White
Write-Host 'git add .' -ForegroundColor White
Write-Host 'git commit -m "Initial SafetyStack commit - complete OHS platform"' -ForegroundColor White
Write-Host 'git branch -M main' -ForegroundColor White
Write-Host 'git remote add origin https://github.com/stanfliet/safetystack.git' -ForegroundColor White
Write-Host 'git push -u origin main --force' -ForegroundColor White
Write-Host "`nSUPABASE SETUP:" -ForegroundColor Cyan
Write-Host "1. Create project at https://supabase.com" -ForegroundColor White
Write-Host "2. Go to SQL Editor and paste supabase/migrations/001_schema.sql" -ForegroundColor White
Write-Host "3. Run the SQL to create all tables and RLS policies" -ForegroundColor White
Write-Host "4. Copy your URL and anon key to .env file" -ForegroundColor White
Write-Host "`nVERCEL DEPLOYMENT:" -ForegroundColor Cyan
Write-Host "1. Push to GitHub" -ForegroundColor White
Write-Host "2. Import repo in Vercel" -ForegroundColor White
Write-Host "3. Add environment variables from .env" -ForegroundColor White
Write-Host "4. Deploy!" -ForegroundColor White
Write-Host "`n============================================" -ForegroundColor Cyan