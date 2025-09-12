import { Container, Box } from '@mui/material';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import ProfessionalHero from './ProfessionalHero';
import DocumentsSection from './DocumentsSection';
import SkillsSection from './SkillsSection';
import TimelineSection from './TimelineSection';
import CareerAspirationsSection from './CareerAspirationsSection';

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