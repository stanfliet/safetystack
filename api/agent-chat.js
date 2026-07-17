export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { agent_id, message, conversation_history } = req.body;
  try {
    const { agentChat } = await import("../src/services/aiService.js");
    const content = await agentChat(agent_id, message, conversation_history || []);
    res.status(200).json({ content });
  } catch (error) {
    console.error("Agent chat error:", error);
    res.status(500).json({ error: "Agent chat failed: " + error.message });
  }
}
