import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const OPENAI_BASE_URL = "https://integrate.api.nvidia.com/v1";

serve(async (req) => {
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  try {
    const { project_id, project_data, documents } = await req.json();
    const authHeader = req.headers.get("Authorization") || "";
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Generate H&S file content via API
    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("NVAPI_KEY_NEMOTRON") || ""}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-super-120b-a12b",
        messages: [
          { role: "system", content: "You are a SACPCMP registered Construction H&S Practitioner. Generate complete H&S File as HTML. Include all 26 sections." },
          { role: "user", content: `Generate complete H&S File for: Project=${project_data.project_name}, Site=${project_data.site_address}, Company=${project_data.company_name}` }
        ],
        temperature: 0.25,
        max_tokens: 16384
      })
    });
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Save to database
    const { data: saved, error } = await supabaseClient.from("hs_files").insert({
      title: project_data.title || "Health & Safety File",
      project_id: project_id,
      user_id: project_data.user_id,
      company_name: project_data.company_name,
      site_address: project_data.site_address,
      scope_of_works: project_data.scope_of_works,
      principal_contractor: project_data.principal_contractor,
      safety_officer: project_data.safety_officer,
      number_of_workers: parseInt(project_data.number_of_workers) || 0,
      project_duration: project_data.project_duration,
      logo_url: project_data.logo_url,
      content: content,
      status: "generated",
      version: 1
    }).select().single();

    if (error) throw error;
    return new Response(JSON.stringify({ success: true, data: saved }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
