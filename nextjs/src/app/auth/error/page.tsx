'use client';

import { useRouter } from 'next/navigation';
import { Box, Button, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function AuthErrorPage() {
  const router = useRouter();

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
        textAlign: 'center',
        p: 3,
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 64, color: '#f44336', mb: 2 }} />
      <Typography variant="h4" sx={{ mb: 2 }}>
        Authentication Error
      </Typography>
      <Typography sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
        There was a problem signing you in. Please try again.
      </Typography>
      <Button
        variant="contained"
        onClick={() => router.push('/working-life/cv')}
        sx={{
          bgcolor: '#89665d',
          '&:hover': { bgcolor: '#6d524a' },
        }}
      >
        Back to CV
      </Button>
    </Box>
  );
}
