import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Bot, Search, Mail, Zap, Play, RefreshCw, BarChart3, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Lead {
  _id: string;
  name: string;
  email: string;
  company: string;
  source: string;
  status: string;
  createdAt: string;
}

interface Campaign {
  _id: string;
  name: string;
  status: string;
  metrics: {
    emailsSent: number;
    responses: number;
    conversions: number;
  };
}

const AIModule = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isScraping, setIsScraping] = useState(false);
  const [activeView, setActiveView] = useState<'leads' | 'campaigns'>('leads');

  useEffect(() => {
    fetchLeads();
    fetchCampaigns();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/leads', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      const data = await res.json();
      if (res.ok) setLeads(data);
    } catch (err) {
      console.error('Fetch leads failed:', err);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/leads/campaigns', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      const data = await res.json();
      if (res.ok) setCampaigns(data);
    } catch (err) {
      console.error('Fetch campaigns failed:', err);
    }
  };

  const handleSimulateScrape = async () => {
    setIsScraping(true);
    try {
      const res = await fetch('http://localhost:5000/api/leads/scrape', {
        method: 'POST',
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (res.ok) {
        setTimeout(() => {
          fetchLeads();
          setIsScraping(false);
        }, 1500);
      }
    } catch (err) {
      console.error('Scrape failed:', err);
      setIsScraping(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 selection:bg-primary selection:text-primary-foreground">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
               <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center -rotate-6 shadow-2xl">
                 <Bot className="h-6 w-6" />
               </div>
               <h1 className="text-4xl font-black uppercase italic tracking-tighter">AI Growth Engine</h1>
            </div>
            <p className="text-muted-foreground font-medium opacity-60 ml-1">Autonomous lead generation and nurture workflows.</p>
          </div>
          
          <div className="flex items-center space-x-2">
             <Button 
               variant={activeView === 'leads' ? 'default' : 'ghost'} 
               onClick={() => setActiveView('leads')}
               className="text-[10px] font-black uppercase tracking-widest px-6 py-6 rounded-2xl"
             >
               Leads & Intel
             </Button>
             <Button 
               variant={activeView === 'campaigns' ? 'default' : 'ghost'} 
               onClick={() => setActiveView('campaigns')}
               className="text-[10px] font-black uppercase tracking-widest px-6 py-6 rounded-2xl"
             >
               Campaigns
             </Button>
          </div>
        </div>

        {/* Feature Grid (Secondary Navigation or Summary) */}
        {!isScraping && leads.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { name: 'Lead Scraper', icon: Search, desc: 'Discover leads via LinkedIn/X/Web' },
              { name: 'Nurture Bot', icon: RefreshCw, desc: 'AI-driven specialized email sequences' },
              { name: 'Analytics', icon: BarChart3, desc: 'Conversion tracking and CTR maps' },
            ].map((feature) => (
              <div key={feature.name} className="p-8 bg-card border border-border rounded-[2rem] space-y-4 hover:border-foreground/20 transition-all group">
                <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest">{feature.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 opacity-70">{feature.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Main Content Area */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40 px-2">{activeView} Matrix</h2>
             {activeView === 'leads' && (
               <Button 
                 onClick={handleSimulateScrape} 
                 disabled={isScraping}
                 className="h-auto py-3.5 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95 shadow-xl"
               >
                 {isScraping ? (
                   <>
                     <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                     Extracting...
                   </>
                 ) : (
                   <>
                     <Play className="mr-2 h-3.5 w-3.5 fill-current" />
                     Ignite Scraper
                   </>
                 )}
               </Button>
             )}
          </div>

          <AnimatePresence mode="wait">
            {activeView === 'leads' ? (
              <motion.div
                key="leads-table"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest opacity-40">Identity</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest opacity-40">Intel Source</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest opacity-40">Status</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest opacity-40">Scraped</th>
                        <th className="px-8 py-5"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.length > 0 ? leads.map((lead) => (
                        <tr key={lead._id} className="group border-b border-border/10 hover:bg-muted/30 transition-colors">
                          <td className="px-8 py-6">
                             <div className="flex items-center space-x-4">
                                <div className="h-10 w-10 rounded-xl bg-muted border border-border flex items-center justify-center font-black text-xs group-hover:rotate-3 transition-transform">
                                  {lead.name[0]}
                                </div>
                                <div>
                                   <p className="text-sm font-black uppercase tracking-tight">{lead.name}</p>
                                   <p className="text-[10px] font-medium text-muted-foreground lowercase opacity-50">{lead.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center space-x-2">
                                <Search className="h-3.5 w-3.5 text-muted-foreground opacity-30" />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{lead.source}</span>
                             </div>
                             <p className="text-[10px] font-medium text-muted-foreground opacity-30 ml-5">{lead.company}</p>
                          </td>
                          <td className="px-8 py-6">
                             <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full leading-none inline-block border ${
                               lead.status === 'New' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-muted border-border text-muted-foreground'
                             }`}>
                               {lead.status}
                             </span>
                          </td>
                          <td className="px-8 py-6 text-[10px] font-medium text-muted-foreground opacity-50">
                             {new Date(lead.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-8 py-6 text-right">
                             <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-muted rounded-lg transition-all">
                                <ChevronRight className="h-4 w-4" />
                             </button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="py-20 text-center">
                             <Zap className="h-10 w-10 mx-auto opacity-10 mb-4" />
                             <p className="text-[10px] font-black uppercase tracking-widest opacity-30">No intelligence data extracted yet.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="campaigns-grid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {campaigns.length > 0 ? campaigns.map((campaign) => (
                  <div key={campaign._id} className="bg-card border border-border rounded-[2.5rem] p-8 space-y-6 hover:border-foreground/20 transition-all group relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 pt-6">
                       <div className="flex items-center space-x-1.5">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">{campaign.status}</span>
                       </div>
                    </div>
                    
                    <div className="space-y-1">
                       <h3 className="text-xl font-black italic uppercase tracking-tighter leading-tight">{campaign.name}</h3>
                       <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest opacity-40">Growth Sequence</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                       <div className="p-3 bg-muted/40 rounded-2xl text-center space-y-1">
                          <p className="text-lg font-black tracking-tighter">{campaign.metrics.emailsSent}</p>
                          <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Dispatched</p>
                       </div>
                       <div className="p-3 bg-muted/40 rounded-2xl text-center space-y-1">
                          <p className="text-lg font-black tracking-tighter">{campaign.metrics.responses}</p>
                          <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Engagement</p>
                       </div>
                       <div className="p-3 bg-primary text-primary-foreground rounded-2xl text-center space-y-1">
                          <p className="text-lg font-black tracking-tighter">{campaign.metrics.conversions}</p>
                          <p className="text-[8px] font-black uppercase tracking-widest opacity-50">Converted</p>
                       </div>
                    </div>

                    <Button className="w-full py-6 rounded-2xl text-[9px] font-black uppercase tracking-widest h-auto" variant="outline">
                       Review Campaign Intel
                    </Button>
                  </div>
                )) : (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-[3rem] opacity-40">
                    <Mail className="h-10 w-10 mx-auto opacity-20 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No active growth campaigns found.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIModule;
