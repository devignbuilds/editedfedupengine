import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FolderKanban,
  ListChecks,
  MessageSquare,
  LayoutDashboard,
  Settings,
  Command,
  ArrowRight,
  User,
  Zap
} from "lucide-react";
import { useAuth } from "../context/useAuth";

interface CommandItem {
  id: string;
  title: string;
  category: "Pages" | "Projects" | "Tasks" | "Utilities";
  icon: any;
  href: string;
}

const CommandBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      fetchSearchData();
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const fetchSearchData = async () => {
    if (!user?.token) return;
    try {
      const [pRes, tRes] = await Promise.all([
        fetch("http://localhost:5001/api/projects", {
          headers: { Authorization: `Bearer ${user.token}` }
        }),
        fetch("http://localhost:5001/api/tasks", {
          headers: { Authorization: `Bearer ${user.token}` }
        })
      ]);
      
      if (pRes.ok) setProjects(await pRes.json());
      if (tRes.ok) setTasks(await tRes.json());
    } catch (err) {
      console.error("Search fetch failed", err);
    }
  };

  const navItems: CommandItem[] = [
    { id: "dash", title: "Dashboard", category: "Pages", icon: LayoutDashboard, href: "/dashboard" },
    { id: "projects", title: "All Projects", category: "Pages", icon: FolderKanban, href: "/projects" },
    { id: "tasks", title: "Global Tasks", category: "Pages", icon: ListChecks, href: "/tasks" },
    { id: "chat", title: "Messages", category: "Pages", icon: MessageSquare, href: "/chat" },
    { id: "settings", title: "Settings", category: "Pages", icon: Settings, href: "/settings" },
    { id: "profile", title: "User Profile", category: "Pages", icon: User, href: "/settings/profile" },
  ];

  const projectItems: CommandItem[] = projects.map(p => ({
    id: p._id,
    title: p.name,
    category: "Projects",
    icon: FolderKanban,
    href: `/projects/${p._id}`
  }));

  const taskItems: CommandItem[] = tasks.map(t => ({
    id: t._id,
    title: t.title,
    category: "Tasks",
    icon: ListChecks,
    href: t.project ? `/projects/${t.project}` : "/tasks"
  }));

  const allItems = [...navItems, ...projectItems, ...taskItems];

  const filteredItems = query === "" 
    ? allItems.slice(0, 8) 
    : allItems.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);

  const handleSelect = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm pointer-events-auto"
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl bg-card border border-border/50 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col relative z-10"
          >
            {/* Search Input */}
            <div className="flex items-center px-6 py-5 border-b border-border/50">
              <Search className="h-5 w-5 text-muted-foreground mr-4" />
              <input
                ref={inputRef}
                className="flex-1 bg-transparent border-none outline-none text-lg font-medium placeholder:text-muted-foreground/50"
                placeholder="Search projects, tasks, or commands..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-[10px] font-black tracking-widest uppercase opacity-50">
                <Command className="h-3 w-3" />
                <span>K</span>
              </div>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto p-3 space-y-6">
              {filteredItems.length > 0 ? (
                <div className="space-y-1">
                   {filteredItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.href)}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-primary/10 transition-all group text-left"
                      >
                        <div className="h-10 w-10 rounded-xl bg-muted group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                          <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm tracking-tight">{item.title}</p>
                          <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">{item.category}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </button>
                   ))}
                </div>
              ) : (
                <div className="py-12 text-center space-y-4">
                  <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                    <Search className="h-6 w-6" />
                  </div>
                  <p className="text-muted-foreground font-medium italic">No results found for "{query}"</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-muted/30 border-t border-border/50 flex items-center justify-between">
               <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                    <span className="px-1 py-0.5 bg-background border border-border rounded">Esc</span>
                    <span>to close</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                    <span className="px-1 py-0.5 bg-background border border-border rounded">↵</span>
                    <span>to navigate</span>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                 <Zap className="h-3 w-3 text-primary" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Devign Command v1</span>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandBar;
