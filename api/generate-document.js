export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { mode, project_id, document_type, context } = req.body;

  const systemPrompt = "You are a senior OHS practitioner with 20+ years experience in South African construction. Expert in OHS Act 85 of 1993, Construction Regulations 2014, COIDA, SANS standards, SACPCMP. Write as a direct, authoritative professional. Format in clean HTML with headings, paragraphs, and signature blocks. Every document must be site-specific and SA legislation-compliant.";

  try {
    const docPrompt = "Generate a " + document_type.replace(/_/g, " ") + " document for:\nProject: " + (context?.project_name || "[Project Name]") + "\nCompany: " + (context?.company_name || "[Company Name]") + "\nSite: " + (context?.site_address || "[Site Address]") + "\nSafety Officer: " + (context?.safety_officer || "[Safety Officer]") + "\nWorkers: " + (context?.number_of_workers || "[Number]") + "\n\nFormat in professional, compliant HTML. Include: cover section, legislative references, detailed content, signature blocks.";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": "Bearer " + process.env.OPENAI_API_KEY, "Content-Type": "application/json" },
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
