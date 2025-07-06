import { useAuth } from '../hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { loading } = useAuth();

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

  // Allow access regardless of authentication status
  return <>{children}</>;
};

export default PublicRoute; 