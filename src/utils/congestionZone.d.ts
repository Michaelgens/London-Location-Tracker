import type { LatLngExpression } from 'leaflet';

declare module '@/utils/congestionZone' {
  export const CONGESTION_ZONE_POLYGON: LatLngExpression[];
  export const CONGESTION_ZONE_CENTER: LatLngExpression;
  export function isPointInCongestionZone(lat: number, lng: number): boolean;
} 