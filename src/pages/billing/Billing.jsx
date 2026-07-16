import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const TIERS = [
  { id: "starter", name: "Starter", monthly: 299, annually: 2990, features: ["Up to 5 projects", "50 workers", "Basic AI documents", "Safety files", "Risk assessments", "Inspections", "Incident reporting", "Email support"] },
  { id: "professional", name: "Professional", monthly: 599, annually: 5990, features: ["Up to 20 projects", "Unlimited workers", "Full AI documents", "All 7 AI agents", "Pricing database", "Tender and contracts", "Compliance dashboard", "Analytics", "Contractor onboarding", "Priority support"] },
  { id: "enterprise", name: "Enterprise", monthly: 1299, annually: 12990, features: ["Unlimited projects", "Unlimited workers", "Unlimited AI docs", "All 7 AI agents", "Everything in Pro", "Custom branding", "API access", "Dedicated manager", "Custom integrations", "SLA guarantee", "24/7 support"] }
];

export default function Billing() {
  const { profile } = useAuth();
  const [interval, setInterval] = useState("monthly");
  const [loading, setLoading] = useState(false);

  async function handleSubscribe(tierId) {
    setLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierId, interval, user_id: profile?.id, email: profile?.email })
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
      else toast.error("Failed to create checkout");
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-gray-500 mt-2">Select the tier that fits your organisation</p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className={"text-sm font-medium " + (interval === "monthly" ? "text-gray-900" : "text-gray-500")}>Monthly</span>
          <button onClick={() => setInterval(interval === "monthly" ? "annually" : "monthly")} className={"w-14 h-7 rounded-full transition-colors relative " + (interval === "annually" ? "bg-safety-600" : "bg-gray-300")}>
            <div className={"w-5 h-5 bg-white rounded-full shadow absolute top-1 transition-transform " + (interval === "annually" ? "translate-x-8" : "translate-x-1")} />
          </button>
          <span className={"text-sm font-medium " + (interval === "annually" ? "text-gray-900" : "text-gray-500")}>Annual <span className="text-green-500 text-xs">Save ~17%</span></span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TIERS.map(tier => (
          <div key={tier.id} className={"card flex flex-col " + (tier.id === "professional" ? "ring-2 ring-safety-500 border-safety-500" : "")}>
            {tier.id === "professional" && <div className="bg-safety-600 text-white text-center text-xs font-semibold py-1.5 rounded-t-xl">MOST POPULAR</div>}
            <div className="card-body flex-1 flex flex-col">
              <h3 className="text-xl font-bold">{tier.name}</h3>
              <div className="mt-4"><span className="text-4xl font-bold">R{interval === "monthly" ? tier.monthly : tier.annually}</span><span className="text-gray-500 text-sm">/{interval === "monthly" ? "mo" : "yr"}</span></div>
              <ul className="mt-6 space-y-3 flex-1">{tier.features.map((f, i) => <li key={i} className="flex items-start gap-2 text-sm"><svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{f}</li>)}</ul>
              <button onClick={() => handleSubscribe(tier.id)} disabled={loading} className="btn-primary w-full mt-6">{loading ? "Processing..." : "Subscribe to " + tier.name}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
