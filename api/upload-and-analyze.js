export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const analysisType = req.headers["x-analysis-type"] || "general";
  const files = [];

  // Parse multipart form data
  try {
    const busboy = (await import("busboy")).default;
    const bb = busboy({ headers: req.headers });
    const fileContents = [];

    await new Promise((resolve, reject) => {
      bb.on("file", (fieldname, file, info) => {
        const chunks = [];
        file.on("data", (chunk) => chunks.push(chunk));
        file.on("end", () => {
          const buffer = Buffer.concat(chunks);
          fileContents.push({ filename: info.filename, buffer, mimetype: info.mimeType });
        });
      });
      bb.on("finish", () => resolve());
      bb.on("error", reject);
      req.pipe(bb);
    });

    if (fileContents.length === 0) return res.status(400).json({ error: "No files uploaded" });

    // For now, return a summary of what was uploaded
    // In production, this would call OpenAI Vision or a document parser
    const summary = fileContents.map(f =>
      `File: ${f.filename} (${(f.buffer.length / 1024).toFixed(1)}KB, ${f.mimetype})`
    ).join("\n");

    const openaiKey = process.env.OPENAI_API_KEY;
    let aiResponse = null;

    if (openaiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + openaiKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are a senior OHS document reviewer. Review the uploaded file names and provide a preliminary compliance assessment. Be specific about what OHS Act sections and Construction Regulations apply."
              },
              {
                role: "user",
                content: `Review these uploaded documents for OHS compliance:\n${summary}\n\nAnalysis type: ${analysisType}`
              }
            ],
            temperature: 0.3,
            max_tokens: 1500
          })
        });

        const data = await response.json();
        aiResponse = data.choices?.[0]?.message?.content || "Analysis completed.";
      } catch (e) {
        aiResponse = `Files uploaded successfully. AI analysis unavailable (${e.message}). Files: ${summary}`;
      }
    } else {
      aiResponse = `Files uploaded successfully. Configure OPENAI_API_KEY for AI analysis.\n\nUploaded:\n${summary}`;
    }

    res.status(200).json({
      success: true,
      files: fileContents.map(f => ({ filename: f.filename, size: f.buffer.length, mimetype: f.mimetype })),
      summary: aiResponse,
      content: aiResponse
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed: " + error.message });
  }
}
