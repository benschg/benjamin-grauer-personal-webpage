import { Box, Container } from '@mui/material';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import PersonalHero from './PersonalHero';
import InterestsGrid from './InterestsGrid';
import SportsTimelineSection from './SportsTimelineSection';

const PersonalLife = () => {
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
};

export default PersonalLife;
