import { Box, Typography, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useState, useEffect, useCallback, useMemo } from 'react';
import RecommendationCard from './RecommendationCard';
import { recommendations } from './data/recommendations';

const RecommendationsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  // Shuffle all recommendations once on component mount
  const shuffledRecommendations = useMemo(() => {
    const shuffled = [...recommendations];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const totalPages = Math.ceil(shuffledRecommendations.length / itemsPerPage);
  const startIndex = currentIndex * itemsPerPage;
  const visibleRecommendations = shuffledRecommendations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  }, [totalPages]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  }, [totalPages]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 960) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePrev();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handlePrev, handleNext]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <Box sx={{ py: 4 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Section Header */}
        <motion.div variants={titleVariants}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                fontWeight: 700,
                color: 'text.primary',
                mb: 2,
              }}
            >
              Professional Recommendations
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              What colleagues say about working with me (recommendations from LinkedIn)
            </Typography>
          </Box>
        </motion.div>

        {/* Recommendations Carousel with Side Navigation */}
        <Box
          sx={{
            position: 'relative',
            overflow: 'visible',
            pt: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* Left Navigation Button */}
          <IconButton
            onClick={handlePrev}
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              width: 48,
              height: 48,
              flexShrink: 0,
            }}
          >
            <FaChevronLeft />
          </IconButton>

          {/* Cards Container */}
          <Box sx={{ flexGrow: 1 }}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${itemsPerPage}, 1fr)`,
                gap: '24px',
                alignItems: 'stretch',
              }}
            >
              {visibleRecommendations.map((recommendation, index) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  index={index}
                />
              ))}
            </motion.div>
          </Box>

          {/* Right Navigation Button */}
          <IconButton
            onClick={handleNext}
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              width: 48,
              height: 48,
              flexShrink: 0,
            }}
          >
            <FaChevronRight />
          </IconButton>
        </Box>

        {/* Page Indicators */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            mt: 3,
          }}
        >
          {Array.from({ length: totalPages }).map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentIndex(index)}
              sx={{
                width: currentIndex === index ? 32 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: currentIndex === index ? 'primary.main' : 'rgba(137, 102, 93, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: currentIndex === index ? 'primary.main' : 'rgba(137, 102, 93, 0.5)',
                },
              }}
            />
          ))}
        </Box>

        {/* Page Counter */}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            Page {currentIndex + 1} of {totalPages} • {shuffledRecommendations.length} recommendations
          </Typography>
        </Box>

        {/* Call to Action */}
        <motion.div variants={titleVariants} style={{ marginTop: '3rem' }}>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontStyle: 'italic',
              }}
            >
              Want to work together?{' '}
              <Box
                component="a"
                href="https://www.linkedin.com/in/benjamin-grauer/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Connect with me on LinkedIn
              </Box>
            </Typography>
          </Box>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default RecommendationsSection;
