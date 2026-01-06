import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export type Plan = 'Free' | 'Agency' | 'Enterprise';
export type Feature = 'AI_GROWTH' | 'CONTENT_HUB' | 'WHITE_LABEL' | 'BILLING' | 'TEAM_MANAGEMENT';

const FEATURE_ENTITLEMENTS: Record<Plan, Feature[]> = {
  'Free': ['BILLING'],
  'Agency': ['BILLING', 'AI_GROWTH', 'CONTENT_HUB'],
  'Enterprise': ['BILLING', 'AI_GROWTH', 'CONTENT_HUB', 'WHITE_LABEL', 'TEAM_MANAGEMENT'],
};

export const usePermissions = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<Plan>('Free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('http://localhost:5000/api/scale/billing', {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      .then(res => res.json())
      .then(data => {
        setPlan(data.plan || 'Free');
        setLoading(false);
      })
      .catch(() => {
        setPlan('Free');
        setLoading(false);
      });
    }
  }, [user]);

  const hasFeature = (feature: Feature) => {
    // Admins have all features regardless of plan (internal management)
    if (user?.role === 'admin') return true;
    
    // Clients/Employees depend on the org's plan
    return FEATURE_ENTITLEMENTS[plan].includes(feature);
  };

  const isPro = (feature: Feature) => !hasFeature(feature);

  return { plan, hasFeature, isPro, loading, role: user?.role };
};
