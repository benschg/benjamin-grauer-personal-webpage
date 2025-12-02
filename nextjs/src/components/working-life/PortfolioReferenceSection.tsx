'use client';

import Link from 'next/link';
import { Box, Typography, Button } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';

const PortfolioReferenceSection = () => {
  return (
    <Box sx={{ py: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 700,
            mb: 2,
            textAlign: 'center',
          }}
        >
          See My Work in Action
        </Typography>
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
          From medical software to game development, explore the projects that showcase my skills
          and passion for creating innovative solutions.
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
              Explore Portfolio
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
            Discover my projects across medical software, games, web development, and more
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
};

export default PortfolioReferenceSection;
