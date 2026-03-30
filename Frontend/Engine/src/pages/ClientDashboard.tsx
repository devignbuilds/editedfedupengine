import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import type { Project } from "../types/project";
import { Link } from "react-router-dom";
import InvoiceList from "../components/InvoiceList";
import NotificationList from "../components/NotificationList";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Plus, Layout } from "lucide-react";
import { motion } from "framer-motion";
import OnboardingWizard from "../components/OnboardingWizard";
import ClientNextSteps from "../components/ClientNextSteps";
import ProjectCreationWizard from "../components/ProjectCreationWizard";
import { Sparkles } from "lucide-react";
import { useSocket } from "../context/SocketContext";

const ClientDashboard = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Renamed state variable
  const [hasOnboarded, setHasOnboarded] = useState(() => {
    return localStorage.getItem("onboarding_completed") === "true";
  });

  // Removed requestData, requestLoading, requestError

  // ... (keep useEffect)
  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/projects", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchProjects();
    }

    const handleRefresh = () => fetchProjects();
    window.addEventListener("projectCreated", handleRefresh);

    if (socket) {
      socket.on("project_updated", handleRefresh);
      socket.on("project_created", handleRefresh);
    }

    return () => {
      window.removeEventListener("projectCreated", handleRefresh);
      if (socket) {
        socket.off("project_updated", handleRefresh);
        socket.off("project_created", handleRefresh);
      }
    };
  }, [user?.token, socket]);

  const handleOnboardingComplete = () => {
    setHasOnboarded(true);
    localStorage.setItem("onboarding_completed", "true");
  };

  if (loading)
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      {!hasOnboarded && projects.length === 0 && (
        <OnboardingWizard onComplete={handleOnboardingComplete} />
      )}

      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name}.
            </p>
          </div>
          {projects.length > 0 && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Button>
          )}
        </div>

        {/* Empty State / Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {projects.length === 0 ? (
              <div className="relative border border-dashed border-border/50 bg-background/50 rounded-3xl p-16 text-center overflow-hidden min-h-[500px] flex flex-col items-center justify-center group">
                {/* Background Elements */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 flex flex-col items-center max-w-lg mx-auto">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20"
                  >
                    <Sparkles className="h-10 w-10 text-primary" />
                  </motion.div>

                  <h3 className="text-3xl font-black mb-4 tracking-tight">
                    The Engine is Idle.
                  </h3>
                  <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                    Your workspace is ready. Initiate your first project to
                    unlock milestone tracking, real-time collaboration, and
                    automated billing.
                  </p>
                    <Button
                      size="lg"
                      onClick={() => setIsCreateModalOpen(true)}
                      className="h-16 px-16 rounded-full font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-lg"
                    >
                      Initialize Engine
                      <Sparkles className="ml-3 h-6 w-6" />
                    </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Layout className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Active Worlds</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <Link
                      key={project._id}
                      to={`/projects/${project._id}`}
                      className="group relative flex flex-col p-8 rounded-3xl border border-border/50 bg-card hover:border-primary/50 transition-all hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                          <h3 className="font-bold text-xl truncate pr-4">
                            {project.name}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest ${
                              project.status === "active"
                                ? "bg-primary/20 text-primary border border-primary/20"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>
                        <p className="text-muted-foreground line-clamp-2 mb-8 h-12 leading-relaxed">
                          {project.description || "No description provided."}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground font-bold uppercase tracking-wider">
                          <span>
                            {(project as any).progress || 0}% SYNCHRONIZED
                          </span>
                          <div className="ml-auto w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-500"
                              style={{
                                width: `${(project as any).progress || 0}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-6">
            <ClientNextSteps
              projects={projects}
              onCreateProject={() => setIsCreateModalOpen(true)}
            />

            <Card>
              <CardContent className="p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                  Notifications
                </h2>
                <NotificationList />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                  Billing
                </h2>
                <InvoiceList />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ProjectCreationWizard
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={() => {
          setIsCreateModalOpen(false);
          // notify other parts of the app to refresh project lists
          window.dispatchEvent(new CustomEvent("projectCreated"));
        }}
      />
    </DashboardLayout>
  );
};

export default ClientDashboard;
