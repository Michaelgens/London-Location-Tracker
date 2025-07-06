import {
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  Box,
  Chip,
  Divider,
  CircularProgress,
  Paper,
} from '@mui/material';
import { 
  CheckCircle,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useUserData } from '../hooks/useUserData';

interface HistoryEntry {
  date: string;
  time: string;
  status: string;
  timestamp: string;
}

const EmptyState = () => (
  <Paper
    elevation={0}
    sx={{
      p: 4,
      textAlign: 'center',
      bgcolor: 'background.default',
      borderRadius: 2,
      mt: 4,
    }}
  >
    <HistoryIcon 
      sx={{ 
        fontSize: 64,
        color: 'action.disabled',
        mb: 2,
        opacity: 0.5,
      }} 
    />
    <Typography 
      variant="h6" 
      sx={{ 
        fontWeight: 600,
        color: 'text.primary',
        mb: 1,
      }}
    >
      No Entry History
    </Typography>
    <Typography 
      variant="body2" 
      color="text.secondary"
      sx={{ 
        maxWidth: 300,
        mx: 'auto',
        lineHeight: 1.6,
      }}
    >
      Your zone entry history will appear here once you start using the congestion charge zones.
    </Typography>
  </Paper>
);

const HistoryPage = () => {
  const { userData, loading } = useUserData();

  // Transform history object into array and sort by timestamp
  const getHistoryEntries = (): HistoryEntry[] => {
    if (!userData?.history) return [];
    
    return Object.values(userData.history)
      .sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
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

  const historyEntries = getHistoryEntries();

  return (
    <Container maxWidth="sm" sx={{ pt: 3, pb: 8, mb: 5 }}>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 3,
          fontWeight: 700,
          color: 'text.primary',
        }}
      >
        Zone Entry History
      </Typography>

      {historyEntries.length === 0 ? (
        <EmptyState />
      ) : (
        <Stack spacing={2}>
          {historyEntries.map((entry, index) => (
            <Card
              key={entry.timestamp}
              sx={{
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 0.5,
                      }}
                    >
                      {entry.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Entry Time: {entry.time}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-end',
                    gap: 1
                  }}>
                    <Chip
                      size="small"
                      label={entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      color={entry.status === 'paid' ? 'success' : 'warning'}
                      icon={entry.status === 'paid' ? <CheckCircle sx={{ fontSize: 16 }} /> : undefined}
                      sx={{ height: 24 }}
                    />
                  </Box>
                </Box>
              </CardContent>
              {index < historyEntries.length - 1 && (
                <Divider sx={{ opacity: 0.1 }} />
              )}
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default HistoryPage; 