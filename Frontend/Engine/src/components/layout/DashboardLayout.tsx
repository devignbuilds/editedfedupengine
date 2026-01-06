import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  Layout,
  Globe,
  CreditCard,
  X,
  Bell,
  Bot,
  Rocket,
  ToggleLeft,
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Sparkles,
} from 'lucide-react';
import { usePermissions, type Feature } from '../../hooks/usePermissions';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { isPro } = usePermissions();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [enabledModules, setEnabledModules] = useState<string[]>([]);
  const [configLoading, setConfigLoading] = useState(true);

  // Fetch module configuration
  useEffect(() => {
    const fetchModuleConfig = async () => {
      if (user?.role !== 'admin') {
        setConfigLoading(false);
        return;
      }
      
      try {
        const res = await fetch('http://localhost:5000/api/modules/config', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setEnabledModules(data.enabledModules || []);
        }
      } catch (err) {
        console.error('Failed to fetch module config:', err);
      } finally {
        setConfigLoading(false);
      }
    };

    fetchModuleConfig();
  }, [user]);

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'employee', 'client'] },
    { name: 'Projects', href: '/projects', icon: FolderKanban, roles: ['admin', 'employee', 'client'] },
    { name: 'Team', href: '/team-dashboard', icon: Users, roles: ['admin', 'employee'] },
    { name: 'AI Growth', href: '/ai', icon: Bot, roles: ['admin'], feature: 'AI_GROWTH' as Feature, moduleId: 'AI_GROWTH' },
    { name: 'Content Hub', href: '/content', icon: Layout, roles: ['admin'], feature: 'CONTENT_HUB' as Feature, moduleId: 'CONTENT_HUB' },
    { name: 'Scale Engine', href: '/growth', icon: Rocket, roles: ['admin'], moduleId: 'SCALE_ENGINE' },
    { name: 'Agency Scale', href: '/org-settings', icon: Globe, roles: ['admin'], moduleId: 'WHITE_LABEL' },
    { name: 'Users', href: '/users', icon: Users, roles: ['admin'] },
    { name: 'App Market', href: '/marketplace', icon: ShoppingBag, roles: ['admin', 'client'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin', 'employee', 'client'] },
    { name: 'Module Control', href: '/module-settings', icon: ToggleLeft, roles: ['admin'] },
  ];

  const filteredNavigation = navigation.filter(item => {
    // Filter by role
    if (user && !item.roles.includes(user.role)) return false;
    
    // For admins, filter by module config (if module has a moduleId)
    if (user?.role === 'admin' && item.moduleId && !configLoading) {
      return enabledModules.includes(item.moduleId);
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-background flex selection:bg-primary selection:text-primary-foreground font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 glass border-r border-border transition-all duration-500 ease-in-out lg:relative lg:translate-x-0 overflow-hidden",
          !isSidebarOpen && "-translate-x-full lg:w-0 lg:opacity-0 lg:border-none"
        )}
      >
        <div className="h-full flex flex-col relative z-10">
          <div className="h-20 flex items-center px-8">
            <h1 className="text-2xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/40">
              Engine
            </h1>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-200 group relative",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10" 
                      : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className={cn("mr-3 h-4 w-4 transition-transform group-hover:scale-110", isActive ? "text-primary-foreground" : "")} />
                  <span className="flex-1">{item.name}</span>
                  {item.feature && isPro(item.feature) && user?.role === 'client' && (
                    <div className="flex items-center space-x-1 px-2 py-0.5 bg-primary/10 rounded-full">
                      <Sparkles className="h-2.5 w-2.5 text-primary" />
                      <span className="text-[7px] font-black uppercase tracking-tighter text-primary">Pro</span>
                    </div>
                  )}
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute right-2 w-1 h-4 bg-primary-foreground rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-border/50 space-y-6">
            <div className="flex items-center px-2">
              <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black text-xs shadow-xl rotate-3">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="ml-4 overflow-hidden">
                <p className="text-[11px] font-black uppercase tracking-widest truncate">{user?.name}</p>
                <div className="flex items-center mt-0.5">
                   <p className="text-[10px] font-medium text-muted-foreground opacity-50 truncate">{user?.role}</p>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-[10px] font-black uppercase tracking-widest text-destructive hover:bg-destructive/5" 
              onClick={logout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-6">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center ml-auto space-x-4">
               <Button variant="ghost" size="icon">
                 <Bell className="h-5 w-5 text-muted-foreground" />
               </Button>
            </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
