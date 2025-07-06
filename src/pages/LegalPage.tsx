import {
  Container,
  Typography,
  Paper,
  Box,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import { Link } from 'react-router-dom';

const LegalPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 4 }}>
        <MuiLink component={Link} to="/" color="inherit">
          Home
        </MuiLink>
        <Typography color="text.primary">Legal Notice</Typography>
      </Breadcrumbs>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
          Legal Notice
        </Typography>

        <Box sx={{ '& > *': { mb: 4 } }}>
          <section>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              1. Company Information
            </Typography>
            <Typography paragraph>
              London Congestion Checker is operated by [Company Name] Limited, registered in England and Wales under company number [number]. Registered office: [address].
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              2. Disclaimer
            </Typography>
            <Typography paragraph>
              While we make every effort to ensure that the information provided through our application is accurate and up-to-date, we cannot guarantee its completeness or accuracy. The application is provided "as is" without any warranties, express or implied.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              3. Intellectual Property
            </Typography>
            <Typography paragraph>
              All content, including but not limited to text, graphics, logos, button icons, images, audio clips, digital downloads, and data compilations, is the property of London Congestion Checker or its content suppliers and is protected by international copyright laws.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              4. Third-Party Services
            </Typography>
            <Typography paragraph>
              Our application may integrate with third-party services, including but not limited to payment processors and mapping services. These services are subject to their own terms and conditions and privacy policies.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              5. Limitation of Liability
            </Typography>
            <Typography paragraph>
              To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              6. Governing Law
            </Typography>
            <Typography paragraph>
              These terms and your use of the application are governed by and construed in accordance with the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              7. Changes to Legal Notice
            </Typography>
            <Typography paragraph>
              We reserve the right to modify this legal notice at any time. We will notify users of any material changes through the application or via email.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              8. Contact Information
            </Typography>
            <Typography paragraph>
              For legal inquiries, please contact our legal department at legal@londoncongestionchecker.com
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

export default LegalPage; 