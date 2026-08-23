import { useState, useEffect, useCallback } from 'react';
import type { DecisionProfile } from '../utils/DecisionProfileStorage';
import { DecisionProfileStorage } from '../utils/DecisionProfileStorage';

export function useDecisionProfile() {
  const [profile, setProfileState] = useState<DecisionProfile | null>(() => {
    return DecisionProfileStorage.getProfile();
  });

  // Automatically load on app startup & listen for custom updates
  useEffect(() => {
    const handleStorageChange = () => {
      setProfileState(DecisionProfileStorage.getProfile());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('decision_profile_updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('decision_profile_updated', handleStorageChange);
    };
  }, []);

  const saveProfile = useCallback((updatedProfile: DecisionProfile) => {
    DecisionProfileStorage.saveProfile(updatedProfile);
    setProfileState(updatedProfile);
    window.dispatchEvent(new Event('decision_profile_updated'));
  }, []);

  const clearProfile = useCallback(() => {
    DecisionProfileStorage.clearProfile();
    setProfileState(null);
    window.dispatchEvent(new Event('decision_profile_updated'));
  }, []);

  const isConfigured = Boolean(
    profile && profile.profession && profile.finalScore !== null && profile.finalScore >= 0,
  );

  return {
    profile,
    saveProfile,
    clearProfile,
    isConfigured,
  };
}
