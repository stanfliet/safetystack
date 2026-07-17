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
    const form = formidable({ multiples: true, maxFileSize: 100 * 1024 * 1024 });
    const [fields, files] = await form.parse(req);
    const projectId = fields.project_id?.[0];
    const userId = fields.user_id?.[0];
    const analysisType = req.headers['x-analysis-type'] || fields.analysis_type?.[0] || 'general';

    if (!files.files) return res.status(400).json({ error: "No files uploaded" });

    const uploads = Array.isArray(files.files) ? files.files : [files.files];
    const fileDetails = [];
    let combinedText = "";

    for (const file of uploads) {
      const ext = (file.originalFilename || "").split(".").pop()?.toLowerCase() || "";
      const buffer = fs.readFileSync(file.filepath);
      let textContent = "";
      let ocrUsed = false;

      try {
        if (["txt", "md", "csv", "json", "xml", "html", "htm"].includes(ext)) {
          textContent = buffer.toString("utf-8");
        } else if (["pdf"].includes(ext)) {
          const pdfParse = (await import("pdf-parse")).default;
          const pdfData = await pdfParse(buffer);
          textContent = pdfData.text || "[PDF extraction limited]";
        } else if (["docx", "doc"].includes(ext)) {
          const mammoth = await import("mammoth");
          const result = await mammoth.extractRawText({ buffer });
          textContent = result.value || "[DOCX extraction limited]";
        } else if (["xlsx", "xls", "xlsm"].includes(ext)) {
          const XLSX = await import("xlsx");
          const wb = XLSX.read(buffer, { type: "buffer" });
          const sheets = wb.SheetNames.map(name => ({
            name,
            data: XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1 })
          }));
          textContent = sheets.map(s =>
            "=== Sheet: " + s.name + " ===\n" + s.data.map(r => r.join("\t")).join("\n")
          ).join("\n\n");
        } else if (["jpg", "jpeg", "png", "gif", "bmp", "webp", "tiff"].includes(ext)) {
          ocrUsed = true;
          textContent = "[Image file: " + file.originalFilename + " - AI will analyze the visual content]";
        } else {
          textContent = buffer.toString("utf-8").substring(0, 100000) || "[Binary file - limited extraction]";
        }
      } catch (e) {
        textContent = "[Parse error for " + ext + ": " + e.message + "]";
      }

      combinedText += "\n--- File: " + file.originalFilename + " ---\n" + textContent + "\n";
      fileDetails.push({ originalName: file.originalFilename, fileType: ext, fileSize: file.size, textLength: textContent.length, ocrUsed });

      // Save to Supabase if configured
      if (supabase.from && process.env.VITE_SUPABASE_URL && userId) {
        await supabase.from("documents").insert({
          project_id: projectId || null,
          user_id: userId,
          filename: file.newFilename || file.originalFilename,
          original_name: file.originalFilename,
          file_type: ext,
          file_size: file.size,
          text_content: textContent.substring(0, 50000),
          status: "uploaded",
          ocr_used: ocrUsed
        }).catch(() => {});
      }
    }

    // AI Analysis
    let analysis = {};
    if (combinedText.trim().length > 50) {
      try {
        const { analyzeDocument } = await import("../src/services/aiService.js");
        analysis = await analyzeDocument(combinedText, analysisType);
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
