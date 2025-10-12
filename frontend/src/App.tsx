import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Box } from '@mui/material';
import './App.css';
import FontLoader from './components/common/FontLoader';

// Lazy load page components for better code splitting
const Home = lazy(() => import('./pages/Home'));
const WorkingLife = lazy(() => import('./pages/WorkingLife'));
const PersonalLife = lazy(() => import('./pages/PersonalLife'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const ProjectDetail = lazy(() => import('./pages/Portfolio/ProjectDetail'));
const ArtGallery = lazy(() => import('./pages/Portfolio/ArtGallery'));

// Very subtle loading indicator
const PageLoader = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '100%',
      backgroundColor: 'primary.main',
      opacity: 0.6,
      animation: 'pulse 1s ease-in-out infinite',
      zIndex: 9999,
      '@keyframes pulse': {
        '0%': { opacity: 0.6 },
        '50%': { opacity: 1 },
        '100%': { opacity: 0.6 },
      },
    }}
  />
);

function App() {
  return (
    <FontLoader>
      <Router>
        <div className="app">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/working-life" element={<WorkingLife />} />
              <Route path="/personal-life" element={<PersonalLife />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/:projectId" element={<ProjectDetail />} />
              <Route path="/portfolio/arts-and-crafts" element={<ArtGallery />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </FontLoader>
  );
}

export default App;
