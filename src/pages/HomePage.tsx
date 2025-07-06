import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Stack,
  IconButton,
  Avatar,
  Badge,
  Link,
  Divider,
  CircularProgress,
  keyframes,
  styled,
} from '@mui/material';
import { 
  PaymentRounded, 
  NotificationsActive, 
  LocationOn,
  CheckCircle,
  Warning,
  OpenInNew,
  Receipt,
  HelpOutline,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '../contexts/LocationContext';
import { useUserData } from '../hooks/useUserData';
import { usePricing } from '../contexts/PricingContext';
import { useEffect, useState } from 'react';

// Define vibration animation
const vibrateAnimation = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(10deg); }
  100% { transform: rotate(0deg); }
`;

// Create styled components for animated icons
const AnimatedNotificationIcon = styled(NotificationsActive, {
  shouldForwardProp: (prop) => prop !== "hasUnread"
})<{ hasUnread: boolean }>(({ hasUnread }) => ({
  animation: hasUnread ? `${vibrateAnimation} 1s infinite` : 'none',
  transformOrigin: 'top center',
}));

type ZoneStatus = 'IN_ZONE_UNPAID' | 'IN_ZONE_PAID' | 'OUTSIDE_ZONE';

const PAYMENT_URL = 'https://tfl.gov.uk/modes/driving/congestion-charge';

const HomePage = () => {
  const navigate = useNavigate();
  const { distanceFromZone, userLocation } = useLocation();
  const { userData, loading, getNotifications, getRecentActivities } = useUserData();
  const { startPricingTimer } = usePricing();
  const [distance, setDistance] = useState<number | null>(null);

  // Update distance when location changes
  useEffect(() => {
    console.debug('HomePage: Location Update', { distanceFromZone, userLocation });
    if (distanceFromZone !== null) {
      setDistance(distanceFromZone);
    }
  }, [distanceFromZone, userLocation]);

  const notifications = getNotifications();
  const unreadNotifications = notifications.filter(notif => !notif.read).length;
  const recentActivities = getRecentActivities();

  const zoneStatus = userData?.currentZoneStatus?.status || 'OUTSIDE_ZONE';
  const hasUnpaidEntry = zoneStatus === 'IN_ZONE_UNPAID' && userData?.currentZoneStatus?.unpaidEntry !== null;

  // Start pricing timer if user is on free trial
  useEffect(() => {
    if (userData?.subscription?.planId === 'free-trial') {
      startPricingTimer();
    }
  }, [userData?.subscription?.planId, startPricingTimer]);

  const handleAlreadyPaid = () => {
    // This would be handled by your payment verification system
    console.log('Payment verification needed');
  };

  const getStatusCardStyle = (status: ZoneStatus) => {
    switch (status) {
      case 'IN_ZONE_UNPAID':
        return {
          background: 'linear-gradient(135deg, #ff3d00 0%, #ff7539 100%)',
          icon: <Warning sx={{ fontSize: 28, mr: 1 }} />,
          title: 'Payment Required!',
          description: 'You are in a charging zone - Payment needed',
        };
      case 'IN_ZONE_PAID':
        return {
          background: 'linear-gradient(135deg, #00c853 0%, #69f0ae 100%)',
          icon: <CheckCircle sx={{ fontSize: 28, mr: 1 }} />,
          title: 'Payment Confirmed',
          description: 'You are in a charging zone - Payment received',
        };
      case 'OUTSIDE_ZONE':
        return {
          background: 'linear-gradient(135deg, #2962ff 0%, #768fff 100%)',
          icon: <LocationOn sx={{ fontSize: 28, mr: 1 }} />,
          title: 'Outside Zone',
          description: 'No charges apply at your location',
        };
    }
  };

  const PaymentButtons = () => (
    <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
      <Button
        variant="contained"
        component={Link}
        href={PAYMENT_URL}
        target="_blank"
        rel="noopener noreferrer"
        startIcon={<PaymentRounded />}
        endIcon={<OpenInNew sx={{ fontSize: 16 }} />}
        sx={{ 
          flex: 1,
          bgcolor: 'white',
          color: '#ff3d00',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.9)',
          },
          fontWeight: 600,
        }}
      >
        Pay Charge Now
      </Button>
      <Button
        variant="outlined"
        onClick={handleAlreadyPaid}
        startIcon={<Receipt />}
        sx={{ 
          flex: 1,
          borderColor: 'white',
          color: 'white',
          '&:hover': {
            borderColor: 'rgba(255,255,255,0.9)',
            bgcolor: 'rgba(255,255,255,0.1)',
          },
          fontWeight: 600,
        }}
      >
        Already Paid
      </Button>
    </Stack>
  );

  const statusStyle = getStatusCardStyle(zoneStatus);

  if (loading) {
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
      {/* Welcome Section */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Welcome back, {userData?.displayName?.split(' ')[0]}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            London Congestion Checker
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          {/* How It Works Button */}
          <IconButton
            onClick={() => navigate('/how-it-works')}
            sx={{ 
              bgcolor: 'info.light',
              color: 'white',
              '&:hover': { 
                bgcolor: 'info.main',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <HelpOutline />
          </IconButton>

          {/* Notifications Button with Animation */}
          <IconButton 
            onClick={() => navigate('/notifications')}
            sx={{ 
              bgcolor: 'primary.light', 
              color: 'white',
              '&:hover': { 
                bgcolor: 'primary.main',
                transform: unreadNotifications > 0 ? 'scale(1.1)' : 'none',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <Badge 
              badgeContent={unreadNotifications} 
              color="error"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              sx={{
                '& .MuiBadge-badge': {
                  animation: unreadNotifications > 0 
                    ? `${vibrateAnimation} 1s infinite` 
                    : 'none',
                  transform: 'translate(50%, -50%)',
                  right: -8,
                  top: -8
                }
              }}
            >
              <AnimatedNotificationIcon hasUnread={unreadNotifications > 0} />
            </Badge>
          </IconButton>
        </Stack>
      </Box>

      {/* Status Card */}
      <Card 
        sx={{ 
          mb: 4,
          background: statusStyle.background,
          color: 'white',
          position: 'relative',
          overflow: 'visible',
          transform: 'translateZ(0)',
        }}
      >
        <CardContent sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {statusStyle.icon}
            <Typography variant="h6" component="div">
              {statusStyle.title}
            </Typography>
          </Box>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: zoneStatus === 'IN_ZONE_UNPAID' ? 3 : 2,
              opacity: 0.9,
              fontSize: '1.1rem',
            }}
          >
            {statusStyle.description}
          </Typography>

          {zoneStatus === 'IN_ZONE_UNPAID' && <PaymentButtons />}

          {zoneStatus === 'OUTSIDE_ZONE' && distance !== null && (
            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.9 }}>
                Distance from Congestion Zone
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {distance.toFixed(1)} mi
                </Typography>
                <Typography variant="h5" sx={{ opacity: 0.7 }}>
                  {(distance * 1.60934).toFixed(1)} km
                </Typography>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Unpaid Entry Section */}
      {hasUnpaidEntry && userData?.currentZoneStatus?.unpaidEntry && (
        <Card 
          sx={{ 
            mb: 4,
            background: 'linear-gradient(135deg, #ff3d00 0%, #ff7539 100%)',
            color: 'white',
            opacity: 0.9,
          }}
        >
          <CardContent sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Warning sx={{ fontSize: 24, mr: 1 }} />
              <Typography variant="h6" component="div">
                Unpaid Congestion Charge
              </Typography>
            </Box>
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                  Entry Date & Time
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {userData.currentZoneStatus.unpaidEntry.date} at {userData.currentZoneStatus.unpaidEntry.time}
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 3 }} />
            <PaymentButtons />
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2,
          color: 'text.primary',
          fontWeight: 600,
        }}
      >
        Recent Activity
      </Typography>
      
      <Stack spacing={2}>
        {recentActivities.map((activity, index) => {
          const getActivityIcon = (type: string) => {
            switch (type) {
              case 'payment':
                return <PaymentRounded />;
              case 'zone_entry':
              case 'zone_exit':
                return <LocationOn />;
              case 'warning':
                return <Warning />;
              default:
                return <NotificationsActive />;
            }
          };

          return (
          <Card 
            key={index}
            sx={{
              '&:hover': {
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <CardContent sx={{ 
              display: 'flex', 
              alignItems: 'center',
              p: 2,
            }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.light',
                  mr: 2,
                }}
              >
                  {getActivityIcon(activity.type)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {activity.action}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {activity.message} • {activity.time}
                </Typography>
              </Box>
            </CardContent>
          </Card>
          );
        })}
      </Stack>
    </Container>
  );
};

export default HomePage; 