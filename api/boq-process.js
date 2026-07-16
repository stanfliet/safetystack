import formidable from "formidable";
import fs from "fs";
export const config = { api: { bodyParser: false } };
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const form = formidable({ multiples: true, maxFileSize: 100 * 1024 * 1024 });
    const [fields, files] = await form.parse(req);
    const uploads = files.files ? (Array.isArray(files.files) ? files.files : [files.files]) : [];
    if (!uploads.length) return res.status(400).json({ error: "No files uploaded" });
    const results = [];
    let combinedText = "";
    for (const file of uploads) {
      const ext = (file.originalFilename || "").split(".").pop()?.toLowerCase() || "";
      let textContent = "";
      const buffer = fs.readFileSync(file.filepath);
      if (["txt", "md", "csv", "json", "xml", "html", "htm"].includes(ext)) {
        textContent = buffer.toString("utf-8");
      } else if (["pdf"].includes(ext)) {
        try {
          const pdfParse = (await import("pdf-parse")).default;
          const pdfData = await pdfParse(buffer);
          textContent = pdfData.text || "[PDF Text Extraction Limited]";
        } catch(e) { textContent = "[PDF Parse Error: " + e.message + "]"; }
      } else if (["docx", "doc"].includes(ext)) {
        try {
          const mammoth = await import("mammoth");
          const result = await mammoth.extractRawText({ buffer });
          textContent = result.value || "[DOCX Extraction Limited]";
        } catch(e) { textContent = "[DOCX Parse Error]"; }
      } else if (["xlsx", "xls", "xlsm"].includes(ext)) {
        try {
          const XLSX = await import("xlsx");
          const wb = XLSX.read(buffer, { type: "buffer" });
          const sheets = wb.SheetNames.map(name => ({ name, data: XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1 }) }));
          textContent = sheets.map(s => "=== Sheet: " + s.name + " ===\n" + s.data.map(r => r.join("\t")).join("\n")).join("\n\n");
        } catch(e) { textContent = "[Excel parse error]"; }
      } else if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) {
        textContent = "[Image - OCR required - file: " + file.originalFilename + "]";
      } else {
        try { textContent = buffer.toString("utf-8").substring(0, 100000); } catch { textContent = "[Binary file]"; }
      }
      combinedText += "\n*--- File: " + file.originalFilename + " ---\n" + textContent + "\n";
      results.push({ originalName: file.originalFilename, ext, size: file.size, textLength: textContent.length });
    }
    let analysis = null;
    if (combinedText.trim().length > 50 && process.env.OPENAI_API_KEY) {
      try {
        const { analyzeDocument } = await import('../src/services/aiService.js');
        const analysisType = req.headers['x-analysis-type'] || 'boq';
        const rawAnalysis = await analyzeDocument(combinedText, analysisType);
        const jsonMatch = rawAnalysis.match(/\{[\\s\\S]*\}/);
        analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: rawAnalysis.substring(0, 10000) };
      } catch (e) { analysis = { error: "AI analysis: " + e.message }; }
    }
    res.status(200).json({ success: true, files: results, analysis, combinedTextLength: combinedText.length });
  } catch (error) {
    console.error("BOQ process error:", error);
    res.status(500).json({ error: "Processing failed: " + error.message });
  }
}
