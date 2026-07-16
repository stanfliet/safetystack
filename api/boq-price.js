export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { items, project_location } = req.body;
    if (!items || !items.length) return res.status(400).json({ error: "No items to price" });
    const { priceBOQItem } = await import('../src/services/aiService.js');
    const pricedItems = [];
    for (const item of items) {
      const priced = await priceBOQItem(item, project_location || "national");
      pricedItems.push(priced);
    }
    const grandTotal = pricedItems.reduce((sum, i) => sum + (i.total_amount || 0), 0);
    res.status(200).json({ success: true, items: pricedItems, grand_total: grandTotal });
  } catch (error) {
    console.error("BOQ pricing error:", error);
    res.status(500).json({ error: "Pricing failed: " + error.message });
  }
}
