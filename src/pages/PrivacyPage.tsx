import {
  Container,
  Typography,
  Paper,
  Box,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 4 }}>
        <MuiLink component={Link} to="/" color="inherit">
          Home
        </MuiLink>
        <Typography color="text.primary">Privacy Policy</Typography>
      </Breadcrumbs>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
          Privacy Policy
        </Typography>

        <Box sx={{ '& > *': { mb: 4 } }}>
          <section>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              1. Information We Collect
            </Typography>
            <Typography paragraph>
              We collect the following types of information:
            </Typography>
            <ul>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Personal identification information (name, email address, phone number)
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Vehicle information (registration number, make, model)
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Location data when entering congestion charge zones
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Payment information (processed securely through our payment provider)
              </Typography>
            </ul>
          </section>

          <section>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              2. How We Use Your Information
            </Typography>
            <Typography paragraph>
              We use the collected information for:
            </Typography>
            <ul>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Processing congestion charge payments
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Sending notifications about zone entries and payments
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Improving our services and user experience
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Complying with legal obligations
              </Typography>
            </ul>
          </section>

          <section>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              3. Data Storage and Security
            </Typography>
            <Typography paragraph>
              We implement appropriate security measures to protect your personal information. Your data is stored securely in encrypted format and we regularly review our security practices.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              4. Data Sharing
            </Typography>
            <Typography paragraph>
              We do not sell your personal data to third parties. We may share your information with:
            </Typography>
            <ul>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Payment processing providers
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Transport for London (TfL) for verification purposes
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Law enforcement when required by law
              </Typography>
            </ul>
          </section>

          <section>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              5. Your Rights
            </Typography>
            <Typography paragraph>
              You have the right to:
            </Typography>
            <ul>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Access your personal data
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Request correction of your personal data
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Request deletion of your personal data
              </Typography>
              <Typography component="li" sx={{ ml: 3, mb: 1 }}>
                Object to processing of your personal data
              </Typography>
            </ul>
          </section>

          <section>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              6. Cookies and Tracking
            </Typography>
            <Typography paragraph>
              We use cookies and similar tracking technologies to improve your experience and collect usage data. You can control cookie settings through your browser preferences.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              7. Contact Us
            </Typography>
            <Typography paragraph>
              If you have any questions about this Privacy Policy, please contact our Data Protection Officer at privacy@londoncongestionchecker.com
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

export default PrivacyPage; 