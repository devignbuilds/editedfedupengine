import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import DashboardLayout from "../components/layout/DashboardLayout";
import ChatWindow from "../components/ChatWindow";
import { MessageSquare, Hash, Search } from "lucide-react";

export default function Chat() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/projects", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setProjects(data);
          // Set "general" as default if admin/employee
          if (user?.role === "admin" || user?.role === "employee") {
            setSelectedProject({ _id: "general", name: "General Workspace" });
          } else if (data.length > 0) {
            setSelectedProject(data[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch projects for chat", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchProjects();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-10rem)] flex overflow-hidden border border-border rounded-[2rem] bg-card shadow-2xl relative">
        {/* Chat Sidebar */}
        <aside className="w-80 border-r border-border bg-muted/20 flex flex-col shrink-0">
          <div className="p-6 border-b border-border space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">Channels</h2>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter channels..."
                className="w-full bg-background/50 border border-border rounded-lg pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {/* General Channel for Team */}
            {(user?.role === "admin" || user?.role === "employee") && (
              <button
                key="general"
                onClick={() =>
                  setSelectedProject({
                    _id: "general",
                    name: "General Workspace",
                  })
                }
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  selectedProject?._id === "general"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="relative">
                  <Hash
                    className={`h-4 w-4 shrink-0 ${
                      selectedProject?._id === "general"
                        ? "text-primary-foreground"
                        : "text-primary opacity-60 group-hover:opacity-100"
                    }`}
                  />
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full animate-pulse border-2 border-background" />
                </div>
                <span className="font-black text-xs uppercase tracking-widest truncate">
                  General Workspace
                </span>
              </button>
            )}

            <div className="pt-4 pb-2 px-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">
                Project Channels
              </p>
            </div>

            {projects.map((p) => (
              <button
                key={p._id}
                onClick={() => setSelectedProject(p)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  selectedProject?._id === p._id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <Hash
                  className={`h-4 w-4 shrink-0 ${
                    selectedProject?._id === p._id
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-primary"
                  } transition-colors`}
                />
                <span className="font-bold text-sm truncate">{p.name}</span>
              </button>
            ))}
            {!loading && projects.length === 0 && (
              <div className="p-4 text-center">
                <p className="text-xs text-muted-foreground italic">
                  No active channels.
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-background/30 max-h-full">
          {selectedProject ? (
            <>
              <header className="h-20 border-b border-border px-8 flex items-center justify-between bg-background/40 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                    #
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-none">
                      {selectedProject.name}
                    </h3>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1.5 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                      Active Sync
                    </p>
                  </div>
                </div>
              </header>
              <div className="flex-1 overflow-hidden p-6">
                <ChatWindow
                  key={selectedProject._id}
                  projectId={selectedProject._id}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
              <div className="h-24 w-24 rounded-full bg-muted/20 flex items-center justify-center border border-border">
                <MessageSquare className="h-10 w-10 text-muted-foreground opacity-20" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight mb-2">
                  Initialize Communication
                </h3>
                <p className="text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  Select a project channel to start real-time synchronization
                  with your team and clients.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
}
