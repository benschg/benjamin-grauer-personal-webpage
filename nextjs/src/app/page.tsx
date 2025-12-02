import { Box } from '@mui/material';
import { Header, Footer } from '@/components/common';
import { Hero, MainSections } from '@/components/home';

export default function Home() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Hero />
        <MainSections />
      </Box>
      <Footer />
    </Box>
  );
}
