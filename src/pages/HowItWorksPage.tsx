import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  useTheme,
  alpha,
  Stack,
  Link as MuiLink,
} from '@mui/material';
import {
  DirectionsCar,
  Payment,
  Notifications,
  AccountBalance,
  OpenInNew,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const AUTO_PAY_URL = 'https://tfl.gov.uk/modes/driving/auto-pay';

const steps = [
  {
    label: 'Check Zone Entry',
    description: 'Drive within the Congestion Charge zone during operating hours: 7:00-18:00 Monday-Friday and 12:00-18:00 Sat-Sun and bank holidays.',
    icon: DirectionsCar,
  },
  {
    label: 'Pay the Charge',
    description: '£15 daily charge applies. Set up Auto Pay for the easiest payment method and to never miss a payment.',
    icon: Payment,
  },
  {
    label: 'Get Notifications',
    description: 'Receive instant notifications about your zone entries and payment status.',
    icon: Notifications,
  },
  {
    label: 'Special Cases',
    description: 'Check if you qualify for exemptions or discounts. No charges apply between Christmas Day and New Year\'s Day bank holiday.',
    icon: AccountBalance,
  },
];

const HowItWorksPage = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="sm" sx={{ pt: 3, pb: 8, mb: 5 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 2,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          How It Works
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Understanding London's Congestion Charge Made Simple
        </Typography>
      </Box>

      {/* Main Content */}
      <Stack spacing={3}>
        {/* Steps Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <Stepper orientation="vertical">
            {steps.map((step) => (
              <Step key={step.label} active={true}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      }}
                    >
                      <step.icon />
                    </Box>
                  )}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                    {step.description}
                  </Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Auto Pay Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Set Up Auto Pay
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Never miss a payment and make your life easier with our Auto Pay system.
          </Typography>
          <Button
            variant="contained"
            fullWidth
            component={MuiLink}
            href={AUTO_PAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNew />}
            sx={{
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Set Up Auto Pay
          </Button>
        </Paper>

        {/* Legal Information Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Legal Information
          </Typography>
          <Stack spacing={1}>
            <Button
              component={Link}
              to="/terms"
              color="inherit"
              sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
            >
              Terms of Service
            </Button>
            <Button
              component={Link}
              to="/privacy"
              color="inherit"
              sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
            >
              Privacy Policy
            </Button>
            <Button
              component={Link}
              to="/legal"
              color="inherit"
              sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
            >
              Legal Notice
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default HowItWorksPage; 