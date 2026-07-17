const AI_ENDPOINT = "/api";

export async function generateDocument(params) {
  const res = await fetch(AI_ENDPOINT + "/generate-document", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error("AI generation failed");
  return res.json();
}

export async function chatWithAgent(agentId, message, conversationHistory = []) {
  const res = await fetch(AI_ENDPOINT + "/agent-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agent_id: agentId, message, conversation_history: conversationHistory })
  });
  if (!res.ok) throw new Error("Agent chat failed");
  return res.json();
}

export async function uploadAndAnalyze(files, projectId, userId, analysisType = "general") {
  const formData = new FormData();
  for (const file of files) formData.append("files", file);
  if (projectId) formData.append("project_id", projectId);
  if (userId) formData.append("user_id", userId);
  const res = await fetch(AI_ENDPOINT + "/upload-and-analyze", {
    method: "POST",
    headers: { "x-analysis-type": analysisType },
    body: formData
  });
  if (!res.ok) throw new Error("Upload & analyze failed");
  return res.json();
}

export async function processBOQ(files, projectLocation = "national") {
  const formData = new FormData();
  for (const file of files) formData.append("files", file);
  formData.append("project_location", projectLocation);
  const res = await fetch(AI_ENDPOINT + "/boq-process", {
    method: "POST",
    body: formData
  });
  if (!res.ok) throw new Error("BOQ processing failed");
  return res.json();
}

export async function generateHSFile(projectData, documents = []) {
  const res = await fetch(AI_ENDPOINT + "/hs-file-generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project_data: projectData, documents })
  });
  if (!res.ok) throw new Error("H&S file generation failed");
  return res.json();
}

export async function generateSingleDoc(documentType, context = {}) {
  const res = await fetch(AI_ENDPOINT + "/generate-document", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: "single",
      document_type: documentType,
      context
    })
  });
  if (!res.ok) throw new Error("Document generation failed");
  return res.json();
}
