'use client';

import { Box, Typography, Grid } from '@mui/material';
import DocumentCard from './DocumentCard';
import { documents, documentsSectionContent } from './content';

const DocumentsSection = () => {
  return (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.5rem', md: '2rem' },
          fontWeight: 700,
          mb: 3,
          color: 'text.primary',
        }}
      >
        {documentsSectionContent.title}
      </Typography>
      <Grid container spacing={3}>
        {documents.map((doc, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={index}>
            <DocumentCard document={doc} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DocumentsSection;
