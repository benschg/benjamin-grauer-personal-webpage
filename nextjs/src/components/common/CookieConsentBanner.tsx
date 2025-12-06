'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Typography, Slide, Link as MuiLink } from '@mui/material';
import Link from 'next/link';

const CONSENT_KEY = 'cookie-consent-acknowledged';

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user has already acknowledged the banner
    const acknowledged = localStorage.getItem(CONSENT_KEY);
    if (!acknowledged) {
      // Small delay for better UX
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcknowledge = () => {
    localStorage.setItem(CONSENT_KEY, 'true');
    setVisible(false);
  };

  return (
    <Slide direction="up" in={visible} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          backgroundColor: 'rgba(52, 58, 64, 0.98)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(137, 102, 93, 0.3)',
          px: { xs: 2, sm: 4 },
          py: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: 'lg',
            mx: 'auto',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              flex: 1,
            }}
          >
            This site uses privacy-friendly analytics to improve your experience. No personal data
            or cookies are used for tracking.{' '}
            <MuiLink
              component={Link}
              href="/privacy-policy"
              sx={{
                color: 'primary.main',
                textDecoration: 'underline',
                '&:hover': {
                  color: 'primary.light',
                },
              }}
            >
              Learn more
            </MuiLink>
          </Typography>
          <Button
            variant="contained"
            onClick={handleAcknowledge}
            sx={{
              minWidth: { xs: '100%', sm: 'auto' },
              px: 4,
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Got it
          </Button>
        </Box>
      </Box>
    </Slide>
  );
}