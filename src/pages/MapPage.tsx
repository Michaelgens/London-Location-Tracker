import { Box, IconButton, Paper, ToggleButton, ToggleButtonGroup, Typography, Stack, Fab, Container, useTheme } from '@mui/material';
import { MapContainer, TileLayer, Polygon, useMap, Marker } from 'react-leaflet';
import type { LatLngExpression, Map as LeafletMap } from 'leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect, useCallback, useRef } from 'react';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LayersIcon from '@mui/icons-material/Layers';
import InfoIcon from '@mui/icons-material/Info';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation } from '../contexts/LocationContext';
import { CONGESTION_ZONE_POLYGON, CONGESTION_ZONE_CENTER } from '../utils/congestionZone';

// Interface for map preferences
interface MapPreferences {
  mapType: 'standard' | 'satellite';
  showControls: boolean;
  showDetails: boolean;
  lastCenter?: LatLngExpression;
  lastZoom?: number;
  activeButton?: string | null;
}

// Custom hook for map preferences
const useMapPreferences = (locationEnabled: boolean): MapPreferences => {
  const defaultPrefs: MapPreferences = {
    mapType: 'standard',
    showControls: false,
    showDetails: false,
    activeButton: locationEnabled ? 'location' : null
  };

  try {
    const savedPrefs = JSON.parse(localStorage.getItem('mapPreferences') || '{}');
    return { ...defaultPrefs, ...savedPrefs };
  } catch {
    return defaultPrefs;
  }
};

