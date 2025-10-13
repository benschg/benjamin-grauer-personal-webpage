import { Container, Box } from '@mui/material';
import { motion } from 'framer-motion';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import TableOfContents from '../../components/common/TableOfContents';
import ProfessionalHero from './ProfessionalHero';
import DocumentsSection from './DocumentsSection';
import ImpactSection from './ImpactSection';
import SkillsSection from './SkillsSection';
import TimelineSection from './TimelineSection';
import RecommendationsSection from './RecommendationsSection';
import CareerAspirationsSection from './CareerAspirationsSection';
import PortfolioReferenceSection from './PortfolioReferenceSection';

const WorkingLife = () => {
  const tocItems = [
    { id: 'documents', title: 'Documents', level: 1 },
    { id: 'impact', title: 'My Impact', level: 1 },
    { id: 'skills', title: 'Skills & Expertise', level: 1 },
    { id: 'portfolio-reference', title: 'See My Work', level: 1 },
    { id: 'timeline', title: 'Career Timeline', level: 1 },
    { id: 'recommendations', title: 'Recommendations', level: 1 },
    { id: 'aspirations', title: 'Career Aspirations', level: 1 },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            backgroundColor: '#e0e0e0',
            backgroundImage: 'url(/working-life/background-wall.webp)',
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <ProfessionalHero />
          </motion.div>
          <Container maxWidth="lg" sx={{ pb: 4 }}>
            <motion.div
              id="documents"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            >
              <DocumentsSection />
            </motion.div>
          </Container>
        </Box>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            <motion.div variants={itemVariants} id="impact">
              <ImpactSection />
            </motion.div>
            <motion.div variants={itemVariants} id="skills">
              <SkillsSection />
            </motion.div>
            <motion.div variants={itemVariants} id="portfolio-reference">
              <PortfolioReferenceSection />
            </motion.div>
            <motion.div variants={itemVariants} id="timeline">
              <TimelineSection />
            </motion.div>
            <motion.div variants={itemVariants} id="recommendations">
              <RecommendationsSection />
            </motion.div>
            <motion.div variants={itemVariants} id="aspirations">
              <CareerAspirationsSection />
            </motion.div>
          </motion.div>
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
