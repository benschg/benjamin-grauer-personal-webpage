'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ArtworkGallery from '@/components/portfolio/ArtworkGallery';
import { motion } from 'framer-motion';

const ArtGallery = () => {
  const router = useRouter();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#343A40' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, py: 6 }}>
        <Container maxWidth="xl">
          {/* Back Button */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => router.push('/portfolio')}
              sx={{
                mb: 4,
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'rgba(137, 102, 93, 0.1)',
                },
              }}
            >
              Back to Portfolio
            </Button>
          </motion.div>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 700,
                  mb: 2,
                  background: 'linear-gradient(135deg, #FF6B9D 0%, #bf9b93 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Arts & Crafts Portfolio
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontSize: '1.1rem',
                  color: 'text.secondary',
                  maxWidth: 600,
                  mx: 'auto',
                }}
              >
                A collection of digital art, paintings, and handmade crafts showcasing creative
                exploration beyond code
              </Typography>
            </Box>
          </motion.div>

          {/* Gallery */}
          <ArtworkGallery showFilters={true} />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default ArtGallery;
