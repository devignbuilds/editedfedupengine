import { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { ToggleLeft, ToggleRight, Save } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/useAuth";
import { motion } from "framer-motion";

const ModuleSettings = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const modules = [
    {
      id: "AI_GROWTH",
      name: "AI Growth Engine",
      desc: "Lead scraping and nurture automation",
      mvp: false,
    },
    {
      id: "CONTENT_HUB",
      name: "Content Hub",
      desc: "AI-assisted content scheduling",
      mvp: false,
    },
    {
      id: "SCALE_ENGINE",
      name: "Scale Engine",
      desc: "Gamification and affiliate systems",
      mvp: false,
    },
    {
      id: "WHITE_LABEL",
      name: "White-labeling",
      desc: "Custom branding and subdomains",
      mvp: false,
    },
    {
      id: "BILLING",
      name: "Billing & Monetization",
      desc: "SaaS subscription management",
      mvp: true,
    },
  ];

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/modules/config", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (err) {
      console.error("Fetch config failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    const enabled = config.enabledModules || [];
    const newEnabled = enabled.includes(moduleId)
      ? enabled.filter((m: string) => m !== moduleId)
      : [...enabled, moduleId];

    setConfig({ ...config, enabledModules: newEnabled });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("http://localhost:5001/api/modules/config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ enabledModules: config.enabledModules }),
      });
      if (res.ok) {
        const updated = await res.json();
        setConfig(updated);
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setTimeout(() => setIsSaving(false), 800);
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <div className="p-20 text-center opacity-20 font-black uppercase tracking-widest">
          Loading Module Configuration...
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12 pb-20 selection:bg-primary selection:text-primary-foreground"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              Module Control
            </h1>
            <p className="text-muted-foreground font-medium opacity-60 ml-1">
              Enable or disable advanced modules for your agency.
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="h-auto py-4 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xl"
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Configuration
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {modules.map((module) => {
            const isEnabled = config?.enabledModules?.includes(module.id);
            return (
              <div
                key={module.id}
                className="p-8 bg-card border border-border rounded-[2.5rem] flex items-center justify-between hover:border-primary/40 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-black uppercase tracking-tight">
                      {module.name}
                    </h3>
                    {module.mvp && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded-full">
                        MVP
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-muted-foreground opacity-60">
                    {module.desc}
                  </p>
                </div>
                <button
                  onClick={() => toggleModule(module.id)}
                  disabled={module.mvp}
                  className={`transition-all ${
                    module.mvp
                      ? "opacity-30 cursor-not-allowed"
                      : "cursor-pointer hover:scale-110"
                  }`}
                >
                  {isEnabled ? (
                    <ToggleRight className="h-10 w-10 text-primary" />
                  ) : (
                    <ToggleLeft className="h-10 w-10 text-muted-foreground" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="p-10 bg-muted/20 border border-border/50 rounded-[2.5rem] space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight">
            Agency-Focused Configuration
          </h3>
          <p className="text-xs font-medium text-muted-foreground opacity-60 leading-relaxed">
            The Engine is designed for agencies. Enable only the modules you
            need to keep your dashboard clean and focused. MVP modules (like
            Billing) are always enabled to ensure core functionality.
          </p>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default ModuleSettings;
