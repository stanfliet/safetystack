const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { tier, interval, user_id } = req.body;

  const priceIds = {
    starter: { monthly: "price_starter_monthly", annually: "price_starter_annual" },
    professional: { monthly: "price_professional_monthly", annually: "price_professional_annual" },
    enterprise: { monthly: "price_enterprise_monthly", annually: "price_enterprise_annual" }
  };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceIds[tier]?.[interval], quantity: 1 }],
      success_url: `${req.headers.origin}/billing?success=true`,
      cancel_url: `${req.headers.origin}/billing?canceled=true`,
      metadata: { user_id, tier }
    });
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
}
