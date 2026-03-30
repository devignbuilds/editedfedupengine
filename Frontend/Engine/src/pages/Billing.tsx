import { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  CreditCard,
  CheckCircle2,
  Zap,
  Rocket,
  Building2,
  ExternalLink,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/useAuth";
import { motion } from "framer-motion";

const Billing = () => {
  const { user } = useAuth();
  const [billing, setBilling] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchBilling();
  }, []);

  const fetchBilling = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/scale/billing", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBilling(data);
      }
    } catch (err) {
      console.error("Fetch billing failed:", err);
    }
  };

  const handleUpdatePlan = async (plan: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch("http://localhost:5001/api/scale/billing/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ plan }),
      });
      if (res.ok) {
        const updated = await res.json();
        setBilling(updated);
      }
    } catch (err) {
      console.error("Plan update failed:", err);
    } finally {
      setTimeout(() => setIsUpdating(false), 800);
    }
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      icon: Zap,
      features: ["Up to 10 Leads/mo", "Basic Boards", "Community Support"],
      button: "Current Plan",
    },
    {
      name: "Agency",
      price: "$99",
      icon: Rocket,
      features: [
        "Unlimited Leads",
        "AI Growth Engine",
        "Custom Branding",
        "Priority Queue",
      ],
      button: "Upgrade to Agency",
    },
    {
      name: "Enterprise",
      price: "$499",
      icon: Building2,
      features: [
        "Dedicated Infra",
        "Custom Subdomains",
        "API Access",
        "24/7 Intel Team",
      ],
      button: "Contact Sales",
    },
  ];

  if (!billing)
    return (
      <div className="p-20 text-center opacity-20 font-black uppercase tracking-widest">
        Accessing Financial Vault...
      </div>
    );

  return (
    <DashboardLayout>
      <div className="space-y-12 pb-20 selection:bg-primary selection:text-primary-foreground">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              Monetization
            </h1>
            <p className="text-muted-foreground font-medium opacity-60 ml-1">
              Manage your service operating system subscription and billing
              history.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-muted p-4 rounded-2xl border border-border/40 shadow-sm">
            <CreditCard className="h-5 w-5 opacity-40" />
            <div className="space-y-0.5">
              <p className="text-[8px] font-black uppercase tracking-widest opacity-40">
                Current Plan
              </p>
              <p className="text-[11px] font-black uppercase tracking-tight">
                {billing.plan}
              </p>
            </div>
            <div className="ml-4 px-3 py-1 bg-primary/10 text-primary rounded-full text-[8px] font-black uppercase tracking-widest">
              {billing.status}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-10 rounded-[2.5rem] border-2 transition-all relative overflow-hidden flex flex-col ${
                billing.plan === p.name
                  ? "bg-foreground text-background border-foreground shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]"
                  : "bg-card border-border hover:border-primary/40 shadow-xl"
              }`}
            >
              {billing.plan === p.name && (
                <div className="absolute top-0 right-0 p-8">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
              )}

              <div className="space-y-6 flex-1">
                <div className="space-y-2">
                  <p
                    className={`text-[10px] font-black uppercase tracking-widest ${
                      billing.plan === p.name ? "opacity-40" : "text-primary"
                    }`}
                  >
                    {p.name}
                  </p>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-5xl font-black tracking-tighter">
                      {p.price}
                    </span>
                    <span className="text-[10px] font-bold opacity-40">
                      /MO
                    </span>
                  </div>
                </div>

                <div className="h-px bg-current opacity-10 w-full" />

                <div className="space-y-4">
                  {p.features.map((f) => (
                    <div
                      key={f}
                      className="flex items-center space-x-3 opacity-80"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span className="text-xs font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                disabled={billing.plan === p.name || isUpdating}
                onClick={() =>
                  p.name !== "Enterprise"
                    ? handleUpdatePlan(p.name)
                    : window.open("mailto:sales@engine.dev", "_blank")
                }
                className={`mt-10 w-full py-6 rounded-2xl text-[9px] font-black uppercase tracking-widest h-auto transition-all ${
                  billing.plan === p.name
                    ? "bg-background/10 text-background cursor-not-allowed border border-background/20"
                    : "bg-primary text-primary-foreground hover:scale-[1.02]"
                }`}
              >
                {billing.plan === p.name ? "Currently Active" : p.button}
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="p-10 bg-muted/20 border border-border/50 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 flex-1">
            <h3 className="text-xl font-black uppercase tracking-tight">
              Need a custom solution?
            </h3>
            <p className="text-xs font-medium text-muted-foreground opacity-60">
              We offer specialized infrastructure for agencies managing 500+
              active clients and multi-org hierarchies.
            </p>
          </div>
          <Button
            variant="ghost"
            className="whitespace-nowrap flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 h-auto py-4"
          >
            <span>Customer Portal (Stripe)</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Billing;
