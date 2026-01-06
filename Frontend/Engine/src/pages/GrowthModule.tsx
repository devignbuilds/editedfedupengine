import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Share2, Award, Zap, Users, TrendingUp, Copy, CheckCircle2, Gift, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

interface GamificationStats {
  points: number;
  level: number;
  badges: Array<{ name: string; icon: string; awardedAt: string }>;
  activityLog: Array<{ action: string; pointsGained: number; date: string }>;
}

interface AffiliateStats {
  referralCode: string;
  referrals: Array<{ user: { name: string; email: string }; status: string; date: string }>;
  earnings: { total: number; pending: number; paid: number };
}

const GrowthModule = () => {
  const { user } = useAuth();
  const [gamification, setGamification] = useState<GamificationStats | null>(null);
  const [affiliate, setAffiliate] = useState<AffiliateStats | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchGrowthStats();
  }, []);

  const fetchGrowthStats = async () => {
    try {
      const [gRes, aRes] = await Promise.all([
        fetch('http://localhost:5000/api/growth/gamification', {
          headers: { Authorization: `Bearer ${user?.token}` }
        }),
        fetch('http://localhost:5000/api/growth/affiliate', {
          headers: { Authorization: `Bearer ${user?.token}` }
        })
      ]);

      const gData = await gRes.json();
      const aData = await aRes.json();

      if (gRes.ok) setGamification(gData);
      if (aRes.ok) setAffiliate(aData);
    } catch (err) {
      console.error('Fetch growth stats failed:', err);
    }
  };

  const handleClaimPoints = async () => {
    setIsClaiming(true);
    try {
      const res = await fetch('http://localhost:5000/api/growth/gamification/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({ action: 'Daily Reward', points: 50 })
      });
      if (res.ok) {
        const updated = await res.json();
        setGamification(updated);
      }
    } catch (err) {
      console.error('Claim failed:', err);
    } finally {
      setTimeout(() => setIsClaiming(false), 1000);
    }
  };

  const copyToClipboard = () => {
    if (affiliate?.referralCode) {
      navigator.clipboard.writeText(`https://engine.devign.com/join?ref=${affiliate.referralCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-12 selection:bg-primary selection:text-primary-foreground pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">Growth & Affiliates</h1>
            <p className="text-muted-foreground font-medium opacity-60 ml-1">Scale your service business with viral mechanics and loyalty loops.</p>
          </div>
          
          <div className="flex items-center space-x-2 bg-muted p-1 rounded-2xl">
              <div className="px-4 py-2 bg-background rounded-xl shadow-sm border border-border/40">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 leading-none mb-1">Total Points</p>
                <p className="text-sm font-black tracking-tight">{gamification?.points || 0} XP</p>
              </div>
              <div className="px-4 py-2 bg-primary text-primary-foreground rounded-xl shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mb-1 text-primary-foreground/70">Level</p>
                <p className="text-sm font-black tracking-tight">{gamification?.level || 1}</p>
              </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gamification Column */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="p-10 bg-card border border-border rounded-[2.5rem] space-y-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                 <Award className="h-32 w-32 -rotate-12" />
              </div>

              <div className="flex items-center space-x-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center -rotate-3 shadow-xl">
                    <Award className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight">Gamification Engine</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Loyalty & Retention</p>
                  </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span>Progress to Level {(gamification?.level || 1) + 1}</span>
                    <span className="opacity-40">{gamification?.points || 0} / {(gamification?.level || 1) * 100} XP</span>
                 </div>
                 <div className="h-3 bg-muted rounded-full overflow-hidden border border-border">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${((gamification?.points || 0) % 100)}%` }}
                      className="h-full bg-primary"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-muted/40 rounded-[1.5rem] space-y-2">
                    <Star className="h-5 w-5 opacity-30" />
                    <p className="text-2xl font-black tracking-tighter">{gamification?.badges?.length || 0}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Achievements</p>
                 </div>
                 <div className="p-6 bg-muted/40 rounded-[1.5rem] space-y-2">
                    <TrendingUp className="h-5 w-5 opacity-30" />
                    <p className="text-2xl font-black tracking-tighter">{gamification?.activityLog?.length || 0}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Milestones</p>
                 </div>
              </div>

              <Button 
                onClick={handleClaimPoints}
                disabled={isClaiming}
                className="w-full py-8 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xl h-auto"
              >
                {isClaiming ? (
                  <Zap className="h-4 w-4 animate-bounce" />
                ) : (
                  <>
                    <Gift className="mr-2 h-4 w-4" />
                    Claim Daily Engagement Points
                  </>
                )}
              </Button>
            </div>

            {/* Recent Activity Log */}
            <div className="bg-muted/20 border border-border/50 rounded-[2rem] p-8 space-y-6">
               <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 px-2 text-center">Engagement Matrix</h3>
               <div className="space-y-4">
                  {gamification?.activityLog?.slice(-3).reverse().map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-background border border-border/40 rounded-xl">
                       <div className="flex items-center space-x-3">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="text-[10px] font-black uppercase tracking-tight">{log.action}</span>
                       </div>
                       <span className="text-[10px] font-bold text-muted-foreground">+{log.pointsGained} XP</span>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>

          {/* Affiliate Column */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="p-10 bg-card border border-border rounded-[2.5rem] space-y-8 relative overflow-hidden shadow-2xl">
              <div className="flex items-center space-x-4">
                  <div className="h-14 w-14 rounded-2xl border-2 border-foreground flex items-center justify-center rotate-3 shadow-sm">
                    <Share2 className="h-8 w-8 text-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight">Affiliate Network</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Referral Ecosystem</p>
                  </div>
              </div>

              <div className="p-6 bg-muted/40 rounded-[1.5rem] space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-40 leading-none">Your Private Link</p>
                 <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-background border border-border/60 rounded-xl px-4 py-3 text-[10px] font-bold truncate opacity-60">
                       https://engine.devign.com/join?ref={affiliate?.referralCode}
                    </div>
                    <Button 
                      onClick={copyToClipboard}
                      variant="ghost" 
                      className="h-full px-4 rounded-xl border border-border/60 hover:bg-background transition-all"
                    >
                       {copied ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                    </Button>
                 </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                 <div className="p-5 bg-muted/30 rounded-2xl text-center space-y-1">
                    <p className="text-lg font-black tracking-tighter">{affiliate?.referrals?.length || 0}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Referrals</p>
                 </div>
                 <div className="p-5 bg-muted/30 rounded-2xl text-center space-y-1">
                    <p className="text-lg font-black tracking-tighter">${affiliate?.earnings.pending || 0}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Pending</p>
                 </div>
                 <div className="p-5 bg-primary text-primary-foreground rounded-2xl text-center space-y-1">
                    <p className="text-lg font-black tracking-tighter">${affiliate?.earnings.total || 0}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-50">Earnings</p>
                 </div>
              </div>

              <div className="space-y-4 pt-4">
                 <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 px-2">Referral Intel</h3>
                 <div className="space-y-2">
                    {affiliate?.referrals.length === 0 ? (
                      <div className="py-12 border border-dashed border-border rounded-3xl text-center">
                         <Users className="h-8 w-8 mx-auto opacity-10 mb-2" />
                         <p className="text-[9px] font-black uppercase tracking-widest opacity-20">No conversions recorded</p>
                      </div>
                    ) : (
                      affiliate?.referrals.map((ref, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-muted/20 border border-border/20 rounded-xl">
                           <div className="space-y-0.5">
                              <p className="text-[10px] font-black uppercase tracking-tight">{ref.user.name}</p>
                              <p className="text-[8px] font-medium text-muted-foreground opacity-50">{ref.user.email}</p>
                           </div>
                           <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-background border border-border/40 rounded-full opacity-60">
                              {ref.status}
                           </span>
                        </div>
                      ))
                    )}
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GrowthModule;
