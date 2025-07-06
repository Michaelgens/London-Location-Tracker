import { Box, CircularProgress, Typography } from '@mui/material';
import { useLocation } from '../contexts/LocationContext';
import { useEffect, useState } from 'react';

const LoadingPage = () => {
  const { locationEnabled, isInitializing } = useLocation();
  const [loadingMessage, setLoadingMessage] = useState('Setting up your experience...');

  useEffect(() => {
    if (isInitializing) {
      if (!locationEnabled) {
        setLoadingMessage('Preparing location services...');
      }
    }
  }, [isInitializing, locationEnabled]);

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        gap: 3,
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography
        variant="h6"
        color="text.secondary"
        align="center"
        sx={{ maxWidth: 300 }}
      >
        {loadingMessage}
      </Typography>
    </Box>
  );
};

export default LoadingPage; 