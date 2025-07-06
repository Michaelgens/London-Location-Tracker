import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Switch,
  Stack,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  NotificationsActive,
  LocationOn,
  Payment,
  DarkMode,
  ArrowForward,
  VolumeUp,
  PlayArrow,
  WorkspacePremium as Premium,
  Check,
  Star,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useColorMode } from '../App';
import useSound from 'use-sound';
import { useUserData } from '../hooks/useUserData';
import { usePricing } from '../contexts/PricingContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { differenceInDays } from 'date-fns';
import { useAuth } from '../hooks/useAuth';

// Alert tone options
const ALERT_TONES = [
  { id: 'basic1', name: 'Basic 1', url: '/sounds/bell.wav' },
  { id: 'basic2', name: 'Basic 2', url: '/sounds/settingsdown.wav' },
  { id: 'basic3', name: 'Basic 3', url: '/sounds/settingsup.wav' },
  { id: 'basic4', name: 'Basic 4', url: '/sounds/notifications.wav' },
  { id: 'basic5', name: 'Basic 5', url: '/sounds/new.wav' },
  { id: 'basic6', name: 'Basic 6', url: '/sounds/nod.wav' },
  { id: 'basic7', name: 'Basic 7', url: '/sounds/fail.wav' },
];

const SettingsPage = () => {
  const { mode, toggleColorMode } = useColorMode();
  const { userData, loading } = useUserData();
  const { currentPlan, setShowPricingModal } = usePricing();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  
  const [notifications, setNotifications] = useState({
    zoneAlerts: false,
    proximityAlert: false,
    paymentReminders: false,
    locationTracking: false,
  });

  // Sound settings
  const [selectedTone, setSelectedTone] = useState(ALERT_TONES[0]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [playSound] = useSound(selectedTone.url);

  // Initialize settings from userData
  useEffect(() => {
    if (userData?.settings) {
      setNotifications(userData.settings.notifications);
      setSelectedTone(
        ALERT_TONES.find(tone => tone.id === userData.settings.alertTone) || ALERT_TONES[0]
      );
    }
  }, [userData]);

  const handleNotificationChange = async (setting: keyof typeof notifications) => {
    if (!userData) return;

    const newNotifications = {
      ...notifications,
      [setting]: !notifications[setting],
    };

    setNotifications(newNotifications);

    try {
      const userRef = doc(db, 'users', userData.uid);
      await updateDoc(userRef, {
        'settings.notifications': newNotifications
      });
    } catch (error) {
      console.error('Error updating notification settings:', error);
      // Revert state on error
      setNotifications(notifications);
    }
  };

  const handleToneMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleToneMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToneSelect = useCallback(async (tone: typeof ALERT_TONES[0]) => {
    if (!userData) return;

    setSelectedTone(tone);
    handleToneMenuClose();

    try {
      const userRef = doc(db, 'users', userData.uid);
      await updateDoc(userRef, {
        'settings.alertTone': tone.id
      });
    } catch (error) {
      console.error('Error updating alert tone:', error);
      // Revert state on error
      setSelectedTone(selectedTone);
    }
  }, [userData, selectedTone]);

  const handlePreviewTone = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    playSound();
  }, [playSound]);

  const getRemainingDays = () => {
    if (!userData?.subscription?.endDate) return 0;
    return differenceInDays(new Date(userData.subscription.endDate), new Date());
  };

  const notificationSettings = [
    {
      key: 'theme',
      icon: <DarkMode />,
      title: 'Dark Mode',
      description: 'Toggle between light and dark theme',
      color: 'primary.main',
      isThemeSwitch: true,
    },
    {
      key: 'alertTone',
      icon: <VolumeUp />,
      title: 'Alert Tone',
      description: 'Choose your notification sound',
      color: 'warning.light',
      isCustom: true,
      customContent: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={handleToneMenuOpen}
            sx={{ 
              textTransform: 'none',
              minWidth: 130,
              justifyContent: 'space-between',
              px: 2,
            }}
            endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
          >
            {selectedTone.name}
          </Button>
          <IconButton
            size="small"
            onClick={handlePreviewTone}
            sx={{ 
              bgcolor: 'background.default',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <PlayArrow fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleToneMenuClose}
            PaperProps={{
              sx: {
                maxHeight: 200,
                width: 200,
              }
            }}
          >
            {ALERT_TONES.map((tone) => (
              <MenuItem
                key={tone.id}
                selected={tone.id === selectedTone.id}
                onClick={() => handleToneSelect(tone)}
                sx={{ 
                  py: 1.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    }
                  }
                }}
              >
                {tone.name}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      ),
    },
    {
      key: 'zoneAlerts',
      icon: <LocationOn />,
      title: 'Zone Alerts',
      description: 'Notify when entering/leaving congestion zones',
      color: 'primary.light',
    },
    {
      key: 'proximityAlert',
      icon: <LocationOn />,
      title: 'Proximity Alert',
      description: 'Notify when 3 miles away from congestion zones',
      color: 'info.light',
    },
    {
      key: 'paymentReminders',
      icon: <Payment />,
      title: 'Payment Reminders',
      description: 'Remind me to pay congestion charges',
      color: 'secondary.light',
    },
    {
      key: 'locationTracking',
      icon: <NotificationsActive />,
      title: 'Location Services',
      description: 'Allow background location tracking',
      color: 'success.light',
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
    setLogoutDialogOpen(false);
  };

  if (loading || !userData || !currentPlan) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ pt: 3, pb: 8, mb:5 }}>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 3,
          fontWeight: 700,
          color: 'text.primary',
        }}
      >
        Settings
      </Typography>

      {/* Premium Membership Section */}
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2,
          fontWeight: 600,
          color: 'text.primary',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Premium sx={{ color: 'warning.main' }} />
        Membership
      </Typography>

      <Card
        sx={{
          mb: 4,
          position: 'relative',
          overflow: 'visible',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                {currentPlan.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your current membership plan
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  color: currentPlan.color,
                }}
              >
                £{currentPlan.price}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {currentPlan.period}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={1.5} sx={{ mb: 2 }}>
            {currentPlan.features.map((feature, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Check sx={{ color: currentPlan.color, fontSize: 18 }} />
                <Typography variant="body2">
                  {feature}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Button
            variant="outlined"
            fullWidth
            onClick={() => setShowPricingModal(true)}
            startIcon={<Star />}
            sx={{
              mt: 1,
              borderColor: currentPlan.color,
              color: currentPlan.color,
              '&:hover': {
                borderColor: currentPlan.color,
                bgcolor: `${currentPlan.color}10`,
              },
            }}
          >
            Upgrade Plan
          </Button>
        </CardContent>

        {/* Expiry Chip */}
        <Chip
          label={`${getRemainingDays()} days remaining`}
          size="small"
          sx={{
            position: 'absolute',
            top: -10,
            right: 16,
            bgcolor: currentPlan.color,
            color: 'white',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />
      </Card>

      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2,
          fontWeight: 600,
          color: 'text.primary',
        }}
      >
        Preferences
      </Typography>
      
      <Stack spacing={2} sx={{ mb: 4 }}>
        {notificationSettings.map((setting) => (
          <Card
            key={setting.key}
            sx={{
              '&:hover': {
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    bgcolor: setting.color,
                    mr: 2,
                  }}
                >
                  {setting.icon}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'text.primary',
                    }}
                  >
                    {setting.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {setting.description}
                  </Typography>
                </Box>
                {setting.isCustom ? (
                  setting.customContent
                ) : (
                  <Switch
                    checked={setting.isThemeSwitch ? mode === 'dark' : notifications[setting.key as keyof typeof notifications] || false}
                    onChange={setting.isThemeSwitch ? toggleColorMode : () => handleNotificationChange(setting.key as keyof typeof notifications)}
                    color="primary"
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2,
          fontWeight: 600,
          color: 'text.primary',
        }}
      >
        Account
      </Typography>

      <Card
        sx={{
          '&:hover': {
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease',
          bgcolor: 'error.main',
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => setLogoutDialogOpen(true)}
          >
            <Avatar
              sx={{
                bgcolor: 'error.dark',
                mr: 2,
              }}
            >
              <LogoutIcon />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600,
                  color: 'white',
                }}
              >
                Log Out
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', opacity: 0.8 }}>
                Sign out of your account
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            width: '90%',
            maxWidth: '400px',
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Confirm Logout
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="text.secondary">
            Are you sure you want to log out? You'll need to sign in again to access your account.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button
            onClick={() => setLogoutDialogOpen(false)}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
          >
            Log Out
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SettingsPage; 