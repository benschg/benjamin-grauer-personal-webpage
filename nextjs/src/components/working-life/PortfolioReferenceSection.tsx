'use client';

import Link from 'next/link';
import { Box, Typography, Button } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { SectionTitle } from '@/components/common';
import { portfolioReferenceSectionContent } from './content';

interface PortfolioReferenceSectionProps {
  id?: string;
}

const PortfolioReferenceSection = ({ id = 'portfolio-reference' }: PortfolioReferenceSectionProps) => {
  return (
    <Box sx={{ py: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <SectionTitle
          id={id}
          title={portfolioReferenceSectionContent.title}
          variant="h3"
          centered
          sx={{ mb: 2 }}
        />
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            mb: 4,
            textAlign: 'center',
            maxWidth: 700,
            mx: 'auto',
          }}
        >
          {portfolioReferenceSectionContent.subtitle}
        </Typography>

        <Box sx={{ textAlign: 'center' }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              component={Link}
              href="/portfolio"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #89665d 0%, #bf9b93 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #a07a6f 0%, #d4afa6 100%)',
                  boxShadow: '0 8px 24px rgba(137, 102, 93, 0.4)',
                },
              }}
            >
              {portfolioReferenceSectionContent.buttonText}
            </Button>
          </motion.div>
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              color: 'text.secondary',
              fontStyle: 'italic',
            }}
          >
            {portfolioReferenceSectionContent.tagline}
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
};

export default PortfolioReferenceSection;
