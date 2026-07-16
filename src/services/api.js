import { supabase } from "../lib/supabase";

export async function fetchProjects(userId) {
  const { data, error } = await supabase.from("projects").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) throw error; return data || [];
}
export async function createProject(project) {
  const { data, error } = await supabase.from("projects").insert(project).select().single();
  if (error) throw error; return data;
}
export async function updateProject(id, updates) {
  const { data, error } = await supabase.from("projects").update(updates).eq("id", id).select().single();
  if (error) throw error; return data;
}
export async function fetchDocuments(projectId, userId) {
  let q = supabase.from("documents").select("*, projects(name)").eq("user_id", userId).order("created_at", { ascending: false });
  if (projectId) q = q.eq("project_id", projectId);
  const { data, error } = await q; if (error) throw error; return data || [];
}
export async function fetchWorkers(projectId) {
  const { data, error } = await supabase.from("workers").select("*").eq("project_id", projectId);
  if (error) throw error; return data || [];
}
export async function fetchBOQItems(projectId) {
  const { data, error } = await supabase.from("boq_items").select("*").eq("project_id", projectId).order("item_number");
  if (error) throw error; return data || [];
}
export async function createBOQItem(item) {
  const { data, error } = await supabase.from("boq_items").insert(item).select().single();
  if (error) throw error; return data;
}
export async function fetchVariations(projectId) {
  const { data, error } = await supabase.from("variations").select("*").eq("project_id", projectId).order("created_at", { ascending: false });
  if (error) throw error; return data || [];
}
export async function createVariation(item) {
  const { data, error } = await supabase.from("variations").insert(item).select().single();
  if (error) throw error; return data;
}
export async function fetchInsights(projectId, userId) {
  let q = supabase.from("intelligence_insights").select("*, projects(name)").eq("user_id", userId).order("created_at", { ascending: false }).limit(50);
  if (projectId) q = q.eq("project_id", projectId);
  const { data, error } = await q; if (error) throw error; return data || [];
}
export async function markInsightRead(id) {
  return supabase.from("intelligence_insights").update({ is_read: true }).eq("id", id);
}
export async function logActivity(userId, action, entityType, entityId, details = {}, projectId = null) {
  try { await supabase.from("activity_logs").insert({ user_id: userId, action, entity_type: entityType, entity_id: entityId, details, project_id: projectId }); } catch (e) { /* silent */ }
}
export async function fetchActivity(userId, limit = 20) {
  const { data, error } = await supabase.from("activity_logs").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(limit);
  if (error) throw error; return data || [];
}
export async function fetchComplianceActions(projectId, userId) {
  let q = supabase.from("compliance_actions").select("*, projects(name)").eq("user_id", userId).order("created_at", { ascending: false });
  if (projectId) q = q.eq("project_id", projectId);
  const { data, error } = await q; if (error) throw error; return data || [];
}
export async function fetchSafetyDocuments(projectId, userId) {
  let q = supabase.from("safety_documents").select("*, projects(name)").eq("user_id", userId).order("created_at", { ascending: false });
  if (projectId) q = q.eq("project_id", projectId);
  const { data, error } = await q; if (error) throw error; return data || [];
}
export async function fetchInspections(projectId, userId) {
  let q = supabase.from("inspections").select("*, projects(name)").eq("user_id", userId).order("created_at", { ascending: false });
  if (projectId) q = q.eq("project_id", projectId);
  const { data, error } = await q; if (error) throw error; return data || [];
}
export async function fetchIncidents(projectId, userId) {
  let q = supabase.from("incidents").select("*, projects(name)").eq("user_id", userId).order("created_at", { ascending: false });
  if (projectId) q = q.eq("project_id", projectId);
  const { data, error } = await q; if (error) throw error; return data || [];
}