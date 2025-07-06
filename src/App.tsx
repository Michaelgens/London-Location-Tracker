import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { getTheme } from './theme/theme';
import Navigation from './components/Navigation';
import AppRoutes from './components/AppRoutes';
import { createContext, useState, useMemo, useContext, useEffect } from 'react';
import type { PaletteMode } from '@mui/material';
import { LocationProvider, useLocation } from './contexts/LocationContext';
import LoadingPage from './components/LoadingPage';
import LocationPermissionModal from './components/LocationPermissionModal';
import { PricingProvider } from './contexts/PricingContext';
import { useFirstLaunch } from './hooks/useFirstLaunch';
import { useAuth } from './hooks/useAuth';
import FirstLaunch from './components/FirstLaunch';
import SplashScreen from './components/SplashScreen';

// Create theme context
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light' as PaletteMode,
});

// Custom hook to use the color mode
export const useColorMode = () => {
  return useContext(ColorModeContext);
};

// App content wrapper component
const AppContent = () => {
  const { locationEnabled, error, isInitializing } = useLocation();
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const { isFirstLaunch, isLoading: firstLaunchLoading, handleAccept } = useFirstLaunch();
  const { loading: authLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Only show permission modal after initialization is complete
    if (!isInitializing && !locationEnabled && error?.includes('denied')) {
      setShowPermissionModal(true);
    }
  }, [isInitializing, locationEnabled, error]);

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // Show loading while checking first launch and auth status
  if (firstLaunchLoading || authLoading || isInitializing) {
    return <LoadingPage />;
  }

  // Show FirstLaunch for first-time visitors
  if (isFirstLaunch) {
    return <FirstLaunch open={true} onAccept={handleAccept} />;
  }

  return (
    <>
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#f5f5f5'
      }}>
        <main style={{ flex: 1, overflow: 'auto' }}>
          <AppRoutes />
        </main>
        <Navigation />
      </div>
      
      {showPermissionModal && (
        <LocationPermissionModal 
          open={showPermissionModal} 
        />
      )}
    </>
  );
};

function App() {
  const [mode, setMode] = useState<PaletteMode>('dark');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider 
          maxSnack={3} 
          anchorOrigin={{ 
            vertical: 'top', 
            horizontal: 'center' 
          }}
          autoHideDuration={5000}
        >
          <LocationProvider>
            <BrowserRouter>
              <PricingProvider>
                <AppContent />
              </PricingProvider>
            </BrowserRouter>
          </LocationProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
