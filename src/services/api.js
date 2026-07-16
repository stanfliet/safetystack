import { supabase } from "../lib/supabase";

export async function fetchProjects(userId) {
  const { data, error } = await supabase.from("projects").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createProject(project) {
  const { data, error } = await supabase.from("projects").insert(project).select().single();
  if (error) throw error;
  return data;
}

export async function fetchWorkers(projectId) {
  const { data, error } = await supabase.from("workers").select("*").eq("project_id", projectId);
  if (error) throw error;
  return data || [];
}
