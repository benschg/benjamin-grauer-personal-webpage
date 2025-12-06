'use client';

import { Box, Container, Typography, Paper, Link as MuiLink } from '@mui/material';
import { Header, Footer } from '@/components/common';

const CONTACT_EMAIL = 'benjamin@benjamingrauer.ch';

export default function PrivacyPolicy() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                mb: 4,
                fontFamily: 'var(--font-orbitron)',
                fontWeight: 600,
              }}
            >
              Privacy Policy
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Last updated: December 6, 2025
            </Typography>

            <Section title="Introduction">
              <Typography paragraph>
                Welcome to Benjamin Grauer&apos;s personal website. I respect your privacy and am
                committed to protecting any information collected through this website. This privacy
                policy explains what data is collected and how it is used.
              </Typography>
            </Section>

            <Section title="Data Controller">
              <Typography paragraph>
                This website is operated by Benjamin Grauer.
              </Typography>
              <Typography paragraph>
                Contact:{' '}
                <MuiLink href={`mailto:${CONTACT_EMAIL}`} color="primary">
                  {CONTACT_EMAIL}
                </MuiLink>
              </Typography>
            </Section>

            <Section title="Information We Collect">
              <Typography paragraph>
                Most of this website does not require registration. We collect minimal, anonymized
                data to understand how visitors use the site and to improve performance.
              </Typography>

              <Typography variant="h6" sx={{ mt: 3, mb: 1.5, fontSize: '1rem' }}>
                Account Data (CV Editor Feature)
              </Typography>
              <Typography paragraph>
                Some features of the CV Editor require authentication via Google Sign-In. When you
                sign in, we collect and store:
              </Typography>
              <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                <li>
                  <Typography>Your email address (from your Google account)</Typography>
                </li>
                <li>
                  <Typography>A unique user identifier</Typography>
                </li>
                <li>
                  <Typography>CV customizations you create (version names, job context)</Typography>
                </li>
              </Box>
              <Typography paragraph>
                This data is stored securely in Supabase (our database provider) and is used solely
                to provide you with the CV customization feature. We do not share this information
                with third parties or use it for marketing purposes.
              </Typography>

              <Typography variant="h6" sx={{ mt: 3, mb: 1.5, fontSize: '1rem' }}>
                Analytics Data (Vercel Analytics)
              </Typography>
              <Typography paragraph>
                We use Vercel Analytics, a privacy-friendly analytics service that collects:
              </Typography>
              <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                <li>
                  <Typography>Page views and navigation patterns</Typography>
                </li>
                <li>
                  <Typography>Referring websites</Typography>
                </li>
                <li>
                  <Typography>General geographic location (country/region level)</Typography>
                </li>
                <li>
                  <Typography>Device type and browser information</Typography>
                </li>
              </Box>
              <Typography paragraph>
                <strong>Important:</strong> Vercel Analytics is designed to be privacy-friendly and
                does not use cookies for tracking. It does not collect personal information such as
                IP addresses, and data is anonymized.
              </Typography>

              <Typography variant="h6" sx={{ mt: 3, mb: 1.5, fontSize: '1rem' }}>
                Performance Data (Vercel Speed Insights)
              </Typography>
              <Typography paragraph>
                We use Vercel Speed Insights to monitor website performance. This collects
                anonymized metrics about page load times and user experience, helping us optimize
                the website. No personal data is collected.
              </Typography>
            </Section>

            <Section title="Cookies">
              <Typography paragraph>
                This website uses minimal cookies that are essential for the website to function
                properly. We do not use cookies for advertising or tracking purposes.
              </Typography>
              <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                <li>
                  <Typography>
                    <strong>Authentication cookies:</strong> If you sign in to use the CV Editor,
                    Supabase sets session cookies to keep you logged in.
                  </Typography>
                </li>
                <li>
                  <Typography>
                    <strong>Analytics:</strong> Vercel Analytics is cookieless and does not set any
                    tracking cookies.
                  </Typography>
                </li>
              </Box>
            </Section>

            <Section title="Third-Party Services">
              <Typography paragraph>
                This website uses the following third-party services:
              </Typography>
              <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                <li>
                  <Typography>
                    <strong>Google Sign-In:</strong> For authentication in the CV Editor feature
                  </Typography>
                </li>
                <li>
                  <Typography>
                    <strong>Supabase:</strong> For database and authentication services
                  </Typography>
                </li>
                <li>
                  <Typography>
                    <strong>YouTube:</strong> Video embeds
                  </Typography>
                </li>
                <li>
                  <Typography>
                    <strong>LinkedIn:</strong> Profile links
                  </Typography>
                </li>
                <li>
                  <Typography>
                    <strong>GitHub:</strong> Project links
                  </Typography>
                </li>
              </Box>
              <Typography paragraph>
                These third-party services have their own privacy policies. We encourage you to
                review their policies when interacting with their content.
              </Typography>
            </Section>

            <Section title="Data Retention">
              <Typography paragraph>
                <strong>Analytics data:</strong> Retained for a maximum of 12 months by Vercel,
                after which it is automatically deleted.
              </Typography>
              <Typography paragraph>
                <strong>Account data:</strong> If you create an account for the CV Editor, your
                data is retained until you request deletion. You can request deletion of your
                account and all associated data at any time by contacting us.
              </Typography>
            </Section>

            <Section title="Your Rights (GDPR)">
              <Typography paragraph>
                If you are located in the European Economic Area (EEA), you have certain data
                protection rights, including:
              </Typography>
              <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                <li>
                  <Typography>The right to access information we hold about you</Typography>
                </li>
                <li>
                  <Typography>The right to request correction or deletion of your data</Typography>
                </li>
                <li>
                  <Typography>The right to object to processing of your data</Typography>
                </li>
                <li>
                  <Typography>The right to data portability</Typography>
                </li>
              </Box>
              <Typography paragraph>
                If you have a CV Editor account, you can request access to or deletion of your
                personal data by contacting us. For analytics data, since it is anonymized, we
                cannot identify individual users.
              </Typography>
            </Section>

            <Section title="Changes to This Policy">
              <Typography paragraph>
                We may update this privacy policy from time to time. Any changes will be posted on
                this page with an updated revision date.
              </Typography>
            </Section>

            <Section title="Contact">
              <Typography paragraph>
                If you have any questions about this privacy policy or our data practices, please
                contact us at:
              </Typography>
              <Typography>
                Email:{' '}
                <MuiLink href={`mailto:${CONTACT_EMAIL}`} color="primary">
                  {CONTACT_EMAIL}
                </MuiLink>
              </Typography>
            </Section>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{
          mb: 2,
          fontFamily: 'var(--font-orbitron)',
          fontWeight: 500,
          fontSize: '1.25rem',
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}