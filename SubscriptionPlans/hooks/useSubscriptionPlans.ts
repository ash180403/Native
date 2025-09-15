import { useState, useEffect } from 'react';
import { DUMMY_PLANS } from '../utils/dummyData';
import { SubscriptionPlan } from '../types';

export const useSubscriptionPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [showAllPlans, setShowAllPlans] = useState(false);

  useEffect(() => {
    // In a real app, this is where you'd fetch from an API
    setPlans(DUMMY_PLANS);
  }, []);

  const toggleAllPlans = () => {
    setShowAllPlans(prev => !prev);
  };

  const visiblePlans = showAllPlans
    ? plans
    : plans.filter(plan => plan.isInitialPlan);

  return {
    plans: visiblePlans,
    showAllPlans,
    toggleAllPlans,
  };
};
