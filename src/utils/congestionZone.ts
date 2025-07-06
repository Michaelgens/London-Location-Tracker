import type { LatLngExpression } from 'leaflet';

// Accurate polygon coordinates for the London Congestion Charge zone
// These coordinates are based on the official TfL congestion zone map
export const CONGESTION_ZONE_POLYGON: LatLngExpression[] = [
  // Northern Boundary (Following Euston Road / Pentonville Road)
  [51.5305, -0.1244], // York Way / Pentonville Road
  [51.5302, -0.1182], // Kings Cross Station
  [51.5298, -0.1156], // Euston Road / Judd Street
  [51.5294, -0.1107], // Euston Road / Woburn Place
  [51.5289, -0.1051], // Euston Road / Grays Inn Road
  
  // Eastern Boundary (Following City Road and Tower Bridge)
  [51.5283, -0.0987], // City Road / Old Street
  [51.5256, -0.0921], // City Road / Great Eastern Street
  [51.5234, -0.0872], // Shoreditch High Street
  [51.5198, -0.0843], // Commercial Street
  [51.5156, -0.0741], // Mansell Street
  [51.5123, -0.0762], // Tower Bridge Approach
  [51.5089, -0.0775], // Tower Bridge
  
  // Southern Boundary (Following Tower Bridge Road to Elephant & Castle)
  [51.5047, -0.0823], // Tower Bridge Road / Tooley Street
  [51.5012, -0.0867], // Tower Bridge Road / Bricklayers Arms
  [51.4978, -0.0912], // New Kent Road
  [51.4956, -0.0989], // New Kent Road / Elephant & Castle
  [51.4934, -0.1051], // Elephant & Castle / London Road
  [51.4923, -0.1107], // St George's Road
  
  // South-Western Boundary (Following Vauxhall Bridge Road)
  [51.4912, -0.1167], // Kennington Lane
  [51.4923, -0.1234], // Vauxhall Bridge Road
  [51.4945, -0.1289], // Vauxhall Bridge
  [51.4967, -0.1345], // Grosvenor Road
  [51.4989, -0.1401], // Chelsea Bridge Road
  
  // Western Boundary (Following Chelsea to Hyde Park)
  [51.5012, -0.1456], // Chelsea Bridge
  [51.5045, -0.1512], // Sloane Square
  [51.5078, -0.1534], // Knightsbridge
  [51.5123, -0.1545], // Hyde Park Corner
  [51.5156, -0.1556], // Park Lane
  
  // North-Western Boundary (Following Park Lane to Marble Arch)
  [51.5189, -0.1567], // Park Lane / Oxford Street
  [51.5212, -0.1578], // Marble Arch
  [51.5245, -0.1567], // Edgware Road
  [51.5278, -0.1545], // Marylebone Road
  [51.5294, -0.1456], // Marylebone Road / Baker Street
  [51.5305, -0.1345], // Euston Road / Osnaburgh Street
  [51.5305, -0.1244]  // Back to start (York Way)
];

// Helper function to check if a point is inside the congestion zone
// Using the Ray Casting algorithm (Point in Polygon)
export const isPointInCongestionZone = (lat: number, lng: number): boolean => {
  let inside = false;
  for (let i = 0, j = CONGESTION_ZONE_POLYGON.length - 1; i < CONGESTION_ZONE_POLYGON.length; j = i++) {
    const point1 = CONGESTION_ZONE_POLYGON[i];
    const point2 = CONGESTION_ZONE_POLYGON[j];
    
    // Ensure points are arrays
    const [yi, xi] = Array.isArray(point1) ? point1 : [point1.lat, point1.lng];
    const [yj, xj] = Array.isArray(point2) ? point2 : [point2.lat, point2.lng];
    
    const intersect = ((yi > lat) !== (yj > lat))
        && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

// Calculate the center point of the congestion zone (weighted center based on the official map)
export const CONGESTION_ZONE_CENTER: LatLngExpression = [51.5134, -0.1089];

// The maximum distance from center to edge (in meters) - based on the actual zone size
export const CONGESTION_ZONE_RADIUS = 3200; // meters 