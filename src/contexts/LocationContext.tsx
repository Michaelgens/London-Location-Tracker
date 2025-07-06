import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useSnackbar } from 'notistack';
import { calculateDistance } from '../utils/locationUtils';
import { CONGESTION_ZONE_CENTER, isPointInCongestionZone } from '../utils/congestionZone';
import { useUserData } from '../hooks/useUserData';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import useSound from 'use-sound';

// London congestion zone center coordinates
export const LONDON_CENTER = {
  lat: 51.5074,
  lng: -0.1278
};

interface LocationContextType {
  userLocation: GeolocationPosition | null;
  locationEnabled: boolean;
  distanceFromZone: number | null;
  isInCongestionZone: boolean;
  error: string | null;
  isInitializing: boolean;
  requestLocationPermission: () => Promise<boolean>;
}

const LocationContext = createContext<LocationContextType>({
  userLocation: null,
  locationEnabled: false,
  distanceFromZone: null,
  isInCongestionZone: false,
  error: null,
  isInitializing: true,
  requestLocationPermission: async () => false,
});

export const useLocation = () => {
  return useContext(LocationContext);
};

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [distanceFromZone, setDistanceFromZone] = useState<number | null>(null);
  const [isInCongestionZone, setIsInCongestionZone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [lastProximityAlert, setLastProximityAlert] = useState<Date | null>(null);
  const [lastZoneAlert, setLastZoneAlert] = useState<Date | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { userData } = useUserData();

  // Load alert sound based on user settings
  const [playSound] = useSound(userData?.settings?.alertTone 
    ? `/sounds/${userData.settings.alertTone}.wav`
    : '/sounds/bell.wav'
  );

  const handleLocationUpdate = async (position: GeolocationPosition) => {
    setUserLocation(position);
    setLocationEnabled(true);
    setError(null);
    setPermissionDenied(false);
    
    // Calculate distance from congestion zone center
    const centerCoords = CONGESTION_ZONE_CENTER as [number, number];
    const distance = calculateDistance(
      position.coords.latitude,
      position.coords.longitude,
      centerCoords[0],
      centerCoords[1]
    );
    setDistanceFromZone(distance);

    console.debug('Location Update:', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      distance,
      timestamp: new Date().toISOString()
    });

    // Check if user is inside the congestion zone
    const inZone = isPointInCongestionZone(
      position.coords.latitude,
      position.coords.longitude
    );
    
    if (!isInitializing && userData) {
      const now = new Date();

      // Handle proximity alert (within 3 miles)
      if (distance <= 3 && userData.settings.notifications.proximityAlert) {
        console.debug('Proximity Check:', {
          distance,
          lastProximityAlert: lastProximityAlert?.toISOString(),
          shouldAlert: !lastProximityAlert || (now.getTime() - lastProximityAlert.getTime() > 300000) // 5 minutes
        });

        // Show proximity alert if:
        // 1. First time within 3 miles, OR
        // 2. It's been at least 5 minutes since last alert
        if (!lastProximityAlert || (now.getTime() - lastProximityAlert.getTime() > 300000)) {
          setLastProximityAlert(now);
          
          // Show proximity notification
          enqueueSnackbar('You are approaching the congestion charge zone', {
            variant: 'info',
            preventDuplicate: true,
            autoHideDuration: 6000
          });
          
          try {
            await playSound();
          } catch (error) {
            console.error('Error playing sound:', error);
          }

          // Add proximity notification to Firestore
          try {
            const userRef = doc(db, 'users', userData.uid);
            const notifId = `notif_${Date.now()}`;
            await updateDoc(userRef, {
              [`notifications.${notifId}`]: {
                id: Date.now(),
                title: 'Approaching Congestion Zone',
                message: `You are ${distance.toFixed(1)} miles from the congestion charge zone`,
                time: 'just now',
                type: 'proximity_alert',
                read: false,
                timestamp: now.toISOString()
              }
            });
          } catch (error) {
            console.error('Error adding proximity notification:', error);
          }
        }
      } else if (distance > 3) {
        // Reset proximity alert when moving away from zone
        if (lastProximityAlert) {
          console.debug('Resetting proximity alert - moved away from zone');
          setLastProximityAlert(null);
        }
      }

      // Handle zone entry/exit alerts independently
      if (inZone !== isInCongestionZone) {
        console.debug('Zone Status Change:', {
          previousStatus: isInCongestionZone ? 'IN_ZONE' : 'OUTSIDE_ZONE',
          newStatus: inZone ? 'IN_ZONE' : 'OUTSIDE_ZONE',
          timestamp: now.toISOString()
        });

        setIsInCongestionZone(inZone);
        
        if (userData.settings.notifications.zoneAlerts) {
          const message = inZone 
            ? 'You have entered the congestion charge zone'
            : 'You have left the congestion charge zone';

          // For zone entry
          if (inZone) {
            const needsPayment = !userData.currentZoneStatus?.status || 
                               userData.currentZoneStatus.status === 'OUTSIDE_ZONE' ||
                               userData.currentZoneStatus.status === 'IN_ZONE_UNPAID';

            console.debug('Zone Entry Check:', {
              needsPayment,
              lastZoneAlert: lastZoneAlert?.toISOString(),
              shouldAlert: !lastZoneAlert || (needsPayment && (now.getTime() - lastZoneAlert.getTime() > 3600000))
            });

            if (!lastZoneAlert || 
                (needsPayment && (now.getTime() - lastZoneAlert.getTime() > 3600000))) {
              setLastZoneAlert(now);
              
              // Show zone entry notification
              enqueueSnackbar(message, {
                variant: needsPayment ? 'warning' : 'info',
                preventDuplicate: true,
                autoHideDuration: 6000
              });
              
              try {
                await playSound();
              } catch (error) {
                console.error('Error playing sound:', error);
              }

              try {
                const userRef = doc(db, 'users', userData.uid);
                const notifId = `notif_${Date.now()}`;
                const historyId = `entry_${Date.now()}`;
                
                // Update zone status, add notification and history entry
                await updateDoc(userRef, {
                  'currentZoneStatus': {
                    status: needsPayment ? 'IN_ZONE_UNPAID' : 'IN_ZONE_PAID',
                    lastUpdated: now.toISOString(),
                    unpaidEntry: needsPayment ? {
                      date: now.toLocaleDateString(),
                      time: now.toLocaleTimeString(),
                      timestamp: now.toISOString()
                    } : null
                  },
                  [`notifications.${notifId}`]: {
                    id: Date.now(),
                    title: needsPayment ? 'Payment Required' : 'Zone Entry',
                    message: needsPayment 
                      ? 'You have entered a congestion zone. Please make payment.'
                      : 'You have entered the London Congestion Zone.',
                    time: 'just now',
                    type: needsPayment ? 'warning' : 'zone_entry',
                    read: false,
                    timestamp: now.toISOString()
                  },
                  [`history.${historyId}`]: {
                    date: now.toLocaleDateString(),
                    time: now.toLocaleTimeString(),
                    status: needsPayment ? 'unpaid' : 'paid',
                    timestamp: now.toISOString()
                  }
                });
              } catch (error) {
                console.error('Error updating zone entry data:', error);
              }
            }
          } else {
            // Zone exit
            console.debug('Zone Exit');
            setLastZoneAlert(null);
            
            // Show zone exit notification
            enqueueSnackbar(message, {
              variant: 'info',
              preventDuplicate: true,
              autoHideDuration: 6000
            });
            
            try {
              await playSound();
            } catch (error) {
              console.error('Error playing sound:', error);
            }

            try {
              const userRef = doc(db, 'users', userData.uid);
              const notifId = `notif_${Date.now()}`;
              
              // Update zone status and add notification
              await updateDoc(userRef, {
                'currentZoneStatus': {
                  status: 'OUTSIDE_ZONE',
                  lastUpdated: now.toISOString(),
                  unpaidEntry: null
                },
                [`notifications.${notifId}`]: {
                  id: Date.now(),
                  title: 'Zone Exit',
                  message: 'You have left the London Congestion Zone.',
                  time: 'just now',
                  type: 'zone_exit',
                  read: false,
                  timestamp: now.toISOString()
                }
              });
            } catch (error) {
              console.error('Error updating zone exit data:', error);
            }
          }
        }
      }
    }
  };

  const handleLocationError = (error: GeolocationPositionError) => {
    // Log error for debugging but don't expose to user
    console.debug('Location service status:', error.code, error.message);
    
    if (error.code === error.PERMISSION_DENIED) {
      setPermissionDenied(true);
      setLocationEnabled(false);
      setError('location_denied');
    } else if (error.code === error.POSITION_UNAVAILABLE) {
      setLocationEnabled(false);
      setError('location_unavailable');
    } else if (error.code === error.TIMEOUT) {
      setLocationEnabled(false);
      setError('location_timeout');
    }

    // Only show user-friendly notifications after initialization
    if (!isInitializing) {
      let message = 'Please enable location services to use this app.';
      let variant: 'warning' | 'error' = 'warning';

      if (error.code === error.POSITION_UNAVAILABLE) {
        message = 'Unable to determine your location. Please check your GPS is enabled.';
      } else if (error.code === error.TIMEOUT) {
        message = 'Location service is responding slowly. Please try again.';
      }

      enqueueSnackbar(message, { 
        variant,
        preventDuplicate: true,
        autoHideDuration: 6000
      });
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      setError('location_unsupported');
      return false;
    }

    // First check if we already have permission
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      
      if (permission.state === 'denied') {
        setPermissionDenied(true);
        setLocationEnabled(false);
        setError('location_denied');
        return false;
      }

      // If permission is granted or prompt, try to get position
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            handleLocationUpdate(position);
            setLocationEnabled(true);
            setPermissionDenied(false);
            resolve(true);
          },
          (error) => {
            console.debug('Location error:', error);
            handleLocationError(error);
            if (error.code === error.PERMISSION_DENIED) {
              setPermissionDenied(true);
              setLocationEnabled(false);
            }
            resolve(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });
    } catch (error) {
      console.debug('Permission check failed:', error);
      setLocationEnabled(false);
      return false;
    }
  };

  // Initial permission check and setup
  useEffect(() => {
    const checkInitialPermission = async () => {
      if (!navigator.geolocation) {
        setError('location_unsupported');
        setIsInitializing(false);
        return;
      }

      try {
        // Try to get permission status
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        
        // Initial permission state handling
        if (permission.state === 'granted') {
          const success = await requestLocationPermission();
          if (!success) {
            setError('location_error');
          }
        } else if (permission.state === 'prompt') {
          // Will trigger the permission prompt
          await requestLocationPermission();
        } else if (permission.state === 'denied') {
          setPermissionDenied(true);
          setLocationEnabled(false);
          setError('location_denied');
        }

        // Listen for permission changes
        permission.addEventListener('change', async () => {
          console.debug('Permission state changed:', permission.state);
          if (permission.state === 'granted') {
            const success = await requestLocationPermission();
            if (!success) {
              setError('location_error');
            }
          } else if (permission.state === 'denied') {
            setPermissionDenied(true);
            setLocationEnabled(false);
            setError('location_denied');
          }
        });

        setIsInitializing(false);
      } catch (error) {
        console.debug('Initial permission check failed:', error);
        setIsInitializing(false);
      }
    };

    checkInitialPermission();
  }, []);

  // Live location updates
  useEffect(() => {
    let watchId: number | undefined;

    const startLocationWatch = () => {
      if (locationEnabled && !permissionDenied && navigator.geolocation) {
        // Get initial position immediately
        navigator.geolocation.getCurrentPosition(
          handleLocationUpdate,
          handleLocationError,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );

        // Then start watching for changes
        watchId = navigator.geolocation.watchPosition(
          handleLocationUpdate,
          handleLocationError,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5000 // Allow cached positions up to 5 seconds old
          }
        );
      }
    };

    startLocationWatch();

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [locationEnabled, permissionDenied]);

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        locationEnabled,
        distanceFromZone,
        isInCongestionZone,
        error,
        isInitializing,
        requestLocationPermission,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}; 