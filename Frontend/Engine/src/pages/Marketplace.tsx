import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Bot, Layout, Rocket, Sparkles, CheckCircle2, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { usePermissions } from '../hooks/usePermissions';
import { Link } from 'react-router-dom';

const Marketplace = () => {
  const { plan, hasFeature } = usePermissions();

  const apps = [
    { 
      id: 'LEAD_SCRAPER',
      name: 'AI Lead Scraper', 
      desc: 'Autonomous lead discovery from LinkedIn, Twitter, and web sources. AI-powered qualification and enrichment.', 
      icon: Bot, 
      price: '$79/mo',
      category: 'AI Intelligence',
      feature: 'AI_GROWTH',
      status: 'subscribe'
    },
    { 
      id: 'CONTENT_GENERATOR',
      name: 'AI Content Engine', 
      desc: 'Generate blog posts, social content, and marketing copy with context-aware AI. Multi-platform scheduling.', 
      icon: Layout, 
      price: '$49/mo',
      category: 'AI Intelligence',
      feature: 'CONTENT_HUB',
      status: 'try_free'
    },
    { 
      id: 'EMAIL_NURTURE',
      name: 'AI Email Nurture', 
      desc: 'Personalized email sequences powered by GPT-4. Automatic follow-ups and sentiment analysis.', 
      icon: Bot, 
      price: '$59/mo',
      category: 'AI Intelligence',
      feature: 'AI_GROWTH',
      status: 'coming_soon'
    },
    { 
      id: 'SENTIMENT_ANALYZER',
      name: 'AI Sentiment Tracker', 
      desc: 'Real-time brand monitoring and sentiment analysis across social platforms. Alert system included.', 
      icon: Sparkles, 
      price: '$39/mo',
      category: 'AI Intelligence',
      feature: 'AI_GROWTH',
      status: 'purchase'
    },
    { 
      id: 'COMPETITOR_INTEL',
      name: 'Competitor Intelligence', 
      desc: 'AI-powered competitive analysis. Track pricing, features, and market positioning automatically.', 
      icon: Bot, 
      price: '$89/mo',
      category: 'AI Intelligence',
      feature: 'AI_GROWTH',
      status: 'coming_soon'
    },
    { 
      id: 'WHITE_LABEL',
      name: 'White-label Portal', 
      desc: 'Full agency branding with custom domains, colors, and logos. Client-facing dashboard included.', 
      icon: Rocket, 
      price: 'Enterprise',
      category: 'Scale',
      feature: 'WHITE_LABEL',
      status: 'subscribe'
    }
  ];

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12 pb-20 selection:bg-primary selection:text-primary-foreground"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
             <div className="flex items-center space-x-3">
               <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center -rotate-6 shadow-2xl">
                 <ShoppingBag className="h-6 w-6" />
               </div>
               <h1 className="text-4xl font-black uppercase italic tracking-tighter">AI Intelligence Store</h1>
             </div>
             <p className="text-muted-foreground font-medium opacity-60 ml-1">Supercharge your agency with AI-powered automation modules.</p>
          </div>
          
          <div className="hidden md:flex items-center space-x-4 px-6 py-3 bg-muted rounded-2xl border border-border/40">
             <div className="space-y-0.5">
                <p className="text-[8px] font-black uppercase tracking-widest opacity-40 text-right">Organization Plan</p>
                <p className="text-[11px] font-black uppercase tracking-tight text-right">{plan}</p>
             </div>
             <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {apps.map((app, i) => (
             <motion.div 
               key={app.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="group relative h-full flex flex-col"
             >
                <div className="h-full p-10 bg-card border border-border/40 rounded-[3rem] space-y-8 hover:border-primary/40 transition-all shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] flex flex-col justify-between">
                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <div className="h-14 w-14 rounded-2xl bg-foreground text-background flex items-center justify-center rotate-3 group-hover:rotate-6 transition-all shadow-lg">
                            <app.icon className="h-8 w-8" />
                         </div>
                         <div className="px-3 py-1 bg-muted rounded-full text-[8px] font-black uppercase tracking-widest opacity-60">
                            {app.category}
                         </div>
                      </div>

                      <div className="space-y-2">
                         <h3 className="text-2xl font-black uppercase tracking-tight leading-none">{app.name}</h3>
                         <p className="text-xs font-medium text-muted-foreground opacity-60 leading-relaxed">{app.desc}</p>
                      </div>

                      <div className="flex items-center space-x-2 text-primary">
                         <Sparkles className="h-3 w-3" />
                         <span className="text-[10px] font-black uppercase tracking-widest">{app.price}</span>
                      </div>
                   </div>

                   <div className="pt-8">
                      {hasFeature(app.feature as any) ? (
                        <div className="w-full py-4 flex items-center justify-center space-x-2 text-primary opacity-60">
                           <CheckCircle2 className="h-4 w-4" />
                           <span className="text-[10px] font-black uppercase tracking-widest">Active In Library</span>
                        </div>
                      ) : (
                        <>
                          {app.status === 'coming_soon' && (
                            <div className="w-full py-4 flex items-center justify-center space-x-2 bg-muted/50 rounded-2xl border border-border/40">
                              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Coming Soon</span>
                            </div>
                          )}
                          {app.status === 'try_free' && (
                            <Button className="w-full py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-green-500 text-white hover:bg-green-600 transition-all shadow-xl">
                              Try Free for 14 Days
                            </Button>
                          )}
                          {app.status === 'purchase' && (
                            <Button className="w-full py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-xl">
                              Purchase One-Time
                            </Button>
                          )}
                          {app.status === 'subscribe' && (
                            <Link to="/billing">
                              <Button className="w-full py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xl">
                                Subscribe Now
                              </Button>
                            </Link>
                          )}
                        </>
                      )}
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

        <div className="p-12 bg-foreground text-background rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-all">
              <Sparkles className="h-40 w-40" />
           </div>
           
           <div className="space-y-4 relative z-10">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">The Enterprise Stack.</h2>
              <p className="max-w-md text-xs font-medium opacity-60 leading-relaxed">Unlock the full potential of Engine.js with custom subdomains, dedicated node infrastructure, and priority AI queues.</p>
           </div>
           
           <Button className="h-auto py-5 px-10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] bg-primary text-primary-foreground relative z-10 hover:scale-105 transition-all shadow-2xl">
              Talk to Engineering
           </Button>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Marketplace;
