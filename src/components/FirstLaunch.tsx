import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import { Link } from 'react-router-dom';

interface FirstLaunchProps {
  open: boolean;
  onAccept: () => void;
}

const FirstLaunch = ({ open, onAccept }: FirstLaunchProps) => {
  const theme = useTheme();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const handleAccept = () => {
    if (acceptedTerms && acceptedPrivacy) {
      // Store acceptance in localStorage or your preferred storage
      localStorage.setItem('termsAccepted', 'true');
      localStorage.setItem('termsAcceptedDate', new Date().toISOString());
      onAccept();
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      onClose={(reason) => {
        // Prevent closing by backdrop click or escape key
        if (reason === 'backdropClick') {
          return;
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
          Welcome to London Congestion Checker
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          Before you start using our app, please review and accept our terms and policies
        </Typography>

        <Stack spacing={2}>
          <Box sx={{ 
            p: 2, 
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderRadius: 1
          }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
              }
              label={
                <Typography>
                  I have read and agree to the{' '}
                  <Link 
                    to="/terms" 
                    target="_blank"
                    style={{ color: theme.palette.primary.main }}
                  >
                    Terms of Service
                  </Link>
                </Typography>
              }
            />
          </Box>

          <Box sx={{ 
            p: 2, 
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderRadius: 1
          }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptedPrivacy}
                  onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                />
              }
              label={
                <Typography>
                  I have read and agree to the{' '}
                  <Link 
                    to="/privacy" 
                    target="_blank"
                    style={{ color: theme.palette.primary.main }}
                  >
                    Privacy Policy
                  </Link>
                </Typography>
              }
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, flexDirection: 'column' }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleAccept}
          disabled={!acceptedTerms || !acceptedPrivacy}
          sx={{ mb: 1 }}
        >
          Accept & Continue
        </Button>
        <Typography variant="caption" color="text.secondary" textAlign="center">
          By clicking "Accept & Continue", you agree to our Terms and Privacy Policy
        </Typography>
      </DialogActions>
    </Dialog>
  );
};

export default FirstLaunch; 