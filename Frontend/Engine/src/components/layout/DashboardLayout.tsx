import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/useAuth";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  ListChecks,
  Users,
  Settings,
  LogOut,
  Menu,
  Globe,
  X,
  Bell,
  ChevronLeft,
  ChevronRight,
  Plus,
  MessageSquare,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../ThemeToggle";
import CreateProjectModal from "../CreateProjectModal";
import CommandBar from "../CommandBar";
import { useSocket } from "../../context/SocketContext";
import type { Project } from "../../types/project";
import { Search } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [manualSidebarToggle, setManualSidebarToggle] = useState(false);
  const [hoveredSidebar, setHoveredSidebar] = useState(false);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const { socket } = useSocket();

  const fetchActiveProjects = useCallback(async () => {
    if (!user?.token) return;
    try {
      const response = await fetch("http://localhost:5001/api/projects", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setActiveProjects(data.slice(0, 5)); // Show top 5
      }
    } catch (error) {
      console.error("Error fetching projects for sidebar", error);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchActiveProjects();

    if (socket) {
      socket.on("project_created", fetchActiveProjects);
      socket.on("project_updated", fetchActiveProjects);
      socket.on("project_deleted", fetchActiveProjects);
    }

    return () => {
      if (socket) {
        socket.off("project_created", fetchActiveProjects);
        socket.off("project_updated", fetchActiveProjects);
        socket.off("project_deleted", fetchActiveProjects);
      }
    };
  }, [fetchActiveProjects, socket]);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // shown state: on desktop allow hover to show collapsed sidebar temporarily
  const shownSidebar = isMobile
    ? isSidebarOpen
    : isSidebarOpen || hoveredSidebar;

  const toggleSidebar = () => {
    setManualSidebarToggle(true);
    setSidebarOpen((s) => !s);
  };

  // Auto-collapse on specific pages unless user manually toggled it
  useEffect(() => {
    if (isMobile) return;
    let t: ReturnType<typeof setTimeout> | null = null;
    const shouldCollapse =
      location.pathname === "/dashboard" ||
      location.pathname === "/client-dashboard" ||
      location.pathname.startsWith("/projects/");

    if (shouldCollapse && !manualSidebarToggle) {
      t = setTimeout(() => setSidebarOpen(false), 800);
    } else if (!shouldCollapse && !manualSidebarToggle) {
      setSidebarOpen(true);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [location.pathname, manualSidebarToggle, isMobile]);

  const navigation = [
    {
      name: "Dashboard",
      href: user?.role === "client" ? "/client-dashboard" : "/dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "employee", "client"],
    },
    {
      name: "Projects",
      href: "/projects",
      icon: FolderKanban,
      roles: ["admin", "employee", "client"],
    },
    {
      name: "My Tasks",
      href: "/tasks",
      icon: ListChecks,
      roles: ["admin", "employee"],
      moduleId: "tasks",
    },
    {
      name: "Chats",
      href: "/chat",
      icon: MessageSquare,
      roles: ["admin", "employee", "client"],
    },
    {
      name: "Invoices",
      href: "/invoices",
      icon: Globe,
      roles: ["admin", "client"],
      moduleId: "invoices",
    },
    {
      name: "White Labeling",
      href: "/org-settings",
      icon: Globe,
      roles: ["admin"],
      moduleId: "WHITE_LABEL",
    },
    { name: "Team Hub", href: "/users", icon: Users, roles: ["admin"] },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      roles: ["admin", "employee", "client"],
    },
  ];

  const filteredNavigation = navigation.filter((item) => {
    // Role check
    if (user && !item.roles.includes(user.role)) return false;

    // Module check (if applicable)
    if (item.moduleId && user) {
      const activeModules = user.modules || [];
      // Core modules are usually active by default in the mock data, or if checked here
      if (!activeModules.includes(item.moduleId)) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-background flex selection:bg-primary selection:text-primary-foreground font-sans overflow-hidden">
      {/* Sidebar */}
      <aside
        onMouseEnter={() => {
          if (!isMobile && !isSidebarOpen) setHoveredSidebar(true);
        }}
        onMouseLeave={() => {
          if (!isMobile) setHoveredSidebar(false);
        }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-background border-r border-border transition-all duration-300 ease-in-out flex flex-col",
          shownSidebar ? "w-64" : "w-20",
          isMobile && !isSidebarOpen && "-translate-x-full",
          isMobile && isSidebarOpen && "w-64 translate-x-0 shadow-2xl",
        )}
      >
        <div className="h-16 flex items-center px-6 justify-between border-b border-border/50 shrink-0">
          {shownSidebar ? (
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-primary rounded-full"></div>
              <span className="font-bold tracking-tight text-lg">Engine</span>
            </div>
          ) : (
            <div className="h-5 w-5 bg-primary rounded-full mx-auto"></div>
          )}

          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="h-8 w-8 hover:bg-muted ml-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {/* New Project CTA */}
          <div className="mb-6 px-1">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className={cn(
                "w-full transition-all group",
                shownSidebar ? "" : "px-0",
              )}
              variant="default"
            >
              <Plus
                className={cn(
                  "h-4 w-4 transition-transform group-hover:rotate-90",
                  shownSidebar ? "mr-2" : "",
                )}
              />
              {shownSidebar && "New Project"}
            </Button>
          </div>

          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => isMobile && setSidebarOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors relative group",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  !shownSidebar && "justify-center",
                )}
                title={!shownSidebar ? item.name : undefined}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground",
                    shownSidebar && "mr-3",
                  )}
                />
                {shownSidebar && (
                  <span className="flex-1 truncate">{item.name}</span>
                )}

                {isActive && !isSidebarOpen && (
                  <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                )}
              </Link>
            );
          })}

          {/* Active Projects Section */}
          {shownSidebar && activeProjects.length > 0 && (
            <div className="mt-8 px-3 pt-4 border-t border-border/30">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-4 px-1">
                Active Projects
              </p>
              <div className="space-y-1">
                {activeProjects.map((p) => (
                  <Link
                    key={p._id}
                    to={`/projects/${p._id}`}
                    className={cn(
                      "flex items-center px-3 py-2 text-xs font-bold rounded-md transition-all truncate hover:bg-muted/50",
                      location.pathname === `/projects/${p._id}`
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground",
                    )}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mr-3 shrink-0" />
                    <span className="truncate">{p.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-border/50 shrink-0">
          {!shownSidebar ? (
            <div className="flex flex-col items-center gap-4">
              <div
                className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium cursor-pointer"
                title={user?.name}
              >
                {user?.name?.[0] || "U"}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                  {user?.name?.[0] || "U"}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-0 transition-all duration-300 ease-in-out",
          shownSidebar && !isMobile ? "ml-64" : !isMobile ? "ml-20" : "",
        )}
      >
        <header className="h-16 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-6">
          <div className="flex items-center">
            {isMobile ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="mr-4"
              >
                <Menu className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="text-muted-foreground hover:text-foreground"
              >
                {shownSidebar ? (
                  <ChevronLeft className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>

          <div className="flex items-center ml-auto space-x-4">
            <button
              onClick={() =>
                window.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", metaKey: true }),
                )
              }
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-muted/50 text-muted-foreground hover:text-foreground transition-all hover:border-foreground/20"
            >
              <Search className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Search Engine
              </span>
              <kbd className="text-[9px] font-black px-1.5 py-0.5 rounded bg-background border border-border">
                ⌘K
              </kbd>
            </button>
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={() => {
          setIsCreateModalOpen(false);
          // notify other parts of the app to refresh project lists
          window.dispatchEvent(new CustomEvent("projectCreated"));
        }}
      />

      <CommandBar />

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
