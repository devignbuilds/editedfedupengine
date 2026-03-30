import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import {
  Sparkles,
  ArrowRight,
  Layers,
  Smartphone,
  ShoppingCart,
  Palette,
  Code2,
  X,
  Target,
  Clock,
  Zap,
  DollarSign,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import type { User as UserType } from "../types/user";
import { cn } from "../lib/utils";

interface ProjectCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
}

const ProjectCreationWizard = ({
  isOpen,
  onClose,
  onProjectCreated,
}: ProjectCreationWizardProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clients, setClients] = useState<UserType[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    serviceType: "both",
    projectType: "web-app",
    budget: "",
    timeline: "standard",
    paymentModel: "quote",
    client: "",
  });

  const nextStep = () => {
    if (step === 0 && user?.role === "admin") {
      fetchClients();
    }
    setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  const fetchClients = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/users?role=client", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await response.json();
      setClients(data);
    } catch (err) {
      console.error("Failed to fetch clients", err);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5001/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onProjectCreated();
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create project.");
        setStep(1); // Go back to where they can fix info if needed
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 5;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl p-4 md:p-8">
      <div className="w-full max-w-4xl bg-card border border-border/40 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header/Progress */}
        <div className="p-8 border-b border-border/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight uppercase italic">
                Initialize Project
              </h2>
              <div className="flex gap-1 mt-1">
                {[...Array(totalSteps)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1 w-8 rounded-full transition-all duration-300",
                      i <= step ? "bg-primary" : "bg-muted"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold text-center rounded-2xl"
              >
                {error}
              </motion.div>
            )}

            {/* Step 0: Welcome & Basic Info */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center max-w-xl mx-auto space-y-4">
                  <h3 className="text-3xl font-black">Let's Define Your Vision</h3>
                  <p className="text-muted-foreground font-medium">
                    What should we call this initiative? A great name sets the tone.
                  </p>
                </div>
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Project Name
                    </label>
                    <input
                      autoFocus
                      type="text"
                      placeholder="e.g., Project X: Genesis"
                      className="w-full px-6 py-4 bg-muted/20 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg font-bold placeholder:opacity-30 transition-all hover:border-primary/40"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-center pt-8">
                  <Button
                    disabled={!formData.name}
                    size="lg"
                    onClick={nextStep}
                    className="h-14 px-12 rounded-full font-black uppercase tracking-widest shadow-xl"
                  >
                    Continue <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 0.5 (Admin only): Select Client */}
            {step === 1 && user?.role === "admin" && (
              <motion.div
                key="stepAdmin"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-black">Assign Origin</h3>
                  <p className="text-muted-foreground font-medium">
                    Which client workspace does this project belong to?
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {clients.map((client) => (
                    <button
                      key={client._id}
                      onClick={() => {
                        setFormData({ ...formData, client: client._id });
                        nextStep();
                      }}
                      className={cn(
                        "p-6 rounded-2xl border-2 flex items-center gap-4 transition-all",
                        formData.client === client._id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-muted/10"
                      )}
                    >
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold">
                        {client.name[0]}
                      </div>
                      <div className="text-left">
                        <p className="font-bold">{client.name}</p>
                        <p className="text-xs text-muted-foreground">{client.email}</p>
                      </div>
                    </button>
                  ))}
                  {clients.length === 0 && (
                     <p className="col-span-2 text-center text-muted-foreground py-12">No clients found. Please create a client user first.</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 1: Project Type */}
            {((step === 1 && user?.role !== "admin") || step === 2) && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-black">Project Anatomy</h3>
                  <p className="text-muted-foreground font-medium">
                    What medium are we building for?
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: "web-app", label: "Web App", icon: Layers },
                    { id: "mobile-app", label: "Mobile App", icon: Smartphone },
                    { id: "website", label: "Website", icon: Zap },
                    { id: "ecommerce", label: "E-commerce", icon: ShoppingCart },
                    { id: "design-system", label: "Design System", icon: Palette },
                    { id: "branding", label: "Branding", icon: Sparkles },
                    { id: "api", label: "API / Backend", icon: Code2 },
                    { id: "custom", label: "Custom Scope", icon: Target },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setFormData({ ...formData, projectType: type.id });
                        setTimeout(nextStep, 200);
                      }}
                      className={cn(
                        "p-6 rounded-3xl border-2 flex flex-col items-center justify-center gap-4 transition-all hover:scale-105",
                        formData.projectType === type.id
                          ? "border-primary bg-primary/10 shadow-lg ring-2 ring-primary/20"
                          : "border-border/50 bg-muted/10 hover:border-primary/50"
                      )}
                    >
                      <div className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center transition-colors",
                        formData.projectType === type.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        <type.icon className="h-6 w-6" />
                      </div>
                      <span className="font-bold text-sm">{type.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Service Type */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 text-center"
              >
                <div className="space-y-4">
                  <h3 className="text-3xl font-black">Expertise Integration</h3>
                  <p className="text-muted-foreground font-medium">
                    Select the service modules required for success.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {[
                      { id: "design", label: "Design", desc: "UI/UX & Identity", icon: Palette },
                      { id: "development", label: "Development", desc: "Full-Stack Build", icon: Code2 },
                      { id: "both", label: "Both", desc: "End-to-End Build", icon: Sparkles },
                    ].map((service) => (
                      <button
                        key={service.id}
                        onClick={() => {
                          setFormData({ ...formData, serviceType: service.id });
                          setTimeout(nextStep, 200);
                        }}
                        className={cn(
                          "p-8 rounded-[2rem] border-2 flex flex-col items-center gap-4 transition-all hover:scale-105",
                          formData.serviceType === service.id
                            ? "border-primary bg-primary/10 shadow-lg"
                            : "border-border/50 bg-muted/10 hover:border-primary/50"
                        )}
                      >
                         <div className={cn(
                          "h-16 w-16 rounded-2xl flex items-center justify-center mb-2",
                          formData.serviceType === service.id ? "bg-primary text-primary-foreground shadow-xl" : "bg-muted text-muted-foreground"
                        )}>
                          <service.icon className="h-8 w-8" />
                        </div>
                        <div>
                          <p className="font-black text-xl mb-1">{service.label}</p>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{service.desc}</p>
                        </div>
                      </button>
                    ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Budget & Timeline */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-black">Constraints & Scale</h3>
                  <p className="text-muted-foreground font-medium">
                    Help us align our resources with your goals.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                   <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                          Budget Estimate (USD)
                        </label>
                        <div className="relative group">
                          <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <input
                            type="text"
                            placeholder="e.g., 5,000 - 15,000"
                            className="w-full pl-14 pr-6 py-4 bg-muted/20 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg font-bold transition-all hover:border-primary/40"
                            value={formData.budget}
                            onChange={(e) =>
                              setFormData({ ...formData, budget: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                          Timeline Priority
                        </label>
                        <div className="flex gap-2">
                          {[
                            { id: "asap", label: "ASAP", icon: Zap },
                            { id: "standard", label: "Standard", icon: Clock },
                            { id: "flexible", label: "Flexible", icon: Layers },
                          ].map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setFormData({ ...formData, timeline: t.id })}
                              className={cn(
                                "flex-1 py-3 px-4 rounded-xl border-2 font-bold text-xs flex flex-col items-center gap-1 transition-all",
                                formData.timeline === t.id ? "border-primary bg-primary/10" : "border-border bg-muted/10"
                              )}
                            >
                              <t.icon className="h-4 w-4" />
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                          Payment Model
                        </label>
                        <div className="space-y-2">
                           {[
                             { id: "quote", label: "Request Custom Quote", desc: "Best for complex builds" },
                             { id: "one-time", label: "One-Time Payment", desc: "Defined project scope" },
                             { id: "subscription", label: "Monthly Retainer", desc: "Ongoing iterations" },
                           ].map((m) => (
                             <button
                                key={m.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, paymentModel: m.id })}
                                className={cn(
                                  "w-full p-4 rounded-xl border-2 text-left transition-all",
                                  formData.paymentModel === m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                                )}
                             >
                               <div className="flex items-center justify-between">
                                  <span className="font-bold text-sm">{m.label}</span>
                                  {formData.paymentModel === m.id && <div className="h-2 w-2 rounded-full bg-primary" />}
                               </div>
                               <p className="text-[10px] text-muted-foreground font-medium">{m.desc}</p>
                             </button>
                           ))}
                        </div>
                      </div>
                   </div>
                </div>
                <div className="flex justify-center pt-4">
                   <Button size="lg" onClick={nextStep} className="h-14 px-12 rounded-full font-black uppercase tracking-widest shadow-xl">
                      Almost There <ArrowRight className="ml-2 h-5 w-5" />
                   </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Final Brief */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-black">Transmission Brief</h3>
                  <p className="text-muted-foreground font-medium">
                    What are the core objectives and success metrics for this project?
                  </p>
                </div>
                <div className="max-w-xl mx-auto space-y-4">
                  <textarea
                    autoFocus
                    placeholder="Describe your goals, target audience, and any critical features or inspirations..."
                    className="w-full px-8 py-6 bg-muted/20 border border-border rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg font-medium h-64 resize-none transition-all hover:border-primary/40 leading-relaxed"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                  <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                    <p className="text-xs font-bold text-primary/80 uppercase tracking-widest mb-2">Syncing Module: PROJECT-V1</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      Upon submission, our lead architects will review your brief and initialize the project workspace. You will receive a notification within 24 hours.
                    </p>
                  </div>
                </div>
                <div className="flex justify-center pt-8">
                  <Button
                    disabled={!formData.description || loading}
                    size="lg"
                    onClick={handleSubmit}
                    className="h-16 px-16 rounded-full font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-lg"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                         <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                         <span>Initializing...</span>
                      </div>
                    ) : (
                      <>
                        Initialize Engine
                        <Sparkles className="ml-3 h-6 w-6" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {step > 0 && (
          <div className="p-6 border-t border-border/40 flex justify-between items-center shrink-0">
            <button
              onClick={prevStep}
              className="px-6 py-2 text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-30">
              Devign Engine v1.0
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCreationWizard;
