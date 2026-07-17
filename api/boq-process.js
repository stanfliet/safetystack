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
    
    const location = fields.project_location?.[0] || "national";
    const results = [];
    let combinedText = "";

    for (const file of uploads) {
      const ext = (file.originalFilename || "").split(".").pop()?.toLowerCase() || "";
      const buffer = fs.readFileSync(file.filepath);
      let textContent = "";

      try {
        if (["txt", "md", "csv", "json", "xml", "html", "htm"].includes(ext)) {
          textContent = buffer.toString("utf-8");
        } else if (["pdf"].includes(ext)) {
          const pdfParse = (await import("pdf-parse")).default;
          const pdfData = await pdfParse(buffer);
          textContent = pdfData.text || "";
        } else if (["docx", "doc"].includes(ext)) {
          const mammoth = await import("mammoth");
          const result = await mammoth.extractRawText({ buffer });
          textContent = result.value || "";
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
        } else if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) {
          textContent = "[Image BOQ - " + file.originalFilename + "]";
        } else {
          textContent = buffer.toString("utf-8").substring(0, 100000);
        }
      } catch (e) {
        textContent = "[Parse error: " + e.message + "]";
      }

      combinedText += "\n--- File: " + file.originalFilename + " ---\n" + textContent + "\n";
      results.push({ originalName: file.originalFilename, ext, size: file.size, textLength: textContent.length });
    }

    // Extract BOQ items via AI
    let items = [];
    let pricedItems = [];
    let grandTotal = 0;

    if (combinedText.trim().length > 50) {
      try {
        const { extractBOQFromText, priceFullBOQ } = await import("../src/services/aiService.js");
        items = await extractBOQFromText(combinedText);
        const priced = await priceFullBOQ(items, location);
        pricedItems = priced.items;
        grandTotal = priced.grand_total;
      } catch (e) {
        return res.status(422).json({ success: false, error: "AI extraction failed: " + e.message, files: results });
      }
    }

    res.status(200).json({
      success: true,
      files: results,
      items_extracted: items,
      items_priced: pricedItems,
      grand_total: grandTotal,
      item_count: items.length
    });
  } catch (error) {
    console.error("BOQ process error:", error);
    res.status(500).json({ error: "Processing failed: " + error.message });
  }
}
