const AI_ENDPOINT = "/api";
export async function generateDocument(params) {
  const res = await fetch(`${AI_ENDPOINT}/generate-document`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error("AI generation failed");
  return res.json();
}
export async function chatWithAgent(agentId, message) {
  const res = await fetch(`${AI_ENDPOINT}/agent-chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agent_id: agentId, message })
  });
  if (!res.ok) throw new Error("Agent chat failed");
  return res.json();
}
