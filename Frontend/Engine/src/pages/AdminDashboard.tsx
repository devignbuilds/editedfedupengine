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
    projects: 0,
    users: 0,
    revenue: 0,
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
        if (response.ok) {
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchStats();
    }
  }, [user]);

  if (loading) return <DashboardLayout><div className="p-8">Loading stats...</div></DashboardLayout>;

  const metrics = [
    { label: 'Total Revenue', value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.revenue), change: '+20.1%', trend: 'up', icon: DollarSign },
    { label: 'Active Projects', value: stats.projects, change: '+5%', trend: 'up', icon: Activity },
    { label: 'Active Users', value: stats.users, change: '+2%', trend: 'up', icon: Users },
    { label: 'System Health', value: '99.9%', change: 'Operational', trend: 'neutral', icon: Activity },
  ];

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your system performance.</p>
        </div>
        <div className="space-x-4">
          <Button asChild>
            <Link to="/projects">
              Manage Projects <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/users">Manage Users</Link>
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {metrics.map((metric, i) => (
          <motion.div key={metric.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center space-x-1 mt-1">
                  {metric.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                  {metric.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                  <p className={`text-xs font-medium ${metric.trend === 'up' ? 'text-green-500' : metric.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {metric.change} {metric.trend !== 'neutral' && 'from last month'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Latest projects added to the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(stats as any).recentProjects?.map((p: any) => (
                <div key={p._id} className="p-4 border border-border rounded-xl bg-muted/30 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.client?.name}</p>
                    </div>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-medium">Progress</span>
                      <span className="font-black text-primary">{p.progress || 65}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${p.progress || 65}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {(!(stats as any).recentProjects || (stats as any).recentProjects.length === 0) && (
                <p className="text-sm text-muted-foreground py-8 text-center">No recent projects.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
