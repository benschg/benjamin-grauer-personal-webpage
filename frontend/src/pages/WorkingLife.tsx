import { Container, Box } from '@mui/material';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ProfessionalHero from '../components/working-life/ProfessionalHero';
import DocumentsSection from '../components/working-life/DocumentsSection';
import SkillsSection from '../components/working-life/SkillsSection';
import TimelineSection from '../components/working-life/TimelineSection';
import CareerAspirationsSection from '../components/working-life/CareerAspirationsSection';

const WorkingLife = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <ProfessionalHero />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <DocumentsSection />
          <SkillsSection />
          <TimelineSection />
          <CareerAspirationsSection />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default WorkingLife;