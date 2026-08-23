export interface OriginLocation {
  type: 'coordinates' | 'manual';
  department?: string;
  province?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
}

export interface DecisionProfile {
  profession: string;
  finalScore: number | null; // decimal 0 to 100
  origin: OriginLocation | null;
  lastUpdated: string;
}

const STORAGE_KEY = 'serums_decision_profile';

/**
 * Storage Abstraction Layer for Decision Profile.
 * Encapsulates localStorage access so it can be swapped for Supabase/API backend in the future without changing UI components.
 */
export class DecisionProfileStorage {
  static getProfile(): DecisionProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading Decision Profile from storage', e);
      return null;
    }
  }

  static saveProfile(profile: DecisionProfile): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving Decision Profile to storage', e);
    }
  }

  static clearProfile(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Error clearing Decision Profile from storage', e);
    }
  }
}
