import { Container, Box } from '@mui/material';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import TableOfContents from '../../components/common/TableOfContents';
import ProfessionalHero from './ProfessionalHero';
import DocumentsSection from './DocumentsSection';
import SkillsSection from './SkillsSection';
import TimelineSection from './TimelineSection';
import CareerAspirationsSection from './CareerAspirationsSection';

const WorkingLife = () => {
  const tocItems = [
    { id: 'documents', title: 'Documents', level: 1 },
    { id: 'skills', title: 'Skills & Expertise', level: 1 },
    { id: 'timeline', title: 'Career Timeline', level: 1 },
    { id: 'aspirations', title: 'Career Aspirations', level: 1 },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            backgroundColor: '#e0e0e0',
            backgroundImage: 'url(/working-life/background-wall-repeating.jpg.webp)',
            backgroundRepeat: 'repeat',
            backgroundSize: 'auto',
            '& .MuiTypography-root': {
              color: '#000000',
              fontWeight: '600',
              textShadow: '0 1px 3px rgba(255, 255, 255, 0.8)',
            },
            '& .MuiTypography-body1': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(5px)',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '16px',
            },
            '& .MuiTypography-h1': {
              color: '#000000',
              fontWeight: '900',
            },
            '& .MuiTypography-h2': {
              color: '#000000',
              fontWeight: '800',
            },
            '& .MuiTypography-h5': {
              color: '#1a1a1a',
              fontWeight: '700',
            },
            '& .MuiCard-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            },
          }}
        >
          <ProfessionalHero />
          <Container maxWidth="lg" sx={{ pb: 4 }}>
            <div id="documents">
              <DocumentsSection />
            </div>
          </Container>
        </Box>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div id="skills">
              <SkillsSection />
            </div>
            <div id="timeline">
              <TimelineSection />
            </div>
            <div id="aspirations">
              <CareerAspirationsSection />
            </div>
          </Box>
          <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
            <TableOfContents items={tocItems} />
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default WorkingLife;
