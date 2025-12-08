'use client';

import Link from 'next/link';
import { Box, Typography, Grid, Button } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { SectionTitle } from '@/components/common';
import DocumentCard from './DocumentCard';
import { documents, documentsSectionContent } from './content';

interface DocumentsSectionProps {
  id?: string;
}

const DocumentsSection = ({ id = 'documents' }: DocumentsSectionProps) => {
  return (
    <Box sx={{ mb: 4 }}>
      <SectionTitle id={id} title={documentsSectionContent.title} sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        {documents.map((doc, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={index}>
            <DocumentCard document={doc} />
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            {documentsSectionContent.customizeTitle}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
            }}
          >
            {documentsSectionContent.customizeDescription}
          </Typography>
        </Box>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            component={Link}
            href="/working-life/cv?theme=light"
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              whiteSpace: 'nowrap',
              px: 3,
              background: 'linear-gradient(135deg, #89665d 0%, #bf9b93 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #a07a6f 0%, #d4afa6 100%)',
                boxShadow: '0 6px 20px rgba(137, 102, 93, 0.4)',
              },
            }}
          >
            {documentsSectionContent.customizeButton}
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
};

export default DocumentsSection;
