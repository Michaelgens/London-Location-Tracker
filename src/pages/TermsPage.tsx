import {
  Container,
  Typography,
  Paper,
  Box,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import { Link } from 'react-router-dom';

const TermsPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 4 }}>
        <MuiLink component={Link} to="/" color="inherit">
          Home
        </MuiLink>
        <Typography color="text.primary">Terms of Service</Typography>
      </Breadcrumbs>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
          Terms of Service
        </Typography>

        <Box sx={{ '& > *': { mb: 4 } }}>
          <section>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              1. Acceptance of Terms
            </Typography>
            <Typography paragraph>
              By accessing and using the London Congestion Checker application, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              2. Service Description
            </Typography>
            <Typography paragraph>
              The London Congestion Checker provides information about congestion charge zones, payment processing, and notifications for zone entry. The service includes:
            </Typography>
            <ul>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Real-time zone entry monitoring
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Payment processing through Auto Pay system
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Notification services for zone entries and payments
              </Typography>
            </ul>
          </section>

          <section>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              3. User Responsibilities
            </Typography>
            <Typography paragraph>
              Users are responsible for:
            </Typography>
            <ul>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Maintaining accurate account information
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Ensuring timely payments of congestion charges
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Complying with all traffic and congestion zone regulations
              </Typography>
            </ul>
          </section>

          <section>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              4. Payment Terms
            </Typography>
            <Typography paragraph>
              The congestion charge is £15 per day for driving within the zone during operating hours. Users must pay by midnight on the next working day after travel to avoid penalty charges.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              5. Privacy and Data
            </Typography>
            <Typography paragraph>
              We collect and process personal data in accordance with our Privacy Policy. By using our service, you consent to such processing and warrant that all data provided is accurate.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              6. Modifications to Service
            </Typography>
            <Typography paragraph>
              We reserve the right to modify or discontinue the service with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              7. Contact Information
            </Typography>
            <Typography paragraph>
              For any questions regarding these Terms of Service, please contact our support team through the application or email us at support@londoncongestionchecker.com
            </Typography>
          </section>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4, pt: 4, borderTop: 1, borderColor: 'divider' }}>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>
      </Paper>
    </Container>
  );
};

export default TermsPage; 