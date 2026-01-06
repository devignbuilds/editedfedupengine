import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Layout, Sparkles, Plus, Send, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Post {
  _id: string;
  content: string;
  platforms: string[];
  status: string;
  scheduledAt: string;
  aiGenerated: boolean;
}

const ContentModule = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [pillar, setPillar] = useState('Agency Growth');
  const [draftContent, setDraftContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [showDraftForm, setShowDraftForm] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/posts', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error('Fetch posts failed:', err);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('http://localhost:5000/api/posts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({ pillar })
      });
      if (res.ok) {
        const data = await res.json();
        setDraftContent(data.content);
        setShowDraftForm(true);
      }
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSchedule = async () => {
    setIsScheduling(true);
    try {
      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          content: draftContent,
          platforms: ['X', 'LinkedIn'],
          scheduledAt: new Date(Date.now() + 86400000).toISOString(),
          aiGenerated: true
        })
      });
      if (res.ok) {
        fetchPosts();
        setShowDraftForm(false);
        setDraftContent('');
      }
    } catch (err) {
      console.error('Scheduling failed:', err);
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <DashboardLayout>
       <motion.div 
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         className="space-y-12 pb-20 selection:bg-primary selection:text-primary-foreground"
       >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                 <div className="h-10 w-10 rounded-2xl bg-foreground text-background flex items-center justify-center -rotate-6 shadow-2xl">
                   <Layout className="h-6 w-6" />
                 </div>
                 <h1 className="text-4xl font-black uppercase italic tracking-tighter">Content Hub</h1>
              </div>
              <p className="text-muted-foreground font-medium opacity-60 ml-1">AI-assisted content creation and scheduled distribution.</p>
            </div>
            
            <Button 
               onClick={() => setShowDraftForm(!showDraftForm)}
               className="h-auto py-4 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xl"
            >
               <Plus className="mr-2 h-4 w-4" />
               {showDraftForm ? 'Cancel Draft' : 'Draft New Post'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-8">
                {/* Draft Form Section */}
                <AnimatePresence>
                  {showDraftForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-8 bg-card border-2 border-primary/20 rounded-[2.5rem] space-y-6 shadow-2xl">
                         <div className="flex items-center space-x-2">
                           <Sparkles className="h-4 w-4 text-primary" />
                           <h3 className="text-[10px] font-black uppercase tracking-widest">Active Post Draft</h3>
                         </div>
                         <textarea 
                           value={draftContent}
                           onChange={(e) => setDraftContent(e.target.value)}
                           className="w-full h-40 bg-muted border-none rounded-3xl p-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                           placeholder="Describe your content or edit the AI draft..."
                         />
                         <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                               {['X', 'LinkedIn', 'Web'].map(p => (
                                 <button key={p} className="px-4 py-1.5 bg-muted rounded-full text-[9px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-all border border-transparent hover:border-primary/20">
                                   {p}
                                 </button>
                               ))}
                            </div>
                            <Button 
                              onClick={handleSchedule}
                              disabled={isScheduling || !draftContent}
                              className="px-8 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest bg-foreground text-background h-auto"
                            >
                               {isScheduling ? 'Scheduling...' : 'Confirm Schedule'}
                            </Button>
                         </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Content List */}
                <div className="space-y-6">
                   <div className="flex items-center justify-between px-2">
                      <h2 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40">Scheduled Pipeline</h2>
                      <div className="flex space-x-4 text-[9px] font-black uppercase tracking-widest opacity-40">
                         <span>Pending: {posts.filter(p => p.status === 'Scheduled').length}</span>
                         <span>Published: {posts.filter(p => p.status === 'Published').length}</span>
                      </div>
                   </div>
                   
                   <div className="space-y-4">
                      {posts.length === 0 ? (
                        <div className="py-20 border-2 border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center space-y-4 opacity-20">
                           <Clock className="h-10 w-10" />
                           <p className="text-[10px] font-black uppercase tracking-[0.2em]">Queue is currently empty</p>
                        </div>
                      ) : (
                        posts.map((post) => (
                          <motion.div 
                            key={post._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-card border border-border rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-primary/20 transition-all shadow-sm hover:shadow-xl"
                          >
                             <div className="space-y-3 flex-1">
                                <div className="flex items-center space-x-3">
                                   <div className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded-full">
                                      {post.status}
                                   </div>
                                   {post.aiGenerated && (
                                     <Sparkles className="h-3 w-3 text-primary opacity-40" />
                                   )}
                                </div>
                                <p className="text-[13px] font-medium leading-relaxed opacity-80">{post.content}</p>
                                <div className="flex items-center space-x-4 text-[9px] font-bold text-muted-foreground opacity-40">
                                   <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {new Date(post.scheduledAt).toLocaleDateString()}</span>
                                   <span className="flex items-center"><Send className="h-3 w-3 mr-1" /> {post.platforms.join(', ')}</span>
                                </div>
                             </div>
                             <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                                <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-muted opacity-0 group-hover:opacity-100 transition-all">
                                   <Trash2 className="h-4 w-4 opacity-40" />
                                </Button>
                             </div>
                          </motion.div>
                        ))
                      )}
                   </div>
                </div>
             </div>

             {/* Sidebar Actions */}
             <div className="space-y-6">
                <div className="p-10 bg-card border border-border rounded-[2.5rem] space-y-8 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all">
                      <Sparkles className="h-24 w-24" />
                   </div>
                   
                   <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-2xl bg-foreground text-background flex items-center justify-center rotate-3 shadow-xl">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <div>
                         <h2 className="text-xl font-black uppercase tracking-tight">AI Drafting</h2>
                         <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Intelligence Injection</p>
                      </div>
                   </div>
                   
                   <p className="text-xs text-muted-foreground leading-relaxed">Let Devign AI generate architectural content blueprints based on your agency's core pillars.</p>
                   
                   <div className="space-y-4">
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Context Pillar</label>
                         <select 
                           value={pillar}
                           onChange={(e) => setPillar(e.target.value)}
                           className="w-full bg-muted border-none rounded-2xl px-6 py-4 text-[10px] font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                         >
                            <option>Agency Growth</option>
                            <option>Conversion Design</option>
                            <option>Automation Alpha</option>
                         </select>
                      </div>

                      <Button 
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full py-8 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xl h-auto"
                      >
                         {isGenerating ? (
                           <div className="flex items-center space-x-2">
                              <div className="h-2 w-2 rounded-full bg-background animate-bounce" />
                              <div className="h-2 w-2 rounded-full bg-background animate-bounce [animation-delay:0.2s]" />
                              <div className="h-2 w-2 rounded-full bg-background animate-bounce [animation-delay:0.4s]" />
                           </div>
                         ) : (
                           <>
                             <Sparkles className="mr-2 h-4 w-4" />
                             Generate Content Draft
                           </>
                         )}
                      </Button>
                   </div>
                </div>

                <div className="p-10 bg-muted/40 border border-border/60 rounded-[2.5rem] space-y-6">
                   <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">Integration Status</h3>
                   <div className="space-y-4">
                      {[
                        { name: 'X / Twitter', status: 'Connected', icon: CheckCircle2 },
                        { name: 'LinkedIn', status: 'Connected', icon: CheckCircle2 },
                        { name: 'Web Engine', status: 'Active', icon: CheckCircle2 },
                      ].map((int) => (
                        <div key={int.name} className="flex items-center justify-between opacity-60 hover:opacity-100 transition-all cursor-crosshair">
                           <span className="text-[10px] font-black uppercase tracking-tight">{int.name}</span>
                           <int.icon className="h-3 w-3 text-primary" />
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
       </motion.div>
    </DashboardLayout>
  );
};

export default ContentModule;
