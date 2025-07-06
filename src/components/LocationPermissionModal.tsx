import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  AlertTitle,
  Stack,
} from '@mui/material';
import { LocationOn, GpsFixed, PhoneAndroid } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useLocation } from '../contexts/LocationContext';

interface LocationPermissionModalProps {
  open: boolean;
}

const LocationPermissionModal = ({ open }: LocationPermissionModalProps) => {
  const { requestLocationPermission, error } = useLocation();
  const [isRequesting, setIsRequesting] = useState(false);
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    if (error === 'location_denied') {
      setShowRetry(true);
    }
  }, [error]);

  const handleEnableLocation = async () => {
    setIsRequesting(true);
    setShowRetry(false);
    try {
      const result = await requestLocationPermission();
      if (!result) {
        setShowRetry(true);
      }
    } catch (err) {
      setShowRetry(true);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      disablePortal
      hideBackdrop
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
        <GpsFixed
          sx={{
            fontSize: 48,
            color: 'primary.main',
            mb: 2,
          }}
        />
        <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
          Enable Location Services
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ px: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>Location Access Required</AlertTitle>
          This app needs your location to provide accurate congestion zone information and notifications.
        </Alert>

        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Quick Setup Guide:
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PhoneAndroid color="primary" />
                <Typography variant="body2">
                  1. Click 'Allow' when prompted for location
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationOn color="primary" />
                <Typography variant="body2">
                  2. Ensure GPS is enabled on your device
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <GpsFixed color="primary" />
                <Typography variant="body2">
                  3. Stay connected for live updates
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Benefits:
            </Typography>
            <Stack spacing={1}>
              <Typography component="li" variant="body2">
                Real-time zone entry/exit alerts
              </Typography>
              <Typography component="li" variant="body2">
                Accurate distance calculations
              </Typography>
              <Typography component="li" variant="body2">
                Timely payment reminders
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 4, flexDirection: 'column', gap: 2 }}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleEnableLocation}
          disabled={isRequesting}
          sx={{ py: 1.5 }}
        >
          {isRequesting ? (
            <CircularProgress size={24} color="inherit" />
          ) : showRetry ? (
            'Try Again'
          ) : (
            'Enable Location Services'
          )}
        </Button>
        <Typography variant="caption" color="text.secondary" align="center">
          {showRetry 
            ? 'If location access is blocked, you may need to enable it in your browser settings'
            : 'Your location is only used while using the app'
          }
        </Typography>
      </DialogActions>
    </Dialog>
  );
};

export default LocationPermissionModal; 