import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Project } from '../types/project';
import { Link } from 'react-router-dom';
import InvoiceList from '../components/InvoiceList';
import NotificationList from '../components/NotificationList';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Plus, Layout } from 'lucide-react';
import { motion } from 'framer-motion';

import OnboardingWizard from '../components/OnboardingWizard';
import ClientNextSteps from '../components/ClientNextSteps';
import { Sparkles } from 'lucide-react';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(() => {
    return localStorage.getItem('onboarding_completed') === 'true';
  });
  
  // ... (keep existing state)
  const [requestData, setRequestData] = useState({ 
    name: '', 
    description: '',
    serviceType: 'both',
    budget: '',
    paymentModel: 'quote'
  });
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState('');

  // ... (keep useEffect)
  useEffect(() => {
    const fetchProjects = async () => {
      // ... (existing fetch logic)
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

  const handleOnboardingComplete = () => {
    setHasOnboarded(true);
    localStorage.setItem('onboarding_completed', 'true');
  };

  if (loading) return <DashboardLayout><div className="flex items-center justify-center h-[50vh]"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div></DashboardLayout>;

  return (
    <DashboardLayout>
      {!hasOnboarded && <OnboardingWizard onComplete={handleOnboardingComplete} />}
      
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user?.name}.</p>
          </div>
          {projects.length > 0 && (
            <Button onClick={() => setIsRequestModalOpen(true)}>
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
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20"
                      >
                        <Sparkles className="h-10 w-10 text-primary" />
                      </motion.div>
                      
                      <h3 className="text-3xl font-black mb-4 tracking-tight">The Engine is Idle.</h3>
                      <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                        Your workspace is ready. Initiate your first project to unlock milestone tracking, real-time collaboration, and automated billing.
                      </p>
                      
                      <Button 
                        size="lg" 
                        onClick={() => setIsRequestModalOpen(true)}
                        className="rounded-full px-10 h-14 text-base font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-all duration-300 animate-pulse"
                      >
                        <Plus className="mr-2 h-5 w-5" /> Initialize First Project
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
                              <h3 className="font-bold text-xl truncate pr-4">{project.name}</h3>
                              <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest ${
                                project.status === 'active' ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-muted text-muted-foreground'
                              }`}>
                                {project.status}
                              </span>
                           </div>
                           <p className="text-muted-foreground line-clamp-2 mb-8 h-12 leading-relaxed">
                             {project.description || 'No description provided.'}
                           </p>
                           <div className="flex items-center text-xs text-muted-foreground font-bold uppercase tracking-wider">
                              <span>{(project as any).progress || 0}% SYNCHRONIZED</span>
                              <div className="ml-auto w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(project as any).progress || 0}%` }} />
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
              <ClientNextSteps projects={projects} onCreateProject={() => setIsRequestModalOpen(true)} />

              <Card>
                <CardContent className="p-6">
                   <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Notifications</h2>
                   <NotificationList />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                   <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Billing</h2>
                   <InvoiceList />
                </CardContent>
              </Card>
           </div>
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
