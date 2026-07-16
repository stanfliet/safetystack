export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { project_id, project_data, documents } = req.body;
    const { generateHealthSafetyFile } = await import('../src/services/aiService.js');
    const content = await generateHealthSafetyFile(project_data || {}, documents || []);
    res.status(200).json({ success: true, content, project_id });
  } catch (error) {
    console.error("H&S File generation error:", error);
    res.status(500).json({ error: "Generation failed: " + error.message });
  }
}
