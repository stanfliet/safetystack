import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const OPENAI_BASE_URL = "https://integrate.api.nvidia.com/v1";

serve(async (req) => {
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  try {
    const { text, project_id, user_id, file_name, project_location } = await req.json();
    const authHeader = req.headers.get("Authorization") || "";
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Step 1: Extract BOQ items
    const extractResp = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("NVAPI_KEY_DEEPSEEK") || ""}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-ai/deepseek-v4-pro",
        messages: [
          { role: "system", content: "You are a PrQS (ASAQS) QS. Extract ALL BOQ line items as JSON array. Return ONLY the JSON array." },
          { role: "user", content: `Extract BOQ items from: ${text.substring(0, 120000)}` }
        ],
        temperature: 0.1,
        max_tokens: 16384
      })
    });
    const extractData = await extractResp.json();
    let items = [];
    try {
      const raw = extractData.choices?.[0]?.message?.content || "[]";
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) items = JSON.parse(match[0]);
    } catch { items = []; }

    // Step 2: Price each item
    const pricedItems = [];
    for (const item of items) {
      const priceResp = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${Deno.env.get("NVAPI_KEY_DEEPSEEK") || ""}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek-ai/deepseek-v4-pro",
          messages: [
            { role: "system", content: "You are a PrQS QS. Price this BOQ item with full rate build-up. Return JSON." },
            { role: "user", content: `Price item: ${JSON.stringify(item)} for ${project_location || "national"} SA` }
          ],
          temperature: 0.15,
          max_tokens: 4000
        })
      });
      const priceData = await priceResp.json();
      try {
        const priceRaw = priceData.choices?.[0]?.message?.content || "{}";
        const pm = priceRaw.match(/\{[\s\S]*\}/);
        if (pm) pricedItems.push({ ...item, ...JSON.parse(pm[0]) });
      } catch { pricedItems.push(item); }
    }

    // Step 3: Save to database
    if (project_id && user_id) {
      for (const item of pricedItems) {
        await supabaseClient.from("boq_items").insert({
          project_id,
          user_id,
          item_number: item.item_number,
          description: item.description,
          unit: item.unit,
          quantity: parseFloat(item.quantity) || 0,
          rate: parseFloat(item.total_rate) || 0,
          total: parseFloat(item.total_amount) || 0,
          rate_build_up: item.rate_build_up || {},
          pricing_status: "ai_priced",
          category: item.category
        }).catch(() => {});
      }
    }

    const grandTotal = pricedItems.reduce((s, i) => s + (parseFloat(i.total_amount) || 0), 0);

    return new Response(JSON.stringify({
      success: true,
      items_extracted: items,
      items_priced: pricedItems,
      grand_total: grandTotal,
      item_count: items.length
    }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
