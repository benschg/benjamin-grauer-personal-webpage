import { Box } from '@mui/material';
import Header from '../components/common/Header';
import Hero from '../components/home/Hero';
import MainSections from '../components/home/MainSections';
import Footer from '../components/common/Footer';

const Home = () => {
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
};

export default Home;