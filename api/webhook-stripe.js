import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const sig = req.headers["stripe-signature"];
  let event;
  try { event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET); }
  catch (err) { return res.status(400).send(`Webhook Error: ${err.message}`); }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const { user_id, tier } = session.metadata;
      await supabase.from("subscriptions").upsert({
        user_id, tier, status: "active",
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        current_period_start: new Date(session.created * 1000).toISOString()
      }, { onConflict: "user_id" });
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      await supabase.from("subscriptions").update({ status: sub.status }).eq("stripe_subscription_id", sub.id);
      break;
    }
  }
  res.json({ received: true });
}
