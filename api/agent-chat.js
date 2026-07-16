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
      headers: { "Authorization": "Bearer " + process.env.OPENAI_API_KEY, "Content-Type": "application/json" },
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
