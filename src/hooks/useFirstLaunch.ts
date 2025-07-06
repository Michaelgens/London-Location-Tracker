import { useState, useEffect } from 'react';

export const useFirstLaunch = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    // Check if terms have been accepted
    const termsAccepted = localStorage.getItem('termsAccepted');
    const onboardingComplete = localStorage.getItem('onboardingCompleted');
    
    setIsFirstLaunch(!termsAccepted);
    setOnboardingCompleted(!!onboardingComplete);
    setIsLoading(false);
  }, []);

  const handleAccept = () => {
    setIsFirstLaunch(false);
    setOnboardingCompleted(true);
    localStorage.setItem('onboardingCompleted', 'true');
  };

  return {
    isFirstLaunch,
    isLoading,
    onboardingCompleted,
    handleAccept,
  };
}; 