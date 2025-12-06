import { Box, Container } from '@mui/material';
import { Header, Footer } from '@/components/common';
import { AttributionsGrid } from '@/components/attributions';

export default function Attributions() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <AttributionsGrid />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
