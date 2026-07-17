import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_BASE_URL = "https://integrate.api.nvidia.com/v1";

serve(async (req) => {
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  try {
    const { text, analysis_type, file_name } = await req.json();
    const model = text.length > 50000 ? "nvidia/nemotron-3-super-120b-a12b" : "deepseek-ai/deepseek-v4-pro";
    const apiKey = text.length > 50000
      ? (Deno.env.get("NVAPI_KEY_NEMOTRON") || "")
      : (Deno.env.get("NVAPI_KEY_DEEPSEEK") || "");

    const prompts = {
      general: "Extract ALL structured info as JSON: scope_of_works, project_type, risks, compliance_requirements.",
      hs_file: "You are a SACPCMP H&S Practitioner. Extract ALL H&S info as JSON.",
      boq: "Extract ALL BOQ line items as JSON array: [{item_number, description, unit, quantity, rate_provided}].",
      scope: "Extract complete scope of works, specifications, quantities as JSON.",
    };

    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: `${prompts[analysis_type] || prompts.general}\nReturn structured JSON.` },
          { role: "user", content: `Analyze${file_name ? " " + file_name : ""}:\n\n${text.substring(0, 100000)}` }
        ],
        temperature: 0.2,
        max_tokens: 8000
      })
    });
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";

    return new Response(JSON.stringify({ success: true, analysis: content }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
