import formidable from "formidable";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

export const config = { api: { bodyParser: false } };

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ""
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const form = formidable({ multiples: true, maxFileSize: 50 * 1024 * 1024 });
    const [fields, files] = await form.parse(req);
    const projectId = fields.project_id?.[0];
    const userId = fields.user_id?.[0];

    if (!files.files) return res.status(400).json({ error: "No files uploaded" });

    const uploads = Array.isArray(files.files) ? files.files : [files.files];
    const fileDetails = [];
    let combinedText = "";

    for (const file of uploads) {
      const content = fs.readFileSync(file.filepath, "utf-8");
      let textContent = "";
      let ocrUsed = false;
      const ext = file.originalFilename?.split(".").pop()?.toLowerCase() || "";

      if (["txt", "md", "csv", "json", "xml", "html"].includes(ext)) {
        textContent = content;
      } else if (["pdf"].includes(ext)) {
        try {
          const pdfParse = (await import("pdf-parse")).default;
          const pdfData = await pdfParse(file.filepath);
          textContent = pdfData.text || "[PDF text extraction limited]";
        } catch { textContent = "[PDF extraction placeholder - install pdf-parse]"; }
      } else if (["docx"].includes(ext)) {
        try {
          const mammoth = await import("mammoth");
          const result = await mammoth.extractRawText({ path: file.filepath });
          textContent = result.value || "[DOCX extraction placeholder]";
        } catch { textContent = "[DOCX extraction placeholder]"; }
      } else if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) {
        ocrUsed = true;
        textContent = "[Image OCR placeholder - requires vision API key]";
      } else {
        textContent = "[Unsupported file type]";
      }

      combinedText += `\n--- File: ${file.originalFilename} ---\n${textContent}\n`;

      fileDetails.push({
        originalName: file.originalFilename,
        fileType: ext,
        fileSize: file.size,
        textLength: textContent.length,
        ocrUsed
      });

      if (supabase.from && process.env.VITE_SUPABASE_URL) {
        await supabase.from("documents").insert({
          project_id: projectId || null,
          user_id: userId || "unknown",
          filename: file.newFilename || file.originalFilename,
          original_name: file.originalFilename,
          file_type: ext,
          file_size: file.size,
          text_content: textContent.substring(0, 50000),
          status: "uploaded",
          ocr_used: ocrUsed
        });
      }
    }

    // AI Analysis
    let analysis = {};
    if (combinedText.trim().length > 50 && process.env.OPENAI_API_KEY) {
      try {
        const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are a construction document analysis AI. Extract structured information from construction documents. Return JSON only with: scope_of_works (string), risks (array of {risk,severity}), compliance_requirements (array of strings), contractor_details (object with name,reg_number,grade), project_timeline (string), key_activities (array of strings), commercial_terms (object with contract_type,value,currency)."
              },
              { role: "user", content: `Analyze this construction document:\n\n${combinedText.substring(0, 80000)}` }
            ],
            temperature: 0.3,
            max_tokens: 3000
          })
        });
        const aiData = await aiRes.json();
        const content = aiData.choices?.[0]?.message?.content || "{}";
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: content };
      } catch (e) {
        analysis = { error: "AI analysis failed: " + e.message };
      }
    }

    res.status(200).json({
      success: true,
      analysis,
      fileDetails,
      textLength: combinedText.length,
      filesProcessed: uploads.length
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload processing failed: " + error.message });
  }
}
