import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Project } from '../types/project';
import { Link } from 'react-router-dom';
import InvoiceList from '../components/InvoiceList';
import NotificationList from '../components/NotificationList';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/button';
import { Plus, Layout } from 'lucide-react';
import { motion } from 'framer-motion';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [requestData, setRequestData] = useState({ 
    name: '', 
    description: '',
    serviceType: 'both',
    budget: '',
    paymentModel: 'quote'
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects', {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setProjects(data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchProjects();
    }
  }, [user]);

  if (loading) return <DashboardLayout><div className="p-8 italic opacity-50">Synchronizing workspace...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-lg font-medium opacity-70">Welcome back, {user?.name}. Manage your active projects.</p>
        </div>
        <Button 
          onClick={() => setIsRequestModalOpen(true)}
          className="rounded-full px-8 font-black uppercase tracking-widest text-[10px] h-12 shadow-2xl hover:scale-105 transition-all"
        >
          <Plus className="mr-2 h-4 w-4" /> New Project Request
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-2 mb-2">
            <Layout className="h-5 w-5 opacity-30" />
            <h2 className="text-xl font-black uppercase tracking-tighter">Your Projects</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <motion.div
                key={project._id}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group"
              >
                <Link
                  to={`/projects/${project._id}`}
                  className="block glass hover-glow p-8 rounded-[2.5rem] transition-all shadow-lg hover:shadow-2xl h-full relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="font-black text-xl tracking-tighter group-hover:text-foreground transition-colors">{project.name}</h3>
                      <span
                        className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${
                          project.status === 'active'
                            ? 'bg-foreground text-background border-foreground shadow-sm'
                            : 'bg-muted text-muted-foreground opacity-50 border-border'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed font-medium mb-6">
                      {project.description || 'No detailed briefing provided.'}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground font-medium">Completion</span>
                        <span className="font-black text-foreground">{(project as any).progress || 0}%</span>
                      </div>
                      <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(project as any).progress || 0}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-foreground to-foreground/60 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            {projects.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-3xl bg-muted/5">
                <p className="text-muted-foreground font-black uppercase tracking-widest text-xs opacity-30">No active deployments detected.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-black uppercase tracking-tighter mb-4 opacity-70">Activity</h2>
            <NotificationList />
          </section>

          <section className="bg-card border border-border p-8 rounded-3xl shadow-sm">
            <h2 className="text-xl font-black uppercase tracking-tighter mb-6">Recent Invoices</h2>
            <InvoiceList />
          </section>
        </div>
      </div>

      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsRequestModalOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-2xl p-12 bg-card border border-border rounded-[3rem] shadow-2xl relative z-10"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-black tracking-tighter uppercase italic mb-2">New Project</h2>
                <p className="text-muted-foreground font-medium leading-relaxed opacity-60">Submit your project brief for priority review by our team.</p>
              </div>
              <button 
                onClick={() => setIsRequestModalOpen(false)}
                className="h-10 w-10 rounded-full bg-muted/20 hover:bg-muted/40 flex items-center justify-center transition-all"
              >
                <span className="text-2xl opacity-60">×</span>
              </button>
            </div>
            
            {requestError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-black uppercase tracking-widest text-center rounded-2xl"
              >
                {requestError}
              </motion.div>
            )}
            
            <form onSubmit={async (e) => { 
              e.preventDefault(); 
              setRequestLoading(true);
              setRequestError('');
              try {
                const response = await fetch('http://localhost:5000/api/projects', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`,
                  },
                  body: JSON.stringify(requestData),
                });
                if (response.ok) {
                  setIsRequestModalOpen(false);
                  setRequestData({ name: '', description: '', serviceType: 'both', budget: '', paymentModel: 'quote' });
                  const res = await fetch('http://localhost:5000/api/projects', {
                    headers: { Authorization: `Bearer ${user?.token}` },
                  });
                  const data = await res.json();
                  if (res.ok) setProjects(data);
                } else {
                  const errorData = await response.json();
                  setRequestError(errorData.message || 'Transmission failed.');
                }
              } catch (err) {
                setRequestError('Server reachability error.');
              } finally {
                setRequestLoading(false);
              }
            }} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 opacity-70">Project Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., E-commerce Platform Redesign" 
                  className="w-full px-6 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-foreground/20 text-foreground font-medium placeholder:opacity-30 transition-all hover:border-foreground/40" 
                  value={requestData.name}
                  onChange={(e) => setRequestData({ ...requestData, name: e.target.value })}
                  required 
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 opacity-70">Service Type</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'development', label: 'Development' },
                    { value: 'design', label: 'Design' },
                    { value: 'both', label: 'Both' }
                  ].map((service) => (
                    <button
                      key={service.value}
                      type="button"
                      onClick={() => setRequestData({ ...requestData, serviceType: service.value })}
                      className={`px-6 py-4 rounded-2xl border-2 transition-all font-black text-xs uppercase tracking-widest ${
                        requestData.serviceType === service.value
                          ? 'border-foreground bg-foreground text-background shadow-lg'
                          : 'border-border bg-muted/20 hover:border-foreground/40 hover:bg-muted/40'
                      }`}
                    >
                      {service.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 opacity-70">Budget (USD)</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 10,000" 
                    className="w-full px-6 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-foreground/20 text-foreground font-medium placeholder:opacity-30 transition-all hover:border-foreground/40" 
                    value={requestData.budget}
                    onChange={(e) => setRequestData({ ...requestData, budget: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 opacity-70">Payment Model</label>
                  <div className="relative">
                    <select
                      className="w-full px-6 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-foreground/20 text-foreground font-bold text-sm transition-all hover:border-foreground/40 cursor-pointer appearance-none pr-12"
                      value={requestData.paymentModel}
                      onChange={(e) => setRequestData({ ...requestData, paymentModel: e.target.value })}
                    >
                      <option value="quote">Request Quote</option>
                      <option value="one-time">One-Time Payment</option>
                      <option value="subscription">Monthly Subscription</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 opacity-70">Project Brief</label>
                <textarea 
                  placeholder="Describe your objectives, target audience, key features, timeline, and success metrics..." 
                  className="w-full px-6 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-foreground/20 text-foreground font-medium placeholder:opacity-30 h-40 resize-none transition-all hover:border-foreground/40" 
                  value={requestData.description}
                  onChange={(e) => setRequestData({ ...requestData, description: e.target.value })}
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end items-center gap-6 pt-6">
                <button 
                  type="button" 
                  onClick={() => setIsRequestModalOpen(false)} 
                  className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity px-6 py-3"
                >
                  Cancel
                </button>
                <Button 
                  type="submit" 
                  disabled={requestLoading} 
                  className="rounded-full px-12 h-14 font-black uppercase tracking-widest text-[10px] min-w-[200px] bg-foreground text-background hover:bg-foreground/90 shadow-2xl hover:shadow-foreground/20 transition-all"
                >
                  {requestLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : 'Submit Project'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ClientDashboard;
