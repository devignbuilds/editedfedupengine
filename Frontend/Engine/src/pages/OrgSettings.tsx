import { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Palette, Globe, Shield, CheckCircle2, Save } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/useAuth";
import { motion } from "framer-motion";

const OrgSettings = () => {
  const { user } = useAuth();
  const [org, setOrg] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("branding");

  useEffect(() => {
    fetchOrg();
  }, []);

  const fetchOrg = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/scale/org", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrg(data);
      }
    } catch (err) {
      console.error("Fetch org failed:", err);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("http://localhost:5001/api/scale/org", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(org),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrg(updated);
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setTimeout(() => setIsSaving(false), 1000);
    }
  };

  if (!org)
    return (
      <div className="p-20 text-center opacity-20 font-black uppercase tracking-widest">
        Loading Org Intelligence...
      </div>
    );

  return (
    <DashboardLayout>
      <div className="space-y-12 pb-20 selection:bg-primary selection:text-primary-foreground">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              Agency Scale
            </h1>
            <p className="text-muted-foreground font-medium opacity-60 ml-1">
              Configure white-labeling, custom domains, and enterprise-grade
              branding.
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="h-auto py-4 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xl"
          >
            {isSaving ? (
              "Processing..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Configuration
              </>
            )}
          </Button>
        </div>

        <div className="flex border-b border-border/40">
          {["branding", "network", "security"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab
                  ? "text-primary"
                  : "opacity-40 hover:opacity-100"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {activeTab === "branding" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="p-10 bg-card border border-border rounded-[2.5rem] space-y-8">
                  <div className="flex items-center space-x-4">
                    <Palette className="h-6 w-6 opacity-40" />
                    <h2 className="text-xl font-black uppercase tracking-tight">
                      Visual Identity
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">
                        Agency Name
                      </label>
                      <input
                        value={org.name}
                        onChange={(e) =>
                          setOrg({ ...org, name: e.target.value })
                        }
                        className="w-full bg-muted border-none rounded-2xl px-6 py-4 text-[10px] font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={org.branding.primaryColor}
                          onChange={(e) =>
                            setOrg({
                              ...org,
                              branding: {
                                ...org.branding,
                                primaryColor: e.target.value,
                              },
                            })
                          }
                          className="h-10 w-20 bg-muted border-none rounded-xl cursor-pointer"
                        />
                        <span className="text-[10px] font-bold opacity-40">
                          {org.branding.primaryColor}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-10 bg-card border border-border rounded-[2.5rem] space-y-8">
                  <div className="flex items-center space-x-4">
                    <Globe className="h-6 w-6 opacity-40" />
                    <h2 className="text-xl font-black uppercase tracking-tight">
                      Portal Network
                    </h2>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-muted/40 rounded-3xl border border-border/40">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-tight">
                          Custom Domain
                        </p>
                        <p className="text-[8px] font-bold text-muted-foreground opacity-60 text-wrap">
                          portal.youragency.com
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-[8px] font-black uppercase tracking-widest border border-border/40 px-4 rounded-full h-8 hover:bg-background"
                      >
                        Configure DNS
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-muted/40 rounded-3xl border border-border/40">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-tight">
                          White-labeling
                        </p>
                        <p className="text-[8px] font-bold text-muted-foreground opacity-60">
                          Remove all "Engine" references
                        </p>
                      </div>
                      <div
                        onClick={() =>
                          setOrg({
                            ...org,
                            settings: {
                              ...org.settings,
                              whiteLabeled: !org.settings.whiteLabeled,
                            },
                          })
                        }
                        className={`w-12 h-6 rounded-full transition-all cursor-pointer relative ${
                          org.settings.whiteLabeled
                            ? "bg-primary"
                            : "bg-muted-foreground/30"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                            org.settings.whiteLabeled ? "right-1" : "left-1"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-foreground text-background rounded-[2.5rem] space-y-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-all">
                <Shield className="h-20 w-20" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight relative z-10">
                Status: Enterprise
              </h3>
              <p className="text-xs font-medium opacity-60 relative z-10">
                Your agency portal is fully encrypted and globally distributed
                via our edge network.
              </p>
              <div className="space-y-3 relative z-10">
                {["SSL Verified", "GDPR Compliant", "Edge Injected"].map(
                  (s) => (
                    <div
                      key={s}
                      className="flex items-center space-x-2 text-[8px] font-black uppercase tracking-widest opacity-40"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{s}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrgSettings;
