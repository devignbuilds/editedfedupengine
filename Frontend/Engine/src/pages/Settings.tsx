import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { User, Lock, Save, Camera, ShieldCheck, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/useAuth";

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const tabs: Tab[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
  ];

  const filteredTabs = tabs.filter(
    (tab) => !tab.roles || (user && tab.roles.includes(user.role)),
  );

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setStatus("Settings synchronized");
      setTimeout(() => setStatus(null), 3000);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-12 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-2">
            System Settings
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            Configure your identity and modular infrastructure.
          </p>
        </motion.div>

        <div className="flex space-x-1 border-b border-border/40 pb-px">
          {filteredTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "profile" | "security")}
              className={cn(
                "flex items-center space-x-3 px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative",
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground/40 hover:text-foreground/60",
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="min-h-[400px]"
          >
            {activeTab === "profile" && (
              <div className="space-y-10 max-w-2xl">
                <div className="flex items-center gap-8">
                  <div className="relative group">
                    <div className="h-28 w-28 rounded-3xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden rotate-2 group-hover:rotate-0 transition-transform">
                      <User className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-2.5 bg-foreground text-background rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest mb-1 italic">
                      Identity Signature
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-[200px]">
                      Your public profile avatar and display metadata.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      defaultValue={user?.name}
                      className="w-full bg-muted/30 border border-border rounded-2xl px-5 py-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                      Email Protocol
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      defaultValue={user?.email}
                      className="w-full bg-muted/30 border border-border rounded-2xl px-5 py-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-not-allowed opacity-50"
                      disabled
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-8 max-w-md">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                    Existing Cipher
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-muted/30 border border-border rounded-2xl px-5 py-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                    New Cipher Engine
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-muted/30 border border-border rounded-2xl px-5 py-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                    Verify Cipher
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-muted/30 border border-border rounded-2xl px-5 py-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="pt-12 border-t border-border/40 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="px-10 py-7 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] h-auto shadow-2xl hover:shadow-primary/30 transition-all active:scale-[0.98]"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 animate-pulse" />
                  <span>Syncing...</span>
                </div>
              ) : (
                <>
                  <Save className="mr-3 h-4 w-4" />
                  Save System
                </>
              )}
            </Button>

            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary"
                >
                  <ShieldCheck className="h-4 w-4" />
                  {status}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden md:flex flex-col items-end opacity-20 filter grayscale select-none">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-3 w-3 bg-foreground rounded-full" />
              <span className="font-black tracking-tighter uppercase italic text-xs">
                Devign Engine
              </span>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.4em]">
              Integrated OS v1.0.4
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
