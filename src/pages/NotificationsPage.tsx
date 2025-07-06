import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Stack,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  NotificationsActive,
  LocationOn,
  PaymentRounded,
  Warning,
  CheckCircle,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../hooks/useUserData';
import { useEffect } from 'react';

type NotificationType = 'payment' | 'zone_entry' | 'zone_exit' | 'warning' | 'signin' | 'signup' | 'proximity_alert';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { loading, getNotifications, markNotificationsAsRead } = useUserData();
  const notifications = getNotifications();

  useEffect(() => {
    // Only mark notifications as read if there are unread notifications
    if (notifications.some(notification => !notification.read)) {
      markNotificationsAsRead();
    }
  }, [markNotificationsAsRead, notifications]); // Add proper dependencies

  const getNotificationStyle = (type: string) => {
    switch (type as NotificationType) {
      case 'warning':
        return {
          icon: <Warning />,
          color: 'error.light',
          chipColor: 'error' as const,
        };
      case 'payment':
        return {
          icon: <PaymentRounded />,
          color: 'success.light',
          chipColor: 'success' as const,
        };
      case 'zone_entry':
        return {
          icon: <LocationOn />,
          color: 'primary.light',
          chipColor: 'primary' as const,
        };
      case 'zone_exit':
        return {
          icon: <CheckCircle />,
          color: 'info.light',
          chipColor: 'info' as const,
        };
      case 'proximity_alert':
        return {
          icon: <LocationOn />,
          color: 'warning.light',
          chipColor: 'warning' as const,
        };
      case 'signin':
        return {
          icon: <NotificationsActive />,
          color: 'warning.light',
          chipColor: 'warning' as const,
        };
      case 'signup':
        return {
          icon: <CheckCircle />,
          color: 'success.light',
          chipColor: 'success' as const,
        };
      default:
        return {
          icon: <NotificationsActive />,
          color: 'primary.light',
          chipColor: 'primary' as const,
        };
    }
  };

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
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <IconButton 
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
          color="primary"
        >
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {notifications.filter(n => !n.read).length} unread notifications
          </Typography>
        </Box>
      </Box>

      {/* Notifications List */}
      <Stack spacing={2}>
        {notifications.map((notification) => {
          const style = getNotificationStyle(notification.type);
          return (
            <Card
              key={notification.id}
              sx={{
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
                opacity: notification.read ? 0.8 : 1,
              }}
            >
              <CardContent sx={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                p: 2,
              }}>
                <Avatar
                  sx={{
                    bgcolor: style.color,
                    mr: 2,
                  }}
                >
                  {style.icon}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 600,
                        color: 'text.primary',
                        flex: 1,
                      }}
                    >
                      {notification.title}
                    </Typography>
                    <Chip
                      size="small"
                      label={notification.read ? 'Read' : 'New'}
                      color={notification.read ? 'default' : style.chipColor}
                      sx={{ ml: 1 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.time}
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

export default NotificationsPage; 