declare module '@/contexts/LocationContext' {
  export interface LocationContextType {
    userLocation: GeolocationPosition | null;
    locationEnabled: boolean;
    distanceFromZone: number | null;
    isInCongestionZone: boolean;
    error: string | null;
    isInitializing: boolean;
    requestLocationPermission: () => Promise<boolean>;
  }

  export const LONDON_CENTER: {
    lat: number;
    lng: number;
  };

  export function useLocation(): LocationContextType;
} 