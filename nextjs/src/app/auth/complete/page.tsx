'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';

const AUTH_REDIRECT_KEY = 'auth_redirect_path';

export default function AuthCompletePage() {
  const router = useRouter();

  useEffect(() => {
    // Get the stored redirect path from sessionStorage
    // Using sessionStorage for security - cleared on tab close, not shared across tabs
    const redirectPath = sessionStorage.getItem(AUTH_REDIRECT_KEY) || '/working-life/cv';
    sessionStorage.removeItem(AUTH_REDIRECT_KEY);

    // Redirect to the stored path
    router.replace(redirectPath);
  }, [router]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: '#1a1d20',
        color: 'white',
      }}
    >
      <CircularProgress color="inherit" sx={{ mb: 2 }} />
      <Typography>Completing sign in...</Typography>
    </Box>
  );
}
