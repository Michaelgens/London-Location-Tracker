import { Routes, Route } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';
import HomePage from '../pages/HomePage';
import HistoryPage from '../pages/HistoryPage';
import MapPage from '../pages/MapPage';
import SettingsPage from '../pages/SettingsPage';
import NotificationsPage from '../pages/NotificationsPage';
import AuthPage from '../pages/AuthPage';
import HowItWorksPage from '../pages/HowItWorksPage';
import TermsPage from '../pages/TermsPage';
import PrivacyPage from '../pages/PrivacyPage';
import LegalPage from '../pages/LegalPage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const AppRoutes = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100%',
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        transition: theme.transitions.create(['background-color', 'color']),
      }}
    >
      <Routes>
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <HistoryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/map"
          element={
            <PrivateRoute>
              <MapPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <NotificationsPage />
            </PrivateRoute>
          }
        />

        {/* Public Routes */}
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />

        {/* Information and Legal Routes - Public */}
        <Route
          path="/how-it-works"
          element={
            <PublicRoute>
              <HowItWorksPage />
            </PublicRoute>
          }
        />
        <Route
          path="/terms"
          element={
            <PublicRoute>
              <TermsPage />
            </PublicRoute>
          }
        />
        <Route
          path="/privacy"
          element={
            <PublicRoute>
              <PrivacyPage />
            </PublicRoute>
          }
        />
        <Route
          path="/legal"
          element={
            <PublicRoute>
              <LegalPage />
            </PublicRoute>
          }
        />

        {/* Catch all route - redirect to home if authenticated, otherwise to auth */}
        <Route
          path="*"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Box>
  );
};

export default AppRoutes; 