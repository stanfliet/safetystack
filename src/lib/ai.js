const AI_ENDPOINT = "/api";
export async function generateDocument(params) {
  const res = await fetch(`${AI_ENDPOINT}/generate-document`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) });
  if (!res.ok) throw new Error("AI generation failed"); return res.json();
}
export async function chatWithAgent(agentId, message, conversationId = null, userId = null) {
  const res = await fetch(`${AI_ENDPOINT}/agent-chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ agent_id: agentId, message, conversation_id: conversationId, user_id: userId }) });
  if (!res.ok) throw new Error("Agent chat failed"); return res.json();
}
export async function uploadAndAnalyze(files, projectId, userId) {
  const formData = new FormData();
  for (const file of files) formData.append("files", file);
  if (projectId) formData.append("project_id", projectId);
  if (userId) formData.append("user_id", userId);
  const res = await fetch(`${AI_ENDPOINT}/upload-and-analyze`, { method: "POST", body: formData });
  if (!res.ok) throw new Error("Upload & analyze failed"); return res.json();
}