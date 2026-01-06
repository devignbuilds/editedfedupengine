import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Shield, Zap, Bot, Layout, ArrowRight, Globe, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';

const LandingPage = () => {
  const features = [
    { title: 'AI Growth Engine', desc: 'Autonomous lead discovery and nurturance.', icon: Bot },
    { title: 'Scale Infrastructure', desc: 'Multi-tenant white-labeling for elite agencies.', icon: Globe },
    { title: 'Content Architect', desc: 'AI-driven distribution across modern networks.', icon: Layout },
    { title: 'Monetization Layer', desc: 'SaaS billing and automated invoicing.', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="h-10 w-10 rounded-2xl bg-foreground text-background flex items-center justify-center -rotate-6 shadow-2xl">
               <Rocket className="h-6 w-6" />
             </div>
             <span className="text-xl font-black uppercase italic tracking-tighter">Engine.js</span>
          </div>
          <div className="flex items-center space-x-8">
             <Link to="/login" className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all">Sign In</Link>
             <Link to="/register">
                <Button className="h-auto py-3 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground shadow-xl hover:scale-105 transition-all">
                   Get Alpha Access
                </Button>
             </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-40 pb-20 px-6 relative overflow-hidden">
           <div className="max-w-7xl mx-auto text-center space-y-12 relative z-10">
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-muted border border-border/40 text-[9px] font-black uppercase tracking-widest opacity-60"
              >
                 <Sparkles className="h-3 w-3 text-primary" />
                 <span>Service Operating System 1.0 Alpha</span>
              </motion.div>
              
              <motion.h1 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.1 }}
                 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9]"
              >
                The Architecture <br />
                <span className="text-primary">Of Scale.</span>
              </motion.h1>

              <motion.p 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.2 }}
                 className="max-w-2xl mx-auto text-muted-foreground font-medium text-lg md:text-xl opacity-60 leading-relaxed"
              >
                 Engine.js is the world's most sophisticated service operating system. 
                 A modular MVP framework designed for elite agencies and automation-first companies.
              </motion.p>

              <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 className="flex flex-col md:flex-row items-center justify-center gap-6"
              >
                 <Link to="/register">
                   <Button className="h-auto py-6 px-12 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] bg-foreground text-background hover:bg-foreground/90 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transition-all">
                      Deploy Your Engine
                   </Button>
                 </Link>
                 <Link to="/login">
                   <Button variant="ghost" className="h-auto py-6 px-12 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-all">
                      View Documentation
                   </Button>
                 </Link>
              </motion.div>
           </div>

           {/* Animated Background Element */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[600px] opacity-20 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-transparent to-transparent blur-[120px]" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary blur-[100px] rounded-full" />
           </div>
        </section>

        {/* Modular Grid */}
        <section className="py-20 px-6 bg-muted/20">
           <div className="max-w-7xl mx-auto space-y-20">
              <div className="text-center space-y-4">
                 <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-primary opacity-60">Architectural Core</h2>
                 <p className="text-3xl font-black uppercase italic tracking-tighter underline decoration-primary/40 underline-offset-8">15 Modules. One System.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 {features.map((f, i) => (
                   <motion.div 
                     key={f.title}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.1 }}
                     viewport={{ once: true }}
                     className="p-10 bg-card border border-border/40 rounded-[2.5rem] space-y-6 hover:border-primary/40 transition-all shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] group"
                   >
                      <div className="h-14 w-14 rounded-2xl bg-foreground text-background flex items-center justify-center rotate-3 group-hover:rotate-6 transition-all shadow-lg">
                         <f.icon className="h-8 w-8" />
                      </div>
                      <div className="space-y-2">
                         <h3 className="text-xl font-black uppercase tracking-tight">{f.title}</h3>
                         <p className="text-xs font-medium text-muted-foreground opacity-60 leading-relaxed">{f.desc}</p>
                      </div>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 px-6">
           <div className="max-w-4xl mx-auto text-center p-20 bg-foreground text-background rounded-[4rem] space-y-10 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-5">
                 <Shield className="h-64 w-64" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-tight relative z-10">
                 Ready To Outscale <br />
                 Your Competition?
              </h2>
              <div className="flex items-center justify-center space-x-6 relative z-10">
                 <Link to="/register">
                    <Button className="h-auto py-5 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground hover:scale-105 transition-all shadow-xl">
                       Start Your Trial
                    </Button>
                 </Link>
                 <Link to="/login" className="text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 flex items-center transition-all">
                    <span>Contact Network</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                 </Link>
              </div>
           </div>
        </section>
      </main>

      <footer className="py-20 px-6 border-t border-border/40 text-center opacity-40">
         <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-center space-x-3">
               <Rocket className="h-4 w-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Devign Engine JS © 2026</span>
            </div>
            <div className="flex justify-center space-x-8 text-[9px] font-black uppercase tracking-widest">
               <a href="#">Security</a>
               <a href="#">Privacy</a>
               <a href="#">Network Terms</a>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
