import { Box, Container, Typography } from '@mui/material';
import Header from '../../../components/common/Header';
import Footer from '../../../components/common/Footer';
import ArtworkGallery from '../components/ArtworkGallery';
import { motion } from 'framer-motion';

const ArtGallery = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#343A40' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, py: 6 }}>
        <Container maxWidth="xl">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 700,
                  mb: 2,
                  background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Art & Crafts Gallery
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
