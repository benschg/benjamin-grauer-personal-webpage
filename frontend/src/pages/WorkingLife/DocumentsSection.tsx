import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { Download, Description, Folder, ContactPage } from '@mui/icons-material';

const DocumentsSection = () => {
  const documents = [
    {
      title: 'References',
      description: 'Professional references and recommendations',
      icon: ContactPage,
      fileType: 'PDF',
      downloadUrl: '#', // Replace with actual URL
    },
    {
      title: 'Certificates',
      description: 'Professional certifications and training certificates',
      icon: Folder,
      fileType: 'ZIP',
      downloadUrl: '#', // Replace with actual URL
    },
    {
      title: 'Full CV',
      description: 'Complete curriculum vitae with detailed work history',
      icon: Description,
      fileType: 'PDF',
      downloadUrl: '#', // Replace with actual URL
    },
  ];

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
        Documents
      </Typography>
      <Grid container spacing={3}>
        {documents.map((doc, index) => {
          const IconComponent = doc.icon;
          return (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  p: 2,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <IconComponent
                    sx={{
                      fontSize: '3rem',
                      color: 'primary.main',
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      mb: 1,
                      color: 'text.primary',
                    }}
                  >
                    {doc.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      mb: 2,
                      lineHeight: 1.5,
                    }}
                  >
                    {doc.description}
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  href={doc.downloadUrl}
                  sx={{
                    mt: 'auto',
                    mx: 2,
                    mb: 1,
                  }}
                >
                  Download {doc.fileType}
                </Button>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default DocumentsSection;