// Custom marker styles
const createCustomMarkerIcon = (theme: any) => {
  const markerHtml = `
    <div class="custom-marker">
      <div class="marker-inner"></div>
      <div class="marker-pulse"></div>
    </div>
  `;

  const markerStyle = `
    <style>
      .custom-marker {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .marker-inner {
        width: 16px;
        height: 16px;
        background-color: ${theme.palette.primary.main};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
      }
      .marker-pulse {
        position: absolute;
        width: 40px;
        height: 40px;
        background-color: ${theme.palette.primary.main}40;
        border-radius: 50%;
        animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0% {
          transform: scale(0.5);
          opacity: 1;
        }
        100% {
          transform: scale(1.5);
          opacity: 0;
        }
      }
    </style>
  `;

  return divIcon({
    html: markerStyle + markerHtml,
    className: 'custom-marker-container',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

interface MapControlsProps {
  onMapReady: (map: LeafletMap) => void;
}

// Component to handle map controls and location updates
const MapControls = ({ onMapReady }: MapControlsProps) => {
  const map = useMap();

  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);

  // Save map position when it changes
  useEffect(() => {
    const saveMapPosition = () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      const prefs = JSON.parse(localStorage.getItem('mapPreferences') || '{}');
      localStorage.setItem('mapPreferences', JSON.stringify({
        ...prefs,
        lastCenter: [center.lat, center.lng],
        lastZoom: zoom
      }));
    };

    map.on('moveend', saveMapPosition);
    return () => {
      map.off('moveend', saveMapPosition);
    };
  }, [map]);

  return null;
};

const MapPage = () => {
  const theme = useTheme();
  const { userLocation, locationEnabled, isInCongestionZone } = useLocation();
  const mapRef = useRef<LeafletMap | null>(null);
  const preferences = useMapPreferences(locationEnabled);
  
  const [currentPosition, setCurrentPosition] = useState<LatLngExpression | null>(null);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>(preferences.mapType);
  const [showDetails, setShowDetails] = useState(preferences.showDetails);
  const [showControls, setShowControls] = useState(preferences.showControls);
  const [activeButton, setActiveButton] = useState<string | null>(preferences.activeButton ?? null);
  
  // Update current position when location changes
  useEffect(() => {
    console.debug('MapPage: Location Update', { userLocation });
    if (userLocation) {
      const newPosition: LatLngExpression = [
        userLocation.coords.latitude,
        userLocation.coords.longitude
      ];
      setCurrentPosition(newPosition);

      // If actively following user location, update map view
      if (mapRef.current && activeButton === 'location') {
        mapRef.current.setView(newPosition, mapRef.current.getZoom());
      }
    }
  }, [userLocation, activeButton]);

  // Save preferences when they change
  useEffect(() => {
    const prefs = preferences;
    const newPrefs = {
      ...prefs,
      mapType,
      showControls,
      showDetails,
      activeButton
    };
    localStorage.setItem('mapPreferences', JSON.stringify(newPrefs));
  }, [mapType, showControls, showDetails, activeButton]);

  // Set initial active button based on location
  useEffect(() => {
    if (locationEnabled && !activeButton) {
      setActiveButton('location');
    }
  }, [locationEnabled]);

  const handleMapReady = useCallback((map: LeafletMap) => {
    mapRef.current = map;
    
    // Load saved position if available
    const prefs = preferences;
    if (prefs.lastCenter && prefs.lastZoom) {
      map.setView(prefs.lastCenter as LatLngExpression, prefs.lastZoom);
    }
  }, []);

  const handleLocationClick = useCallback(() => {
    setActiveButton(activeButton === 'location' ? null : 'location');
    if (userLocation && mapRef.current) {
      mapRef.current.setView(
        [userLocation.coords.latitude, userLocation.coords.longitude],
        15
      );
    }
  }, [activeButton, userLocation]);

  const handleZoneClick = useCallback(() => {
    setActiveButton(activeButton === 'zone' ? null : 'zone');
    if (mapRef.current) {
      mapRef.current.setView(CONGESTION_ZONE_CENTER as LatLngExpression, 13);
    }
  }, [activeButton]);

  const handleInfoClick = useCallback(() => {
    setShowDetails(!showDetails);
    setActiveButton(showDetails ? null : 'info');
  }, [showDetails]);

  const handleMapTypeChange = useCallback((_: any, value: 'standard' | 'satellite' | null) => {
    if (value) {
      setMapType(value);
    }
  }, []);

  const handleCloseControls = useCallback(() => {
    setShowControls(false);
    setShowDetails(false);
    setActiveButton(null);
  }, []);

  const userPosition: LatLngExpression | null = userLocation
    ? [userLocation.coords.latitude, userLocation.coords.longitude]
    : null;

  // Create marker icon with current theme
  const markerIcon = createCustomMarkerIcon(theme);

  // Get initial map center
  const getInitialCenter = (): LatLngExpression => {
    const prefs = preferences;
    if (prefs.lastCenter) {
      return prefs.lastCenter;
    }
    if (userPosition) {
      return userPosition;
    }
    return CONGESTION_ZONE_CENTER as LatLngExpression;
  };

  // Get initial zoom
  const getInitialZoom = (): number => {
    const prefs = preferences;
    return prefs.lastZoom || 13;
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        height: 'calc(100vh - 56px)',
        position: 'relative',
        p: 0,
      }}
    >
      <Box 
        sx={{ 
          height: '100%',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <MapContainer
          center={getInitialCenter()}
          zoom={getInitialZoom()}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={true}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={mapType === 'standard' 
              ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            }
          />
          {/* Congestion Zone Polygon */}
          <Polygon
            positions={CONGESTION_ZONE_POLYGON}
            pathOptions={{
              color: theme.palette.mode === 'dark' ? '#ff6b6b' : '#ff4b4b',
              fillColor: theme.palette.mode === 'dark' ? '#ff6b6b' : '#ff4b4b',
              fillOpacity: isInCongestionZone ? 0.3 : 0.2,
              weight: 3,
              dashArray: isInCongestionZone ? '5' : undefined,
            }}
          />
          {/* User Location Marker */}
          {currentPosition && (
            <Marker 
              position={currentPosition} 
              icon={markerIcon}
              zIndexOffset={1000}
            />
          )}
          <MapControls onMapReady={handleMapReady} />
        </MapContainer>

        {/* Map Details Panel */}
        {showDetails && (
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              p: 2,
              bgcolor: theme.palette.mode === 'dark' 
                ? 'rgba(0, 0, 0, 0.8)' 
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              maxWidth: 300,
              zIndex: 999
            }}
          >
            <Box sx={{ mb: 1 }}>
              • Red polygon shows the official TfL Congestion Charge zone
            </Box>
            <Box sx={{ mb: 1 }}>
              • Blue marker shows your current location
            </Box>
            <Box sx={{ mb: 1 }}>
              • Charges apply 7:00 AM - 6:00 PM Mon-Fri
            </Box>
            <Box sx={{ mb: 1 }}>
              • Charges apply 12:00 NOON - 6:00 PM Sat-Sun & bank holidays
            </Box>
            <Box>
              • No charge between Christmas Day and New Year's Day bank holiday
            </Box>
          </Paper>
        )}

        {/* Toggle Controls Button */}
        {!showControls && (
          <Fab
            color="primary"
            aria-label="map controls"
            onClick={() => setShowControls(true)}
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              zIndex: 999,
              bgcolor: theme.palette.mode === 'dark' 
                ? 'rgba(25, 118, 210, 0.9)'
                : 'rgba(25, 118, 210, 0.9)',
              backdropFilter: 'blur(8px)',
              boxShadow: theme.shadows[4],
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark'
                  ? 'rgba(25, 118, 210, 1)'
                  : 'rgba(25, 118, 210, 1)',
              }
            }}
          >
            <Stack alignItems="center">
              <TuneIcon />
            </Stack>
          </Fab>
        )}

        {/* Footer Controls */}
        {showControls && (
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              right: 16,
              p: 2,
              bgcolor: theme.palette.mode === 'dark' 
                ? 'rgba(0, 0, 0, 0.8)' 
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              zIndex: 999
            }}
          >
            <Stack spacing={2}>
              <Stack 
                direction="row" 
                alignItems="center" 
                justifyContent="space-between"
                sx={{ pb: 1, borderBottom: 1, borderColor: 'divider' }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                  MAP CONTROLS
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={handleCloseControls}
                  sx={{ 
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      color: theme.palette.text.primary
                    }
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Stack>

              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <ToggleButtonGroup
                  value={mapType}
                  exclusive
                  onChange={handleMapTypeChange}
                  size="small"
                  sx={{
                    '& .MuiToggleButton-root': {
                      px: 3,
                      py: 1,
                      textTransform: 'none',
                      fontSize: '0.9rem'
                    }
                  }}
                >
                  <ToggleButton value="standard">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LayersIcon fontSize="small" />
                      <Typography variant="body2">Map</Typography>
                    </Stack>
                  </ToggleButton>
                  <ToggleButton value="satellite">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LayersIcon fontSize="small" />
                      <Typography variant="body2">Satellite</Typography>
                    </Stack>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Stack 
                direction="row" 
                spacing={2} 
                sx={{ 
                  justifyContent: 'space-around',
                  '& .MuiIconButton-root': {
                    flexDirection: 'column',
                    gap: 0.5,
                    color: theme.palette.text.primary,
                    '&.active': {
                      color: theme.palette.primary.main,
                      bgcolor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.1)',
                    }
                  }
                }}
              >
                <IconButton 
                  onClick={handleLocationClick}
                  sx={{ borderRadius: 2 }}
                  className={activeButton === 'location' ? 'active' : ''}
                  disabled={!locationEnabled}
                >
                  <MyLocationIcon fontSize="small" />
                  <Typography variant="caption">My Location</Typography>
                </IconButton>

                <IconButton 
                  onClick={handleZoneClick}
                  sx={{ borderRadius: 2 }}
                  className={activeButton === 'zone' ? 'active' : ''}
                >
                  <LocationCityIcon fontSize="small" />
                  <Typography variant="caption">Zone Center</Typography>
                </IconButton>

                <IconButton 
                  onClick={handleInfoClick}
                  sx={{ borderRadius: 2 }}
                  className={activeButton === 'info' ? 'active' : ''}
                >
                  <InfoIcon fontSize="small" />
                  <Typography variant="caption">Info</Typography>
                </IconButton>
              </Stack>
            </Stack>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default MapPage; 