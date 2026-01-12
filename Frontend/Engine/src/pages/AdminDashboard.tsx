import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Activity, DollarSign, Users, ExternalLink, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: 12, // Default mock data
    users: 24,
    revenue: 45231.89,
    visits: 8902,
    activeModules: 8,
    recentProjects: []
  });

  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/admin/stats', {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        const data = await response.json();
        if (response.ok && data) {
          setStats(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error('Failed to fetch stats, utilizing mock data', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchStats();
    } else {
        setLoading(false); // Just show mock data if not authenticated/no token for dev
    }
  }, [user]);

    // Mock trend data for the chart
    const trendData = [30, 45, 50, 40, 60, 75, 65, 80, 70, 90, 85, 100];
    const maxVal = Math.max(...trendData);
    const minVal = Math.min(...trendData);
    const normalizedData = trendData.map(val => (val - minVal) / (maxVal - minVal));
    const points = normalizedData.map((val, index) => `${index * (100 / (trendData.length - 1))},${100 - (val * 100)}`).join(' ');


  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-[50vh]">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </DashboardLayout>
  );

  const metrics = [
    { label: 'Total Revenue', value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.revenue), change: '+20.1%', trend: 'up', icon: DollarSign },
    { label: 'Active Projects', value: stats.projects, change: '+12%', trend: 'up', icon: Activity },
    { label: 'Active Users', value: stats.users, change: '+5%', trend: 'up', icon: Users },
     { label: 'Active Modules', value: stats.activeModules, change: '+2', trend: 'neutral', icon: Users }, // Reusing Users icon or similar
  ];

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Overview</h1>
            <p className="text-muted-foreground mt-1 text-sm">Welcome back, here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" size="sm" asChild className="h-9">
               <Link to="/users">Manage Users</Link>
             </Button>
            <Button size="sm" asChild className="h-9 shadow-sm">
              <Link to="/projects">
                Manage Projects <ExternalLink className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, i) => (
            <motion.div 
              key={metric.label} 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <Card className="card-hover border-border/60 shadow-sm bg-card hover:border-border/80 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{metric.label}</CardTitle>
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight">{metric.value}</div>
                  <div className="flex items-center gap-2 mt-1">
                     <span className={`inline-flex items-center text-xs font-medium ${
                        metric.trend === 'up' ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-md' : 
                        metric.trend === 'down' ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded-md' : 
                        'text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-md'
                     }`}>
                        {metric.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                        {metric.trend === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                        {metric.change}
                     </span>
                     <span className="text-xs text-muted-foreground">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
          {/* Revenue Chart */}
          <Card className="col-span-1 lg:col-span-4 border-border/60 shadow-sm bg-card">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>
                Monthly revenue performance over the last year.
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-0">
               <div className="h-[300px] w-full mt-4 flex items-end justify-center px-4 relative">
                  {/* Grid Lines */}
                   <div className="absolute inset-x-4 top-0 bottom-0 flex flex-col justify-between text-muted-foreground/20 pointer-events-none">
                       {[0, 1, 2, 3, 4].map((_, i) => (
                           <div key={i} className="border-t border-dashed w-full h-px"></div>
                       ))}
                   </div>

                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                     <path 
                        d={`M0,100 L${points} L100,100 Z`} 
                        fill="url(#gradient)" 
                        className="opacity-50"
                     />
                     <path 
                        d={`M0,100 ${points.split(' ').map((p, i) => (i === 0 ? `L${p}` : `L${p}`)).join(' ')}`} 
                        fill="none" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                     />
                  </svg>
                  
                  {/* Tooltip placeholder hint */}
                   <div className="absolute top-4 right-4 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                       Last 12 Months
                   </div>
               </div>
               <div className="flex justify-between px-6 mt-4 text-xs text-muted-foreground">
                   <span>Jan</span>
                   <span>Jun</span>
                   <span>Dec</span>
               </div>
            </CardContent>
          </Card>

          {/* Recent Activity / Projects */}
          <Card className="col-span-1 lg:col-span-3 border-border/60 shadow-sm bg-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest projects and system events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {(stats.recentProjects && stats.recentProjects.length > 0) ? (
                   (stats as any).recentProjects.map((p: any) => (
                  <div key={p._id} className="flex items-start space-x-4">
                     <div className="mt-1 bg-primary/10 p-2 rounded-full">
                         <Activity className="h-4 w-4 text-primary" />
                     </div>
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.client?.name || 'Unknown Client'} • Recently updated</p>
                       <div className="w-full bg-secondary h-1.5 rounded-full mt-2 overflow-hidden">
                           <div className="bg-primary h-full rounded-full" style={{ width: `${p.progress || 30}%`}}></div>
                       </div>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                        2h ago
                    </div>
                  </div>
                ))) : (
                    // Fallback Mock Activity if no real projects
                    [1, 2, 3].map((_, i) => (
                         <div key={i} className="flex items-start space-x-4">
                            <div className="mt-1 bg-muted p-2 rounded-full">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="space-y-1 flex-1">
                                <p className="text-sm font-medium leading-none">System System Update {i + 1}</p>
                                <p className="text-xs text-muted-foreground">Automated maintenance • System</p>
                            </div>
                            <div className="text-xs text-muted-foreground whitespace-nowrap">
                                {i + 2}h ago
                            </div>
                         </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
