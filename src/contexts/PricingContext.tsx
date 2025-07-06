import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useUserData } from '../hooks/useUserData';
import { useAuth } from '../hooks/useAuth';
import PricingModal from '../components/PricingModal';

export interface PlanType {
  id: string;
  name: string;
  price: string;
  period: string;
  color: string;
  features: string[];
  recommended: boolean;
}

interface PricingContextType {
  showPricingModal: boolean;
  setShowPricingModal: (show: boolean) => void;
  plans: PlanType[];
  loading: boolean;
  error: Error | null;
  currentPlan: PlanType | null;
  onSelectPlan: (planId: string) => void;
  startPricingTimer: () => void;
}

const PricingContext = createContext<PricingContextType | null>(null);

export const usePricing = () => {
  const context = useContext(PricingContext);
  if (!context) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
};

export const PricingProvider = ({ children }: { children: ReactNode }) => {
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pricingTimerStarted, setPricingTimerStarted] = useState(false);
  const { userData } = useUserData();
  const { user } = useAuth();

  // Fetch plans from Firestore
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansCollection = collection(db, 'plans');
        const plansSnapshot = await getDocs(plansCollection);
        const plansData = plansSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PlanType[];
        setPlans(plansData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Start pricing timer only once per session
  const startPricingTimer = () => {
    if (!pricingTimerStarted && user && userData?.subscription?.planId === 'free-trial') {
      setPricingTimerStarted(true);
      const timer = setTimeout(() => {
        setShowPricingModal(true);
      }, 50000);

      return () => clearTimeout(timer);
    }
  };

  // Find current plan with proper type handling
  const currentPlan: PlanType | null = userData?.subscription?.planId && plans.length > 0
    ? plans.find(plan => plan.id === userData.subscription.planId) || null
    : null;

  const onSelectPlan = async (planId: string) => {
    // Here you would implement the plan selection/purchase logic
    console.log('Selected plan:', planId);
    setShowPricingModal(false);
  };

  return (
    <PricingContext.Provider
      value={{
        showPricingModal,
        setShowPricingModal,
        plans,
        loading,
        error,
        currentPlan,
        onSelectPlan,
        startPricingTimer
      }}
    >
      {children}
      {plans.length > 0 && (
        <PricingModal
          open={showPricingModal}
          onClose={() => setShowPricingModal(false)}
          currentPlanId={currentPlan?.id}
          onSelectPlan={onSelectPlan}
          plans={plans}
        />
      )}
    </PricingContext.Provider>
  );
}; 