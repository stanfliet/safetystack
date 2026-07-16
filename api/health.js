export default function handler(req, res) {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "SafetyStack API",
    version: "2.0.0"
  });
}
