import React from 'react';
import { usePermissions, type Feature } from '../hooks/usePermissions';
import { Button } from './ui/button';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureGateProps {
  feature: Feature;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const FeatureGate: React.FC<FeatureGateProps> = ({ feature, children, fallback }) => {
  const { hasFeature, loading } = usePermissions();

  if (loading) return null;

  if (hasFeature(feature)) {
    return <>{children}</>;
  }

  if (fallback) return <>{fallback}</>;

  return (
    <div className="relative group cursor-not-allowed">
      <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] z-10 rounded-[2.5rem] flex flex-col items-center justify-center space-y-4 opacity-0 group-hover:opacity-100 transition-all">
         <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-2xl">
            <Lock className="h-6 w-6" />
         </div>
         <div className="text-center space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest">Premium Intelligence Required</p>
            <Link to="/billing">
               <Button className="h-auto py-2 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest bg-primary text-primary-foreground">
                  Upgrade Plan
               </Button>
            </Link>
         </div>
      </div>
      <div className="opacity-40 grayscale pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default FeatureGate;
