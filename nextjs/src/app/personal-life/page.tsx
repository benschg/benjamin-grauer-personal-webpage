import { Box, Container } from '@mui/material';
import { Header, Footer } from '@/components/common';
import { PersonalHero, InterestsGrid, SportsTimelineSection } from '@/components/personal-life';

export default function PersonalLife() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <PersonalHero />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <InterestsGrid />
          <SportsTimelineSection />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
