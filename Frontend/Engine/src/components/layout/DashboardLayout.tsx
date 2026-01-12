import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
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
  MessageSquare
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../ThemeToggle';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'employee'] },
    { name: 'Client Hub', href: '/client-dashboard', icon: LayoutDashboard, roles: ['client'] },
    { name: 'Projects', href: '/projects', icon: FolderKanban, roles: ['admin', 'employee', 'client'] },
    { name: 'My Tasks', href: '/tasks', icon: ListChecks, roles: ['admin', 'employee'] },
    { name: 'Team', href: '/team-dashboard', icon: Users, roles: ['admin'] },
    { name: 'Messages', href: '/chat', icon: MessageSquare, roles: ['admin', 'employee', 'client'] },
    { name: 'Invoices', href: '/invoices', icon: Globe, roles: ['admin', 'client'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin', 'employee', 'client'] },
    { name: 'Org Settings', href: '/org-settings', icon: Globe, roles: ['admin'] },
  ];

  const filteredNavigation = navigation.filter(item => {
    if (user && !item.roles.includes(user.role)) return false;
    return true;
  });

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-background flex selection:bg-primary selection:text-primary-foreground font-sans overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
            "fixed inset-y-0 left-0 z-50 bg-background border-r border-border transition-all duration-300 ease-in-out flex flex-col",
            isSidebarOpen ? "w-64" : "w-20",
            isMobile && !isSidebarOpen && "-translate-x-full",
            isMobile && isSidebarOpen && "w-64 translate-x-0 shadow-2xl"
        )}
      >
        <div className="h-16 flex items-center px-6 justify-between border-b border-border/50 shrink-0">
          {isSidebarOpen ? (
               <div className="flex items-center space-x-2">
                   <div className="h-5 w-5 bg-primary rounded-full"></div>
                   <span className="font-bold tracking-tight text-lg">Engine</span>
               </div>
          ) : (
               <div className="h-5 w-5 bg-primary rounded-full mx-auto"></div>
          )}
          
          {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="h-8 w-8 hover:bg-muted ml-auto">
                <X className="h-4 w-4" />
              </Button>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {/* New Project CTA */}
           <div className="mb-6 px-1">
             <Button className={cn("w-full transition-all group", isSidebarOpen ? "" : "px-0")} variant="default">
                 <Plus className={cn("h-4 w-4 transition-transform group-hover:rotate-90", isSidebarOpen ? "mr-2" : "")} />
                 {isSidebarOpen && "New Project"}
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
                  !isSidebarOpen && "justify-center"
                )}
                title={!isSidebarOpen ? item.name : undefined}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-muted-foreground", isSidebarOpen && "mr-3")} />
                {isSidebarOpen && <span className="flex-1 truncate">{item.name}</span>}
                
                {isActive && !isSidebarOpen && (
                    <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50 shrink-0">
           {!isSidebarOpen ? (
                <div className="flex flex-col items-center gap-4">
                     <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium cursor-pointer" title={user?.name}>
                        {user?.name?.[0] || 'U'}
                     </div>
                     <Button variant="ghost" size="icon" onClick={logout} title="Sign out">
                        <LogOut className="h-4 w-4" />
                     </Button>
                </div>
           ) : (
               <>
               <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    {user?.name?.[0] || 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate capitalize">{user?.role}</p>
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
      <div className={cn(
          "flex-1 flex flex-col min-h-0 transition-all duration-300 ease-in-out",
          isSidebarOpen && !isMobile ? "ml-64" : (!isMobile ? "ml-20" : "")
      )}>
        <header className="h-16 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-6">
            <div className="flex items-center">
                 {isMobile ? (
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="mr-4">
                        <Menu className="h-5 w-5" />
                    </Button>
                 ) : (
                    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-muted-foreground hover:text-foreground">
                        {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </Button>
                 )}
            </div>
            
            <div className="flex items-center ml-auto space-x-4">
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
      
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
