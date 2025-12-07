'use client';

import { Box, Typography, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useState, useEffect, useCallback } from 'react';
import RecommendationCard from './RecommendationCard';
import { recommendations, recommendationsSectionContent, Recommendation } from './content';

// Fisher-Yates shuffle helper
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const RecommendationsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  // Start with original order (matches server), shuffle after hydration
  const [shuffledRecommendations, setShuffledRecommendations] =
    useState<Recommendation[]>(recommendations);

  // Shuffle after hydration to avoid mismatch
  useEffect(() => {
    // Use requestAnimationFrame to defer the state update and satisfy the linter
    const rafId = requestAnimationFrame(() => {
      setShuffledRecommendations(shuffleArray(recommendations));
    });
    return () => cancelAnimationFrame(rafId);
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
      if (window.innerWidth < 900) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1400) {
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

  return (
    <Box sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
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
            {recommendationsSectionContent.title}
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
            {recommendationsSectionContent.subtitle}
          </Typography>
        </Box>

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
          <IconButton
            onClick={handlePrev}
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              width: { xs: 36, sm: 48 },
              height: { xs: 36, sm: 48 },
              flexShrink: 0,
            }}
          >
            <ChevronLeft />
          </IconButton>

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

          <IconButton
            onClick={handleNext}
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              width: { xs: 36, sm: 48 },
              height: { xs: 36, sm: 48 },
              flexShrink: 0,
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>

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

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            {recommendationsSectionContent.pagination(currentIndex + 1, totalPages, shuffledRecommendations.length)}
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontStyle: 'italic',
            }}
          >
            {recommendationsSectionContent.cta.text}{' '}
            <Box
              component="a"
              href={recommendationsSectionContent.cta.linkUrl}
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
              {recommendationsSectionContent.cta.linkText}
            </Box>
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
};

export default RecommendationsSection;
