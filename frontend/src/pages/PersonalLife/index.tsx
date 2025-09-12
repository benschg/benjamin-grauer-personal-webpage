import { Box, Typography, Container } from '@mui/material';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const PersonalLife = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            Personal Life
          </Typography>
          <Typography variant="body1">
            Coming soon...
          </Typography>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default PersonalLife;