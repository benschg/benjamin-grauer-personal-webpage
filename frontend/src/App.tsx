import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { CircularProgress, Box } from '@mui/material';
import './App.css';
import FontLoader from './components/common/FontLoader';

// Lazy load route components
const Home = lazy(() => import('./pages/Home'));
const WorkingLife = lazy(() => import('./pages/WorkingLife'));
const PersonalLife = lazy(() => import('./pages/PersonalLife'));
const Portfolio = lazy(() => import('./pages/Portfolio'));

// Loading component
const LoadingSpinner = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <FontLoader>
      <Router>
        <div className="app">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/working-life" element={<WorkingLife />} />
              <Route path="/personal-life" element={<PersonalLife />} />
              <Route path="/portfolio" element={<Portfolio />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </FontLoader>
  );
}

export default App;
