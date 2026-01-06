import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Save, Camera } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 2000); // Mock save
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">System Settings</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage your identity and platform security.</p>
        </div>

        <div className="flex space-x-2 border-b border-border/50 pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground/40 hover:text-foreground/60'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                />
              )}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          {activeTab === 'profile' ? (
            <div className="space-y-8">
              <div className="flex items-center space-x-6">
                <div className="relative group">
                  <div className="h-24 w-24 rounded-[2rem] bg-muted flex items-center justify-center border border-border overflow-hidden rotate-3 transition-transform group-hover:rotate-0">
                    <User className="h-10 w-10 text-muted-foreground/20" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2 bg-foreground text-background rounded-xl shadow-xl hover:scale-110 transition-transform">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest">Profile Avatar</h3>
                  <p className="text-xs text-muted-foreground mt-1 text-balance">Upload a high-res image for your platform ID.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={user?.name}
                    className="w-full px-5 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-foreground/20 font-medium transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue={user?.email}
                    className="w-full px-5 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-foreground/20 font-medium transition-all"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Current Password</label>
                <input 
                  type="password" 
                  className="w-full px-5 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-foreground/20 font-medium transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">New Password</label>
                <input 
                  type="password" 
                  className="w-full px-5 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-foreground/20 font-medium transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Confirm New Password</label>
                <input 
                  type="password" 
                  className="w-full px-5 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-foreground/20 font-medium transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-border/50">
            <Button 
              onClick={handleSave}
              className="px-8 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] h-auto shadow-2xl hover:shadow-primary/20 transition-all active:scale-[0.98]"
            >
              {isSaving ? 'Synchronizing...' : (
                <>
                  <Save className="mr-3 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
